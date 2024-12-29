// import 'server-only';

import FlexSearch from 'flexsearch';
import fs from 'fs-extra';
import path from 'path';
import glob from 'tiny-glob';

import { ConsoleLogger } from "../../utils/logger";
import { pinoLogBuilder } from '../../utils/pino-log';
import { readAllMarkdown } from './utils';
import { ExecuteBuildSearchIndexOptions, ImportSearchIndexOptions, SearchIndexMetadataResponse } from './types';
import { buildSearchIndex, createFlexSearchIndex } from './search-index';

function getRelativePath(path: string, rootPath: string): string {
  if (!path.startsWith(rootPath)) {
    throw new Error("The provided path is not within the rootPath.");
  }

  // Remove the rootPath from the full path to get the relative path
  const relativePath = path.replace(rootPath, "").replace(/^[\\/]+/, ""); // Remove leading slashes if any

  return relativePath;
}


export async function executeBuildSearchIndex(options: ExecuteBuildSearchIndexOptions): Promise<FlexSearch.Document<unknown, string[]>> {
  const { cwd = process.cwd(), postMetadataFile, searchIndexPath, indexSize, rootPublicDir } = options;
  const postData = await readAllMarkdown(cwd, postMetadataFile, pinoLogBuilder('readAllMarkdown', 'info'));
  const index = buildSearchIndex({
    markdownData: postData.markdownData,
    indexSize,
    logger: pinoLogBuilder('buildSearchIndex', 'info'),
  });

  let targetIndexPath: string[] = [];

  fs.removeSync(searchIndexPath);
  fs.ensureDirSync(searchIndexPath);

  await index.export(
    async (key, data) => {
      const targetIndex = path.join(searchIndexPath, `${key}.json`);
      await fs.writeJSON(targetIndex, data ?? {});
      targetIndexPath.push(targetIndex);
    }
  );
  let totalFileSizeInMegabytes = 0;
  targetIndexPath.forEach((p) => {
    const stats = fs.statSync(p);
    totalFileSizeInMegabytes += stats.size / 1024 / 1024;
  });
  targetIndexPath = targetIndexPath.map((p) => '/' + getRelativePath(p, rootPublicDir));
  await fs.writeJSON(options.searchIndexMetadataPath, {
    sitemap: targetIndexPath,
    totalFileSizeInMegabytes: parseFloat(totalFileSizeInMegabytes.toFixed(2)),
  } as SearchIndexMetadataResponse);
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