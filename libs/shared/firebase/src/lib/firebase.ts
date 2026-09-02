// client/src/api/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const getEnvVar = (key: string) => {
  const globalScope = typeof globalThis !== 'undefined' ? globalThis : undefined;
  const processEnv = globalScope && (globalScope as any).process ? (globalScope as any).process.env : undefined;

  if (processEnv && processEnv[key] !== undefined) {
    return processEnv[key];
  }

  const windowEnv = globalScope && (globalScope as any).window ? (globalScope as any).window.__ENV__ : undefined;
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
const app = isConfigValid 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : ({} as any); // Fallback to empty object to prevent "app undefined" errors

const storage = isConfigValid ? getStorage(app) : (null as any);
const auth = isConfigValid ? getAuth(app) : (null as any);

export { 
  app, 
  auth, 
  storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
};