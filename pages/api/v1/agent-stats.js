// pages/api/v1/agent-stats.js
// Get stats for logs paid by a specific wallet address
// Agent proves ownership by signing a message

import { ethers } from 'ethers'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const { wallet, signature, message, days = '30' } = req.query

  if (!wallet) {
    return res.status(400).json({
      error: 'wallet parameter required',
      example: '/api/v1/agent-stats?wallet=0x...&signature=0x...&message=logwick-query-TIMESTAMP'
    })
  }

  if (!signature || !message) {
    return res.status(401).json({
      error: 'Authentication required',
      description: 'Sign a message with your wallet to prove ownership.',
    })
  }

  // Verify message is recent
  const timestamp = parseInt(message.replace('logwick-query-', ''))
  if (isNaN(timestamp) || Date.now() - timestamp > 5 * 60 * 1000) {
    return res.status(401).json({ error: 'Message expired or invalid' })
  }

  // Verify signature
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' })
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid signature', message: err.message })
  }

  const { getSupabaseAdmin } = await import('../../../lib/supabase')
  const supabase = getSupabaseAdmin()

  const daysNum = Math.min(parseInt(days) || 30, 365)
  const since = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000).toISOString()

  const { data: logs, error } = await supabase
    .from('logs')
    .select('status, tokens, latency_ms, cost_usd, created_at')
    .eq('wallet_ref', wallet.toLowerCase())
    .gte('created_at', since)

  if (error) {
    return res.status(500).json({ error: 'Stats query failed', message: error.message })
  }

  const total = logs.length
  const success = logs.filter(l => l.status === 'success').length
  const errored = logs.filter(l => l.status === 'error').length
  const totalTokens = logs.reduce((sum, l) => sum + (l.tokens || 0), 0)
  const totalCost = logs.reduce((sum, l) => sum + (l.cost_usd || 0), 0)
  const latencies = logs.filter(l => l.latency_ms).map(l => l.latency_ms)
  const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0

  return res.status(200).json({
    wallet,
    period_days: daysNum,
    total,
    success,
    error: errored,
    success_rate: total ? Math.round((success / total) * 1000) / 10 : 0,
    error_rate: total ? Math.round((errored / total) * 1000) / 10 : 0,
    avg_latency_ms: avgLatency,
    total_tokens: totalTokens,
    total_cost_usd: Math.round(totalCost * 10000) / 10000,
    total_paid_usd: total * 0.001,
  })
}
