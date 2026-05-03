# Logwick — Agent Instructions

Logwick is the audit log for AI agents. This file provides instructions for AI coding agents working with or integrating Logwick.

## What Logwick does

Logwick captures every AI agent action in production — inputs, outputs, tokens, latency, costs, and errors — and makes them searchable from a dashboard or queryable via API.

## How to integrate Logwick into a project

1. Install the SDK: `npm install logwick` or `pip install logwick`
2. Add `LOGWICK_API_KEY` to environment variables
3. After each AI call, fire a log:

```javascript
import { LogwickClient } from 'logwick'
const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })

// After your AI call:
logwick.fire({
  agent: 'gpt-4o',
  action: 'email_draft',
  status: 'success',
  input: userPrompt,
  output: result,
  tokens: usage.total_tokens
})
```

## API endpoints

- `POST https://logwick.io/api/v1/logs` — ingest a log (requires API key)
- `GET https://logwick.io/api/v1/logs` — query logs (requires API key)
- `GET https://logwick.io/api/v1/stats` — get stats (requires API key)
- `GET https://logwick.io/api/v1/guest-token` — get a demo key (no auth)

## Authentication

All API endpoints require `Authorization: Bearer sk-lw-your-key` header.
Get an API key at https://logwick.io/dashboard after signing up.

## Full documentation

- Human docs: https://logwick.io/docs
- Machine docs: https://logwick.io/llms.txt
- Full docs: https://logwick.io/llms-full.txt
- OpenAPI spec: https://logwick.io/openapi.json
