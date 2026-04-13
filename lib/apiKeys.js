// lib/apiKeys.js
import { createHash, randomBytes } from 'crypto'

/**
 * Generate a new Logwick API key.
 * Returns { key, keyHash, keyPrefix }
 * - key:       the full secret, shown ONCE to the user
 * - keyHash:   sha256, stored in DB
 * - keyPrefix: first 16 chars, shown in UI for identification
 */
export function generateApiKey() {
  const random = randomBytes(32).toString('hex')   // 64 hex chars
  const key = `sk-lw-${random}`                    // e.g. sk-lw-a1b2c3...
  const keyHash = hashKey(key)
  const keyPrefix = key.slice(0, 16)               // "sk-lw-a1b2c3d4"
  return { key, keyHash, keyPrefix }
}

export function hashKey(key) {
  return createHash('sha256').update(key).digest('hex')
}

/**
 * Validate an incoming API key against the DB.
 * Returns the api_keys row (with org_id) if valid, null otherwise.
 */
export async function validateApiKey(rawKey, supabaseAdmin) {
  if (!rawKey?.startsWith('sk-lw-')) return null

  const keyHash = hashKey(rawKey)

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, org_id, revoked')
    .eq('key_hash', keyHash)
    .single()

  if (error || !data || data.revoked) return null

  // Update last_used_at and increment call_count (fire and forget)
  supabaseAdmin
    .from('api_keys')
    .update({
      last_used_at: new Date().toISOString(),
      call_count: data.call_count + 1,
    })
    .eq('id', data.id)
    .then(() => {})

  return data
}

/**
 * Extract Bearer token from Authorization header.
 */
export function extractBearerToken(req) {
  const auth = req.headers.get?.('authorization') || req.headers?.authorization || ''
  const match = auth.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}
