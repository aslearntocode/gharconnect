import { getSupabaseClient } from './supabase'

export async function testSupabaseConnection() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('investment_records')
      .select('count');
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
} 