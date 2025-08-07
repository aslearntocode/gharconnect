import { auth } from './firebase'
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth'

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
}

// Prevent multiple OAuth flows
let isSigningIn = false;

export async function signInWithGoogle(): Promise<AuthResult> {
  // Prevent multiple simultaneous sign-in attempts
  if (isSigningIn) {
    return {
      success: false,
      error: 'Sign in already in progress',
      errorCode: 'auth/already-in-progress'
    }
  }

  try {
    isSigningIn = true;

    // Validate Firebase auth is initialized
    if (!auth) {
      return {
        success: false,
        error: 'Firebase authentication is not initialized',
        errorCode: 'auth/not-initialized'
      }
    }

    // Ensure Firebase app is ready
    if (!auth.app) {
      return {
        success: false,
        error: 'Firebase app is not initialized',
        errorCode: 'auth/app-not-initialized'
      }
    }

    // Check if user is already signed in
    if (auth.currentUser) {
      return {
        success: true,
        user: auth.currentUser
      }
    }

    // Clear all OAuth-related state to prevent nonce errors
    if (typeof window !== 'undefined') {
      // Clear all Firebase-related storage items
      const keysToRemove = [];
      
      // Find all Firebase-related keys in sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('firebase')) {
          keysToRemove.push(key);
        }
      }
      
      // Find all Firebase-related keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('firebase')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all Firebase-related keys
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      });
      
      console.log('Cleared Firebase storage keys:', keysToRemove);
    }

    // Create a fresh provider instance
    const provider = new GoogleAuthProvider()
    
    // Add scopes
    provider.addScope('email')
    provider.addScope('profile')

    console.log('Attempting Google sign in...', {
      authInitialized: !!auth,
      appInitialized: !!auth.app,
      currentUser: auth.currentUser?.email,
      provider: provider.providerId
    });

    console.log('About to call signInWithPopup...');
    
    try {
      const result = await signInWithPopup(auth, provider)
      console.log('signInWithPopup completed successfully');
      
      console.log('Sign in successful:', result.user.email);
      
      return {
        success: true,
        user: result.user
      }
    } catch (popupError: any) {
      // If we get a nonce error, try one more time after clearing state
      if (popupError?.code === 'auth/missing-or-invalid-nonce') {
        console.log('Nonce error detected, retrying after clearing state...');
        
        // Clear state again and retry
        if (typeof window !== 'undefined') {
          const keysToRemove = [];
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.includes('firebase')) {
              keysToRemove.push(key);
            }
          }
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('firebase')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => {
            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
          });
        }
        
        // Wait a bit longer before retry
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Retry the sign in
        const retryResult = await signInWithPopup(auth, provider);
        console.log('Retry successful:', retryResult.user.email);
        
        return {
          success: true,
          user: retryResult.user
        }
      }
      
      // If it's not a nonce error, re-throw it
      throw popupError;
    }
  } catch (error: any) {
    console.error('Google sign in error:', error);
    console.error('Error details:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      toString: error?.toString()
    });
    
    // Handle different types of errors
    let errorMessage = 'Authentication failed';
    let errorCode = 'auth/unknown-error';
    
    if (error?.code) {
      errorCode = error.code;
      errorMessage = error.message || 'Authentication failed';
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      // Try to extract meaningful information from the error object
      const errorKeys = Object.keys(error);
      if (errorKeys.length > 0) {
        errorMessage = `Authentication error: ${errorKeys.join(', ')}`;
      } else {
        errorMessage = 'Unknown authentication error occurred';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: errorCode
    }
  } finally {
    isSigningIn = false;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth)
    console.log('User signed out successfully')
  } catch (error: any) {
    console.error('Sign out error:', error)
    throw error
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}

export function isAuthenticated(): boolean {
  return !!auth.currentUser
}

// Debug function to check Firebase configuration
export function debugFirebaseConfig() {
  const config = {
    appName: auth.app.name,
    authDomain: auth.app.options.authDomain,
    projectId: auth.app.options.projectId,
    apiKey: auth.app.options.apiKey ? 'Present' : 'Missing',
    currentUser: auth.currentUser ? {
      email: auth.currentUser.email,
      uid: auth.currentUser.uid
    } : null,
    timestamp: new Date().toISOString()
  }
  
  console.log('Firebase Debug Info:', config)
  return config
} 