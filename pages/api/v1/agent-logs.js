// pages/api/v1/agent-logs.js
// Query logs by wallet address — no account required
// Agent proves ownership of wallet by signing a message
// Then gets back only logs paid by that wallet

import { ethers } from 'ethers'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const { wallet, signature, message, status, agent, action, search, limit = '50', offset = '0' } = req.query

  // Require wallet address
  if (!wallet) {
    return res.status(400).json({
      error: 'wallet parameter required',
      description: 'Provide your wallet address and a signed message to query your logs.',
      example: '/api/v1/agent-logs?wallet=0x...&signature=0x...&message=logwick-query-TIMESTAMP'
    })
  }

  // Require signature for non-public queries
  if (!signature || !message) {
    return res.status(401).json({
      error: 'Authentication required',
      description: 'Sign a message with your wallet to prove ownership and query your logs.',
      howTo: {
        step1: 'Create a message: "logwick-query-" + Date.now()',
        step2: 'Sign it with your wallet private key',
        step3: 'Include wallet, signature, and message as query params',
        ethersExample: 'const sig = await signer.signMessage(message)'
      }
    })
  }

  // Verify message is recent — prevent replay attacks
  const timestamp = parseInt(message.replace('logwick-query-', ''))
  if (isNaN(timestamp) || Date.now() - timestamp > 5 * 60 * 1000) {
    return res.status(401).json({
      error: 'Message expired or invalid',
      description: 'Message must be in format "logwick-query-TIMESTAMP" and less than 5 minutes old.',
    })
  }

  // Verify signature — recover signer address
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)

    if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
      return res.status(401).json({
        error: 'Signature verification failed',
        description: 'The signature does not match the provided wallet address.',
        recovered: recoveredAddress,
        provided: wallet,
      })
    }
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid signature',
      description: err.message,
    })
  }

  // Signature valid — query logs for this wallet
  const { getSupabaseAdmin } = await import('../../../lib/supabase')
  const supabase = getSupabaseAdmin()

  const limitNum = Math.min(parseInt(limit) || 50, 100)
  const offsetNum = parseInt(offset) || 0

  let query = supabase
    .from('logs')
    .select('id, agent, action, status, input, output, tokens, latency_ms, cost_usd, user_ref, wallet_ref, tags, created_at', { count: 'exact' })
    .eq('wallet_ref', wallet.toLowerCase())
    .order('created_at', { ascending: false })
    .range(offsetNum, offsetNum + limitNum - 1)

  if (status) query = query.eq('status', status)
  if (agent) query = query.ilike('agent', `%${agent}%`)
  if (action) query = query.ilike('action', `%${action}%`)
  if (search) {
    query = query.or(`agent.ilike.%${search}%,action.ilike.%${search}%,input.ilike.%${search}%,output.ilike.%${search}%`)
  }

  const { data: logs, error, count } = await query

  if (error) {
    return res.status(500).json({ error: 'Query failed', message: error.message })
  }

  return res.status(200).json({
    wallet,
    logs: logs || [],
    total: count || 0,
    limit: limitNum,
    offset: offsetNum,
  })
}
