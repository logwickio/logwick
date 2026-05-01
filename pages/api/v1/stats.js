// pages/api/v1/stats.js
import { getSupabaseAdmin } from '../../../lib/supabase'
import { validateApiKey, extractBearerToken } from '../../../lib/apiKeys'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' })

  const rawKey = extractBearerToken(req)
  if (!rawKey) return res.status(401).json({ error: 'Missing API key.' })

  const supabase = getSupabaseAdmin()
  const keyData = await validateApiKey(rawKey, supabase)
  if (!keyData) return res.status(401).json({ error: 'Invalid or revoked API key.' })

  const days = Math.min(parseInt(req.query.days) || 30, 365)

  const { data, error } = await supabase.rpc('get_org_stats', {
    p_org_id: keyData.org_id,
    p_days:   days,
  })

  if (error) return res.status(500).json({ error: 'Stats query failed.' })

  // Daily breakdown for charts
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data: daily } = await supabase
    .from('logs')
    .select('created_at, status')
    .eq('org_id', keyData.org_id)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true })

  // Group by day
  const byDay = {}
  for (const row of daily || []) {
    const day = row.created_at.slice(0, 10)
    if (!byDay[day]) byDay[day] = { date: day, total: 0, success: 0, error: 0, pending: 0 }
    byDay[day].total++
    byDay[day][row.status] = (byDay[day][row.status] || 0) + 1
  }

  return res.json({
    ...data,
    period_days: days,
    daily: Object.values(byDay),
  })
}
