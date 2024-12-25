import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

import { ConsoleLogger, Logger } from "../utils/logger";
import glob from 'tiny-glob';
import { pinoLogBuilder } from '../utils/pino-log';
import { config } from '../_config';
import { createFlexSearchIndex } from './search-libs';

async function importSearchIndex(searchIndexPath: string, logger: Logger = new ConsoleLogger()): Promise<FlexSearch.Document<unknown, string[]>> {
  const index = createFlexSearchIndex(logger);

  const indexFiles = await glob(`${searchIndexPath}/*.json`);
  for (const indexFile of indexFiles) {
    const data = await fs.readJSON(indexFile);
    const key = path.basename(indexFile, '.json');
    await index.import(key, data);
    logger.info(`Imported index key: ${key}, file: ${indexFile}`);
  }
  return index;
}

export async function searchViaCLI(searchIndexPath: string) {
  const idStoreObject = (await fs.readJson(config.blogIdModule.targetFile)) as any;
  const index = await importSearchIndex(searchIndexPath, pinoLogBuilder('importSearchIndex', 'info'));
  const query = process.argv[2];
  const results = await index.searchAsync(query, {
    limit: 5,
  });
  console.log(`Search results for query "${query}":`, results);
  const contentResult = results.filter((result) => result.field === 'content');
  if(contentResult.length === 0) {
    console.log('No content results found');
    return;
  }
  for(const id of contentResult[0].result) {
    const path = idStoreObject[id].path;
    console.log(`[${id}] Found path: ${path}`);
  }
}