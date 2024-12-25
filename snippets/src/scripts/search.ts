import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./_config";
import { ConsoleLogger, Logger, pinoLogBuilder } from "./utils/logger";
import { MarkdownFileProcessorOutput } from './libs/type';
import { logTime } from './utils/utils';

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

async function main(){
  const postData = await readAllMarkdown(pinoLogBuilder('readAllMarkdown', 'info'));
  const index = buildSearchIndex(postData, pinoLogBuilder('buildSearchIndex', 'info'));
  
  const searchIndexPath = './src/search-index';
  fs.removeSync(searchIndexPath);
  fs.ensureDirSync(searchIndexPath);
  index.export(
    (key, data) => fs.writeFileSync(path.join(searchIndexPath, `${key}.json`), String(data))
  )
}

logTime('build-search-index', main, pinoLogBuilder('main', 'info'));

// // Step 3: Searching
// const query = process.argv[2];
// const results = index.search(query, {
//   limit: 5,
// });

// // Step 4: Display search results
// console.log(results);