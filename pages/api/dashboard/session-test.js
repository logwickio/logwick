import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { session }, error } = await supabase.auth.getSession()
  res.json({
    hasSession: !!session,
    userId: session?.user?.id || 'none',
    email: session?.user?.email || 'none',
    error: error?.message || null
  })
}
