// Supabase Client Initialization & Fallback Handler

// Attempt to read environment variables from window/import.meta.env
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || window.SUPABASE_URL || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || window.SUPABASE_ANON_KEY || '';

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey && window.supabase) {
  try {
    supabaseInstance = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    console.log('[RankStreak] Supabase initialized successfully!');
  } catch (err) {
    console.warn('[RankStreak] Supabase client initialization failed, running in Local Demo Mode:', err);
  }
} else {
  console.log('[RankStreak] Running in Local Demo / Offline Mode (No Supabase ENV set)');
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = Boolean(supabaseInstance);
