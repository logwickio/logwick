// pages/docs.js
import Head from 'next/head'
import { useRouter } from 'next/router'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'nodejs', label: 'Node.js SDK' },
  { id: 'python', label: 'Python SDK' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'langchain', label: 'LangChain' },
  { id: 'mcp', label: 'Claude MCP' },
  { id: 'api', label: 'REST API' },
  { id: 'x402', label: 'x402 — Pay per log' },
  { id: 'reference', label: 'Log fields' },
]

function Code({ children, lang = '' }) {
  return (
    <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
      {lang && <div style={{ padding: '7px 14px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#a8c8dc', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{lang}</div>}
      <pre style={{ padding: '16px', fontSize: 13, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', whiteSpace: 'pre', margin: 0 }}>{children}</pre>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ marginBottom: 56, scrollMarginTop: 80 }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>{title}</h2>
      {children}
    </div>
  )
}

function P({ children }) {
  return <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.8, marginBottom: 16 }}>{children}</p>
}

function H3({ children }) {
  return <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: '#e8f4fb', marginBottom: 12, marginTop: 24 }}>{children}</h3>
}

function Badge({ children, color = '#0ea5e9' }) {
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, background: color + '18', border: `1px solid ${color}44`, color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', marginRight: 6 }}>{children}</span>
}

function Field({ name, type, required, desc }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 80px 1fr', gap: 12, padding: '10px 0', borderBottom: '1px solid #0e1c26', alignItems: 'start' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#38bdf8' }}>{name}{required && <span style={{ color: '#f87171', marginLeft: 4 }}>*</span>}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8c8dc' }}>{type}</div>
      <div style={{ fontSize: 13, color: '#c8dce8', lineHeight: 1.6 }}>{desc}</div>
    </div>
  )
}

