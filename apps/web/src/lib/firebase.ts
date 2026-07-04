import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase client config — values are public by design (visible in browser network tab).
// Firebase security is enforced via Security Rules, not API key secrecy.
const firebaseConfig = {
  apiKey: "AIzaSyCPyOAT0fUD0Ntlk3-aUiclnVm7K6XQFro",
  authDomain: "finance-tracker-2a358.firebaseapp.com",
  projectId: "finance-tracker-2a358",
  storageBucket: "finance-tracker-2a358.firebasestorage.app",
  messagingSenderId: "160523211564",
  appId: "1:160523211564:web:dc383ae4a8f1ad41ca5289",
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
