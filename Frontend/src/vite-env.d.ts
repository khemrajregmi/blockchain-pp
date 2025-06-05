/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEV_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
