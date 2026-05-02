// pages/blog/how-to-log-openai-api-calls.js
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>How to Log OpenAI API Calls in Production | Logwick</title>
        <meta name="description" content="Learn how to log every OpenAI API call in production — inputs, outputs, tokens, latency, and costs. Complete guide with code examples for GPT-4o, GPT-4, and the Assistants API." />
        <meta property="og:title" content="How to Log OpenAI API Calls in Production" />
        <meta property="og:description" content="Learn how to log every OpenAI API call in production — inputs, outputs, tokens, latency, and costs. Complete guide with code examples." />
        <meta property="og:url" content="https://logwick.io/blog/how-to-log-openai-api-calls" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://logwick.io/blog/how-to-log-openai-api-calls" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How to Log OpenAI API Calls in Production",
          "description": "Learn how to log every OpenAI API call in production — inputs, outputs, tokens, latency, and costs.",
          "url": "https://logwick.io/blog/how-to-log-openai-api-calls",
          "author": { "@type": "Organization", "name": "Logwick", "url": "https://logwick.io" },
          "publisher": { "@type": "Organization", "name": "Logwick", "url": "https://logwick.io" },
          "datePublished": "2026-05-02",
          "dateModified": "2026-05-02",
          "keywords": ["OpenAI logging", "log OpenAI API calls", "OpenAI monitoring", "GPT-4 logging", "AI API logging", "OpenAI production monitoring"]
        })}} />
      </Head>

      <div style={{ background: '#06090c', minHeight: '100vh', color: '#c8dce8', fontFamily: "'JetBrains Mono', monospace" }}>

        {/* Nav */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'rgba(6,9,12,0.95)', borderBottom: '1px solid #1e3040', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 100, backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#0ea5e9"/><path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="25" cy="24" r="3.5" fill="white"/></svg>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#f1f5f9' }}>Logwick</span>
            <span style={{ fontSize: 11, color: '#4a7a90' }}>/blog</span>
          </div>
          <div style={{ flex: 1 }} />
          <a href="/docs" style={{ fontSize: 12, color: '#a8c8dc', textDecoration: 'none' }}>Docs</a>
          <a href="/signup" style={{ fontSize: 12, color: '#fff', background: '#0ea5e9', padding: '6px 14px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Get started free</a>
        </nav>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '96px 24px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Guide · May 2026</div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
              How to Log OpenAI API Calls in Production
            </h1>
            <p style={{ fontSize: 16, color: '#94b8cc', lineHeight: 1.8, marginBottom: 24 }}>
              OpenAI's dashboard shows you aggregate token usage and costs. What it doesn't show you is which specific calls failed, what prompts triggered unexpected responses, how latency varies by user, or which features are actually consuming your budget. For that you need your own logging. This guide covers everything you need to know.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['OpenAI', 'GPT-4o', 'Production logging', 'API monitoring', 'Token tracking'].map(tag => (
                <span key={tag} style={{ fontSize: 11, color: '#4a7a90', background: '#0a1520', border: '1px solid #1e3040', borderRadius: 4, padding: '3px 10px' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* TOC */}
          <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '20px 24px', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Table of contents</div>
            {[
              ['#why', 'Why OpenAI\'s built-in logging isn\'t enough'],
              ['#what', 'What to log on every API call'],
              ['#basic', 'Basic logging with fetch'],
              ['#sdk', 'Logging with the OpenAI SDK'],
              ['#wrapper', 'Building a reusable wrapper'],
              ['#npm', 'Using the Logwick SDK (fastest approach)'],
              ['#costs', 'Tracking costs per user and feature'],
              ['#errors', 'Logging errors and timeouts'],
              ['#langchain', 'Logging LangChain + OpenAI calls'],
              ['#dashboard', 'Viewing and searching your logs'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#7ab0c8', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid #0e1c26' }}
                onMouseEnter={e => e.target.style.color = '#38bdf8'}
                onMouseLeave={e => e.target.style.color = '#7ab0c8'}>
                {label}
              </a>
            ))}
          </div>

          {/* Section: Why */}
          <div id="why" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Why OpenAI's built-in logging isn't enough
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              OpenAI provides a usage dashboard that shows total tokens consumed and estimated costs. It's useful for billing but useless for debugging. When a user reports that your AI feature gave them a bad response, the OpenAI dashboard can't tell you what prompt triggered it, what the model returned, how long it took, or whether the problem is reproducible.
            </p>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              What you actually need in production:
            </p>
            {[
              ['Input/output logging', 'The exact prompt sent and response received for every call, so you can reproduce and debug issues.'],
              ['Per-request token counts', 'Not just total usage, but tokens per call, per user, per feature — so you know what\'s expensive.'],
              ['Latency tracking', 'How long each call takes. GPT-4o can vary from 500ms to 30 seconds depending on prompt length and load.'],
              ['Error logging', 'Rate limit errors, timeouts, and content policy rejections need to be tracked separately from successful calls.'],
              ['User attribution', 'Which of your users or customers triggered each call, so you can debug customer-specific issues and allocate costs.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f4fb', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Section: What */}
          <div id="what" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              What to log on every OpenAI API call
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              At minimum, every log entry should capture these fields:
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Log fields</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`{
  agent:      "gpt-4o",          // model used
  action:     "email_draft",     // what the call was for
  status:     "success",         // success | error | pending
  input:      userPrompt,        // the prompt sent
  output:     responseText,      // the response received
  tokens:     312,               // total tokens used
  latency_ms: 1842,              // how long it took
  cost_usd:   0.0021,            // estimated cost
  user:       "user@example.com" // who triggered it
}`}</pre>
            </div>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9 }}>
              The <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>action</code> field is important — it's the business context for the call. Not just "gpt-4o was called" but "an email was drafted". This lets you filter logs by feature and understand which parts of your product are working.
            </p>
          </div>

          {/* Section: Basic */}
          <div id="basic" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Basic logging with fetch
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              The simplest approach — make your OpenAI call, then immediately fire a log. The log call is fire-and-forget so it never blocks your response.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`const start = Date.now()

// Your existing OpenAI call — unchanged
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: userPrompt }]
})

const output = response.choices[0].message.content
const latency = Date.now() - start

// Log immediately after — fire and forget
fetch('https://logwick.io/api/v1/logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.LOGWICK_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agent:      'gpt-4o',
    action:     'email_draft',   // what this call was for
    status:     'success',
    input:      userPrompt,
    output:     output,
    tokens:     response.usage.total_tokens,
    latency_ms: latency,
    user:       currentUser.email,
    cost_usd:   response.usage.total_tokens * 0.000005
  })
}).catch(() => {}) // never throws, never blocks

return output`}</pre>
            </div>
          </div>

          {/* Section: SDK */}
          <div id="sdk" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Logging with the OpenAI SDK
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              The same pattern works with the official OpenAI Node.js SDK. The SDK returns the same response object including <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>usage.total_tokens</code> and <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>usage.prompt_tokens</code>.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — OpenAI SDK</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function callWithLogging(prompt, action, user) {
  const start = Date.now()
  let status = 'success'
  let output = ''
  let tokens = 0

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    })
    output = response.choices[0].message.content
    tokens = response.usage.total_tokens
  } catch (err) {
    status = 'error'
    output = err.message
  }

  // Log regardless of success or failure
  fetch('https://logwick.io/api/v1/logs', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.LOGWICK_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent: 'gpt-4o',
      action,
      status,
      input: prompt,
      output,
      tokens,
      latency_ms: Date.now() - start,
      user
    })
  }).catch(() => {})

  if (status === 'error') throw new Error(output)
  return output
}`}</pre>
            </div>
          </div>

          {/* Section: Wrapper */}
          <div id="wrapper" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Building a reusable wrapper
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              If you're making OpenAI calls in multiple places, a wrapper function avoids repeating the logging code everywhere. Here's a clean pattern that works across your entire codebase.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>lib/ai.js — reusable wrapper</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`// lib/ai.js
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const LOGWICK_KEY = process.env.LOGWICK_API_KEY

