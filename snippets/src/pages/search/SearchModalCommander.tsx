import { createRef } from "react";
import { searchModalEvent } from "../search-modal-event";
import './search.css';
/**
 * SearchModalCommander component, responsible for emitting commands the the shell,
 * 
 * Commander can be any javascript function not necessarily a react component,
 * It just simply emits event to the shell
 * 
 * However, SearchModalCommander is a react component that emits event to the shell
 * and provide the search text field as the dummy search box for user can click on it
 * After the user click on the dummy search box, the search modal will be shown
 * 
 * @returns 
 */
export function SearchModalCommander() {
  const searchRef = createRef<HTMLInputElement>();
  
  const sendCommand = (isModalOpen: boolean) => {
    if (searchRef.current) {
      searchRef.current.blur();
    }
    const action = isModalOpen ? 'open' : 'close';
    searchModalEvent.dispatch({ action} );
    console.log(`SearchModalCommander: ${action} search modal`);
  }

  return (
    <div className="app">
      <input
        id="dummy-search-box"
        type="text"
        ref={searchRef}
        className="search-box"
        onClick={() => sendCommand(true)}   // Detect when the field is clicked
        placeholder="Search post..."
      />
    </div>
  );
}