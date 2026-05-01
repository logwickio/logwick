import { getSupabaseAdmin } from '../../../lib/supabase'
import { generateApiKey } from '../../../lib/apiKeys'

async function getUserOrg(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return { orgId: null, userId: null }
  const supabase = getSupabaseAdmin()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return { orgId: null, userId: null }
  const { data } = await supabase.from('org_members').select('org_id').eq('user_id', user.id).single()
  return { orgId: data?.org_id || null, userId: user.id }
}

export default async function handler(req, res) {
  const { orgId, userId } = await getUserOrg(req)
  if (!orgId) return res.status(401).json({ error: 'Not authenticated' })

  const supabase = getSupabaseAdmin()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('api_keys')
      .select('id, name, key_prefix, last_used_at, call_count, created_at, revoked')
      .eq('org_id', orgId).eq('revoked', false).order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ keys: data })
  }

  if (req.method === 'POST') {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Key name required' })

    // Get org plan and enforce key limits
    const { data: org } = await supabase
      .from('organizations')
      .select('plan')
      .eq('id', orgId)
      .single()

    const plan = org?.plan || 'free'
    const keyLimit = plan === 'pro' || plan === 'enterprise' ? 10 : 1

    // Count existing keys
    const { count } = await supabase
      .from('api_keys')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId)
      .eq('revoked', false)

    if (count >= keyLimit) {
      return res.status(403).json({
        error: `API key limit reached. ${plan === 'free' ? 'Free plan allows 1 key. Upgrade to Pro for 10 keys.' : 'Pro plan allows 10 keys.'}`,
        limit: keyLimit,
        plan,
      })
    }

    const { key, keyHash, keyPrefix } = generateApiKey()
    const { data, error } = await supabase.from('api_keys')
      .insert({ org_id: orgId, name, key_hash: keyHash, key_prefix: keyPrefix, created_by: userId })
      .select('id, name, key_prefix, created_at').single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ...data, key })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Key ID required' })
    const { error } = await supabase.from('api_keys').update({ revoked: true }).eq('id', id).eq('org_id', orgId)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
