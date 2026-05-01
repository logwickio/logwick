// pages/blog/audit-logging-for-ai-agents.js
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>The Complete Guide to Audit Logging for AI Agents | Logwick</title>
        <meta name="description" content="Learn how to implement audit logging for AI agents and LLM applications. Complete guide covering what to log, how to log it, and the best tools for AI agent observability." />
        <meta property="og:title" content="The Complete Guide to Audit Logging for AI Agents" />
        <meta property="og:description" content="Learn how to implement audit logging for AI agents and LLM applications. Complete guide with code examples for OpenAI, Anthropic, Gemini, and LangChain." />
        <meta property="og:url" content="https://logwick.io/blog/audit-logging-for-ai-agents" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Complete Guide to Audit Logging for AI Agents" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "The Complete Guide to Audit Logging for AI Agents",
          "description": "Learn how to implement audit logging for AI agents and LLM applications.",
          "url": "https://logwick.io/blog/audit-logging-for-ai-agents",
          "author": { "@type": "Organization", "name": "Logwick", "url": "https://logwick.io" },
          "publisher": { "@type": "Organization", "name": "Logwick", "url": "https://logwick.io" },
          "datePublished": "2026-05-01",
          "dateModified": "2026-05-01",
          "keywords": ["audit logging", "AI agents", "LLM observability", "AI monitoring", "GPT logging", "Claude logging", "LangChain logging"]
        })}} />
      </Head>

      <div style={{ background: '#06090c', minHeight: '100vh', color: '#c8dce8', fontFamily: "'JetBrains Mono', monospace" }}>

        {/* Nav */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'rgba(6,9,12,0.95)', borderBottom: '1px solid #1e3040', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 100, backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="#0ea5e9"/>
              <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="25" cy="24" r="3.5" fill="white"/>
            </svg>
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
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
              The Complete Guide to Audit Logging for AI Agents
            </h1>
            <p style={{ fontSize: 16, color: '#94b8cc', lineHeight: 1.8, marginBottom: 24 }}>
              When your AI agent does something wrong in production — sends the wrong email, makes a bad decision, costs you money — do you know what happened? Most teams don't. This guide explains how to implement audit logging for AI agents so you always have a complete trail of every action your AI takes.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['AI agents', 'LLM observability', 'Production monitoring', 'OpenAI', 'Anthropic', 'LangChain'].map(tag => (
                <span key={tag} style={{ fontSize: 11, color: '#4a7a90', background: '#0a1520', border: '1px solid #1e3040', borderRadius: 4, padding: '3px 10px' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* TOC */}
          <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '20px 24px', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Table of contents</div>
            {[
              ['#why', 'Why AI agents need audit logs'],
              ['#what', 'What to log on every AI call'],
              ['#how', 'How to implement audit logging'],
              ['#openai', 'Logging OpenAI calls'],
              ['#anthropic', 'Logging Anthropic / Claude calls'],
              ['#langchain', 'Logging LangChain agents'],
              ['#tools', 'Tools for AI agent logging'],
              ['#compliance', 'Compliance and retention'],
              ['#mcp', 'Querying logs with Claude MCP'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#7ab0c8', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid #0e1c26' }}
                onMouseEnter={e => e.target.style.color = '#38bdf8'}
                onMouseLeave={e => e.target.style.color = '#7ab0c8'}>
                {label}
              </a>
            ))}
          </div>

          {/* Content */}
          {[
            {
              id: 'why',
              title: 'Why AI agents need audit logs',
              content: `AI agents are different from traditional software. A conventional function does exactly what its code says — deterministic, predictable, debuggable. An AI agent interprets a prompt and produces output that varies with every call. The same input can produce different outputs. Errors aren't syntax errors you can trace — they're semantic failures that only become visible when something goes wrong in production.

This creates a fundamental visibility problem. When a user complains that your AI agent gave them bad advice, sent the wrong email, or made a decision they don't understand — how do you investigate? Without logs, you have nothing. No record of what prompt was sent, what model was called, what it returned, or how long it took.

Audit logging for AI agents solves this. It gives you a complete, searchable record of every action your AI takes — every input, every output, every error, every cost. When something goes wrong, you open your dashboard and see exactly what happened.`
            },
            {
              id: 'what',
              title: 'What to log on every AI call',
              content: `Every AI call should log the following fields:

**agent** — The model or agent name. \`gpt-4o\`, \`claude-3-5-sonnet\`, \`gemini-1.5-pro\`. This tells you which model produced a given output and lets you compare performance across models.

**action** — What the agent was doing. \`email_draft\`, \`data_analysis\`, \`customer_support\`. This is the business context — not just the raw API call, but what it was supposed to accomplish.

**status** — \`success\`, \`error\`, or \`pending\`. The outcome. A high error rate on a specific action tells you immediately where to focus debugging.

**input** — The prompt or message sent to the AI. Essential for reproducing issues and understanding what the model was working with.

**output** — The response from the AI. Required for auditing decisions, debugging bad outputs, and meeting compliance requirements.

**tokens** — Total tokens used. Combined with cost tracking, this tells you which workflows are expensive and where to optimize.

**latency_ms** — How long the call took in milliseconds. Slow calls degrade user experience. Tracking latency lets you spot regressions.

**user** — Which user or system triggered this action. Critical for multi-tenant applications where you need to isolate activity per customer.

**cost_usd** — Estimated cost of the call. Directly ties AI activity to spend.

Most teams skip half of these fields when they first add logging. Don't. The fields that seem unnecessary become critical when you're debugging an incident at 2am.`
            },
            {
              id: 'how',
              title: 'How to implement audit logging',
              content: `The pattern is simple: make your AI call, then immediately log the result. The log call should never block your main code path — fire it in the background and let it complete asynchronously.

Here's the basic pattern in JavaScript:`
            },
            {
              id: 'openai',
              title: 'Logging OpenAI calls',
              content: `Here's how to log every OpenAI call using the Logwick SDK:`
            },
            {
              id: 'anthropic',
              title: 'Logging Anthropic / Claude calls',
              content: `The same pattern works for Anthropic's Claude API:`
            },
            {
              id: 'langchain',
              title: 'Logging LangChain agents',
              content: `For LangChain, the cleanest approach is a callback handler that automatically logs every LLM call in your chain — no per-call code needed:`
            },
            {
              id: 'tools',
              title: 'Tools for AI agent logging',
              content: `Several tools exist for AI agent audit logging. Here's how they compare:

**Logwick** — Simple, affordable, and purpose-built for AI agent audit logging. One line of code, $29/month Pro tier, native Claude MCP integration so you can query logs in plain English. Best for: developers and small teams who need logging fast without a complex platform.

**Braintrust** — Full evaluation platform with logging, evals, datasets, and CI/CD integration. $249/month. Best for: enterprise teams running systematic evaluation pipelines.

**LangSmith** — Logging and tracing for LangChain specifically. Requires LangChain. Best for: teams already deeply invested in the LangChain ecosystem.

**Helicone** — Proxy-based logging that intercepts OpenAI API calls. Simple to set up but limited to proxied calls. Best for: quick setup with OpenAI specifically.

**Datadog / New Relic** — General observability platforms with LLM monitoring add-ons. Expensive and complex. Best for: large enterprises with existing Datadog infrastructure.

The right choice depends on your needs. If you want to be up and running in 3 minutes with a free tier and no vendor lock-in, Logwick is designed for exactly that.`
            },
            {
              id: 'compliance',
              title: 'Compliance and retention',
              content: `Compliance requirements for AI systems are evolving rapidly. The EU AI Act, financial services regulations, and healthcare data requirements are all pushing companies toward formal audit trails for AI decisions.

What regulators typically require:

- A complete record of every AI decision made on behalf of a user
- The ability to explain why a decision was made (input + output)
- Retention of records for a defined period — typically 1-7 years depending on industry
- The ability to produce records on request for audit or investigation

Free-tier logging tools with 7-day retention don't meet these requirements. If you're in a regulated industry, you need a logging solution with appropriate retention policies and the ability to export or produce records on demand.

When evaluating retention needs: consumer apps typically need 30-90 days, fintech and healthcare need 1-7 years, and any AI system making decisions that affect individuals may need indefinite retention in some jurisdictions.`
            },
            {
              id: 'mcp',
              title: 'Querying logs with Claude MCP',
              content: `One of the most powerful features of modern AI agent logging is the ability to query your logs using natural language. Instead of writing SQL queries or using a dashboard UI, you can ask Claude directly about your agent's behavior.

Logwick's MCP server connects your logs to Claude Desktop. Once configured, you can ask questions like:

- "Show me the last 10 error logs from my email drafting agent"
- "What was my success rate this week?"
- "Find all failed customer support interactions from yesterday"
- "How much did we spend on tokens in April?"

Claude retrieves the actual data from your Logwick account and answers in plain English. This is particularly useful during incident investigation — instead of manually filtering logs, you describe what you're looking for and Claude finds it.

To set it up, add the Logwick MCP server to your Claude Desktop config and restart. Full instructions at logwick.io/docs.`
            },
          ].map((section, i) => (
            <div key={section.id} id={section.id} style={{ marginBottom: 48, scrollMarginTop: 80 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
                {section.title}
              </h2>
              {section.content.split('\n\n').map((para, j) => {
                if (para.startsWith('**') || para.includes('**')) {
                  return (
                    <p key={j} style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}
                      dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8f4fb">$1</strong>').replace(/`(.*?)`/g, '<code style="color:#38bdf8;background:#07101a;padding:1px 6px;borderRadius:3px;fontSize:12px">$1</code>').replace(/\n/g, '<br/>') }} />
                  )
                }
                return (
                  <p key={j} style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}
                    dangerouslySetInnerHTML={{ __html: para.replace(/`(.*?)`/g, '<code style="color:#38bdf8;background:#07101a;padding:1px 6px;border-radius:3px;font-size:12px">$1</code>') }} />
                )
              })}

              {/* Code blocks for specific sections */}
              {section.id === 'how' && (
                <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginTop: 8, marginBottom: 16 }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — basic pattern</div>
                  <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`const start = Date.now()
const result = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: userPrompt }]
})

// Log immediately after — fire and forget
fetch('https://logwick.io/api/v1/logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.LOGWICK_API_KEY,
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
    user:       currentUser.email,
  })
}).catch(() => {}) // never blocks, never throws`}</pre>
                </div>
              )}

              {section.id === 'openai' && (
                <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginTop: 8, marginBottom: 16 }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — OpenAI wrapper</div>
                  <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`import { LogwickClient } from 'logwick'

const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })

// Wrap your OpenAI call — logs automatically
const result = await logwick.openai(
  () => openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  }),
  { action: 'email_draft', user: req.user.email }
)

// result is the normal OpenAI response — nothing changes`}</pre>
                </div>
              )}

              {section.id === 'anthropic' && (
                <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginTop: 8, marginBottom: 16 }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — Anthropic wrapper</div>
                  <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`const result = await logwick.anthropic(
  () => anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  }),
  { action: 'document_review', user: req.user.email }
)`}</pre>
                </div>
              )}

              {section.id === 'langchain' && (
                <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginTop: 8, marginBottom: 16 }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>JavaScript — LangChain callback</div>
                  <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`import { LogwickCallbackHandler } from 'logwick'

const handler = new LogwickCallbackHandler(logwick, {
  user: 'ops@acme.com'
})

// Every LLM call in this chain is now logged automatically
const chain = new LLMChain({
  llm,
  prompt,
  callbacks: [handler]
})`}</pre>
                </div>
              )}

              {section.id === 'mcp' && (
                <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, overflow: 'hidden', marginTop: 8, marginBottom: 16 }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #1e3040', fontSize: 10, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase' }}>claude_desktop_config.json</div>
                  <pre style={{ padding: 16, fontSize: 12, color: '#c8dce8', lineHeight: 1.75, overflowX: 'auto', margin: 0 }}>{`{
  "mcpServers": {
    "logwick": {
      "command": "npx",
      "args": ["-y", "@logwick/mcp"],
      "env": {
        "LOGWICK_API_KEY": "sk-lw-your-key"
      }
    }
  }
}`}</pre>
                </div>
              )}
            </div>
          ))}

          {/* CTA */}
          <div style={{ background: '#07101a', border: '1px solid #0ea5e9', borderRadius: 12, padding: '32px 28px', textAlign: 'center', marginTop: 48 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Start logging your AI agents today</div>
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
