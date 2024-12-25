import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

import { MarkdownFileProcessor, processMarkdownDirectories } from "./markdown-files";
import { config } from "../_config";
import { ConsoleLogger, Logger } from "../utils/logger";
import { MarkdownFileProcessorOutput } from './type';
import { pinoLogBuilder } from '../utils/pino-log';
import glob from 'tiny-glob';

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

// const targetFile = './.tmp/content.json';

export async function readAllMarkdown(cwd: string = process.cwd(), targetFile: string, logger: Logger = new ConsoleLogger()): Promise<MarkdownFileProcessorOutput> {
  const processor = new MarkdownFileProcessor('read', { ignoreMarkdownFiles, logger, isIncludeContent: true });
  const processorOutput = await processMarkdownDirectories(sourceDirectories, processor, logger, cwd) ?? new Map();

  // Ensure target directory exists
  await fs.ensureDir(path.dirname(targetFile));
  fs.writeJSON(targetFile, processorOutput.markdownData);
  return processorOutput;
}

export const createFlexSearchIndex = (logger: Logger = new ConsoleLogger()) => new FlexSearch.Document({
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

function buildSearchIndex({ markdownData }: MarkdownFileProcessorOutput, logger: Logger = new ConsoleLogger()): FlexSearch.Document<unknown, string[]> {
  const index = createFlexSearchIndex(logger);
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

export async function executeBuildSearchIndex(
  cwd: string = process.cwd(),
  postMetadataFile: string,
  searchIndexPath: string
) {
  const postData = await readAllMarkdown(cwd, postMetadataFile, pinoLogBuilder('readAllMarkdown', 'info'));
  const index = buildSearchIndex(postData, pinoLogBuilder('buildSearchIndex', 'info'));

  fs.removeSync(searchIndexPath);
  fs.ensureDirSync(searchIndexPath);
  index.export(
    (key, data) => fs.writeJSONSync(path.join(searchIndexPath, `${key}.json`), data ?? {}),
  )
  return index;
}

export async function importSearchIndex(searchIndexPath: string, logger: Logger = new ConsoleLogger()): Promise<FlexSearch.Document<unknown, string[]>> {
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