import { MarkdownMetadata } from '../content';
import GraphemeSplitter from 'grapheme-splitter';
import { joinUrl } from './browser-utils';
import { createLogger } from '../../utils/browser-logger';

const logger = createLogger('search/result');

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
      const foundResult = result.find((r) => r.id === id);
      if (foundResult) {
        foundResult.field.push(raw.field);
        continue;
      }
      result.push({
        field: [raw.field],
        id,
        path: '',
        title: '',
        score: 0,
        tags: [],
        excerpt: []
      });
    }
  }
  const calculatedResult = calculateScore(result).toSorted((a, b) => b.score - a.score);
  return postProcessSearchResult(calculatedResult, options);
}


export function postProcessSearchResult(searchResult: SearchResult[], options: SerializeSearchResultOptions): SearchResult[] {
  for (const result of searchResult) {
    const metadata = options.postMetadata.find((meta) => meta.id === result.id);
    if (!metadata) continue;
    result.path = joinUrl(options.hostname, metadata.path);
    if (result.field.includes('title')) {
      result.title = createdMatchedTitleWithMultiplesQuery(metadata.frontmatter.title, options.query);
    } else {
      result.title = metadata.frontmatter.title;
    }
    result.tags = createMatchedTag(metadata.frontmatter.taxonomies?.tags ?? [], options.query);
    if (result.field.includes('content')) {
      result.excerpt = createExcerptWithMultiplesQuery(metadata.content ?? '', options.query, 50, 3)
    }
  }
  return searchResult;
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
 * Reimplement string of JavaScript to handle Unicode characters
 */
export class UnicodeString {
  private value: string[];

  constructor(value: string | string[]) {
    if (typeof value === 'string') {
      // TODO: Migrate to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
      this.value = new GraphemeSplitter().splitGraphemes(value);
    } else {
      this.value = value;
    }
  }

  /**
   * Convert the Unicode string to lower case
   */
  toLowerCase(): UnicodeString {
    return new UnicodeString(this.value.map((char) => char.toLowerCase()));
  }

  get length(): number {
    return this.value.length;
  }

  /**
   * Find the index of the first occurrence of a substring
   */
  indexOf(substring: UnicodeString, startIndex: number): number {
    const subLength = substring.length;

    for (let i = startIndex; i <= this.length - subLength; i++) {
      let match = true;

      for (let j = 0; j < subLength; j++) {
        if (this.value[i + j] !== substring.value[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Extract a substring from the Unicode string
   */
  slice(start: number, end: number): UnicodeString {
    return new UnicodeString(this.value.slice(start, end));
  }

  /**
   * Convert the Unicode string to a regular string
   */
  toString(): string {
    return this.value.join('');
  }

}

/**
 * Create matched title for the search result,
 * highlight the matched text,
 * 
 * This also support query with spaces
 */
export function createdMatchedTitleWithMultiplesQuery(title: string, query: string): string {
  const splitQuery = query.split(' ').map((q) => q.trim()).filter((q) => q.length > 0);
  let result: string = title;
  for (const q of splitQuery) {
    logger?.debug(`Created matched title for ${q}`);
    result = createdMatchedTitle(result, q);
  }
  return result;
}

export function createdMatchedTitle(title: string, query: string): string {
  return title.replace(new RegExp(query, 'gi'), (match) => `<i>${match}</i>`);
}

/**
 * Support creating excerpt for the search result, highlight the matched text
 * also add context before and after the matched text,
 * 
 * This also support query with spaces
 * @returns 
 */
export function createExcerptWithMultiplesQuery(content: string, query: string, contextSize: number, limit = 3): string[] {

  const simplifedContent = content
      // Remove '|' from the content
      .replaceAll('|', '')

  const splitQuery = query.split(' ').map((q) => q.trim()).filter((q) => q.length > 0);
  // If there are multiple queries, limit the excerpt to 2, prevent too many excerpts
  const newLimit = splitQuery.length > 1 ? 2 : limit;
  let result: string[] = [];
  for (const q of splitQuery) {
    logger?.debug(`Created excerpt for ${q}`);
    result.push(createExcerpt(simplifedContent, q, contextSize, newLimit).join(''));
    logger?.debug(`Created excerpt for ${q} result: ${result}`);
  }
  return result
}


export function createExcerpt(content: string, query: string, contextSize: number, limit = 3): string[] {
  // Split the content into graphemes to handle Unicode characters
  const safeContent = new UnicodeString(content);
  const safeQuery = new UnicodeString(query);
  const excerpts: string[] = [];

  // Normalize content and query for case-insensitive search
  const lowerContent = safeContent.toLowerCase();
  const lowerQuery = safeQuery.toLowerCase();

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
    const contextEnd = Math.min(safeContent.length, matchIndex + lowerQuery.length + contextSize);

    // Extract the context and wrap the matched text with <i></i>
    const beforeMatch = safeContent.slice(contextStart, matchIndex);
    const matchedText = safeContent.slice(matchIndex, matchIndex + lowerQuery.length);
    logger?.debug(`Matched text: ${matchedText}, matchIndex: ${matchIndex}, query.length: ${lowerQuery.length}`);
    const afterMatch = safeContent.slice(matchIndex + lowerQuery.length, contextEnd);
    const excerpt = `${beforeMatch.toString()}<i>${matchedText.toString()}</i>${afterMatch.toString()}`;

    excerpts.push(excerpt.trim());

    // Check if the limit has been reached
    if (excerpts.length >= limit) {
      break;
    }

    // Move the start index forward to continue searching
    startIndex = matchIndex + lowerQuery.length;
  }

  return excerpts;
}


