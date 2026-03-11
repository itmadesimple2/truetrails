import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://hqbvbuhkkytzxkhpxkyw.supabase.co'
const SUPABASE_KEY = 'sb_publishable_VIDp5WeyGsCNLIBDQ9eiWw_dbRYgvU8'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
