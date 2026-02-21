import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vsaqtepbxtjwlzxfrsqi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYXF0ZXBieHRqd2x6eGZyc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzYyMjQsImV4cCI6MjA4NzI1MjIyNH0.I0dV_C8imRqgQlmwrZYlLuxwjV0f242qbcarmSDlqR4'

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)
