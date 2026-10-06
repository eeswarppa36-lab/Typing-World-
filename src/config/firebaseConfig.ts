/**
 * ============================================================================
 * TYPING WORLD — FIREBASE CONFIGURATION GUIDE
 * ============================================================================
 * 
 * To enable live production Firebase Google Authentication:
 * 1. Visit the Firebase Console: https://console.firebase.google.com/
 * 2. Create or select your project.
 * 3. Go to "Authentication" > "Sign-in method" and enable "Google" and "Email/Password".
 * 4. In Project Settings > "Your apps", register a Web App.
 * 5. Copy the configuration keys below and paste them into your environment (.env)
 *    or directly replace the placeholder values below.
 * 
 * ENVIRONMENT VARIABLES (Optional, can be placed in /.env):
 *   VITE_FIREBASE_API_KEY="your-api-key"
 *   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
 *   VITE_FIREBASE_PROJECT_ID="your-project-id"
 *   VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
 *   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
 *   VITE_FIREBASE_APP_ID="your-app-id"
 * ============================================================================
 */

export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Stored / environment configuration
export const defaultFirebaseConfig: FirebaseAppConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "typing-world-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "typing-world-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "typing-world-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "967271095582",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:967271095582:web:abcdef1234567890",
};

/**
 * Returns true if the developer has supplied real Firebase API keys.
 */
export function isFirebaseConfigured(): boolean {
  const key = defaultFirebaseConfig.apiKey;
  return Boolean(key && key.trim().length > 10 && !key.includes('your-api-key'));
}
