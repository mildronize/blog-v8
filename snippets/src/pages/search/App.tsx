import React, { useState, useEffect, createRef } from 'react';
import './style.css';

const apiServer = 'http://localhost:7074';

interface SearchResult {
  field: string[];
  id: string;
  path: string;
  title: string;
  score: number;
}

export default () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchRef = createRef<HTMLInputElement>();

  const searchApi = async (query: string) => {
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
      searchApi(query);
      // Update the URL with the query parameter
      const params = new URLSearchParams(window.location.search);
      params.set('q', query);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    } else {
      setResults([]);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchRef.current?.value ?? '';
      console.log('Search query:', query);
      handleSearch(query);
    }
  };

  return (
    <div className="app">
      <input
        type="text"
        className="search-box"
        placeholder="Search..."
        defaultValue={query}
        ref={searchRef}
        onKeyDown={handleKeyDown}
      />
      <div className="results-container">
        {error && <p className="error">{error}</p>}
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <a  className="result-title" href={result.path}><h3 >{result.title}</h3></a>
          </div>
        ))}
      </div>
    </div>
  );
};