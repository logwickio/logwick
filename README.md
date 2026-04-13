# Logwick — Deployment Guide

## What this is

A production-ready Next.js app you deploy once and run forever with minimal maintenance.

- **Frontend + API**: Next.js on Vercel (free tier handles ~100k requests/day)
- **Database + Auth**: Supabase (free tier: 500MB storage, 50k auth users)
- **Total cost to launch**: $0

---

## Step 1 — Supabase Setup (10 min)

### 1.1 Create project
1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a region close to your users
3. Save your database password somewhere safe

### 1.2 Run the database schema
1. In your Supabase dashboard → **SQL Editor**
2. Open `supabase/migrations/001_schema.sql` from this repo
3. Paste the entire file and click **Run**
4. You should see "Success" — all tables, indexes, and RLS policies are created

### 1.3 Get your API keys
Go to **Settings → API** and copy:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep secret)

### 1.4 Configure Auth
1. Go to **Authentication → Settings**
2. Set **Site URL** to `https://your-app.vercel.app` (fill in after Vercel deploy)
3. Under **Email**, enable "Confirm email" (or disable for easier testing)

---

## Step 2 — Deploy to Vercel (5 min)

### 2.1 Push to GitHub
```bash
cd logwick
git init
git add .
git commit -m "Initial Logwick deploy"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/yourusername/logwick.git
git push -u origin main
```

### 2.2 Import to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variables (copy from `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJ...
SUPABASE_SERVICE_ROLE_KEY       = eyJ...
NEXT_PUBLIC_APP_URL             = https://your-app.vercel.app
API_KEY_SECRET                  = (run: openssl rand -hex 32)
```

5. Click **Deploy** — done in ~90 seconds

### 2.3 Update Supabase Site URL
Back in Supabase → Authentication → Settings → set Site URL to your Vercel URL.

---

## Step 3 — Create your first account

1. Visit `https://your-app.vercel.app/signup`
2. Enter your org name and email
3. **Copy your API key** — it's shown only once
4. You're in the dashboard

---

## Step 4 — Start logging

Pick your stack and add one call after each AI request:

### Node.js / TypeScript
```typescript
// utils/logwick.ts
const LOGWICK_KEY = process.env.LOGWICK_KEY // sk-lw-...
const LOGWICK_URL = process.env.LOGWICK_URL // https://your-app.vercel.app

export async function logAI(entry: {
  agent: string
  action: string
  status: 'success' | 'error' | 'pending'
  input?: string
  output?: string
  user?: string
  tokens?: number
  latency_ms?: number
  cost_usd?: number
  tags?: string[]
}) {
  // Fire and forget — don't await, don't block your main flow
  fetch(`${LOGWICK_URL}/api/v1/logs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOGWICK_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  }).catch(console.error)
}

// Usage:
const start = Date.now()
const result = await openai.chat.completions.create({ model: 'gpt-4o', messages })
logAI({
  agent: 'gpt-4o',
  action: 'email_draft',
  status: 'success',
  input: userMessage,
  output: result.choices[0].message.content,
  tokens: result.usage.total_tokens,
  latency_ms: Date.now() - start,
  cost_usd: result.usage.total_tokens * 0.000015,
  user: req.user.email,
})
```

### Python
```python
import os, time, requests, threading

def log_ai(agent, action, status, **kwargs):
    """Fire-and-forget log to Logwick."""
    def send():
        try:
            requests.post(
                f"{os.environ['LOGWICK_URL']}/api/v1/logs",
                headers={"Authorization": f"Bearer {os.environ['LOGWICK_KEY']}"},
                json={"agent": agent, "action": action, "status": status, **kwargs},
                timeout=5
            )
        except Exception:
            pass
    threading.Thread(target=send, daemon=True).start()

