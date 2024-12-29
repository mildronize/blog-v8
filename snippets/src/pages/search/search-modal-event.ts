import { createBrowserEvent } from "../../libs/browser-event";

export interface SearchModalEventDetail {
  action: 'open' | 'close';
}

/**
 * Declare a browser event for search modal
 * 
 * For using between SearchModalCommander and SearchModalShell
 * Or any JavaScript function can emit the event
 */
export const searchModalEvent =
  createBrowserEvent('SearchModalEvent')
    .configDetail<SearchModalEventDetail>();