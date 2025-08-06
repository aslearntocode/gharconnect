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
    // Validate Firebase auth is initialized
    if (!auth) {
      return {
        success: false,
        error: 'Firebase authentication is not initialized',
        errorCode: 'auth/not-initialized'
      }
    }

    // Clear any existing auth state
    if (auth.currentUser) {
      console.log('Clearing existing auth state...')
      await signOut(auth)
      // Wait for sign out to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Create a fresh provider instance
    const provider = new GoogleAuthProvider()
    
    // Add some scopes if needed
    provider.addScope('email')
    provider.addScope('profile')

    console.log('Initiating Google sign in...')
    const result = await signInWithPopup(auth, provider)
    
    console.log('Sign in successful:', result.user?.email)
    
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