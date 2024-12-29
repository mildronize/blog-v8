import { createRef, useEffect, useState } from 'react';
import SearchModal from './SearchModal';
import './style.css';
import { useShortcut } from './useShortcut'

export default () => {
  const searchRef = createRef<HTMLInputElement>();
  const [focus, setFocus] = useState<boolean>(false);

  const handleEnterSearchTextFields = () => {
    setFocus(true);
  }

  const handleClearTextField = () => {
    setFocus(false);
  }

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    'Control+p': handleEnterSearchTextFields,
    'Command+p': handleEnterSearchTextFields,
    'Enter': handleEnterSearchTextFields,
    'Escape': handleClearTextField
  }

  Object.entries(shortcuts).forEach(([shortcut, callback]) => {
    useShortcut(shortcut, (e: KeyboardEvent) => {
      e.preventDefault();
      callback(e);
    })
  })

  const handleClick = () => {
    setFocus(true);
    if (searchRef.current) {
      searchRef.current.blur();
    }
  }

  useEffect(() => {
    // Set query from URL on initial load
    const params = new URLSearchParams(window.location.search);
    if (params.get('q') !== null) {
      setFocus(true);
    }
  }, []);

  return (
    <div className="app">
      <input
        id="dummy-search-box"
        type="text"
        className="search-box"
        ref={searchRef}
        onClick={() => handleClick()}   // Detect when the field is clicked
        placeholder="Search post..."
      />

      {focus && <SearchModal isBackdropVisible={focus} setBackdropVisible={(focus) => setFocus(focus)} />}
    </div>
  );
};