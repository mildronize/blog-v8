import { createRef, useState } from 'react';
import SearchModal from './SearchModal';
import './style.css';
// import { BrowserSearch } from '../../libs/search/search-index-broswer';
import { useShortcut } from './useShortcut'

export default () => {
  const searchRef = createRef<HTMLInputElement>();
  const [focus, setFocus] = useState<boolean>(false);

  const handleFocus = (isFocus: boolean) => {
    setFocus(isFocus);
    // if (searchRef.current) {
    //   if (isFocus) searchRef.current.focus(); // Focus the text field
    //   else searchRef.current.blur(); // Remove focus from the input
    // }
  }

  const handleEnterSearchTextFields = () => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth", // Enables smooth scrolling
    // });
    handleFocus(true); // Focus the text field
  }

  const handleClearTextField = () => {
    handleFocus(false); // Remove focus from the input
  }

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    'Control+p': handleEnterSearchTextFields,
    'Command+p': handleEnterSearchTextFields,
    'Escape': handleClearTextField
  }

  Object.entries(shortcuts).forEach(([shortcut, callback]) => {
    useShortcut(shortcut, (e: KeyboardEvent) => {
      e.preventDefault();
      callback(e);
    })
  })

  const handleClick = () => {
    handleFocus(true);
    if(searchRef.current) {
      searchRef.current.blur();
    }
  }


  return (
    <div className="app">
      <input
        type="text"
        className="search-box"
        ref={searchRef}
        // onFocus={() => handleFocus(true)} // Detect when the field gains focus
        // onBlur={() => handleFocus(false)}   // Detect when the field loses focus
        onClick={() => handleClick()}   // Detect when the field is clicked
        placeholder="Search post..."
      />

      {focus && <SearchModal />}
    </div>
  );
};