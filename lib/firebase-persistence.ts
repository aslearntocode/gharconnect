import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './firebase';

let persistenceSet = false;

export function initializeFirebasePersistence() {
  if (persistenceSet) {
    return Promise.resolve();
  }

  persistenceSet = true;
  
  return setPersistence(auth, browserLocalPersistence)
    .then(() => {
      // Persistence set successfully
    })
    .catch((error: Error) => {
      console.error('Error setting Firebase persistence:', error);
      persistenceSet = false;
    });
} 