export default function Docs() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Logwick Docs — Audit logging for AI agents</title>
        <meta name="description" content="Complete documentation for Logwick — how to install, integrate, and use the audit log for AI agents." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div style={{ background: '#06090c', minHeight: '100vh', color: '#c8dce8' }}>

        {/* Nav */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'rgba(6,9,12,0.95)', borderBottom: '1px solid #1e3040', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 100, backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="#0ea5e9"/>
              <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="25" cy="24" r="3.5" fill="white"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 16, color: '#f1f5f9' }}>Logwick</span>
            <span style={{ fontSize: 11, color: '#4a7a90', fontFamily: 'var(--font-mono)' }}>/docs</span>
          </div>
          <div style={{ flex: 1 }} />
          <a href="https://logwick.io/dashboard" style={{ fontSize: 12, color: '#38bdf8', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>Dashboard →</a>
        </nav>

        <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '80px 24px 0' }}>

          {/* Sidebar */}
          <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 80, height: 'calc(100vh - 80px)', overflowY: 'auto', paddingTop: 24, paddingRight: 24 }}>
            <div style={{ fontSize: 10, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Documentation</div>
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{ display: 'block', padding: '6px 0', fontSize: 13, color: '#a8c8dc', textDecoration: 'none', borderLeft: '2px solid transparent', paddingLeft: 12, marginLeft: -12, transition: 'color 0.15s' }}
                onMouseEnter={e => { e.target.style.color = '#38bdf8'; e.target.style.borderLeftColor = '#38bdf8' }}
                onMouseLeave={e => { e.target.style.color = '#a8c8dc'; e.target.style.borderLeftColor = 'transparent' }}>
                {s.label}
              </a>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, padding: '24px 0 80px 40px' }}>

            {/* Page title */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Logwick Documentation</div>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 12, lineHeight: 1.1 }}>Audit logging for AI agents</h1>
              <p style={{ fontSize: 15, color: '#c8dce8', lineHeight: 1.8, maxWidth: 600, marginBottom: 24 }}>Everything you need to log, search, and understand what your AI agents are doing in production. One line of code. Full visibility.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const docs = `LOGWICK DOCUMENTATION — Audit logging for AI agents

OVERVIEW
Logwick is an audit log for AI agents. After each AI call, POST the input, output, agent, and status to Logwick. It stores, indexes, and makes everything searchable from your dashboard.

INSTALL
npm install logwick
# or
pip install logwick

QUICK START (JavaScript)
import { LogwickClient } from 'logwick'
const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })

// Add after any AI call — fire and forget
logwick.fire({
  agent:      'gpt-4o',
  action:     'email_draft',
  status:     'success',
  input:      userPrompt,
  output:     result.choices[0].message.content,
  tokens:     result.usage.total_tokens,
  latency_ms: Date.now() - start,
  user:       currentUser.email,
})

QUICK START (Python)
import logwick
logwick.init(api_key=os.environ['LOGWICK_API_KEY'])

logwick.fire({
    'agent':  'gpt-4o',
    'action': 'email_draft',
    'status': 'success',
    'input':  user_prompt,
    'output': result,
    'tokens': 312,
    'user':   user_email,
})

OPENAI WRAPPER (JavaScript)
const result = await logwick.openai(
  () => openai.chat.completions.create({ model: 'gpt-4o', messages }),
  { action: 'email_draft', user: req.user.email }
)

ANTHROPIC WRAPPER (JavaScript)
const result = await logwick.anthropic(
  () => anthropic.messages.create({ model: 'claude-3-5-sonnet-20241022', messages, max_tokens: 1024 }),
  { action: 'document_review', user: req.user.email }
)

GEMINI WRAPPER (JavaScript)
const result = await logwick.gemini(
  () => model.generateContent(prompt),
  { action: 'data_analysis', user: req.user.email }
)

LANGCHAIN (JavaScript)
import { LogwickCallbackHandler } from 'logwick'
const handler = new LogwickCallbackHandler(logwick, { user: 'ops@acme.com' })
const chain = new LLMChain({ llm, prompt, callbacks: [handler] })

CLAUDE MCP SETUP
Add to claude_desktop_config.json:
{
  "mcpServers": {
    "logwick": {
      "command": "npx",
      "args": ["-y", "@logwick/mcp"],
      "env": { "LOGWICK_API_KEY": "sk-lw-your-key" }
    }
  }
}

REST API
POST https://logwick.io/api/v1/logs
Authorization: Bearer sk-lw-your-key
Body: { agent, action, status, input, output, tokens, latency_ms, user, cost_usd, tags, metadata }

GET https://logwick.io/api/v1/logs?status=error&agent=gpt-4o&search=email&limit=50
GET https://logwick.io/api/v1/stats?days=30

LOG FIELDS
agent (required) — AI model name e.g. gpt-4o, claude-3-5-sonnet
action (required) — task type e.g. email_draft, data_analysis
status — success, error, or pending (default: success)
input — prompt sent to the AI
output — response from the AI
user — user or system that triggered the action
tokens — total tokens used
latency_ms — response time in milliseconds
cost_usd — estimated cost in USD
tags — array of strings for categorization
metadata — any additional key-value data

Get your API key at logwick.io — 5,000 logs/month free.`
                    navigator.clipboard.writeText(docs)
                    const btn = document.getElementById('copy-docs-btn')
                    if (btn) { btn.textContent = '✓ Copied — paste into your AI assistant'; btn.style.background = 'rgba(52,211,153,0.1)'; btn.style.borderColor = '#34d399'; btn.style.color = '#34d399'; setTimeout(() => { btn.textContent = '⊕ Copy docs for your AI assistant'; btn.style.background = 'rgba(14,165,233,0.08)'; btn.style.borderColor = 'rgba(14,165,233,0.3)'; btn.style.color = '#38bdf8' }, 3000) }
                  }}
                  id="copy-docs-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, color: '#38bdf8', fontSize: 13, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  ⊕ Copy docs for your AI assistant
                </button>
                <a href="https://logwick.io/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#0ea5e9', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: 'var(--font-mono)', textDecoration: 'none', fontWeight: 600 }}>
                  Get your API key →
                </a>
              </div>
            </div>

            {/* Overview */}
            <Section id="overview" title="Overview">
              <P>Logwick is an audit log for AI agents. After each AI call in your code, you send one POST request to Logwick with the input, output, agent, and status. Logwick stores it, indexes it, and makes it searchable from your dashboard.</P>
              <P>Use it to debug production issues, monitor costs and error rates, meet compliance requirements, and understand what your AI agents are actually doing.</P>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
                {[
                  ['REST API', 'POST logs from any language or framework'],
                  ['Node.js SDK', 'npm install logwick'],
                  ['Python SDK', 'pip install logwick'],
                  ['Claude MCP', 'Ask Claude about your logs in plain English'],
                  ['Dashboard', 'Search, filter, export, and set webhooks'],
                  ['Webhooks', 'Get alerted when error rates spike'],
                ].map(([title, desc]) => (
                  <div key={title} style={{ background: '#0a1520', border: '1px solid #1e3040', borderRadius: 8, padding: '14px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f4fb', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#a8c8dc', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Quick start */}
            <Section id="quickstart" title="Quick start">
              <P>Get up and running in under 3 minutes. No SDK required — just a fetch call.</P>
              <H3>1. Get your API key</H3>
              <P>Sign up at <a href="https://logwick.io" style={{ color: '#38bdf8' }}>logwick.io</a> and copy your API key from the dashboard. It starts with <code style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: 12 }}>sk-lw-</code></P>
              <H3>2. Add one call after your AI request</H3>
              <Code lang="JavaScript — add after any AI call">{`const start = Date.now()
const result = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: userPrompt }]
})

// Add this — fire and forget, never blocks your code
fetch('https://logwick.io/api/v1/logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-lw-your-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agent:      'gpt-4o',
    action:     'email_draft',
    status:     'success',
    input:      userPrompt,
    output:     result.choices[0].message.content,
    tokens:     result.usage.total_tokens,
    latency_ms: Date.now() - start,
    user:       req.user.email,
  })
}).catch(() => {}) // never throws`}</Code>
              <H3>3. Check your dashboard</H3>
              <P>Open <a href="https://logwick.io/dashboard" style={{ color: '#38bdf8' }}>logwick.io/dashboard</a> — your log appears instantly. That's it.</P>
            </Section>

            {/* Node.js SDK */}
            <Section id="nodejs" title="Node.js SDK">
              <Code lang="Install">{`npm install logwick`}</Code>
              <H3>Basic usage</H3>
              <Code lang="JavaScript">{`import { LogwickClient } from 'logwick'

const logwick = new LogwickClient({ apiKey: 'sk-lw-your-key' })

// Fire and forget
logwick.fire({
  agent:  'gpt-4o',
  action: 'email_draft',
  status: 'success',
  input:  userPrompt,
  output: result.choices[0].message.content,
  tokens: result.usage.total_tokens,
  user:   currentUser.email,
})`}</Code>
              <H3>Client options</H3>
              <Code lang="JavaScript">{`const logwick = new LogwickClient({
  apiKey:  'sk-lw-your-key',  // required
  silent:  true,               // suppress console warnings (default: true)
  tags:    ['production'],     // default tags on every log
})`}</Code>
            </Section>

            {/* Python SDK */}
            <Section id="python" title="Python SDK">
              <Code lang="Install">{`pip install logwick`}</Code>
              <H3>Basic usage</H3>
              <Code lang="Python">{`import logwick

logwick.init(api_key="sk-lw-your-key")

# Fire and forget
logwick.fire({
    "agent":  "gpt-4o",
    "action": "email_draft",
    "status": "success",
    "input":  user_prompt,
    "output": result,
    "tokens": 312,
    "user":   user_email,
})`}</Code>
              <H3>Using the client directly</H3>
              <Code lang="Python">{`from logwick import LogwickClient

lw = LogwickClient(
    api_key="sk-lw-your-key",
    silent=False,            # print warnings
    tags=["production"],     # default tags
)`}</Code>
            </Section>

            {/* OpenAI */}
            <Section id="openai" title="OpenAI integration">
              <P>Wrap your OpenAI call and Logwick automatically captures input, output, tokens, cost, and latency.</P>
              <H3>Node.js</H3>
              <Code lang="JavaScript">{`const result = await logwick.openai(
  () => openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  }),
  { action: 'email_draft', user: req.user.email }
)
// result is the normal OpenAI response — nothing changes`}</Code>
              <H3>Python</H3>
              <Code lang="Python">{`result = lw.openai(
    lambda: client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    ),
    {"action": "email_draft", "user": user_email}
)`}</Code>
            </Section>

            {/* Anthropic */}
            <Section id="anthropic" title="Anthropic / Claude integration">
              <P>Wrap your Anthropic messages call and Logwick captures everything automatically.</P>
              <H3>Node.js</H3>
              <Code lang="JavaScript">{`const result = await logwick.anthropic(
  () => anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  }),
  { action: 'document_review', user: req.user.email }
)`}</Code>
              <H3>Python</H3>
              <Code lang="Python">{`result = lw.anthropic(
    lambda: client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    ),
    {"action": "document_review", "user": user_email}
)`}</Code>
            </Section>

            {/* Gemini */}
            <Section id="gemini" title="Google Gemini integration">
              <H3>Node.js</H3>
              <Code lang="JavaScript">{`const result = await logwick.gemini(
  () => model.generateContent(prompt),
  { action: 'data_analysis', user: req.user.email }
)`}</Code>
              <H3>Python</H3>
              <Code lang="Python">{`result = lw.gemini(
    lambda: model.generate_content(prompt),
    {"action": "data_analysis", "user": user_email}
)`}</Code>
            </Section>

            {/* LangChain */}
            <Section id="langchain" title="LangChain integration">
              <P>Add one callback handler and every LLM call in your chain is logged automatically — no per-call code needed.</P>
              <H3>Node.js</H3>
              <Code lang="JavaScript">{`import { LogwickCallbackHandler } from 'logwick'

const handler = new LogwickCallbackHandler(logwick, {
  user: 'ops@acme.com'
})

const chain = new LLMChain({
  llm,
  prompt,
  callbacks: [handler]  // every call in the chain is now logged
})`}</Code>
              <H3>Python</H3>
              <Code lang="Python">{`handler = lw.langchain_handler(user="ops@acme.com")

chain = LLMChain(
    llm=llm,
    prompt=prompt,
    callbacks=[handler]  # every call in the chain is now logged
)`}</Code>
            </Section>

            {/* MCP */}
            <Section id="mcp" title="Claude MCP integration">
              <P>Connect Logwick to Claude Desktop and ask questions about your logs in plain English. This is the fastest way to investigate AI agent incidents.</P>
              <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: '#7dd3fc', fontFamily: 'var(--font-mono)', lineHeight: 2 }}>
                  "Show me my last 10 error logs"<br/>
                  "What was my success rate this week?"<br/>
                  "How many tokens did I spend yesterday?"<br/>
                  "Find all failed email_draft actions"<br/>
                  "Log this GPT-4o call for me"
                </div>
              </div>
              <H3>Setup with Claude Desktop</H3>
              <P>Add this to your <code style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: 12 }}>claude_desktop_config.json</code> and restart Claude Desktop.</P>
              <P><strong style={{ color: '#e8f4fb' }}>Mac:</strong> <code style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: 12 }}>~/Library/Application Support/Claude/claude_desktop_config.json</code></P>
              <P><strong style={{ color: '#e8f4fb' }}>Windows:</strong> <code style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: 12 }}>%APPDATA%\Claude\claude_desktop_config.json</code></P>
              <Code lang="claude_desktop_config.json">{`{
  "mcpServers": {
    "logwick": {
      "command": "npx",
      "args": ["-y", "@logwick/mcp"],
      "env": {
        "LOGWICK_API_KEY": "sk-lw-your-key"
      }
    }
  }
}`}</Code>
              <H3>Available tools</H3>
              <div style={{ background: '#0a1520', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
                {[
                  ['ingest_log', 'Write a log entry to Logwick'],
                  ['query_logs', 'Search logs by status, agent, action, date, or keyword'],
                  ['get_stats', 'Get usage stats — success rate, tokens, cost'],
                  ['get_log', 'Get full details of a single log entry by ID'],
                  ['delete_log', 'Delete a log entry'],
                ].map(([tool, desc], i, arr) => (
                  <div key={tool} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid #0e1c26' : 'none' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#38bdf8' }}>{tool}</code>
                    <span style={{ fontSize: 13, color: '#c8dce8' }}>{desc}</span>
                  </div>
                ))}
              </div>
              <H3>Adding Logwick to a project via Claude</H3>
              <P>Once the MCP server is connected, you can ask Claude to add Logwick to any project:</P>
              <Code lang="Say this to Claude">{`"Go to https://logwick.io/docs and add Logwick logging 
to my project. My API key is sk-lw-your-key."`}</Code>
              <P>Claude will read this documentation, install the appropriate SDK, add your API key to your environment variables, and wire up logging to your existing AI calls.</P>
            </Section>

            {/* REST API */}
            <Section id="api" title="REST API">
              <P>All endpoints require an API key in the Authorization header.</P>
              <Code lang="Authentication">{`Authorization: Bearer sk-lw-your-key`}</Code>
              <H3>POST /api/v1/logs — Ingest a log</H3>
              <Code lang="Request">{`curl -X POST https://logwick.io/api/v1/logs \\
  -H "Authorization: Bearer sk-lw-your-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent":      "gpt-4o",
    "action":     "email_draft",
    "status":     "success",
    "input":      "Draft a follow-up email",
    "output":     "Subject: Following up...",
    "tokens":     312,
    "latency_ms": 1842,
    "user":       "customer@acme.com"
  }'`}</Code>
              <Code lang="Response">{`{
  "id": "fcf559c2-a3cb-4d48-999c-b606f1440472",
  "timestamp": "2026-04-19T13:44:52.241063+00:00",
  "status": "ingested"
}`}</Code>
              <H3>GET /api/v1/logs — Query logs</H3>
              <Code lang="Request">{`# All logs
curl https://logwick.io/api/v1/logs \\
  -H "Authorization: Bearer sk-lw-your-key"

# Filter by status
curl "https://logwick.io/api/v1/logs?status=error" \\
  -H "Authorization: Bearer sk-lw-your-key"

# Filter by agent
curl "https://logwick.io/api/v1/logs?agent=gpt-4o" \\
  -H "Authorization: Bearer sk-lw-your-key"

# Search
curl "https://logwick.io/api/v1/logs?search=email" \\
  -H "Authorization: Bearer sk-lw-your-key"

# Export as CSV
curl "https://logwick.io/api/v1/logs?format=csv" \\
  -H "Authorization: Bearer sk-lw-your-key"`}</Code>
              <H3>GET /api/v1/stats — Usage statistics</H3>
              <Code lang="Request">{`curl "https://logwick.io/api/v1/stats?days=30" \\
  -H "Authorization: Bearer sk-lw-your-key"`}</Code>
              <Code lang="Response">{`{
  "total": 1842,
  "success": 1756,
  "error": 86,
  "success_rate": 95.4,
  "error_rate": 4.6,
  "avg_latency": 1204,
  "total_tokens": 284921,
  "total_cost": 4.27,
  "period_days": 30
}`}</Code>
            </Section>

            {/* x402 */}
            <Section id="x402" title="x402 — Pay per log">
              <P>Logwick supports <a href="https://x402.org" style={{ color: '#38bdf8' }}>x402</a> — an open payment protocol that lets AI agents pay per log with USDC on Base. No account, no API key, no signup required. The agent pays and logs in a single request.</P>
              <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginBottom: 8, fontWeight: 700 }}>Endpoint</div>
                <div style={{ fontSize: 13, color: '#c8dce8', fontFamily: 'var(--font-mono)' }}>POST https://logwick.io/api/v1/agent-log</div>
                <div style={{ fontSize: 12, color: '#a8c8dc', marginTop: 8 }}>Price: $0.001 USDC per log · Network: Base (eip155:8453) · No API key required</div>
              </div>
              <H3>How it works</H3>
              <P>The agent calls the endpoint. Logwick responds with HTTP 402 and payment requirements. The agent pays $0.001 USDC, includes the payment proof in the request header, and Logwick stores the log.</P>
              <Code lang="Discover pricing — GET request">{`curl https://logwick.io/api/v1/agent-log

# Returns:
# {
#   "x402Version": 1,
#   "accepts": [{
#     "scheme": "exact",
#     "network": "eip155:8453",
#     "maxAmountRequired": "1000",
#     "payTo": "0x...",
#     "description": "Ingest one AI agent audit log entry"
#   }]
# }`}</Code>
              <H3>Log a paid entry</H3>
              <Code lang="POST with x402 payment header">{`curl -X POST https://logwick.io/api/v1/agent-log \
  -H "Content-Type: application/json" \
  -H "X-Payment: <signed-payment-proof>" \
  -d '{
    "agent":      "gpt-4o",
    "action":     "email_draft",
    "status":     "success",
    "input":      "Draft a follow-up email",
    "output":     "Subject: Following up...",
    "tokens":     312,
    "latency_ms": 1842
  }'`}</Code>
              <H3>Using the Coinbase AgentKit</H3>
              <P>If your agent uses <a href="https://docs.cdp.coinbase.com/agentkit" style={{ color: '#38bdf8' }}>Coinbase AgentKit</a>, x402 payments are handled automatically — the agent discovers the price, pays, and logs in one step.</P>
              <Code lang="JavaScript — AgentKit with x402">{`import { CdpWalletProvider } from '@coinbase/agentkit'
import { x402Fetch } from '@coinbase/x402-fetch'

const wallet = await CdpWalletProvider.configureWithWallet({ /* config */ })

// x402Fetch automatically handles payment — no manual signing needed
const response = await x402Fetch('https://logwick.io/api/v1/agent-log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent:      'gpt-4o',
    action:     'email_draft',
    status:     'success',
    input:      prompt,
    output:     result,
    tokens:     312,
  }),
  wallet,
})`}</Code>
              <H3>Log fields</H3>
              <P>Same fields as the standard REST API — see <a href="#reference" style={{ color: '#38bdf8' }}>Log fields reference</a> below. The only difference is authentication — payment via x402 instead of an API key.</P>
              <div style={{ background: '#0a1520', border: '1px solid #1e3040', borderRadius: 8, padding: '16px 20px' }}>
                <div style={{ fontSize: 13, color: '#c8dce8', lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: '#e8f4fb' }}>No account required</strong> — payment is authentication</div>
                  <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: '#e8f4fb' }}>$0.001 per log</strong> — fractions of a cent, agent-friendly pricing</div>
                  <div style={{ marginBottom: 8 }}>✓ <strong style={{ color: '#e8f4fb' }}>Base mainnet</strong> — real USDC, instant settlement</div>
                  <div>✓ <strong style={{ color: '#e8f4fb' }}>Listed on agentic.market</strong> — discoverable by any x402-compatible agent</div>
                </div>
              </div>
            </Section>

            {/* Reference */}
            <Section id="reference" title="Log fields reference">
              <P>All fields accepted by the ingest endpoint. Fields marked with <span style={{ color: '#f87171' }}>*</span> are required.</P>
              <div style={{ background: '#0a1520', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 80px 1fr', gap: 12, padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  <span>Field</span><span>Type</span><span>Description</span>
                </div>
                <div style={{ padding: '0 16px' }}>
                  <Field name="agent" type="string" required desc="The AI model or agent name (e.g. gpt-4o, claude-3-5-sonnet, gemini-1.5-pro)" />
                  <Field name="action" type="string" required desc="The action or task type (e.g. email_draft, data_analysis, code_generation)" />
                  <Field name="status" type="string" desc="success, error, or pending (default: success)" />
                  <Field name="input" type="string" desc="The prompt or input sent to the AI agent" />
                  <Field name="output" type="string" desc="The response or output from the AI agent" />
                  <Field name="user" type="string" desc="The user or system that triggered this action" />
                  <Field name="tokens" type="number" desc="Total tokens used (input + output)" />
                  <Field name="latency_ms" type="number" desc="Response time in milliseconds" />
                  <Field name="cost_usd" type="number" desc="Estimated cost in USD" />
                  <Field name="tags" type="array" desc="Array of strings for categorization (e.g. ['production', 'v2'])" />
                  <Field name="metadata" type="object" desc="Any additional key-value data you want to store" />
                </div>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </>
  )
}
