// import 'server-only';

import FlexSearch from 'flexsearch';
import fs from 'fs-extra';
import path from 'path';
import glob from 'tiny-glob';

import { ConsoleLogger } from "../../utils/logger";
import { pinoLogBuilder } from '../../utils/pino-log';
import { readAllMarkdown } from './utils';
import { ExecuteBuildSearchIndexOptions, ImportSearchIndexOptions } from './types';
import { buildSearchIndex, createFlexSearchIndex } from './search-index';

export class CallbackWaiter {
  private numberOfCallbackCalled: number;

  constructor(totalCallback: number) {
    this.numberOfCallbackCalled = totalCallback
  }

  public execute(fn: () => any) {
    fn();
    this.numberOfCallbackCalled--;
  }

  public async wait(delay: number = 100): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.numberOfCallbackCalled <= 0) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }
}

export async function waitForCounter(n: number, delay: number = 100): Promise<void> {
  return new Promise((resolve) => {
    let count = n + 1; // Prevent the last call, may exit before the last call
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}

export const totalIndexFiles = 15;

export async function executeBuildSearchIndex(options: ExecuteBuildSearchIndexOptions): Promise<FlexSearch.Document<unknown, string[]>> {
  const { cwd = process.cwd(), postMetadataFile, searchIndexPath, indexSize } = options;
  const postData = await readAllMarkdown(cwd, postMetadataFile, pinoLogBuilder('readAllMarkdown', 'info'));
  const index = buildSearchIndex({
    markdownData: postData.markdownData,
    indexSize,
    logger: pinoLogBuilder('buildSearchIndex', 'info'),
  });

  const targetIndexPath: string[] = [];

  fs.removeSync(searchIndexPath);
  fs.ensureDirSync(searchIndexPath);

  const callbackWaiter = new CallbackWaiter(totalIndexFiles);
  index.export(
    (key, data) => callbackWaiter.execute(
      () => {
        const targetIndex = path.join(searchIndexPath, `${key}.json`);
        fs.writeJSONSync(targetIndex, data ?? {});
        targetIndexPath.push(targetIndex);
      })
  );
  // Wait for the last call
  await callbackWaiter.wait();

  console.log('targetIndexPath', targetIndexPath);
  await fs.writeJSON(options.searchIndexMetadataPath, { sitemap: targetIndexPath });
  return index;
}

export async function importSearchIndexFromFile(optios: ImportSearchIndexOptions): Promise<FlexSearch.Document<unknown, string[]>> {
  const { indexSize, searchIndexPath, logger = new ConsoleLogger() } = optios;
  const index = createFlexSearchIndex(indexSize, logger);

  const indexFiles = await glob(`${searchIndexPath}/*.json`);
  for (const indexFile of indexFiles) {
    const data = await fs.readJSON(indexFile);
    const key = path.basename(indexFile, '.json');
    await index.import(key, data);
    logger.info(`Imported index key: ${key}, file: ${indexFile}`);
  }
  return index;
}