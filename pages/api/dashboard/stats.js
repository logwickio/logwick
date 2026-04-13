// pages/api/dashboard/stats.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { getSupabaseAdmin } from '../../../lib/supabase'

async function getOrgId(supabaseUser, userId) {
  const { data } = await supabaseUser
    .from('org_members').select('org_id').eq('user_id', userId).single()
  return data?.org_id
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const supabaseUser = createServerSupabaseClient({ req, res })
  const { data: { session } } = await supabaseUser.auth.getSession()
  if (!session) return res.status(401).json({ error: 'Not authenticated' })

  const orgId = await getOrgId(supabaseUser, session.user.id)
  if (!orgId) return res.status(403).json({ error: 'No organization found' })

  const supabase = getSupabaseAdmin()
  const days = Math.min(parseInt(req.query.days) || 30, 90)

  // Aggregate stats
  const { data: stats } = await supabase.rpc('get_org_stats', { p_org_id: orgId, p_days: days })

  // 7-day daily breakdown for chart
  const since7 = new Date()
  since7.setDate(since7.getDate() - 6)
  since7.setHours(0, 0, 0, 0)

  const { data: recent } = await supabase
    .from('logs')
    .select('created_at, status')
    .eq('org_id', orgId)
    .gte('created_at', since7.toISOString())

  const byDay = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(since7)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    byDay[key] = { date: key, total: 0, success: 0, error: 0, pending: 0 }
  }
  for (const row of recent || []) {
    const key = row.created_at.slice(0, 10)
    if (byDay[key]) { byDay[key].total++; byDay[key][row.status]++ }
  }

  // Agent breakdown
  const { data: allLogs } = await supabase
    .from('logs')
    .select('agent, status')
    .eq('org_id', orgId)
    .gte('created_at', new Date(Date.now() - days * 86400000).toISOString())

  const agentMap = {}
  for (const row of allLogs || []) {
    if (!agentMap[row.agent]) agentMap[row.agent] = { agent: row.agent, total: 0, errors: 0 }
    agentMap[row.agent].total++
    if (row.status === 'error') agentMap[row.agent].errors++
  }

  // Monthly usage for plan limits
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const { count: monthlyCount } = await supabase
    .from('logs').select('*', { count: 'exact', head: true })
    .eq('org_id', orgId).gte('created_at', startOfMonth.toISOString())

  const { data: org } = await supabase
    .from('organizations').select('name, plan, log_limit').eq('id', orgId).single()

  return res.json({
    ...stats,
    daily:          Object.values(byDay),
    agents:         Object.values(agentMap).sort((a, b) => b.total - a.total).slice(0, 8),
    monthly_used:   monthlyCount,
    monthly_limit:  org?.log_limit,
    org_plan:       org?.plan,
    org_name:       org?.name,
  })
}
