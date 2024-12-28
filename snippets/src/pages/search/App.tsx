// import { useState, useEffect, createRef } from 'react';
import SearchModal from './SearchModal';
import './style.css';
// import { BrowserSearch } from '../../libs/search/search-index-broswer';
// import { useShortcut } from './useShortcut'

export default () => {
  return (
    <div className="app">
      <input
        type="text"
        className="search-box"
        placeholder="Dummy"
      />
      <SearchModal />
    </div>
  );
};