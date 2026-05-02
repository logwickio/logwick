export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    version: '1.0',
    resources: [
      {
        url: 'https://logwick.io/api/v1/agent-log',
        method: 'POST',
        description: 'Ingest one AI agent audit log entry',
        payment: {
          protocol: 'x402',
          scheme: 'exact',
          network: 'eip155:8453',
          price: '$0.001',
          asset: 'USDC',
          payTo: process.env.X402_WALLET_ADDRESS,
        },
        headers: {
          'PAYMENT-REQUIRED': 'true',
          'X-Payment-Network': 'eip155:8453',
          'X-Payment-Price': '0.001',
          'X-Payment-Asset': 'USDC',
        }
      }
    ]
  })
}
