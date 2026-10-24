// client/src/api/firebase.ts
import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import {
  type FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

type Environment = Record<string, string | undefined>;

const viteEnv = (import.meta as ImportMeta & { env?: Environment }).env;

const getEnvVar = (key: string) => {
  const globalScope = typeof globalThis !== 'undefined' ? globalThis : undefined;
  const processEnv =
    globalScope &&
    (globalScope as { process?: { env?: Record<string, string | undefined> } }).process?.env;

  if (processEnv && processEnv[key] !== undefined) {
    return processEnv[key];
  }

  const windowEnv =
    globalScope &&
    (globalScope as { window?: { __ENV__?: Record<string, string | undefined> } }).window?.__ENV__;
  if (windowEnv && windowEnv[key] !== undefined) {
    return windowEnv[key];
  }

  return undefined;
};

export const firebaseConfig = {
  apiKey: viteEnv?.VITE_FIREBASE_API_KEY ?? getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: viteEnv?.VITE_FIREBASE_AUTH_DOMAIN ?? getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: viteEnv?.VITE_FIREBASE_PROJECT_ID ?? getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: viteEnv?.VITE_FIREBASE_STORAGE_BUCKET ?? getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId:
    viteEnv?.VITE_FIREBASE_MESSAGING_SENDER_ID ?? getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: viteEnv?.VITE_FIREBASE_APP_ID ?? getEnvVar('VITE_FIREBASE_APP_ID'),
};

// 🛡️ Safety Check: Prevent crash if keys are missing
const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined';

if (!isConfigValid) {
  console.error(
    'Firebase API key is missing from the Vite build. Set VITE_FIREBASE_API_KEY in the frontend build environment and redeploy.',
  );
}

// Initialize Firebase (Singleton pattern)
const app: FirebaseApp | null = isConfigValid
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
  : null; // Fallback to null to prevent initialization with an invalid config

const storage: FirebaseStorage | null = app ? getStorage(app) : null;
const auth: Auth | null = app ? getAuth(app) : null;

export { app, auth, storage, ref, uploadBytes, getDownloadURL };

export const firebase = app;
