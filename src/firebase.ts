import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration from environment variables
// Security note: These are public config values - actual security is enforced by Firestore rules
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter((varName) => !import.meta.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingVars);
  console.error('📋 Available env vars:', Object.keys(import.meta.env));
  
  if (import.meta.env.PROD) {
    console.error('🔧 GitHub Secrets may not be configured. Check:', 
      'https://github.com/Vaibhavk11/HMI/settings/secrets/actions');
  } else {
    console.error('📝 Please copy .env.example to .env and fill in your Firebase config');
  }
} else {
  console.log('✅ Firebase environment variables loaded successfully');
  console.log('🔥 Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
