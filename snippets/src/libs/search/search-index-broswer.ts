import 'client-only';

import FlexSearch from 'flexsearch';
import { ImportSearchIndexFromRemoteOptions, SearchIndexMetadataResponse } from './types';
import { ConsoleLogger } from '../../utils/logger';
import { createFlexSearchIndex } from './search-index';

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

export async function importSearchIndexFromRemote(optios: ImportSearchIndexFromRemoteOptions): Promise<FlexSearch.Document<unknown, string[]>> {
  const { indexSize, searchIndexMetadataPath, logger = new ConsoleLogger() } = optios;
  const index = createFlexSearchIndex(indexSize, logger);

  const indexFiles = (await (await fetch(searchIndexMetadataPath)).json() as SearchIndexMetadataResponse).sitemap;
  for (const indexFile of indexFiles) {
    const data = await (await fetch(indexFile)).json();
    const key = getBasename(indexFile, '.json');
    await index.import(key, data);
    logger.info(`Imported index key: ${key}, file: ${indexFile}`);
  }
  return index;
}