import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { auth } from './firebase' // Import Firebase auth

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a base client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Function to get an authenticated Supabase client
export const getSupabaseClient = async (): Promise<SupabaseClient> => {
  const token = await auth.currentUser?.getIdToken()
  
  if (token) {
    supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    })
  }
  
  return supabase
}

// Function to get Supabase client with Firebase auth headers
export const getSupabaseClientWithAuth = async (): Promise<SupabaseClient> => {
  const token = await auth.currentUser?.getIdToken()
  
  if (token) {
    // Create a new client with custom headers
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Client-Info': 'supabase-js/2.x.x',
        },
      },
    })
    
    return client
  }
  
  return supabase
}

// Function to get Supabase client for storage operations
export const getSupabaseStorageClient = async (): Promise<SupabaseClient> => {
  const token = await auth.currentUser?.getIdToken()
  
  if (token) {
    // For storage operations, we need to use the service role key or handle auth differently
    // For now, let's use the regular client but with proper auth setup
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
    
    // Set the session with the Firebase token
    await client.auth.setSession({
      access_token: token,
      refresh_token: token,
    })
    
    return client
  }
  
  return supabase
}

// DEPRECATED: This function is part of a pattern that can cause race conditions.
// Use getSupabaseClient instead.
export const updateSupabaseAuth = async () => {
  const token = await auth.currentUser?.getIdToken()
  if (token) {
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: token,
    })
  }
}

export type Review = {
  id?: string
  user_id: string
  user_name: string
  card_id: string
  card_name: string
  rating: number
  comment: string
  created_at?: string
}

// Add a simple test function to verify connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('investment_records')
      .select('created_at')
      .limit(1)

    if (error) {
      console.error('Supabase connection test error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return false
    }

    console.log('Supabase connection successful')
    return true
  } catch (err) {
    console.error('Supabase connection test failed:', err)
    return false
  }
}

// Test storage access
export async function testStorageAccess() {
  try {
    const { data, error } = await supabase.storage
      .from('product-images')
      .list('', { limit: 1 })

    if (error) {
      console.error('Storage access test error:', {
        message: error.message,
        name: error.name
      })
      return false
    }

    console.log('Storage access successful')
    return true
  } catch (err) {
    console.error('Storage access test failed:', err)
    return false
  }
}

// Test authenticated storage upload
export async function testStorageUpload(userId: string) {
  try {
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileName = `${userId}/test-${Date.now()}.txt`
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, testFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload test error:', {
        message: error.message,
        name: error.name
      })
      return false
    }

    // Clean up test file
    await supabase.storage
      .from('product-images')
      .remove([fileName])

    console.log('Storage upload test successful')
    return true
  } catch (err) {
    console.error('Storage upload test failed:', err)
    return false
  }
} 