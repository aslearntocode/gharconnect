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
    // Simple Google sign in
    const provider = new GoogleAuthProvider()
    
    // Clear any existing OAuth state
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
      localStorage.clear()
    }
    
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