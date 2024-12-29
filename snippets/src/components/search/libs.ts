import type { BrowserEvent } from "../../libs/browser-event";
import type { SearchModalEventDetail } from "./search-modal-event";

export async function openSearchModal(targetElement: HTMLElement | null, searchModalEvent: BrowserEvent<'SearchModalEvent', SearchModalEventDetail>) {
  targetElement?.blur();
  const action = 'open';
  console.log(`SearchPlaceholder: Injecting Script for Search Modal Component (React)`);
  injectScript('/js/search-modal.js');
  const loading = new ElementController('.search-modal-loading');
  loading.show();
  await waitUntilHtmlElementExists('#search-root');
  console.log(`SearchPlaceholder: Loaded Search Modal Component (React)`);
  loading.hide();
  console.log(`SearchPlaceholder: Emitting "${searchModalEvent.name}" event, action: "${action}"`);
  searchModalEvent.dispatch({ action });
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

export function getHTMLElement(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}


/**
 * Dynamic Script Injection,
 * This may save network bandwidth and improve performance
 */
export function injectScript(src: string, type = 'module') {
  // To prevent duplicate script injection
  if (!document.querySelector(`script[src="${src}"]`)) {
    document.body.appendChild(
      Object.assign(document.createElement('script'), { type, src })
    );
  }
}

export function loadPlaceholder(selector: string) {
  const placeholderRoot = document.querySelector<HTMLDivElement>(selector)!;
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

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ElementController {
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
