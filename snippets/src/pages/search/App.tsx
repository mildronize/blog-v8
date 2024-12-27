import React, { useState, useEffect, createRef } from 'react';
import './style.css';
import { BrowserSearch } from '../../libs/search/search-index-broswer';

const apiServer = 'http://localhost:7074';

interface SearchResult {
  field: string[];
  id: string;
  path: string;
  title: string;
  score: number;
}

const sharedOptions = {
  hostname: 'http://localhost:1111',
  postMetadataPath: '/api/post-metadata.json'
}

// Initialize the BrowserSearch instance, make sure it's singleton
const browserSearch = {
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

browserSearch.small.init();

export default () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchRef = createRef<HTMLInputElement>();

  const searchOnBrowser = async (query: string) => {
    try {
      const results = await browserSearch.small.search(query);
      setResults(results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  const searchWithApiServer = async (query: string) => {
    try {
      const response = await fetch(`${apiServer}/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setResults(data.results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    }
  };

  useEffect(() => {
    // Set query from URL on initial load
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    setQuery(initialQuery);
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  const handleSearch = (query: string) => {
    if (query) {
      // searchWithApiServer(query);
      searchOnBrowser(query);
      // Update the URL with the query parameter
      const params = new URLSearchParams(window.location.search);
      params.set('q', query);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Do search when Enter key is pressed
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = searchRef.current?.value ?? '';
    console.log('Search query:', query);
    handleSearch(query);
  };

  return (
    <div className="app">
      <input
        type="text"
        className="search-box"
        placeholder="Search..."
        defaultValue={query}
        ref={searchRef}
        // onKeyDown={handleKeyDown}
        onChange={(e) => handleTextFieldChange(e)}
      />
      <div className="results-container">
        {error && <p className="error">{error}</p>}
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <a className="result-title" href={result.path}><h3 >{result.title}</h3></a>
          </div>
        ))}
      </div>
    </div>
  );
};