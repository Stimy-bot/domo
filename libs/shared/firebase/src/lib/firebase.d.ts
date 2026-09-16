import { type FirebaseApp } from 'firebase/app';
import { ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import { type Auth } from 'firebase/auth';
export declare const firebaseConfig: {
    apiKey: string | undefined;
    authDomain: string | undefined;
    projectId: string | undefined;
    storageBucket: string | undefined;
    messagingSenderId: string | undefined;
    appId: string | undefined;
};
declare const app: FirebaseApp | null;
declare const storage: FirebaseStorage | null;
declare const auth: Auth | null;
export { app, auth, storage, ref, uploadBytes, getDownloadURL };
export declare const firebase: FirebaseApp | null;
//# sourceMappingURL=firebase.d.ts.map