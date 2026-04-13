// pages/api/auth/signup.js
// Called after Supabase email verification to provision the org
import { getSupabaseAdmin } from '../../../lib/supabase'
import { generateApiKey } from '../../../lib/apiKeys'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, orgName, email } = req.body
  if (!userId || !orgName) return res.status(400).json({ error: 'userId and orgName required' })

  const supabase = getSupabaseAdmin()

  // Create slug from org name
  const slug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) + '-' + Math.random().toString(36).slice(2, 6)

  // Create org
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({ name: orgName, slug, plan: 'free', log_limit: 5000, retention_days: 7 })
    .select().single()

  if (orgErr) {
    console.error(orgErr)
    return res.status(500).json({ error: 'Failed to create organization' })
  }

  // Add user as owner
  await supabase.from('org_members').insert({ org_id: org.id, user_id: userId, role: 'owner' })

  // Create default settings
  await supabase.from('org_settings').insert({ org_id: org.id })

  // Auto-generate first API key
  const { key, keyHash, keyPrefix } = generateApiKey()
  const { data: keyData } = await supabase
    .from('api_keys')
    .insert({ org_id: org.id, name: 'Default', key_hash: keyHash, key_prefix: keyPrefix, created_by: userId })
    .select('id').single()

  return res.status(201).json({
    orgId:   org.id,
    orgSlug: org.slug,
    apiKey:  key,           // ← shown once to user in onboarding
    keyId:   keyData?.id,
  })
}
