import { createClient } from '@supabase/supabase-js';

// Публичный проект Supabase этого сайта.
// anon-ключ безопасно держать в коде: чтение открыто всем, запись — только
// залогиненному админу (защищено RLS-политиками на стороне Supabase).
export const SUPABASE_URL = 'https://nuypnadvzoshqdhjdwre.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51eXBuYWR2em9zaHFkaGpkd3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTUzMzQsImV4cCI6MjA5ODMzMTMzNH0.pbfpf6zrqKH8HRPoVWG7ybOKYjtSmvg9IJfS-A52Gnw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
