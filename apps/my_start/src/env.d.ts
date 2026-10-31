/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BETTER_AUTH_SECRET: string;

  readonly BETTER_AUTH_URL: string;

  readonly PUBLIC_URL: string;

  readonly VITE_API_URL: string;

  readonly VITE_FIREBASE_API_KEY: string;

  readonly VITE_FIREBASE_AUTH_DOMAIN: string;

  readonly VITE_FIREBASE_DATABASE_URL: string;

  readonly VITE_FIREBASE_PROJECT_ID: string;

  readonly VITE_FIREBASE_STORAGE_BUCKET: string;

  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;

  readonly VITE_FIREBASE_APP_ID: string;

  readonly VITE_GOOGLE_OAUTH_REDIRECT_URL: string;

  readonly VITE_GOOGLE_CLIENT_ID: string;

  readonly VITE_GOOGLE_CLIENT_SECRET: string;

  readonly MONGO_DATABASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.jpg';
declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.ico';
