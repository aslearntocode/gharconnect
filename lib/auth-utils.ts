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

    // Clear any existing OAuth state that might cause issues
    if (typeof window !== 'undefined') {
      // Clear any stored OAuth state
      sessionStorage.removeItem('firebase:authUser:gharconnect2025:web');
      localStorage.removeItem('firebase:authUser:gharconnect2025:web');
    }

    // Create a fresh provider instance
    const provider = new GoogleAuthProvider()
    
    // Add scopes
    provider.addScope('email')
    provider.addScope('profile')

    const result = await signInWithPopup(auth, provider)
    
    return {
      success: true,
      user: result.user
    }
  } catch (error: any) {
    console.error('Google sign in error:', error)
    
    return {
      success: false,
      error: error.message || 'Authentication failed',
      errorCode: error.code
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