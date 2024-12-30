import FlexSearch from 'flexsearch';

import { Logger } from "../../utils/logger";
import { BuildSearchIndexOptions, IndexSize } from './types';
import { ConsoleLogger } from '../../utils/console-logger';

export async function searchIndex(index: FlexSearch.Document<unknown, string[]>, query: string) {
  return index.searchAsync(query, {
    limit: 10
  });
}

/**
 * Prepare the input for word segmentation, remove '|' from the input
 */
export function prepareWordSegmentation(input: string): string {
  return input    
    // Replace '|' with space
    .replaceAll('|', ' ')
}


export const createFlexSearchIndex = (indexSize: IndexSize, _logger: Logger = new ConsoleLogger()) => new FlexSearch.Document({
  preset: 'match',
  tokenize: indexSize === 'small' ? 'strict' : 'reverse',
  cache: 100,
  document: {
    id: 'id',
    store: [
      "title", "tags", "content"
    ],
    index: ["title", "tags", "content"]
  }
});


export function buildSearchIndex(options: BuildSearchIndexOptions): FlexSearch.Document<unknown, string[]> {
  const { indexSize, markdownData, logger = new ConsoleLogger() } = options;
  const index = createFlexSearchIndex(indexSize, logger);
  let indexCount = 0;

  for (const item of markdownData) {
    index.add({
      id: item.id,
      title: item.frontmatter.title,
      content: prepareWordSegmentation(item.content ?? ''),
      tags: (item.frontmatter.taxonomies?.tags ?? []).join(' '),
      // categories: (item.frontmatter.taxonomies?.categories ?? []).join(' '),
    });
    indexCount++;
  }

  logger.info(`Indexed ${indexCount} documents`);
  return index;
}
