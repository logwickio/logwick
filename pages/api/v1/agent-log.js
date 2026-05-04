// pages/api/v1/agent-log.js
// x402 v2 enabled endpoint — AI agents pay $0.001 USDC per log
// No API key or account required — payment is the authentication

import { getSupabaseAdmin } from '../../../lib/supabase'
import { verifyX402Payment, x402Config } from '../../../lib/x402'

const PAYMENT_REQUIREMENTS = {
  x402Version: 2,
  accepts: [{
    scheme: 'exact',
    network: 'eip155:8453',
    maxAmountRequired: '1000', // $0.001 USDC in microUSDC
    resource: 'https://logwick.io/api/v1/agent-log',
    description: 'Ingest one AI agent audit log entry to Logwick. Logs agent name, action, input, output, tokens, latency, and status.',
    mimeType: 'application/json',
    payTo: process.env.X402_WALLET_ADDRESS || '0x19f50adb4a5b41802594814f9ad51f26324ee90e',
    maxTimeoutSeconds: 300,
    extensions: {
      bazaar: {
        name: 'Logwick — AI Agent Audit Log',
        description: 'Log any AI agent action to Logwick. Captures agent name, action, input prompt, output, token usage, latency, cost, and status. Searchable from dashboard. Works with GPT-4o, Claude, Gemini, Mistral, or any LLM.',
        category: 'logging',
        tags: ['logging', 'audit', 'ai-agents', 'observability', 'llm', 'monitoring'],
        url: 'https://logwick.io',
        docsUrl: 'https://logwick.io/docs',
        inputSchema: {
          type: 'object',
          properties: {
            agent: { type: 'string', description: 'AI model or agent name (e.g. gpt-4o, claude-3-5-sonnet)' },
            action: { type: 'string', description: 'What the agent was doing (e.g. email_draft, code_review)' },
            status: { type: 'string', enum: ['success', 'error', 'pending'], description: 'Outcome of the action' },
            input: { type: 'string', description: 'The prompt or input sent to the agent' },
            output: { type: 'string', description: 'The response or output from the agent' },
            tokens: { type: 'number', description: 'Total tokens used' },
            latency_ms: { type: 'number', description: 'Time taken in milliseconds' },
            cost_usd: { type: 'number', description: 'Estimated cost in USD' },
            user: { type: 'string', description: 'User or customer identifier' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags for filtering' },
            metadata: { type: 'object', description: 'Any additional key-value data' }
          },
          required: ['agent', 'action']
        },
        outputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Log entry ID' },
            timestamp: { type: 'string', description: 'ISO timestamp of when the log was stored' },
            status: { type: 'string', description: 'ingested' }
          }
        }
      }
    }
  }],
  error: 'Payment required — $0.001 USDC per log entry',
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Payment, Payment, PAYMENT-SIGNATURE')
  res.setHeader('payment-required', 'true')
  res.setHeader('X-Payment-Network', 'eip155:8453')
  res.setHeader('X-Payment-Price', '0.001')
  res.setHeader('X-Payment-Asset', 'USDC')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET returns 402 so agents can discover pricing and Bazaar metadata
  if (req.method === 'GET') {
    return res.status(402).json(PAYMENT_REQUIREMENTS)
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify x402 payment
  const payment = await verifyX402Payment(req)

  if (!payment.valid) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(402).json(PAYMENT_REQUIREMENTS)
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

  // Get x402 public org
  const { data: publicOrg } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'x402-public')
    .single()

  if (!publicOrg) {
    return res.status(500).json({ error: 'x402 org not configured' })
  }

  const walletRef = payment.walletAddress || null

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
      wallet_ref: walletRef,
    })
    .select('id, created_at')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({
    id: log.id,
    timestamp: log.created_at,
    status: 'ingested',
  })
}
