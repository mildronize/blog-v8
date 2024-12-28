import { createRef, useEffect, useState } from "react";
import { SearchResult } from "../../libs/search/search-result";
import { BrowserSearch } from "../../libs/search/search-index-broswer";

/**
 * Interval to check if the search index is loaded, by using SearchBrowser.isReady
 * @param browserSearch 
 */
export function useSearchBrowser(browserSearch: BrowserSearch) {

  const intervalDuration = 100;

  const [indexLoaded, setIndexLoaded] = useState<boolean>(false);

  useEffect(() => {
    browserSearch.init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (browserSearch.isReady) {
        setIndexLoaded(true);
        clearInterval(interval);
      }
    }, intervalDuration);
    return () => clearInterval(interval);
  }, []);

  return indexLoaded;
}