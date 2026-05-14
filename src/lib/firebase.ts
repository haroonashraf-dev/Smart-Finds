import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';

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

// Firebase configuration from environment variables or fallback to JSON
// To use in Vercel/Production, set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
const config: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCI3K3LenzYz6QKZq0JNPTxUq9Xdv0y8Y0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smart-living-finds.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smart-living-finds",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smart-living-finds.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1038172929782",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1038172929782:web:ca25aa543399f3e330f6d7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-F27SJ5LW4X",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "(default)"
};

// Check if we have a real API key (not empty and not a placeholder)
export const isFirebaseConfigured = !!config.apiKey && config.apiKey !== "your_api_key" && config.apiKey !== "";

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
