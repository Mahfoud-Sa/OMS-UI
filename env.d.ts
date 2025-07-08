/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_ENV: string
  // Add any other custom env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
