// pages/api/v1/agent-log.js
// x402 v2 enabled endpoint — AI agents pay $0.001 USDC per log
// No API key or account required — payment is the authentication

import { getSupabaseAdmin } from '../../../lib/supabase'

const USDC_BASE_MAINNET = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const PAYTO = process.env.X402_WALLET_ADDRESS || '0x19f50adb4a5b41802594814f9ad51f26324ee90e'
const CDP_FACILITATOR = 'https://api.cdp.coinbase.com/platform/v2/x402/facilitator'

const PAYMENT_ENVELOPE = {
  x402Version: 2,
  error: 'Payment required',
  resource: {
    url: 'https://logwick.io/api/v1/agent-log',
    description: 'Ingest one AI agent audit log entry to Logwick. Logs agent name, action, input, output, tokens, latency, and status. Works with any LLM — GPT-4o, Claude, Gemini, or any custom model.',
    mimeType: 'application/json',
  },
  accepts: [{
    scheme: 'exact',
    network: 'eip155:8453',
    amount: '1000',
    asset: USDC_BASE_MAINNET,
    payTo: PAYTO,
    maxTimeoutSeconds: 300,
  }],
  extensions: {
    bazaar: {
      info: {
        input: {
          type: 'http',
          method: 'POST',
          body: {
            agent: 'gpt-4o',
            action: 'email_draft',
            status: 'success',
            input: 'Draft a follow-up email',
            output: 'Subject: Following up...',
            tokens: 312,
            latency_ms: 1842,
          },
          bodyType: 'json',
        },
        output: {
          type: 'json',
          example: {
            id: 'uuid-here',
            timestamp: '2026-05-04T12:00:00.000Z',
            status: 'ingested',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          timestamp: { type: 'string' },
          status: { type: 'string' },
        },
        required: ['id', 'timestamp', 'status'],
      },
    },
  },
}

const PAYMENT_ENVELOPE_B64 = Buffer.from(JSON.stringify(PAYMENT_ENVELOPE)).toString('base64')

async function verifyPayment(paymentHeader) {
  if (!paymentHeader) return { valid: false }
  try {
    const response = await fetch(`${CDP_FACILITATOR}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment: paymentHeader,
        payload: PAYMENT_ENVELOPE,
      }),
    })
    const data = await response.json()
    return { valid: response.ok && data.isValid, data }
  } catch (err) {
    console.error('x402 verify error:', err)
    return { valid: false }
  }
}

async function settlePayment(paymentHeader) {
  try {
    await fetch(`${CDP_FACILITATOR}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment: paymentHeader,
        payload: PAYMENT_ENVELOPE,
      }),
    })
  } catch (err) {
    console.error('x402 settle error:', err)
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Payment, Payment, PAYMENT-SIGNATURE, payment-required')
  res.setHeader('payment-required', PAYMENT_ENVELOPE_B64)

  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET returns 402 so agents can discover pricing
  if (req.method === 'GET') {
    return res.status(402)
      .setHeader('Content-Type', 'application/json')
      .json({ error: 'Payment required', x402Version: 2 })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check for payment header
  const paymentHeader = req.headers['x-payment'] || req.headers['payment-signature'] || req.headers['payment']

  if (!paymentHeader) {
    return res.status(402)
      .setHeader('payment-required', PAYMENT_ENVELOPE_B64)
      .json({ error: 'Payment required', x402Version: 2, id: '', timestamp: '', status: '' })
  }

  // Verify payment
  const verification = await verifyPayment(paymentHeader)
  if (!verification.valid) {
    return res.status(402)
      .setHeader('payment-required', PAYMENT_ENVELOPE_B64)
      .json({ error: 'Payment verification failed', x402Version: 2 })
  }

  // Store the log
  const supabase = getSupabaseAdmin()
  const {
    agent, action, status = 'success',
    input, output, tokens, latency_ms,
    cost_usd, user, tags = [], metadata = {},
  } = req.body || {}

  if (!agent || !action) {
    return res.status(400).json({ error: 'agent and action are required' })
  }

  const { data: publicOrg } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'x402-public')
    .single()

  if (!publicOrg) {
    return res.status(500).json({ error: 'x402 org not configured' })
  }

  const { data: log, error } = await supabase
    .from('logs')
    .insert({
      org_id: publicOrg.id,
      agent: String(agent).slice(0, 200),
      action: String(action).slice(0, 200),
      status,
      input: input ? String(input).slice(0, 10000) : null,
      output: output ? String(output).slice(0, 10000) : null,
      tokens: tokens || null,
      latency_ms: latency_ms || null,
      cost_usd: cost_usd || null,
      user: user ? String(user).slice(0, 200) : null,
      tags: Array.isArray(tags) ? tags : [],
      metadata: typeof metadata === 'object' ? metadata : {},
    })
    .select('id, created_at')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Settle payment in background
  settlePayment(paymentHeader)

  return res.status(200).json({
    id: log.id,
    timestamp: log.created_at,
    status: 'ingested',
  })
}
