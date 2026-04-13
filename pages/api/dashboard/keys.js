// pages/api/dashboard/keys.js
// Used by the dashboard UI (session auth, not API key auth)
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { generateApiKey } from '../../../lib/apiKeys'

async function getOrgId(supabaseUser, userId) {
  const { data } = await supabaseUser
    .from('org_members')
    .select('org_id')
    .eq('user_id', userId)
    .single()
  return data?.org_id
}

export default async function handler(req, res) {
  const supabaseUser = createServerSupabaseClient({ req, res })
  const { data: { session } } = await supabaseUser.auth.getSession()
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const orgId = await getOrgId(supabaseUser, session.user.id)
  if (!orgId) return res.status(403).json({ error: 'No organization found' })

  const supabase = getSupabaseAdmin()

  // ── GET: list keys ─────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, last_used_at, call_count, created_at, revoked')
      .eq('org_id', orgId)
      .eq('revoked', false)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ keys: data })
  }

  // ── POST: create key ───────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Key name required' })

    const { key, keyHash, keyPrefix } = generateApiKey()

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        org_id:     orgId,
        name,
        key_hash:   keyHash,
        key_prefix: keyPrefix,
        created_by: session.user.id,
      })
      .select('id, name, key_prefix, created_at')
      .single()

    if (error) return res.status(500).json({ error: error.message })

    // Return the full key ONCE — never stored
    return res.status(201).json({ ...data, key })
  }

  // ── DELETE: revoke key ─────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Key ID required' })

    const { error } = await supabase
      .from('api_keys')
      .update({ revoked: true })
      .eq('id', id)
      .eq('org_id', orgId)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
