import { MarkdownMetadata } from '../content';
import urlJoin from 'url-join';
export interface RawSearchResult {
  field: string;
  result: string[];
}

export interface MatchedTag {
  name: string;
  matched: boolean;
}

export interface SearchResult {
  field: string[];
  id: string;
  path: string;
  title: string;
  score: number;
  tags: MatchedTag[];
}


/**
 * Calculate the score of the search result
 * @param searchResult 
 * @returns 
 */
export function calculateScore(searchResult: SearchResult[]): SearchResult[] {
  // Preserving the original order from the search result as the score
  // the earlier the search result, the higher the score
  for (let i = 0; i < searchResult.length; i++) {
    searchResult[i].score = searchResult.length - i;
  }
  // If found in the title, tags add 2 to the score'
  return searchResult.map((r) => {
    if (r.field.includes('title') || r.field.includes('tags')) {
      r.score += 2;
    }
    return r;
  });
}

export interface SerializeSearchResultOptions {
  query: string;
  rawResult: RawSearchResult[];
  postMetadata: MarkdownMetadata[];
  hostname?: string;
}

/**
 * Serialize the search result, add the score to the search result
 * 
 * @param rawResult 
 * @param postMetadata 
 * @returns 
 */
export function serializeSearchResult(options: SerializeSearchResultOptions): SearchResult[] {
  const result: SearchResult[] = [];
  for (const raw of options.rawResult) {
    for (const id of raw.result) {
      const metadata = options.postMetadata.find((meta) => meta.id === id);
      if (!metadata) continue;
      const foundResult = result.find((r) => r.id === id);
      if (foundResult) {
        foundResult.field.push(raw.field);
        continue;
      }
      result.push({
        field: [raw.field],
        id,
        path: urlJoin(options.hostname ?? '', metadata.path),
        title: createdMatchedTitle(metadata.frontmatter.title, options.query),
        score: 0,
        tags: createMatchedTag(metadata.frontmatter.taxonomies?.tags ?? [], options.query),
      });
    }
  }
  const calculatedResult = calculateScore(result).toSorted((a, b) => b.score - a.score);
  return calculatedResult;
}

/**
 * Create partial matched tag for the search result 
 */
export function createMatchedTag(tags: string[], query: string): MatchedTag[] {
  return tags.map((tag) => ({
    name: tag,
    matched: tag.toLowerCase().includes(query.toLowerCase())
  }));
}

/**
 * Create matched title for the search result,
 * highlight the matched text
 */
export function createdMatchedTitle(title: string, query: string): string {
  return title.replace(new RegExp(query, 'gi'), (match) => `<i>${match}</i>`);
}