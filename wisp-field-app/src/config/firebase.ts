/**
 * Firebase Configuration for Mobile App
 * Aligned to the main web app (wisptools-production).
 * Android builds use android/app/google-services.json (local; copy from *.example).
 * Do not commit real API keys — set values locally or via CI secrets.
 */

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "wisptools-production.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "wisptools-production",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "wisptools-production.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || ""
};

export const API_URL = 'https://us-central1-wisptools-production.cloudfunctions.net/hssProxy';
