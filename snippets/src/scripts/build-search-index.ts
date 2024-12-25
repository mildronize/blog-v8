import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./_config";
import { ConsoleLogger, Logger } from "./utils/logger";
import { MarkdownFileProcessorOutput } from './libs/type';
import { logTime } from './utils/utils';
import { pinoLogBuilder } from './utils/pino-log';

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
    tokenize: "forward",
    cache: 100,
    document: {
      id: 'id',
      store: [
        "title", "tags", "categories", "content"
      ],
      index: ["title", "tags", "categories", "content"]
    }
  });

  let indexCount = 0;

  for (const item of markdownData) {
    index.add({
      id: item.id,
      title: item.frontmatter.title,
      content: item.content,
      tags: (item.frontmatter.taxonomies?.tags ?? []).join(' '),
      categories: (item.frontmatter.taxonomies?.categories ?? []).join(' '),
    });
    indexCount++;
  }

  logger.info(`Indexed ${indexCount} documents`);
  return index;
}

async function main() {
  const postData = await readAllMarkdown(pinoLogBuilder('readAllMarkdown', 'info'));
  const index = buildSearchIndex(postData, pinoLogBuilder('buildSearchIndex', 'info'));

  const searchIndexPath = './src/search-index';
  fs.removeSync(searchIndexPath);
  fs.ensureDirSync(searchIndexPath);
  index.export(
    (key, data) => fs.writeJSONSync(path.join(searchIndexPath, `${key}.json`), data ?? {}),
  )
  return index;
}

logTime('build-search-index', main, pinoLogBuilder('main', 'info'));
