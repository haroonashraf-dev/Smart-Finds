import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCI3K3LenzYz6QKZq0JNPTxUq9Xdv0y8Y0",
  authDomain: "smart-living-finds.firebaseapp.com",
  projectId: "smart-living-finds",
  storageBucket: "smart-living-finds.firebasestorage.app",
  messagingSenderId: "1038172929782",
  appId: "1:1038172929782:web:ca25aa543399f3e330f6d7",
  measurementId: "G-F27SJ5LW4X"
};

// Check if we have a real API key (not empty and not the placeholder)
export const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key";

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export { signInAnonymously };
export const googleProvider = new GoogleAuthProvider();
