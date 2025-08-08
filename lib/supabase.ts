import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a base client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Function to get an authenticated Supabase client
export const getSupabaseClient = async (): Promise<SupabaseClient> => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    // Session is automatically handled by the client
    return supabase
  }
  
  return supabase
}

// Function to get Supabase client with custom headers if needed
export const getSupabaseClientWithHeaders = async (): Promise<SupabaseClient> => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    // Create a new client with custom headers if needed
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
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
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    // For storage operations, the session is automatically handled
    return supabase
  }
  
  return supabase
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