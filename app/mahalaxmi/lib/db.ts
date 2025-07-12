import { getSupabaseClient } from '@/lib/supabase'

interface DatabaseRecord {
  [key: string]: string | number | boolean;
}

// Your database functions here
export async function saveRecord(table: string, record: DatabaseRecord) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .insert([record])
  
  if (error) throw error
  return data
}

export async function getRecord(table: string, query: DatabaseRecord) {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .match(query)
  
  if (error) throw error
  return data
} 