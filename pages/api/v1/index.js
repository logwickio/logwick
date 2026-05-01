// Public API discovery endpoint — no auth required
// Tells agents that a public API exists and how to use it

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({
    name: 'Logwick API',
    version: '1.0.0',
    description: 'The audit log for AI agents. Log every prompt, response, and error your AI agents produce.',
    docs: 'https://logwick.io/docs',
    openapi: 'https://logwick.io/openapi.json',
    llms_txt: 'https://logwick.io/llms.txt',
    endpoints: {
      ingest_log: {
        method: 'POST',
        path: '/api/v1/logs',
        auth: 'Bearer sk-lw-your-key',
        description: 'Ingest an AI agent log entry'
      },
      query_logs: {
        method: 'GET',
        path: '/api/v1/logs',
        auth: 'Bearer sk-lw-your-key',
        description: 'Query and search log entries'
      },
      get_stats: {
        method: 'GET',
        path: '/api/v1/stats',
        auth: 'Bearer sk-lw-your-key',
        description: 'Get usage statistics'
      },
      agent_log_x402: {
        method: 'POST',
        path: '/api/v1/agent-log',
        auth: 'x402 payment — $0.001 USDC on Base',
        description: 'Ingest a log entry via x402 payment — no account required'
      }
    },
    authentication: {
      type: 'bearer',
      format: 'Authorization: Bearer sk-lw-your-key',
      get_key: 'https://logwick.io/dashboard'
    },
    streaming: {
      endpoint: 'GET /api/v1/logs/stream',
      protocol: 'text/event-stream (SSE)',
      description: 'Stream log entries as Server-Sent Events. Emits start, log, and end events.',
      example: 'curl -N -H "Authorization: Bearer sk-lw-..." https://logwick.io/api/v1/logs/stream',
      events: ['start', 'log', 'end', 'error']
    },
    sdks: {
      nodejs: 'npm install logwick',
      python: 'pip install logwick',
      mcp: 'npx @logwick/mcp'
    }
  })
}
