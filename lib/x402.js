// lib/x402.js
// x402 payment verification using @x402/core directly
// Works with Next.js 14 without version conflicts

const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator'
const WALLET_ADDRESS = process.env.X402_WALLET_ADDRESS
const NETWORK = process.env.X402_NETWORK || 'eip155:84532' // Base Sepolia testnet default
const PRICE = process.env.X402_LOG_PRICE || '$0.001'

export const x402Config = {
  price: PRICE,
  network: NETWORK,
  payTo: WALLET_ADDRESS,
  facilitatorUrl: FACILITATOR_URL,
  description: 'Ingest one AI agent audit log entry to Logwick. Logs agent name, action, input, output, tokens, latency, and status.',
  mimeType: 'application/json',
}

/**
 * Verify x402 payment from request headers
 * Returns { valid: true } or { valid: false, paymentRequired: <402 response body> }
 */
export async function verifyX402Payment(req) {
  const paymentHeader = req.headers['x-payment'] || req.headers['payment']

  if (!paymentHeader) {
    return {
      valid: false,
      paymentRequired: buildPaymentRequired(),
    }
  }

  try {
    // Call facilitator to verify payment
    const res = await fetch(`${FACILITATOR_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment: paymentHeader,
        paymentRequirements: [buildPaymentRequirement()],
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.isValid) {
      return {
        valid: false,
        paymentRequired: buildPaymentRequired(),
      }
    }

    // Settle the payment
    const settleRes = await fetch(`${FACILITATOR_URL}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment: paymentHeader,
        paymentRequirements: [buildPaymentRequirement()],
      }),
    })

    const settleData = await settleRes.json()

    if (!settleRes.ok || settleData.success === false) {
      return {
        valid: false,
        paymentRequired: buildPaymentRequired(),
      }
    }

    return { valid: true, txHash: settleData.transaction }

  } catch (err) {
    console.error('x402 verification error:', err)
    return {
      valid: false,
      paymentRequired: buildPaymentRequired(),
    }
  }
}

function buildPaymentRequirement() {
  return {
    scheme: 'exact',
    network: NETWORK,
    maxAmountRequired: priceToAtomicUnits(PRICE),
    resource: 'https://logwick.io/api/v1/agent-log',
    description: x402Config.description,
    mimeType: x402Config.mimeType,
    payTo: WALLET_ADDRESS,
    maxTimeoutSeconds: 300,
    asset: getUSDCAddress(NETWORK),
    extra: {
      name: 'Logwick Agent Log',
      version: '1',
    },
  }
}

function buildPaymentRequired() {
  return {
    x402Version: 1,
    accepts: [buildPaymentRequirement()],
    error: 'Payment required',
  }
}

function priceToAtomicUnits(price) {
  // Convert $0.001 to atomic USDC units (6 decimals)
  const dollars = parseFloat(price.replace('$', ''))
  return String(Math.floor(dollars * 1_000_000))
}

function getUSDCAddress(network) {
  const addresses = {
    'eip155:8453':  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base mainnet USDC
    'eip155:84532': '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
  }
  return addresses[network] || addresses['eip155:84532']
}
