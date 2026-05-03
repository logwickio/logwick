# Logwick — The Audit Log for AI Agents

[![ora agent readiness](https://ora.run/api/badge/logwick.io)](https://ora.run/score/logwick.io)

Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it.

**[logwick.io](https://logwick.io)** · [Docs](https://logwick.io/docs) · [npm](https://npmjs.com/package/logwick) · [PyPI](https://pypi.org/project/logwick)

---

## What it does

Logwick captures every AI agent action in production — inputs, outputs, tokens, latency, costs, and errors — and makes them searchable from a dashboard or queryable via API.

```javascript
import { LogwickClient } from 'logwick'

const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })

// After your AI call:
logwick.fire({
  agent:      'gpt-4o',
  action:     'email_draft',
  status:     'success',
  input:      userPrompt,
  output:     result,
  tokens:     312,
  latency_ms: 1842
})
```

That's it. One line. Full audit trail.

---

## Why Logwick

| | Logwick | Braintrust | LangSmith | Helicone |
|---|---|---|---|---|
| Price | Free / $29/mo | $249/mo | $39/mo | $20/mo |
| Works with any model | ✓ | ✓ | LangChain only | OpenAI only |
| No proxy required | ✓ | ✗ | ✗ | ✗ |
| Claude MCP | ✓ | ✗ | ✗ | ✗ |
| AI agent pay-per-log | ✓ (x402) | ✗ | ✗ | ✗ |

---

## Quick start

```bash
npm install logwick
```

```javascript
import { LogwickClient } from 'logwick'

const logwick = new LogwickClient({
  apiKey: process.env.LOGWICK_API_KEY
})

// OpenAI wrapper — logs automatically
const result = await logwick.openai(
  () => openai.chat.completions.create({ model: 'gpt-4o', messages }),
  { action: 'email_draft', user: req.user.email }
)

// Anthropic wrapper — logs automatically  
const result = await logwick.anthropic(
  () => anthropic.messages.create({ model: 'claude-3-5-sonnet-20241022', messages, max_tokens: 1024 }),
  { action: 'document_review' }
)

// Or fire manually after any AI call
logwick.fire({ agent: 'gpt-4o', action: 'my_action', status: 'success', input, output, tokens })
```

**Python:**

```python
import logwick

logwick.init(api_key='sk-lw-your-key')

logwick.fire({
  'agent': 'gpt-4o',
  'action': 'email_draft',
  'status': 'success',
  'input': prompt,
  'output': result,
  'tokens': 312
})
```

---

## Features

- **Universal logging** — works with any model: GPT-4o, Claude, Gemini, Mistral, Llama, or any custom model
- **Searchable dashboard** — filter by agent, action, status, date, user
- **Real-time streaming** — SSE endpoint for live log consumption
- **Webhook alerts** — get notified when error rates spike
- **CSV export** — for compliance audits and data pipelines
- **Claude MCP** — query logs in plain English from Claude Desktop
- **x402 pay-per-log** — AI agents pay $0.001 USDC per log, no account needed

---

## Pricing

| Plan | Logs/month | Retention | Price |
|------|-----------|-----------|-------|
| Free | 5,000 | 7 days | $0 |
| Pro | 100,000 | 90 days | $29/mo |
| Enterprise | Unlimited | Custom | Custom |
| Pay-per-log | — | 90 days | $0.001 USDC via x402 |

---

## Claude MCP Integration

Connect Logwick to Claude Desktop and query logs in plain English:

```json
{
  "mcpServers": {
    "logwick": {
      "command": "npx",
      "args": ["-y", "@logwick/mcp"],
      "env": { "LOGWICK_API_KEY": "sk-lw-your-key" }
    }
  }
}
```

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` and restart Claude Desktop.

Then ask: *"Show me my last 10 error logs"* or *"What was my success rate this week?"*

---

## API

```bash
# Ingest a log
curl -X POST https://logwick.io/api/v1/logs \
  -H "Authorization: Bearer sk-lw-your-key" \
  -H "Content-Type: application/json" \
  -d '{"agent":"gpt-4o","action":"email_draft","status":"success","tokens":312}'

# Query logs
curl "https://logwick.io/api/v1/logs?status=error&limit=50" \
  -H "Authorization: Bearer sk-lw-your-key"

# Get stats
curl "https://logwick.io/api/v1/stats?days=30" \
  -H "Authorization: Bearer sk-lw-your-key"
```

Full API reference: [logwick.io/docs](https://logwick.io/docs)  
OpenAPI spec: [logwick.io/openapi.json](https://logwick.io/openapi.json)

---

## Get started

1. Sign up free at [logwick.io](https://logwick.io)
2. Get your API key from the dashboard
3. `npm install logwick`
4. Add one line after your AI call

**Or let your AI do it:** Copy the docs from [logwick.io/docs](https://logwick.io/docs) and paste into Claude, ChatGPT, or any AI assistant.

---

## Links

- Website: [logwick.io](https://logwick.io)
- Docs: [logwick.io/docs](https://logwick.io/docs)
- npm: [npmjs.com/package/logwick](https://npmjs.com/package/logwick)
- PyPI: [pypi.org/project/logwick](https://pypi.org/project/logwick)
- MCP: [npmjs.com/package/@logwick/mcp](https://npmjs.com/package/@logwick/mcp)
- Status: [logwick.io/status](https://logwick.io/status)
- Email: [hello@logwick.io](mailto:hello@logwick.io)

---

MIT License
