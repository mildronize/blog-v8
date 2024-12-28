import { useState, useEffect, createRef } from 'react';
// import debounce from 'debounce';
import './style.css';
import { BrowserSearch } from '../../libs/search/search-index-broswer';
// import useDebounce from './useDebounce';

interface SearchResult {
  field: string[];
  id: string;
  path: string;
  title: string;
  score: number;
}

export const localStorageKey = {
  enableFullTextSearch: 'enableFullTextSearch',
}

const sharedOptions = {
  hostname: 'http://localhost:1111',
  postMetadataPath: '/api/post-metadata.json'
}

// Initialize the BrowserSearch instance, make sure it's singleton
const browserSearchCollection = {
  small: new BrowserSearch({
    indexSize: 'small',
    searchIndexMetadataPath: '/api/search-index-metadata-small.json',
    ...sharedOptions
  }),
  large: new BrowserSearch({
    indexSize: 'large',
    searchIndexMetadataPath: '/api/search-index-metadata-large.json',
    ...sharedOptions,
  }),
}
// Use the small search index by default
let browserSearch: BrowserSearch = browserSearchCollection.small;

export default () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enableFullTextSearch, setEnableFullTextSearch] = useState(false);
  // This state is used to store the debounce timer, prevent multiple search requests
  // const debouncedQueryValue = useDebounce(query, 300)

  const searchRef = createRef<HTMLInputElement>();

  const searchOnBrowser = async (query: string) => {
    try {
      const results = await browserSearch.search(query);
      setResults(results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    browserSearch.init();
    // Set query from URL on initial load
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    const paramFull = params.get('full');
    if (paramFull) {
      setEnableFullTextSearch(paramFull === 'true');
    }
    setEnableFullTextSearch(localStorage.getItem(localStorageKey.enableFullTextSearch) === 'true');
    setQuery(initialQuery);
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  // const debounceSearch = (query: string) => debounce(() => handleSearch(query), 1000);

  const handleSearch = (query: string) => {
    if (query) {
      console.log('Search query:', query);
      searchOnBrowser(query);
      handleUrlChange(query);
    } else {
      setResults([]);
    }
  };

  const handleUrlChange = (query?: string) => {
    // If query is not provided, use the current query state
    if (!query) {
      query = searchRef.current?.value ?? '';
    }
    // Update the URL with the query parameter
    const params = new URLSearchParams(window.location.search);
    params.set('action', 'search'); // Define default action
    params.set('q', query);
    params.set('full', enableFullTextSearch.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  const handleTextFieldChange = (query: string) => {
    // const query = searchRef.current?.value ?? '';
    setQuery(query);

    handleSearch(query);
  };

  const handleEnableFullTextSearchChange = (value: boolean) => {
    console.log('Enable full text search:', value);
    if (value) {
      browserSearch = browserSearchCollection.large;
      browserSearch.init();
    } else {
      browserSearch = browserSearchCollection.small;
      browserSearch.init();
    }
    setEnableFullTextSearch(value);
    localStorage.setItem(localStorageKey.enableFullTextSearch, value.toString());
    handleTextFieldChange(query);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When press the ESC key, clear the search box
    if (e.key === 'Escape') {
      // searchRef.current?.value = '';
      setQuery('');
      setResults([]);
    }
  }

  return (
    <div className="app">
      <input
        type="text"
        className="search-box"
        placeholder="Search..."
        // defaultValue={query}
        value={query} // Bind state to the input
        ref={searchRef}
        onKeyDown={(e) => handleKeyDown(e)}
        onChange={(e) => handleTextFieldChange(e.target.value)}
      />
      <div className="checkbox-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={enableFullTextSearch}
            onChange={(e) => handleEnableFullTextSearchChange(e.target.checked)}
          />
          Enable Full Text Search
        </label>
      </div>
      <div className="results-container">
        {error && <p className="error">{error}</p>}
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <a className="result-title" href={result.path}><h4>{result.title}</h4></a>
          </div>
        ))}
      </div>
    </div>
  );
};