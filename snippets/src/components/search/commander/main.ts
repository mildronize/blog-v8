
import { openSearchModal } from '../libs';
import { registerShortcut } from '../register-shortcut';
import { searchModalEvent } from '../search-modal-event';
import '../search-placeholder/search-placeholder.css';

function handleSearchModal() {
  const searchBox = document.querySelector<HTMLElement>('#placeholder-search-box');
  openSearchModal(searchBox, searchModalEvent);
}

function commander() {

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    'Control+p': handleSearchModal,
    'Command+p': handleSearchModal,
  }

  Object.entries(shortcuts).forEach(([shortcut, callback]) => {
    registerShortcut(shortcut, (e) => {
      e.preventDefault();
      callback(e);
    });
  });

  console.log('Commander: Initialized');

}

commander();