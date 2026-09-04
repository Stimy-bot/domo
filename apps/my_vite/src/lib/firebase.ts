// client/src/api/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

type Environment = Record<string, string | undefined>;
type GlobalScope = typeof globalThis & {
  process?: { env?: Environment };
  window?: { __ENV__?: Environment };
};

const getEnvVar = (key: string) => {
  const globalScope = typeof globalThis !== 'undefined'
    ? (globalThis as GlobalScope)
    : undefined;
  const processEnv = globalScope?.process?.env;

  if (processEnv?.[key] !== undefined) {
    return processEnv[key];
  }

  const windowEnv = globalScope?.window?.__ENV__;
  if (windowEnv?.[key] !== undefined) {
    return windowEnv[key];
  }

  return undefined;
};

export const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
};

// 🛡️ Safety Check: Prevent crash if keys are missing
const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

if (!isConfigValid) {
  console.error(
    "❌ Firebase API Key is missing! Check your Render Environment Variables and ensure they start with VITE_"
  );
}

// Initialize Firebase (Singleton pattern)
const app = isConfigValid 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null; // Fallback to null to prevent "app undefined" errors

const storage = isConfigValid && app ? getStorage(app) : null;
const auth = isConfigValid && app ? getAuth(app) : null;

export { 
  app, 
  auth, 
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
};