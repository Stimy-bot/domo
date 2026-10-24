/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MONGO_URI: string;
  readonly GITHUB_CLIENT_SECRET: string;
  readonly GITHUB_CLIENT_ID: string;
  readonly BETTER_AUTH_URL: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly GOOGLE_OAUTH_REDIRECT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
