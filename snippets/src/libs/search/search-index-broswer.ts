import 'client-only';

import FlexSearch from 'flexsearch';
import { ImportSearchIndexOptions } from './types';
import { ConsoleLogger } from '../../utils/logger';
import { createFlexSearchIndex } from './search-index';

// TODO: Implement this function
// export async function importSearchIndexFromRemote(optios: ImportSearchIndexOptions): Promise<FlexSearch.Document<unknown, string[]>> {
//   const { indexSize, searchIndexPath, logger = new ConsoleLogger() } = optios;
//   const index = createFlexSearchIndex(indexSize, logger);

//   const indexFiles = await glob(`${searchIndexPath}/*.json`);
//   for (const indexFile of indexFiles) {
//     const data = await fs.readJSON(indexFile);
//     const key = path.basename(indexFile, '.json');
//     await index.import(key, data);
//     logger.info(`Imported index key: ${key}, file: ${indexFile}`);
//   }
//   return index;
// }