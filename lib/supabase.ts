import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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