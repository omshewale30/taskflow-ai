import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for client-side usage
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseBrowser = createBrowserClient(supabaseUrl, supabaseAnonKey);

export { supabase, supabaseBrowser };
