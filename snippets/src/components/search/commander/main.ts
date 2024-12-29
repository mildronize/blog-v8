
import { getHTMLElement, openSearchModal } from '../libs';
import { registerShortcut } from '../register-shortcut';
import { searchModalEvent } from '../search-modal-event';
import '../search-placeholder/search-placeholder.css';

function _openSearchModal() {
  const searchBox = document.querySelector<HTMLElement>('#placeholder-search-box');
  openSearchModal(searchBox, searchModalEvent);
}

function handleSearchUrl(targetElement: HTMLElement | null) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q') !== null) {
    openSearchModal(targetElement, searchModalEvent);
  }
}

function commander() {

  const searchBox = document.querySelector<HTMLElement>('#placeholder-search-box');
  handleSearchUrl(searchBox);

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    'Control+p': _openSearchModal,
    'Command+p': _openSearchModal,
  }

  Object.entries(shortcuts).forEach(([shortcut, callback]) => {
    registerShortcut(shortcut, (e) => {
      e.preventDefault();
      callback(e);
    });
  });

  const searchIcon = getHTMLElement<HTMLButtonElement>('#search-header');
  searchIcon.addEventListener('click', _openSearchModal);

  console.log('Commander: Initialized');

}

commander();