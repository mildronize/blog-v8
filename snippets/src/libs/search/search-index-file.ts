import 'server-only';

import FlexSearch from 'flexsearch';
import fs from 'fs-extra';
import path from 'path';
import glob from 'tiny-glob';

import { ConsoleLogger } from "../../utils/logger";
import { pinoLogBuilder } from '../../utils/pino-log';
import { readAllMarkdown } from './utils';
import { ExecuteBuildSearchIndexOptions, ImportSearchIndexOptions } from './types';
import { buildSearchIndex, createFlexSearchIndex } from './search-index';

export async function executeBuildSearchIndex(options: ExecuteBuildSearchIndexOptions): Promise<FlexSearch.Document<unknown, string[]>> {
  const { cwd = process.cwd(), postMetadataFile, searchIndexPath, indexSize } = options;
  const postData = await readAllMarkdown(cwd, postMetadataFile, pinoLogBuilder('readAllMarkdown', 'info'));
  const index = buildSearchIndex({
    markdownData: postData.markdownData,
    indexSize,
    logger: pinoLogBuilder('buildSearchIndex', 'info'),
  });

  fs.removeSync(searchIndexPath);
  fs.ensureDirSync(searchIndexPath);
  index.export(
    (key, data) => fs.writeJSONSync(path.join(searchIndexPath, `${key}.json`), data ?? {}),
  )
  return index;
}

export async function importSearchIndex(optios: ImportSearchIndexOptions): Promise<FlexSearch.Document<unknown, string[]>> {
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