/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEARCH_METADATA_HOSTNAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}