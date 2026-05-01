// pages/api/v1/logs/stream.js
// Server-Sent Events streaming endpoint for AI agents
// Streams log entries as they are queried — no waiting for full response
// Usage: GET /api/v1/logs/stream?status=error&limit=100

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Content-Type', 'application/json')
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  // Auth
  const auth = req.headers.authorization || ''
  const rawKey = auth.replace('Bearer ', '').trim()

  if (!rawKey) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(401).json({ error: 'Missing API key. Use: Authorization: Bearer sk-lw-...' })
  }

  // Validate key
  const { getSupabaseAdmin } = await import('../../../../lib/supabase')
  const { hashKey } = await import('../../../../lib/apiKeys')
  const supabase = getSupabaseAdmin()

  const keyHash = hashKey(rawKey)
  const { data: keyData } = await supabase
    .from('api_keys')
    .select('org_id, key_prefix')
    .eq('key_hash', keyHash)
    .single()

  if (!keyData) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(401).json({ error: 'Invalid or revoked API key.' })
  }

  // Parse query params
  const {
    status,
    agent,
    action,
    search,
    from,
    to,
    limit = '100',
    offset = '0',
  } = req.query

  const limitNum = Math.min(parseInt(limit) || 100, 500)
  const offsetNum = parseInt(offset) || 0

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('X-Accel-Buffering', 'no')

  const send = (event, data) => {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    // Send start event
    send('start', {
      message: 'Stream started',
      filters: { status, agent, action, search, from, to, limit: limitNum, offset: offsetNum }
    })

    // Build query
    let query = supabase
      .from('logs')
      .select('id, agent, action, status, input, output, tokens, latency_ms, cost_usd, user_ref, tags, metadata, created_at')
      .eq('org_id', keyData.org_id)
      .order('created_at', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1)

    if (status) query = query.eq('status', status)
    if (agent) query = query.ilike('agent', `%${agent}%`)
    if (action) query = query.ilike('action', `%${action}%`)
    if (from) query = query.gte('created_at', from)
    if (to) query = query.lte('created_at', to + 'T23:59:59Z')
    if (search) {
      query = query.or(`agent.ilike.%${search}%,action.ilike.%${search}%,input.ilike.%${search}%,output.ilike.%${search}%,user_ref.ilike.%${search}%`)
    }

    const { data: logs, error, count } = await query

    if (error) {
      send('error', { error: 'Query failed', message: error.message })
      return res.end()
    }

    // Stream each log entry as a separate event
    for (const log of logs || []) {
      send('log', log)
      // Small delay to prevent overwhelming the client
      await new Promise(r => setTimeout(r, 5))
    }

    // Send end event with summary
    send('end', {
      message: 'Stream complete',
      total: logs?.length || 0,
      hasMore: (logs?.length || 0) === limitNum
    })

  } catch (err) {
    send('error', { error: 'Stream failed', message: err.message })
  }

  res.end()
}
