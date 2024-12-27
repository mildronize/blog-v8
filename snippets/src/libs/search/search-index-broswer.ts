import 'client-only';

import FlexSearch from 'flexsearch';
import { ImportSearchIndexFromRemoteOptions, SearchIndexMetadataResponse } from './types';
import { ConsoleLogger } from '../../utils/logger';
import { createFlexSearchIndex, searchIndex } from './search-index';
import urlJoin from 'url-join';
import { RawSearchResult, SearchResult, serializeSearchResult } from './search-result';
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface BroswerSearchOptions extends ImportSearchIndexFromRemoteOptions {
  postMetadataPath: string;
  /**
   * Each time the search fails, it will wait for `waitTime` milliseconds before retrying
   * 
   * Default: 100;
   */
  waitTime?: number;
}

export class BrowserSearch {
  private waitTime;
  isInitialized = false;
  index: FlexSearch.Document<unknown, string[]> | null = null;
  postMetadata: MarkdownMetadata[] | null = null;
  constructor(public options: BroswerSearchOptions) {
    this.waitTime = options.waitTime ?? 100;
  }

  async init() {
    this.isInitialized = true;
    this.index = await importSearchIndexFromRemote(this.options);
    this.postMetadata = await (await fetch(urlJoin(this.options.hostname ?? '', this.options.postMetadataPath))).json();
  }

  async search(query: string, retried = 100): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.init();
    }
    if (!this.index || !this.postMetadata) {
      if (retried > 0) {
        await delay(this.waitTime);
        return this.search(query, retried - 1);
      }
      throw new Error('Search index or post metadata is not initialized');
    }
    const searchResults = await searchIndex(this.index, query);
    return serializeSearchResult({
      rawResult: searchResults as RawSearchResult[],
      postMetadata: this.postMetadata,
      hostname: this.options.hostname,
    });
  }

}
