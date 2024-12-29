import { searchModalEvent } from "../search-modal-event";
import './search-placeholder.css';

function loadPlaceholder() {
  const placeholderRoot = document.querySelector<HTMLDivElement>('#search-placeholder-root')!;
  if (placeholderRoot.innerHTML) {
    console.log('SearchPlaceholder: Placeholder already loaded');
    return;
  }
  placeholderRoot.innerHTML = `
  <div id="placeholder-search-box-wrapper">
    <input
      id="placeholder-search-box"
      type="text"
      class="search-box"
      placeholder="Search post..."
    />
    <div class="search-modal-loading">Loading Search Modal Component... </div>
    </div>
`}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function initSearchPlaceholder() {
  loadPlaceholder();
  const searchBox = document.querySelector<HTMLInputElement>('#placeholder-search-box');
  if (!searchBox) {
    console.error('SearchPlaceholder: Search box not found');
    return;
  }
  searchBox.addEventListener('click', async () => {
    searchBox.blur();
    const action = 'open';
    console.log(`SeachPlaceholder: ${action} search modal`);
    loadSearchModal();
    const loading = new ElementController('.search-modal-loading');
    loading.show();
    await waitUntilHtmlElementExists('#search-root');
    loading.hide();
    searchModalEvent.dispatch({ action });
  });
}

class ElementController {
  private readonly element: HTMLDivElement;

  constructor(selector: string) {
    this.element = document.querySelector<HTMLDivElement>(selector)!;
  }

  show() {
    // Add class 'show' to the element
    this.element.classList.add('show');
  }

  hide() {
    // Remove class 'show' from the element
    this.element.classList.remove('show');
  }
}

export async function waitUntilHtmlElementExists(selector: string, timeout = 5000) {
  const start = Date.now();
  while (!document.querySelector(selector)?.innerHTML) {
    if (Date.now() - start > timeout) {
      throw new Error(`Element with selector ${selector} not found or not loaded`);
    }
    await delay(100);
  }
}

function loadSearchModal() {
  // To prevent duplicate script injection
  if (!document.querySelector('script[src="/js/search.js"]')) {
    document.body.appendChild(
      Object.assign(document.createElement('script'), { type: 'module', src: '/js/search.js' })
    );
  }
}


initSearchPlaceholder();