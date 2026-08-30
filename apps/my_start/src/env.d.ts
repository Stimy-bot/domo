/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MONGO_URI: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}