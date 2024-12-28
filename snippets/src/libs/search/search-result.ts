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
  /**
   * Excerpt of the search result, which added the highlight to the matched text before and after the matched text
   */
  excerpt: string[];
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
        excerpt: createExcerpt(metadata.content ?? '', options.query, 30, 3)
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

export function createExcerpt(content: string, query: string, contextSize: number, limit = 3): string[] {
  const excerpts: string[] = [];

  // Normalize content and query for case-insensitive search
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let startIndex = 0;

  // Find all occurrences of the query in the content
  while (startIndex < lowerContent.length) {
    const matchIndex = lowerContent.indexOf(lowerQuery, startIndex);

    // If no more matches are found, break out of the loop
    if (matchIndex === -1) {
      break;
    }

    // Calculate the context bounds
    const contextStart = Math.max(0, matchIndex - contextSize);
    const contextEnd = Math.min(content.length, matchIndex + lowerQuery.length + contextSize);

    // Extract the context and wrap the matched text with <i></i>
    const beforeMatch = content.slice(contextStart, matchIndex);
    const matchedText = content.slice(matchIndex, matchIndex + query.length);
    const afterMatch = content.slice(matchIndex + query.length, contextEnd);
    const excerpt = `${beforeMatch}<i>${matchedText}</i>${afterMatch}`;

    excerpts.push(excerpt);

    // Check if the limit has been reached
    if (excerpts.length >= limit) {
      break;
    }

    // Move the start index forward to continue searching
    startIndex = matchIndex + lowerQuery.length;
  }

  return excerpts;
}


