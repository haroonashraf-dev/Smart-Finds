import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '@/firebase-applet-config.json';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  firestoreDatabaseId?: string;
}

const config = firebaseConfig as FirebaseConfig;

// Check if we have a real API key (not empty and not the placeholder)
export const isFirebaseConfigured = !!config.apiKey && config.apiKey !== "your_api_key";

const app = isFirebaseConfigured ? initializeApp(config) : null;

// Initialize Firestore - only pass databaseId if it is not the default one
export const db = app ? (
  config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app)
) : null;

export const auth = app ? getAuth(app) : null;
export { signInAnonymously };
export const googleProvider = new GoogleAuthProvider();
