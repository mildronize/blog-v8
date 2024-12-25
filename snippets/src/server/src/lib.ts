import { MarkdownMetadata } from '../../libs/type';
export interface RawSearchResult {
  field: string;
  result: string[];
}

export interface SearchResult {
  field: string;
  id: string;
  path: string;
  title: string;
}

export function serializeSearchResult(rawResult: RawSearchResult[], postMetadata: MarkdownMetadata[]): SearchResult[] {
  const result: SearchResult[] = [];
  for (const raw of rawResult) {
    for (const id of raw.result) {
      const metadata = postMetadata.find((meta) => meta.id === id);
      if (!metadata) continue;
      result.push({
        field: raw.field,
        id,
        path: metadata.path,
        title: metadata.frontmatter.title,
      });
    }
  }
  return result;
}