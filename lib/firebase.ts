  import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing required fields:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
  });
} else {
  console.log('Firebase configuration validated:', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId
  });
}

// Singleton pattern to ensure only one Firebase instance
let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;

function initializeFirebase() {
  if (firebaseApp) {
    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb };
  }

  // Initialize Firebase only if not already initialized
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }

  // Initialize Firebase services
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb };
}

const { auth, db } = initializeFirebase();

// Log Firebase app details for debugging
if (typeof window !== 'undefined') {
  console.log('Firebase app initialized:', {
    appName: auth.app.name,
    authDomain: auth.app.options.authDomain,
    projectId: auth.app.options.projectId,
    appId: auth.app.options.appId
  });
}

export { auth, db }; 

