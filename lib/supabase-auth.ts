import { createClient } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
}

// Sign in with Google OAuth
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    // Check if Supabase is properly initialized
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase not properly initialized');
      return {
        success: false,
        error: 'Authentication service not available',
        errorCode: 'auth/not-initialized',
      };
    }

    console.log('=== GOOGLE OAUTH DEBUG START ===');
    console.log('Starting Google OAuth...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Current location:', typeof window !== 'undefined' ? window.location.href : 'server-side');
    
    // Extract project reference from Supabase URL
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
    console.log('Supabase Project Reference:', projectRef);
    console.log('Expected redirect URI:', `https://${projectRef}.supabase.co/auth/v1/callback`);
    console.log('Please add this exact redirect URI to your Google OAuth configuration');
    
    console.log('About to call supabase.auth.signInWithOAuth...');
    
    // Use Supabase's default OAuth flow (no custom redirect)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    
    console.log('OAuth call completed');
    console.log('Data:', data);
    console.log('Error:', error);
    console.log('=== GOOGLE OAUTH DEBUG END ===');

    if (error) {
      console.error('Google sign in error:', error)
      return {
        success: false,
        error: error.message || 'Authentication failed',
        errorCode: error.status?.toString(),
      }
    }

    // OAuth flow initiated successfully
    console.log('OAuth flow initiated:', data)
    return {
      success: true,
      // OAuth flow initiated, user will be available after redirect
      user: undefined,
    }
  } catch (error: any) {
    console.error('Google sign in error:', error)
    return {
      success: false,
      error: error.message || 'Authentication failed',
    }
  }
}

// Sign out user
export async function signOutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  } catch (error: any) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  return data.user
}



// Sign in with email and password (for admin)
export async function signInWithEmailAndPassword(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Email sign in error:', error)
      return {
        success: false,
        error: error.message || 'Authentication failed',
        errorCode: error.status?.toString(),
      }
    }

    return {
      success: true,
      user: data.user || undefined,
    }
  } catch (error: any) {
    console.error('Email sign in error:', error)
    return {
      success: false,
      error: error.message || 'Authentication failed',
    }
  }
}

// Get user session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Get session error:', error)
    return null
  }
  return session
}

// Debug function to check Supabase configuration
export function debugSupabaseConfig() {
  const config = {
    supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
    supabaseAnonKey: supabaseAnonKey ? 'Present' : 'Missing',
    currentUser: getCurrentUser(),
    timestamp: new Date().toISOString(),
  }
  
  console.log('Supabase Debug Info:', config)
  return config
} 