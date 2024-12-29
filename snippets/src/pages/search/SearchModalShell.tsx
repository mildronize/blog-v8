import { useEffect, useState } from "react";
import { searchModalEvent } from "../search-modal-event.js";
import { useShortcut } from "./useShortcut";
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
      console.log(`SearchModalShell: ${event.detail.action} search modal`);
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
    // TODO: This will handle by global commander
    // 'Control+p': handleEnterSearchTextFields,
    // 'Command+p': handleEnterSearchTextFields,
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