# Usage:
start = time.time()
result = client.messages.create(model="claude-3-5-sonnet-20241022", ...)
log_ai(
    agent="claude-3-5-sonnet",
    action="document_review",
    status="success",
    input=prompt,
    output=result.content[0].text,
    tokens=result.usage.input_tokens + result.usage.output_tokens,
    latency_ms=int((time.time() - start) * 1000),
    user=user_email,
)
```

### cURL (test it right now)
```bash
curl -X POST https://your-app.vercel.app/api/v1/logs \
  -H "Authorization: Bearer sk-lw-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "gpt-4o",
    "action": "test_event",
    "status": "success",
    "input": "Hello world",
    "output": "This is a test log entry"
  }'
```

---

## API Reference

### POST /api/v1/logs — Ingest a log

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| agent | string | ✓ | Model name (e.g. "gpt-4o") |
| action | string | ✓ | Task type (e.g. "email_draft") |
| status | string | | success \| error \| pending |
| input | string | | Prompt sent to AI |
| output | string | | AI response |
| user | string | | User identifier |
| tokens | integer | | Total tokens used |
| latency_ms | integer | | Response time |
| cost_usd | float | | Estimated cost |
| tags | string[] | | Custom labels |
| metadata | object | | Any extra key/value pairs |

### GET /api/v1/logs — Query logs

Query params: `status`, `agent`, `action`, `user`, `from`, `to`, `search`, `limit` (max 1000), `offset`, `format` (json\|csv)

### GET /api/v1/stats — Usage statistics

Query params: `days` (default 30, max 365)

---

## Scaling up

When you outgrow the free tiers:

| Need | Solution | Cost |
|------|----------|------|
| More DB storage | Supabase Pro | $25/mo |
| More function invocations | Vercel Pro | $20/mo |
| Redis rate limiting | Upstash | $0–10/mo |
| Email notifications | Resend | $0–20/mo |
| Stripe billing | Add stripe.js | Pay-as-you-go |

### Adding Stripe billing (when ready)
1. Create products in Stripe dashboard: Free ($0), Pro ($29/mo), Enterprise (custom)
2. Add `stripe_customer_id` and `stripe_subscription_id` to the `organizations` table
3. Create `/api/billing/webhook` to handle `customer.subscription.updated` events
4. Update `log_limit` in the org row based on plan

---

## Maintenance checklist (monthly, ~15 min)

- [ ] Check Supabase dashboard for storage usage
- [ ] Review error logs in your dashboard for patterns
- [ ] Check Vercel function logs for any 500 errors
- [ ] Delete old logs past retention window (can automate with a Supabase cron job)

### Auto-delete old logs (Supabase cron)
In Supabase SQL Editor, run once to set up automatic cleanup:
```sql
-- Requires pg_cron extension (enable in Supabase dashboard → Extensions)
select cron.schedule(
  'delete-old-logs',
  '0 2 * * *',  -- daily at 2am UTC
  $$
    delete from logs l
    using organizations o
    where l.org_id = o.id
      and l.created_at < now() - (o.retention_days || ' days')::interval;
  $$
);
```

---

## Project structure

```
logwick/
├── pages/
│   ├── index.js              # Redirect → dashboard or login
│   ├── login.js              # Auth: sign in
│   ├── signup.js             # Auth: create account + org
│   ├── dashboard.js          # Main app UI
│   └── api/
│       ├── v1/
│       │   ├── logs.js       # PUBLIC: POST ingest, GET query
│       │   └── stats.js      # PUBLIC: GET statistics
│       ├── dashboard/
│       │   ├── logs.js       # UI: session-auth log queries + delete
│       │   ├── stats.js      # UI: session-auth stats
│       │   ├── keys.js       # UI: API key CRUD
│       │   └── webhooks.js   # UI: webhook CRUD
│       └── auth/
│           └── signup.js     # Provision org after Supabase signup
├── lib/
│   ├── supabase.js           # Browser + admin clients
│   ├── apiKeys.js            # Key generation, hashing, validation
│   └── webhooks.js           # Webhook dispatcher
├── styles/
│   └── globals.css
├── supabase/
│   └── migrations/
│       └── 001_schema.sql    # Full DB schema — run in Supabase
├── .env.local.example        # Copy to .env.local, fill in values
├── next.config.js
└── package.json
```

---

## Support

Questions? Email: hello@logwick.io
