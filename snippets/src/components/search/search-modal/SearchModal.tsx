import { useState, useEffect, createRef } from 'react';
import '../search-placeholder/search-placeholder.css';
import './search.css';
import { BrowserSearch } from '../../../libs/search/search-index-broswer';
import { useShortcut } from './useShortcut';
import { SearchResult } from '../../../libs/search/search-result';
import { useSearchBrowser } from './useSearchBrowser';
import { searchModalEvent } from '../search-modal-event';
import { createLogger } from '../../../utils/browser-logger';

const logger = createLogger('search/modal-react');

export const localStorageKey = {
  enableFullTextSearch: 'enableFullTextSearch',
}

const sharedOptions = {
  hostname: import.meta.env.VITE_SEARCH_METADATA_HOSTNAME,
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
  // For Full Text Search only
  const [totalIndexFileSize, setTotalIndexFileSize] = useState<number>(5);

  const smallIndexLoaded = useSearchBrowser(browserSearchCollection.small);
  const largeIndexLoaded = useSearchBrowser(browserSearchCollection.large);

  const searchRef = createRef<HTMLInputElement>();

  const searchOnBrowser = async (query: string) => {
    try {
      const results = await browserSearch.search(query);
      logger?.debug('Search results:', results);
      setResults(results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  /**
   * Only For Full Text Search
   * 
   * Get the total file size of the search index in megabytes
   * No need to load the index yet, simply read the metadata
  */
  const handleTotalIndexFileSize = async () => {
    const searchMetadata = await browserSearchCollection.large.getSearchMetadata();
    setTotalIndexFileSize(Math.ceil(searchMetadata.totalFileSizeInMegabytes));
  }

  useEffect(() => {
    handleTotalIndexFileSize();
    // Set query from URL on initial load
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    const paramFull = params.get('full');

    const isEnableFullTextSearch = paramFull !== null ? paramFull === 'true' : localStorage.getItem(localStorageKey.enableFullTextSearch) === 'true';
    localStorage.setItem(localStorageKey.enableFullTextSearch, String(isEnableFullTextSearch));
    handleEnableFullTextSearchChange(isEnableFullTextSearch);

    setQuery(initialQuery);
    if (initialQuery) {
      handleSearch(initialQuery, paramFull === 'true');
    }
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const handleSearch = (query: string, isEnableFullTextSearch?: boolean) => {
    if (query) {
      logger?.info(`Searching for "${query}"`);
      searchOnBrowser(query);
      handleUrlChange(query, isEnableFullTextSearch);
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

  const handleUrlChange = (query?: string, isEnableFullTextSearch?: boolean) => {
    // Update the URL with the query parameter
    const params = new URLSearchParams(window.location.search);
    params.set('action', 'search'); // Define default action
    if (query) params.set('q', query);
    else params.delete('q');
    if (isEnableFullTextSearch !== undefined) params.set('full', isEnableFullTextSearch.toString());
    else params.set('full', enableFullTextSearch.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  const handleTextFieldChange = (query: string, isEnableFullTextSearch?: boolean) => {
    if (query === '') { handleUrlChange(undefined, isEnableFullTextSearch); }
    setQuery(query);
    handleSearch(query, isEnableFullTextSearch);
  };

  const handleClearTextField = () => {
    setQuery(""); // Clear the input value
    handleUrlChange(); // Clear the query parameter in the URL
    setResults([]); // Clear the search results
    handleFocus(false); // Remove focus from the input
  }

  const handleEnableFullTextSearchChange = (value: boolean) => {
    logger?.info(`Enable full text search: ${value}`);
    if (value) {
      browserSearch = browserSearchCollection.large;
      browserSearch.init();
    } else {
      browserSearch = browserSearchCollection.small;
      browserSearch.init();
    }
    setEnableFullTextSearch(value);
    localStorage.setItem(localStorageKey.enableFullTextSearch, value.toString());
    handleTextFieldChange(query, value);
  }

  const handleTextFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // When press the ESC key, clear the search box
    if (e.key === 'Escape') {
      handleClearTextField();
    }

    // When press the Enter key, enable full text search
    if (e.key === 'Enter') {
      handleEnableFullTextSearchChange(true);
    }
  }

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    'Enter': () => handleFocus(true),
    'Escape': () => handleFocus(false),
  }

  Object.entries(shortcuts).forEach(([shortcut, callback]) => {
    useShortcut(shortcut, (e: KeyboardEvent) => {
      e.preventDefault();
      callback(e);
    })
  })

  const handleSearchModal = (isModalOpen: boolean) => {
    const action = isModalOpen ? 'open' : 'close';
    logger?.info(`SearchModal: Emitting "${searchModalEvent.name}" event, action: "${action}"`);
    searchModalEvent.dispatch({ action });
  }

  return (
    <div className="search-modal-app">
      <div
        id="search-backdrop"
        className="active"
        onClick={() => handleSearchModal(false)}
      />
      <div className="search-modal">
        <input
          type="text"
          id="search-box-react"
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
            <span className="custom-checkbox"></span>
            Enable Full Text Search
          </label>
          <p className="checkbox-info">
            Press Enter to enable full text search. Note: This may consume approximately {totalIndexFileSize} MB of additional traffic.
          </p>
        </div>
        <div className='results-container'>
          {smallIndexLoaded === false && results.length === 0 && enableFullTextSearch === false &&
            <div className="no-results">
              <div className="loader"></div><div>Importing Small Search Index...</div>
            </div>
          }
          {largeIndexLoaded === false && results.length === 0 && enableFullTextSearch === true &&
            <div className="no-results">
              <div className="loader"></div><div>Importing Large Search Index...</div>
            </div>
          }
          {smallIndexLoaded === true && results.length === 0 && enableFullTextSearch === false && query !== '' &&
            <div className="no-results">
              <p style={{ textAlign: 'center' }}>No results found <br />
                <a href="#" onClick={() => handleEnableFullTextSearchChange(true)}>Enable Full Text Search</a> may find your result</p>
            </div>
          }
          {largeIndexLoaded === true && results.length === 0 && enableFullTextSearch === true && query !== '' &&
            <div className="no-results">No results found.</div>
          }
          {error && <p className="error">{error}</p>}
          {results.map((result) => (
            <div key={result.id} className="result-item">
              <a className="result-title" href={result.path}><h4 dangerouslySetInnerHTML={{ __html: result.title }}></h4></a>
              <p className="result-content" dangerouslySetInnerHTML={{
                __html: result.excerpt.map(
                  (line) => `..${line}..` // Add ellipsis to the beginning and end of the line
                ).join('')
              }}></p>
              <div className="result-tags">
                {result.tags.map((tag) => (
                  <div
                    key={tag.name}
                    className={`tag ${tag.matched ? 'matched' : ''}`}
                    onClick={() => handleTextFieldChange(tag.name)}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="close-message fixed"
            onClick={() => handleSearchModal(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
};