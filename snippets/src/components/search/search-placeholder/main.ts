import { searchModalEvent } from "../search-modal-event";
import { loadPlaceholder, getHTMLElement, openSearchModal } from "../libs";
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
  searchBox.addEventListener('click', () => openSearchModal(searchBox, searchModalEvent));
}

initSearchPlaceholder();