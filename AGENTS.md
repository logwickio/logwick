# AGENTS.md — AI Coding Agent Instructions for Logwick

This file tells AI coding agents how to interact with the Logwick codebase.

## Project overview

Logwick is a Next.js 14 SaaS application for AI agent audit logging. It uses:
- **Frontend**: Next.js 14 (Pages Router), React, inline styles
- **Backend**: Next.js API routes (pages/api/)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with JWT Bearer tokens
- **Payments**: Stripe (subscriptions) + x402 (pay-per-log)
- **Email**: Resend
- **Deployment**: Vercel

## Key directories

- `pages/` — Next.js pages and API routes
- `pages/api/v1/` — Public REST API endpoints
- `pages/api/dashboard/` — Authenticated dashboard API endpoints
- `pages/api/billing/` — Stripe webhook and portal handlers
- `pages/api/auth/` — Signup and auth handlers
- `lib/` — Shared utilities (supabase.js, apiKeys.js, webhooks.js, x402.js)
- `public/` — Static files including llms.txt, openapi.json, robots.txt

## Development guidelines

### Authentication pattern
- Public API routes (`/api/v1/*`) use API key auth via `lib/apiKeys.js`
- Dashboard routes (`/api/dashboard/*`) use Supabase JWT via `authFetch` with Bearer token
- x402 routes use USDC payment verification via `lib/x402.js`

### Adding a new API endpoint
1. Create file in `pages/api/v1/your-endpoint.js`
2. Set `res.setHeader('Content-Type', 'application/json')`
3. Validate API key using pattern from existing endpoints
4. Return structured JSON errors (never HTML)
5. Add endpoint to `public/openapi.json` and `public/llms.txt`

### Database access
Always use `getSupabaseAdmin()` from `lib/supabase.js` in API routes.
Never use the browser client in server-side code.

### Environment variables required
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PAYMENT_LINK
- RESEND_API_KEY
- X402_WALLET_ADDRESS
- X402_FACILITATOR_URL
- X402_NETWORK
- CDP_API_KEY_ID
- CDP_API_KEY_SECRET

### Testing API endpoints
Use curl with your API key:
```bash
curl -X POST https://logwick.io/api/v1/logs \
  -H "Authorization: Bearer sk-lw-your-key" \
  -H "Content-Type: application/json" \
  -d '{"agent":"gpt-4o","action":"test","status":"success","input":"test","output":"test"}'
```

### Style conventions
- Use inline styles (no CSS modules or Tailwind)
- Dark theme: background #06090c, accent #0ea5e9
- Fonts: Syne (display), JetBrains Mono (mono)
- All API responses must be JSON with Content-Type: application/json

## Running locally

```bash
npm install
cp .env.example .env.local  # add your env vars
npm run dev
```

## Links
- Live site: https://logwick.io
- Docs: https://logwick.io/docs
- OpenAPI: https://logwick.io/openapi.json
- llms.txt: https://logwick.io/llms.txt
