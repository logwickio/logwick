# Logwick — The Audit Log for AI Agents

> Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it.

## What is Logwick?

Logwick is an audit logging service for AI agents. After each AI call in your code, you send one POST request to Logwick with the input, output, agent, and status. Logwick stores it, indexes it, and makes it searchable from your dashboard.

## Key capabilities

- Log every AI agent action — agent, action, input, output, status, tokens, latency, cost
- Search and filter logs from a dashboard
- Export logs as CSV
- Set webhook alerts when error rates spike
- Query logs in plain English via Claude Desktop MCP
- AI agents can pay per log with USDC — no account required (x402)

## Quick start

```bash
npm install logwick
```

```javascript
import { LogwickClient } from 'logwick'
const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })

logwick.fire({
  agent: 'gpt-4o',
  action: 'email_draft',
  status: 'success',
  input: userPrompt,
  output: result,
  tokens: 312,
})
```

## API

- POST https://logwick.io/api/v1/logs — Ingest a log
- GET https://logwick.io/api/v1/logs — Query logs
- GET https://logwick.io/api/v1/logs/stream — Stream logs via SSE
- GET https://logwick.io/api/v1/stats — Get usage stats
- POST https://logwick.io/api/v1/agent-log — Pay-per-log via x402

## Pricing

- Free: 5,000 logs/month — $0
- Pro: 100,000 logs/month — $29/month
- Pay-per-log: $0.001 USDC via x402

## Links

- Full docs: https://logwick.io/docs
- Pricing: https://logwick.io/pricing.md
- OpenAPI: https://logwick.io/openapi.json
- npm: https://npmjs.com/package/logwick
- pip: https://pypi.org/project/logwick
- MCP: https://npmjs.com/package/@logwick/mcp
