import { useEffect, useState } from "react";
import { searchModalEvent } from "../search-modal-event.js";
import { useShortcut } from "./useShortcut.js";
import SearchModal from "./SearchModal.js";
import { createLogger } from "../../../utils/browser-logger.js";

const logger = createLogger('search/shell-react');

/**
 * SearchModalShell component, responsible for receiving commands from the commander
 * then show the search modal
 * @returns 
 */
export function SearchModalShell() {

  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    searchModalEvent.listen((event) => {
      logger?.info(`Received "${searchModalEvent.name}" event, action: "${event.detail.action}"`);
      setIsShow(event.detail.action === 'open');
    });
    return () => {
      searchModalEvent.removeListener();
    }
  }, []);

  const handleEnterSearchTextFields = () => {
    setIsShow(true);
  }

  const handleClearTextField = () => {
    setIsShow(false);
  }

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    'Enter': handleEnterSearchTextFields,
    'Escape': handleClearTextField
  }

  Object.entries(shortcuts).forEach(([shortcut, callback]) => {
    useShortcut(shortcut, (e: KeyboardEvent) => {
      e.preventDefault();
      callback(e);
    })
  })

  return (
    <div>
      {isShow && <SearchModal />}
    </div>
  );
}
