import { searchModalEvent } from "../search-modal-event";
import { ElementController, loadPlaceholder, injectScript, waitUntilHtmlElementExists } from "./libs";
import './search-placeholder.css';

/**
 * SearchPlaceholder, responsible for emitting commands the the shell,
 * 
 * Commander can be any javascript function not necessarily a react component,
 * It just simply emits event to the shell
 * 
 * However, SearchPlaceholder is a JS that emits event to the shell
 * and provide the search text field as the dummy search box for user can click on it
 * After the user click on the dummy search box, the search modal will be shown
 * 
 * @returns 
 */
function initSearchPlaceholder() {
  loadPlaceholder('#search-placeholder-root');
  const searchBox = document.querySelector<HTMLInputElement>('#placeholder-search-box');
  if (!searchBox) {
    console.error('SearchPlaceholder: Search box not found');
    return;
  }
  searchBox.addEventListener('click', async () => {
    searchBox.blur();
    const action = 'open';
    console.log(`SeachPlaceholder: ${action} search modal`);
    // Load React Search Modal Component
    injectScript('/js/search.js');
    const loading = new ElementController('.search-modal-loading');
    loading.show();
    await waitUntilHtmlElementExists('#search-root');
    loading.hide();
    searchModalEvent.dispatch({ action });
  });
}

initSearchPlaceholder();