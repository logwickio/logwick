// lib/supabase.js
// ── Browser client (uses anon key) ───────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

let browserClient = null

export function getSupabase() {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return browserClient
}

// ── Server / API-route client (uses service role — bypasses RLS) ─────────────
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}
