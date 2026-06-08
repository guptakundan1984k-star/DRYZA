import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup as firebaseSignInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithPopupWrapper = async (adminScopes = false) => {
    try {
      isSigningIn = true;
      const customProvider = new GoogleAuthProvider();
      if (adminScopes) {
         customProvider.addScope('https://www.googleapis.com/auth/gmail.send');
      }
      
      const result = await firebaseSignInWithPopup(auth, customProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Failed to get access token from Firebase Auth');
      }
  
      cachedAccessToken = credential.accessToken;
      return {...result, credential};
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      isSigningIn = false;
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    return cachedAccessToken;
};

export const signOutWrapper = async () => {
    await firebaseSignOut(auth);
    cachedAccessToken = null;
};

export { signInWithPopupWrapper as signInWithPopup, signOutWrapper as signOut };
