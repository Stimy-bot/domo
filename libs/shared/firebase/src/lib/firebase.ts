// client/src/api/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';

const getEnvVar = (key: string) => {
  const globalScope = typeof globalThis !== 'undefined' ? globalThis : undefined;
  const processEnv = globalScope && (globalScope as { process?: { env?: Record<string, string | undefined> } }).process?.env;

  if (processEnv && processEnv[key] !== undefined) {
    return processEnv[key];
  }

  const windowEnv = globalScope && (globalScope as { window?: { __ENV__?: Record<string, string | undefined> } }).window?.__ENV__;
  if (windowEnv && windowEnv[key] !== undefined) {
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
const app: FirebaseApp | null = isConfigValid 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null; // Fallback to null to prevent initialization with an invalid config

const storage: FirebaseStorage | null = app ? getStorage(app) : null;
const auth: Auth | null = app ? getAuth(app) : null;

export { 
  app, 
  auth, 
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
};

export const firebase = app;