import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

// Step 1: Example data this needs to be extracted from website in this form final result is shown here
// const documents = [
//   {
//     id: '1',
//     title: 'Introduction to AI',
//     description: 'Artificial Intelligence (AI) is a field of computer science that focuses on creating intelligent machines.',
//   },
//   {
//     id: '2',
//     title: 'ความรู้เบื้องต้นเกี่ยวกับ AI',
//     description: 'ปัญญาประดิษฐ์ (Artificial Intelligence หรือ AI) เป็นสาขาหนึ่งของวิทยาศาสตร์คอมพิวเตอร์ที่มุ่งเน้นการสร้างเครื่องจักรที่ฉลาด.',
//   },
//   {
//     id: '3',
//     title: 'การพัฒนาเว็บ',
//     description: 'การพัฒนาเว็บไซต์เป็นกระบวนการของการสร้างและบำรุงรักษาเว็บไซต์โดยใช้ภาษา HTML, CSS และ JavaScript.',
//   },
//   {
//     id: '4',
//     title: 'Web Development Basics',
//     description: 'Web development involves building and maintaining websites using HTML, CSS, and JavaScript.',
//   },
//   {
//     id: '5',
//     title: 'Machine Learning Basics',
//     description: 'Machine learning is a subset of AI that focuses on building systems that learn from data.',
//   },
//   {
//     id: '6',
//     title: 'พื้นฐานของการเรียนรู้ของเครื่อง',
//     description: 'การเรียนรู้ของเครื่องเป็นสาขาหนึ่งของ AI ที่มุ่งเน้นการสร้างระบบที่เรียนรู้จากข้อมูล.',
//   },
// ];

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./_config";
import { ConsoleLogger, Logger, pinoLogBuilder } from "./utils/logger";
import { MarkdownFileProcessorOutput } from './libs/type';
import { logTime } from './utils/utils';

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

const targetFile = './.tmp/content.json';

export async function readAllMarkdown(logger: Logger = new ConsoleLogger(), debug = false): Promise<MarkdownFileProcessorOutput> {
  const processor = new MarkdownFileProcessor('read', { ignoreMarkdownFiles, logger, isIncludeContent: true });
  const processorOutput = await processMarkdownDirectories(sourceDirectories, processor, logger) ?? new Map();

  if (debug) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFile));
    fs.writeJSON(targetFile, processorOutput.markdownData);
  }
  return processorOutput;
}

function buildSearchIndex({ markdownData }: MarkdownFileProcessorOutput, logger: Logger = new ConsoleLogger()): FlexSearch.Document<unknown, string[]> {
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

  let indexCount = 0;

  markdownData.forEach(item => {
    index.add({
      id: item.id,
      title: item.frontmatter.title,
      content: item.content
    });
    indexCount++;
  });

  logger.info(`Indexed ${indexCount} documents`);
  return index;
}

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