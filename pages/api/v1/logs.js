// pages/api/v1/logs.js
import { getSupabaseAdmin } from '../../../lib/supabase'
import { validateApiKey, extractBearerToken } from '../../../lib/apiKeys'
import { dispatchWebhooks } from '../../../lib/webhooks'
import { stringify } from 'csv-stringify/sync'

export const config = { api: { bodyParser: true } }

// ── Rate limiting (simple in-memory, swap for Redis in production) ────────────
const rateLimitMap = new Map()
function checkRateLimit(orgId, limit = 1000) {
  const now = Date.now()
  const window = 60_000 // 1 minute
  const entry = rateLimitMap.get(orgId) || { count: 0, reset: now + window }
  if (now > entry.reset) { entry.count = 0; entry.reset = now + window }
  entry.count++
  rateLimitMap.set(orgId, entry)
  return { allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count), reset: entry.reset }
}

export default async function handler(req, res) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const rawKey = extractBearerToken(req)
  if (!rawKey) return res.status(401).json({ error: 'Missing API key. Use: Authorization: Bearer sk-lw-...' })

  const supabase = getSupabaseAdmin()
  const keyData = await validateApiKey(rawKey, supabase)
  if (!keyData) return res.status(401).json({ error: 'Invalid or revoked API key.' })

  const { org_id: orgId } = keyData

  // ── Rate limit ────────────────────────────────────────────────────────────
  const rl = checkRateLimit(orgId)
  res.setHeader('X-RateLimit-Remaining', rl.remaining)
  res.setHeader('X-RateLimit-Reset', rl.reset)
  if (!rl.allowed) return res.status(429).json({ error: 'Rate limit exceeded. Max 1000 requests/minute.' })

  // ══════════════════════════════════════════════════════════════════════════
  if (req.method === 'POST') {
    return handleIngest(req, res, supabase, orgId, keyData.id)
  }

  if (req.method === 'GET') {
    return handleQuery(req, res, supabase, orgId)
  }

  return res.status(405).json({ error: 'Method not allowed. Use POST to ingest, GET to query.' })
}

// ── POST /api/v1/logs ─────────────────────────────────────────────────────────
async function handleIngest(req, res, supabase, orgId, apiKeyId) {
  const body = req.body

  // Validate required fields
  if (!body.agent) return res.status(400).json({ error: '`agent` is required (e.g. "gpt-4o")' })
  if (!body.action) return res.status(400).json({ error: '`action` is required (e.g. "email_draft")' })

  const validStatuses = ['success', 'error', 'pending']
  const status = body.status || 'success'
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `\`status\` must be one of: ${validStatuses.join(', ')}` })
  }

  // Check org log limit for this month
  const { count } = await supabase
    .from('logs')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  const { data: org } = await supabase
    .from('organizations')
    .select('log_limit, plan')
    .eq('id', orgId)
    .single()

  if (count >= (org?.log_limit || 5000)) {
    return res.status(402).json({
      error: `Monthly log limit reached (${org?.log_limit?.toLocaleString()} logs). Upgrade your plan at app.logwick.io/settings.`,
    })
  }

  // Insert log
  const logEntry = {
    org_id:      orgId,
    api_key_id:  apiKeyId,
    agent:       String(body.agent).slice(0, 100),
    action:      String(body.action).slice(0, 100),
    status,
    input:       body.input != null ? String(body.input).slice(0, 50000) : null,
    output:      body.output != null ? String(body.output).slice(0, 50000) : null,
    user_ref:    body.user ? String(body.user).slice(0, 255) : null,
    tokens:      body.tokens != null ? parseInt(body.tokens) || null : null,
    latency_ms:  body.latency_ms != null ? parseInt(body.latency_ms) || null : null,
    cost_usd:    body.cost_usd != null ? parseFloat(body.cost_usd) || null : null,
    tags:        Array.isArray(body.tags) ? body.tags.map(String).slice(0, 20) : [],
    metadata:    body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
  }

  const { data, error } = await supabase.from('logs').insert(logEntry).select().single()

  if (error) {
    console.error('Log insert error:', error)
    return res.status(500).json({ error: 'Failed to save log entry.' })
  }

  // Fire webhooks async (don't await — don't block response)
  dispatchWebhooks(orgId, data).catch(console.error)

  return res.status(201).json({
    id:        data.id,
    timestamp: data.created_at,
    status:    'ingested',
  })
}

// ── GET /api/v1/logs ──────────────────────────────────────────────────────────
async function handleQuery(req, res, supabase, orgId) {
  const {
    status, agent, action, user,
    from, to,
    search,
    limit = '50', offset = '0',
    format = 'json',   // json | csv
    order = 'desc',
  } = req.query

  const take = Math.min(parseInt(limit) || 50, 1000)
  const skip = parseInt(offset) || 0

  let query = supabase
    .from('logs')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: order === 'asc' })
    .range(skip, skip + take - 1)

  if (status)  query = query.eq('status', status)
  if (agent)   query = query.eq('agent', agent)
  if (action)  query = query.eq('action', action)
  if (user)    query = query.eq('user_ref', user)
  if (from)    query = query.gte('created_at', new Date(from).toISOString())
  if (to)      query = query.lte('created_at', new Date(to + 'T23:59:59').toISOString())
  if (search)  query = query.or(
    `agent.ilike.%${search}%,action.ilike.%${search}%,input.ilike.%${search}%,output.ilike.%${search}%,user_ref.ilike.%${search}%`
  )

  const { data, error, count } = await query

  if (error) {
    console.error('Log query error:', error)
    return res.status(500).json({ error: 'Query failed.' })
  }

  // CSV export
  if (format === 'csv') {
    const cols = ['id','created_at','agent','action','status','user_ref','tokens','latency_ms','cost_usd','input','output']
    const csv = stringify([cols, ...data.map(row => cols.map(c => row[c] ?? ''))], {})
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="logwick_export.csv"')
    return res.send(csv)
  }

  return res.json({
    logs:   data,
    total:  count,
    limit:  take,
    offset: skip,
    has_more: skip + take < count,
  })
}
