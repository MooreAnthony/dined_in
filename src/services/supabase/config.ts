import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Verify connection
export const verifyConnection = async () => {
  try {
    const { error } = await supabase.from('contacts').select('count');
    if (error) throw error;
    console.log('Supabase connection verified');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};