import { getSupabaseAdmin } from '../../../lib/supabase'
import { stringify } from 'csv-stringify/sync'

async function getUserOrg(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return null
  const supabase = getSupabaseAdmin()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  const { data } = await supabase.from('org_members').select('org_id').eq('user_id', user.id).single()
  return data?.org_id || null
}

export default async function handler(req, res) {
  const orgId = await getUserOrg(req)
  if (!orgId) return res.status(401).json({ error: 'Not authenticated' })

  const supabase = getSupabaseAdmin()

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id required' })
    await supabase.from('logs').delete().eq('id', id).eq('org_id', orgId)
    return res.json({ success: true })
  }

  if (req.method !== 'GET') return res.status(405).end()

  const { status, agent, action, from, to, search, limit = '50', offset = '0', format = 'json' } = req.query
  const take = Math.min(parseInt(limit) || 50, 500)
  const skip = parseInt(offset) || 0

  let query = supabase.from('logs').select('*', { count: 'exact' })
    .eq('org_id', orgId).order('created_at', { ascending: false }).range(skip, skip + take - 1)

  if (status) query = query.eq('status', status)
  if (agent)  query = query.eq('agent', agent)
  if (action) query = query.eq('action', action)
  if (from)   query = query.gte('created_at', new Date(from).toISOString())
  if (to)     query = query.lte('created_at', new Date(to + 'T23:59:59').toISOString())
  if (search) query = query.or(`agent.ilike.%${search}%,action.ilike.%${search}%,input.ilike.%${search}%,output.ilike.%${search}%`)

  const { data, error, count } = await query
  if (error) return res.status(500).json({ error: error.message })

  if (format === 'csv') {
    const cols = ['id','created_at','agent','action','status','user_ref','tokens','latency_ms','cost_usd','input','output']
    const csv = stringify([cols, ...(data || []).map(row => cols.map(c => row[c] ?? ''))], {})
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="logwick_logs.csv"')
    return res.send(csv)
  }

  return res.json({ logs: data, total: count, limit: take, offset: skip })
}
