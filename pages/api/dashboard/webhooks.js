// pages/api/dashboard/webhooks.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { getSupabaseAdmin } from '../../../lib/supabase'

async function getOrgId(supabaseUser, userId) {
  const { data } = await supabaseUser
    .from('org_members').select('org_id').eq('user_id', userId).single()
  return data?.org_id
}

export default async function handler(req, res) {
  const supabaseUser = createServerSupabaseClient({ req, res })
  const { data: { session } } = await supabaseUser.auth.getSession()
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const orgId = await getOrgId(supabaseUser, session.user.id)
  if (!orgId) return res.status(403).json({ error: 'No organization found' })

  const supabase = getSupabaseAdmin()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('webhooks').select('*').eq('org_id', orgId).order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ webhooks: data })
  }

  if (req.method === 'POST') {
    const { label, url, events, secret } = req.body
    if (!label || !url) return res.status(400).json({ error: 'label and url required' })
    const { data, error } = await supabase
      .from('webhooks').insert({ org_id: orgId, label, url, events: events || ['error'], secret })
      .select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PATCH') {
    const { id, active } = req.body
    const { error } = await supabase
      .from('webhooks').update({ active }).eq('id', id).eq('org_id', orgId)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    const { error } = await supabase
      .from('webhooks').delete().eq('id', id).eq('org_id', orgId)
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
