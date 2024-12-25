export interface RawSearchResult {
  field: string;
  result: string[];
}

export interface SearchResult {
  field: string;
  id: string;
}

export function serializeSearchResult(rawResult: RawSearchResult[]): SearchResult[] {
  return rawResult.reduce((acc, result) => {
    return acc.concat(result.result.map(id => ({
      field: result.field,
      id
    })));
  }, []);
}