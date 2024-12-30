
import { createLogger } from '../../../utils/browser-logger';
import { getHTMLElement, openSearchModal } from '../libs';
import { registerShortcut } from '../register-shortcut';
import { searchModalEvent } from '../search-modal-event';
import '../search-placeholder/search-placeholder.css';

const logger = createLogger('commander');

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

function isMacOperatingSystem(): boolean {
  const platform = navigator.platform.toLowerCase();
  return platform.includes('mac');
}

function commanderKey() {
  return isMacOperatingSystem() ? 'CMD + p' : 'CTRL + p';
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

  logger?.info('Initialized');
  logger?.info(`Press "${commanderKey()}" to open search popup`);

}

commander();