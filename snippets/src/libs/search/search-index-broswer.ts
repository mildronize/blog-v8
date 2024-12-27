import 'client-only';

import FlexSearch from 'flexsearch';
import { ImportSearchIndexFromRemoteOptions, SearchIndexMetadataResponse } from './types';
import { ConsoleLogger } from '../../utils/logger';
import { createFlexSearchIndex, searchIndex } from './search-index';
import urlJoin from 'url-join';
import { RawSearchResult, serializeSearchResult } from './search-result';
import { MarkdownMetadata } from '../content/type';
/**
 * Simple function to `path.basename` from Node.js
 * @param path 
 * @returns 
 */
export function getBasename(path: string, extension: string): string {
  // Use regex or split to get the basename
  const basename = path.split('/').pop() || "";
  return basename.replace(extension, '');
}

export async function importSearchIndexFromRemote(options: ImportSearchIndexFromRemoteOptions): Promise<FlexSearch.Document<unknown, string[]>> {
  const { indexSize, searchIndexMetadataPath, logger = new ConsoleLogger(), hostname } = options;
  const index = createFlexSearchIndex(indexSize, logger);

  const indexFiles = (await (await fetch(urlJoin(hostname ?? '', searchIndexMetadataPath))).json() as SearchIndexMetadataResponse).sitemap;
  for (const indexFile of indexFiles) {
    const data = await (await fetch(urlJoin(hostname ?? '', indexFile))).json();
    const key = getBasename(indexFile, '.json');
    await index.import(key, data);
    logger.info(`Imported index key: ${key}, file: ${indexFile}`);
  }
  return index;
}

interface BroswerSearchOptions extends ImportSearchIndexFromRemoteOptions {
  postMetadataPath: string;
}

export class BrowserSearch {
  isInitialized = false;
  index: FlexSearch.Document<unknown, string[]> | null = null;
  postMetadata: MarkdownMetadata[] | null = null;
  constructor(public options: BroswerSearchOptions) { }

  async init() {
    this.isInitialized = true;
    this.index = await importSearchIndexFromRemote(this.options);
    this.postMetadata = await (await fetch(urlJoin(this.options.hostname ?? '', this.options.searchIndexMetadataPath))).json();
  }

  async search(query: string) {
    if (!this.isInitialized) {
      await this.init();
    }
    if (!this.index) {
      throw new Error('Search index is not initialized');
    }
    if (!this.postMetadata) {
      throw new Error('Post metadata is not initialized');
    }
    const searchResults = await searchIndex(this.index, query);
    return serializeSearchResult(searchResults as RawSearchResult[], this.postMetadata);
  }
}
