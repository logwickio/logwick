// Returns a short-lived guest API key for demo/testing purposes
// Allows agents to test Logwick without creating an account
// Keys expire after 1 hour and are rate limited to 10 logs

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { getSupabaseAdmin } = await import('../../../lib/supabase')
  const { generateApiKey } = await import('../../../lib/apiKeys')
  const supabase = getSupabaseAdmin()

  // Get the x402 public org for guest logs
  const { data: publicOrg } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'x402-public')
    .single()

  if (!publicOrg) {
    return res.status(500).json({ error: 'Guest org not configured' })
  }

  // Generate a short-lived key
  const { key, keyHash, keyPrefix } = generateApiKey()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

  const { error } = await supabase.from('api_keys').insert({
    org_id: publicOrg.id,
    name: 'guest-demo',
    key_hash: keyHash,
    key_prefix: keyPrefix,
    created_by: null,
  })

  if (error) {
    return res.status(500).json({ error: 'Failed to create guest token' })
  }

  return res.status(200).json({
    key,
    expires_at: expiresAt,
    limit: 10,
    description: 'Demo key — expires in 1 hour, max 10 logs',
    ingest_endpoint: 'POST https://logwick.io/api/v1/logs',
    docs: 'https://logwick.io/docs',
  })
}
