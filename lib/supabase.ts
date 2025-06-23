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