import { searchModalEvent } from "../search-modal-event";
import { ElementController, loadPlaceholder, injectScript, waitUntilHtmlElementExists, getHTMLElement } from "./libs";
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
  const searchBox = getHTMLElement('#placeholder-search-box');
  handleSearchUrl(searchBox);
  searchBox.addEventListener('click', () => openSearchModal(searchBox));
}

async function openSearchModal(targetElement: HTMLElement) {
  targetElement.blur();
  const action = 'open';
  console.log(`SearchPlaceholder: Injecting Script for Search Modal Component (React)`);
  injectScript('/js/search.js');
  const loading = new ElementController('.search-modal-loading');
  loading.show();
  await waitUntilHtmlElementExists('#search-root');
  console.log(`SearchPlaceholder: Loaded Search Modal Component (React)`);
  loading.hide();
  console.log(`SearchPlaceholder: Emitting "${searchModalEvent.name}" event, action: "${action}"`);
  searchModalEvent.dispatch({ action });
}

function handleSearchUrl(targetElement: HTMLElement) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q') !== null) {
    openSearchModal(targetElement);
  }
}

initSearchPlaceholder();