export async function chat(messages, { action, user, model = 'gpt-4o' } = {}) {
  const start = Date.now()
  const prompt = messages.map(m => m.content).join('\\n')

  try {
    const response = await openai.chat.completions.create({ model, messages })
    const output = response.choices[0].message.content

    log({ action, user, model, status: 'success',
      input: prompt, output,
      tokens: response.usage.total_tokens,
      latency_ms: Date.now() - start })

    return output
  } catch (err) {
    log({ action, user, model, status: 'error',
      input: prompt, output: err.message,
      latency_ms: Date.now() - start })
    throw err
  }
}

function log(data) {
  if (!LOGWICK_KEY) return
  fetch('https://logwick.io/api/v1/logs', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + LOGWICK_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ agent: data.model, ...data })
  }).catch(() => {})
}

// Usage anywhere in your app:
// import { chat } from './lib/ai'
// const reply = await chat(messages, { action: 'email_draft', user: req.user.email })`}</pre>
            </div>
          </div>

          {/* Section: npm */}
          <div id="npm" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Using the Logwick SDK (fastest approach)
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              The Logwick SDK includes a built-in OpenAI wrapper that handles all the timing, error handling, and token counting automatically.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Install</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`npm install logwick`}</pre>
            </div>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`import { LogwickClient } from 'logwick'

const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })

// Wrap your existing OpenAI call — nothing else changes
const result = await logwick.openai(
  () => openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  }),
  { action: 'email_draft', user: req.user.email }
)

// result is the normal OpenAI response object
const reply = result.choices[0].message.content`}</pre>
            </div>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9 }}>
              The wrapper automatically captures timing, token usage, the input prompt, the output, and logs errors. You get a full audit trail for every call with one line of change.
            </p>
          </div>

          {/* Section: Costs */}
          <div id="costs" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Tracking costs per user and feature
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              OpenAI's dashboard shows total spend. It doesn't tell you which feature or customer is driving it. By logging the <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>user</code> and <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>action</code> fields alongside <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>cost_usd</code>, you can answer questions like: which customer costs the most to serve, and which feature is most expensive.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>GPT-4o cost calculation</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`// GPT-4o pricing (as of 2026):
// Input:  $2.50 per million tokens
// Output: $10.00 per million tokens

function calculateCost(usage) {
  const inputCost  = (usage.prompt_tokens / 1_000_000) * 2.50
  const outputCost = (usage.completion_tokens / 1_000_000) * 10.00
  return inputCost + outputCost
}

// Then log it:
logwick.fire({
  agent:    'gpt-4o',
  action:   'email_draft',
  tokens:   response.usage.total_tokens,
  cost_usd: calculateCost(response.usage),
  user:     currentUser.email
})`}</pre>
            </div>
          </div>

          {/* Section: Errors */}
          <div id="errors" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Logging errors and timeouts
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              OpenAI errors fall into three categories: rate limit errors (429), timeout errors, and content policy rejections. Each needs different handling. Log all of them with <code style={{ color: '#38bdf8', background: '#07101a', padding: '1px 6px', borderRadius: 3, fontSize: 12 }}>status: 'error'</code> so you can track error rates over time.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — error handling</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`try {
  const response = await openai.chat.completions.create({ ... })
  logwick.fire({ status: 'success', ...data })
} catch (err) {
  // Log the error with full context
  logwick.fire({
    agent:    'gpt-4o',
    action:   action,
    status:   'error',
    input:    prompt,
    output:   err.message,
    latency_ms: Date.now() - start,
    user:     user,
    metadata: {
      error_type: err.constructor.name,
      error_code: err.status,
      // Rate limit: 429, Timeout: ETIMEDOUT, Policy: 400
    }
  })
  throw err
}`}</pre>
            </div>
          </div>

          {/* Section: LangChain */}
          <div id="langchain" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Logging LangChain + OpenAI calls
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              If you're using LangChain, the cleanest approach is a callback handler that automatically logs every LLM call in your chain without modifying each call individually.
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — LangChain callback</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`import { LogwickCallbackHandler } from 'logwick'
import { LLMChain } from 'langchain/chains'

const handler = new LogwickCallbackHandler(logwick, {
  user: req.user.email
})

// Every LLM call in this chain is logged automatically
const chain = new LLMChain({
  llm,
  prompt,
  callbacks: [handler]
})

const result = await chain.call({ input: userQuery })
// Logwick has already logged the call — no extra code needed`}</pre>
            </div>
          </div>

          {/* Section: Dashboard */}
          <div id="dashboard" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Viewing and searching your logs
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              Once you're logging, the Logwick dashboard gives you a searchable, filterable view of all your OpenAI calls. You can filter by status to find all errors, search by user to debug a customer issue, or filter by action to understand the performance of a specific feature.
            </p>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              You can also query logs via API or stream them in real time:
            </p>
            <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Query your logs via API</div>
              <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`# Get all errors from the last 24 hours
curl "https://logwick.io/api/v1/logs?status=error&from=2026-05-01" \\
  -H "Authorization: Bearer sk-lw-your-key"

# Stream logs in real time
curl -N "https://logwick.io/api/v1/logs/stream?status=error" \\
  -H "Authorization: Bearer sk-lw-your-key"

# Get stats
curl "https://logwick.io/api/v1/stats?days=7" \\
  -H "Authorization: Bearer sk-lw-your-key"`}</pre>
            </div>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9 }}>
              If you use Claude Desktop, you can also connect the Logwick MCP server and ask questions in plain English: "Show me all failed email_draft calls from yesterday" or "How much did we spend on GPT-4o this week?"
            </p>
          </div>

          {/* CTA */}
          <div style={{ background: '#07101a', border: '1px solid #0ea5e9', borderRadius: 12, padding: '32px 28px', textAlign: 'center', marginTop: 48 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Start logging your OpenAI calls today</div>
            <p style={{ fontSize: 14, color: '#94b8cc', marginBottom: 24, lineHeight: 1.7 }}>Free tier includes 5,000 logs/month. No credit card required. Up and running in 3 minutes.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/signup" style={{ padding: '12px 24px', background: '#0ea5e9', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Get started free →</a>
              <a href="/docs" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #1e3040', borderRadius: 8, color: '#a8c8dc', textDecoration: 'none', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Read the docs</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
