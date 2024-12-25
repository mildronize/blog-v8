import fs from 'fs-extra';
import FlexSearch from 'flexsearch';
import path from 'path';

import { ConsoleLogger, Logger } from "../../utils/logger";
import { MarkdownMetadata } from './../type';
import { pinoLogBuilder } from '../../utils/pino-log';
import glob from 'tiny-glob';
import { readAllMarkdown } from './utils';


/**
 * Small Index: Suitable for browser search
 * Large Index: Suitable for server search, more memory usage, for better full-text search e.g. Thai language
 */
export type IndexSize = 'small' | 'large';

export interface ExecuteBuildSearchIndexOptions {
  cwd?: string;
  postMetadataFile: string;
  searchIndexPath: string;
  indexSize: IndexSize;
}

export const createFlexSearchIndex = (indexSize: IndexSize, _logger: Logger = new ConsoleLogger()) => new FlexSearch.Document({
  preset: 'match',
  tokenize: indexSize === 'small' ? 'strict' : 'forward',
  cache: 100,
  document: {
    id: 'id',
    store: [
      "title", "tags", "categories", "content"
    ],
    index: ["title", "tags", "categories", "content"]
  }
});

export interface BuildSearchIndexOptions {
  markdownData: MarkdownMetadata[];
  logger?: Logger;
  indexSize: IndexSize;
}

function buildSearchIndex(options: BuildSearchIndexOptions): FlexSearch.Document<unknown, string[]> {
  const { indexSize, markdownData, logger = new ConsoleLogger() } = options;
  const index = createFlexSearchIndex(indexSize, logger);
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

export interface ImportSearchIndexOptions {
  searchIndexPath: string;
  logger?: Logger;
  indexSize: IndexSize;
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