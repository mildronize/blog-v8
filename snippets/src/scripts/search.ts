import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

import { ConsoleLogger, Logger } from "./utils/logger";
import { logTime } from './utils/utils';
import glob from 'tiny-glob';
import { pinoLogBuilder } from './utils/pino-log';

const searchIndexPath = './src/search-index';

async function importSearchIndex(logger: Logger = new ConsoleLogger()): Promise<FlexSearch.Document<unknown, string[]>> {
  const index = new FlexSearch.Document({
    preset: 'match',
    tokenize: "full",
    cache: 100,
    document: {
      id: 'id',
      store: [
        "title", "content"
      ],
      index: ["title", "content"]
    }
  });

  const indexFiles = await glob(`${searchIndexPath}/*.json`);
  for (const indexFile of indexFiles) {
    const data = await fs.readJSON(indexFile);
    const key = path.basename(indexFile, '.json');
    await index.import(key, data);
    logger.info(`Imported index key: ${key}, file: ${indexFile}`);
  }
  return index;
}

async function main() {
  const index = await importSearchIndex(pinoLogBuilder('importSearchIndex', 'info'));
  const query = process.argv[2];
  const results = await index.searchAsync(query, {
    limit: 5,
  });
  console.log(`Search results for "${query}":`, results);
}

await logTime('search', main, pinoLogBuilder('main', 'info'));
