import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

// Check if localStorage is available
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Safe Firebase Auth initialization
export const initializeFirebaseAuth = (callback: (user: User | null) => void) => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, skipping Firebase Auth initialization');
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }

  return auth.onAuthStateChanged(callback);
}; 