import { useState, useEffect, createRef } from 'react';
import './style.css';
import { BrowserSearch } from '../../libs/search/search-index-broswer';

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
  const [_focus, setFocus] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enableFullTextSearch, setEnableFullTextSearch] = useState(false);

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
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const handleSearch = (query: string) => {
    if (query) {
      console.log('Search query:', query);
      searchOnBrowser(query);
      handleUrlChange(query);
    } else {
      setResults([]);
    }
  };

  const handleFocus = (isFocus: boolean) => {
    setFocus(isFocus);
    if (searchRef.current) {
      if (isFocus) searchRef.current.focus(); // Focus the text field
      else searchRef.current.blur(); // Remove focus from the input
    }
  }

  const handleUrlChange = (query?: string) => {
    // Update the URL with the query parameter
    const params = new URLSearchParams(window.location.search);
    params.set('action', 'search'); // Define default action
    if (query) params.set('q', query);
    else params.delete('q');
    params.set('full', enableFullTextSearch.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  const handleTextFieldChange = (query: string) => {
    if (query === '') { handleUrlChange(); }
    setQuery(query);
    handleSearch(query);
  };

  const handleClearTextField = () => {
    setQuery(""); // Clear the input value
    handleUrlChange(); // Clear the query parameter in the URL
    setResults([]); // Clear the search results
    handleFocus(false); // Remove focus from the input
  }

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

  const handleTextFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When press the ESC key, clear the search box
    if (e.key === 'Escape') {
      handleClearTextField();
    }
  }

  return (
    <div className="app">
      <div id="search-backdrop" />
      <div className="results-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search post..."
          onFocus={() => handleFocus(true)} // Detect when the field gains focus
          onBlur={() => handleFocus(false)}   // Detect when the field loses focus
          value={query} // Bind state to the input
          ref={searchRef}
          onKeyDown={(e) => handleTextFieldKeyDown(e)}
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