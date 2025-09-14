import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bdfwqnenqpoygnoqsstb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZndxbmVucXBveWdub3Fzc3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTE5MjIsImV4cCI6MjA3MDMyNzkyMn0.9Um0CP9_ylf1GEwo4Pf4_sqaxgU0x_nRulBFLY14-GA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});