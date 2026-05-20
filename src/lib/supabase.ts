import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cyxkbjgplhcxtmkfrwqp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGtiamdwbGhjeHRta2Zyd3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MDU0MzEsImV4cCI6MjA1NTQ4MTQzMX0.maEMLQ2foNB_AXbggRTmIbEAs39ALWKwwROidcgqZNU';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('Supabase deployment error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);