// pages/api/v1/agent-log.js
// x402-enabled endpoint — AI agents pay $0.001 USDC per log
// No API key or account required — payment is the authentication

import { getSupabaseAdmin } from '../../../lib/supabase'
import { verifyX402Payment, x402Config } from '../../../lib/x402'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Payment, Payment')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET returns 402 so agents can discover pricing
  if (req.method === 'GET') {
    res.setHeader('PAYMENT-REQUIRED', 'true')
    res.setHeader('X-Payment-Network', 'eip155:8453')
    res.setHeader('X-Payment-Price', '0.001')
    res.setHeader('X-Payment-Asset', 'USDC')
    return res.status(402).json({
      x402Version: 1,
      accepts: [{
        scheme: 'exact',
        network: x402Config.network,
        maxAmountRequired: String(Math.floor(parseFloat(x402Config.price.replace('$', '')) * 1_000_000)),
        resource: 'https://logwick.io/api/v1/agent-log',
        description: x402Config.description,
        mimeType: x402Config.mimeType,
        payTo: x402Config.payTo,
        maxTimeoutSeconds: 300,
      }],
      error: 'Payment required — $0.001 USDC per log entry',
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify x402 payment
  const payment = await verifyX402Payment(req)

  if (!payment.valid) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('PAYMENT-REQUIRED', 'true')
    res.setHeader('X-Payment-Network', 'eip155:8453')
    res.setHeader('X-Payment-Price', '0.001')
    res.setHeader('X-Payment-Asset', 'USDC')
    return res.status(402).json(payment.paymentRequired)
  }

  const {
    agent, action, status = 'success',
    input, output, tokens, latency_ms,
    cost_usd, user, tags = [], metadata = {}, org_id,
  } = req.body

  if (!agent) return res.status(400).json({ error: 'agent is required' })
  if (!action) return res.status(400).json({ error: 'action is required' })

  const supabase = getSupabaseAdmin()

  let targetOrgId = org_id

  if (!targetOrgId) {
    const { data: publicOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', 'x402-public')
      .single()

    if (!publicOrg) return res.status(500).json({ error: 'x402 public org not configured' })
    targetOrgId = publicOrg.id
  }

  const { data, error } = await supabase
    .from('logs')
    .insert({
      org_id: targetOrgId,
      agent, action, status,
      input: input ? String(input).slice(0, 10000) : null,
      output: output ? String(output).slice(0, 10000) : null,
      tokens: tokens || null,
      latency_ms: latency_ms || null,
      cost_usd: cost_usd || null,
      user_ref: user || null,
      wallet_ref: payment.walletAddress || null,
      tags: tags || [],
      metadata: metadata || {},
    })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('x402 log insert error:', error)
    return res.status(500).json({ error: 'Failed to store log' })
  }

  return res.status(200).json({
    id: data.id,
    timestamp: data.created_at,
    status: 'ingested',
    paid: true,
    tx: payment.txHash || null,
  })
}
