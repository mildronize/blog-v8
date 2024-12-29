import { useEffect, useState } from "react";
import { searchModalEvent } from "../search-modal-event";
import { useShortcut } from "./useShortcut.js";
import SearchModal from "./SearchModal.js";

/**
 * SearchModalShell component, responsible for receiving commands from the commander
 * then show the search modal
 * @returns 
 */
export function SearchModalShell() {

  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    searchModalEvent.listen((event) => {
      console.log(`SearchModalShell: Received "${searchModalEvent.name}" event, action: "${event.detail.action}"`);
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
