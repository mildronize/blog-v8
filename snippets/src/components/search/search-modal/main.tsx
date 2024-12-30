import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SearchModalShell } from './SearchModalShell';

createRoot(document.getElementById('search-root')!).render(
  <StrictMode>
    <SearchModalShell />
  </StrictMode>,
)