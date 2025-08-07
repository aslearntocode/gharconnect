import { auth } from './firebase'
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth'

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
}

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    // Check if popup is supported (mobile browsers might not support it)
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return {
        success: false,
        error: 'Please use a desktop browser for Google sign-in, or try refreshing the page',
        errorCode: 'auth/mobile-not-supported'
      }
    }

    // Simple Google sign in - no state clearing, no complex logic
    const provider = new GoogleAuthProvider()
    
    // Add a small delay to ensure Firebase is fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await signInWithPopup(auth, provider)
    
    return {
      success: true,
      user: result.user
    }
  } catch (error: any) {
    console.error('Google sign in error:', error)
    
    // Handle specific errors
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: 'Please allow popups for this site and try again',
        errorCode: error.code
      }
    }
    
    if (error.code === 'auth/missing-or-invalid-nonce') {
      return {
        success: false,
        error: 'Please refresh the page and try again',
        errorCode: error.code
      }
    }
    
    return {
      success: false,
      error: error.message || 'Authentication failed',
      errorCode: error.code
    }
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