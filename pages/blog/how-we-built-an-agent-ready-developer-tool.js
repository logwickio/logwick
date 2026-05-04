// pages/blog/logwick-92-agent-ready-score.js
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>How We Built One of the Most Agent-Ready Developer Tools on the Internet | Logwick</title>
        <meta name="description" content="How Logwick achieved Grade A on ora.run's agent readiness benchmark — putting us in the top 1% of sites scanned. Here's exactly what we built and why it matters." />
        <meta property="og:title" content="How We Built One of the Most Agent-Ready Developer Tools on the Internet" />
        <meta property="og:description" content="How Logwick achieved Grade A on ora.run's agent readiness benchmark — top 1% of sites scanned. Here's exactly what we built." />
        <meta property="og:url" content="https://logwick.io/blog/how-we-built-an-agent-ready-developer-tool" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://logwick.io/blog/how-we-built-an-agent-ready-developer-tool" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How We Built One of the Most Agent-Ready Developer Tools on the Internet",
          "description": "How Logwick achieved Grade A on ora.run's agent readiness benchmark — top 1% of sites scanned.",
          "url": "https://logwick.io/blog/how-we-built-an-agent-ready-developer-tool",
          "author": { "@type": "Organization", "name": "Logwick", "url": "https://logwick.io" },
          "publisher": { "@type": "Organization", "name": "Logwick", "url": "https://logwick.io" },
          "datePublished": "2026-05-02",
          "dateModified": "2026-05-02",
          "keywords": ["AI agent ready", "ora.run", "MCP", "x402", "llms.txt", "agent infrastructure", "developer tools"]
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
            <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Behind the build · May 2026</div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
              How We Built One of the Most Agent-Ready Developer Tools on the Internet
            </h1>
            <p style={{ fontSize: 16, color: '#94b8cc', lineHeight: 1.8, marginBottom: 24 }}>
              <a href="https://ora.run" style={{ color: '#38bdf8', textDecoration: 'none' }}>Ora.run</a> scans websites and scores how ready they are for AI agents — things like MCP servers, OpenAPI specs, x402 payments, llms.txt files, and structured data. We started at a failing score and worked our way to Grade A — putting Logwick in the top 1% of sites scanned. Here's exactly what we built, why it matters, and what we learned. (Scores update as the benchmark evolves.)
            </p>
            <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#f87171', fontFamily: "'Syne', sans-serif" }}>32</div>
                  <div style={{ fontSize: 11, color: '#4a7a90', marginTop: 4 }}>Starting score</div>
                </div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#38bdf8', fontFamily: "'Syne', sans-serif" }}>A</div>
                  <div style={{ fontSize: 11, color: '#4a7a90', marginTop: 4 }}>Grade</div>
                </div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#34d399', fontFamily: "'Syne', sans-serif" }}>Top 1%</div>
                  <div style={{ fontSize: 11, color: '#4a7a90', marginTop: 4 }}>of all sites scanned</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['AI agents', 'MCP', 'x402', 'llms.txt', 'OpenAPI', 'Agent infrastructure'].map(tag => (
                <span key={tag} style={{ fontSize: 11, color: '#4a7a90', background: '#0a1520', border: '1px solid #1e3040', borderRadius: 4, padding: '3px 10px' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Score progression visual */}
          <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '20px 24px', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Score progression</div>
            {[
              { score: 32, label: 'Starting point — bare site, no agent infrastructure', color: '#f87171' },
              { score: 60, label: 'Added llms.txt, OpenAPI spec, robots.txt', color: '#fb923c' },
              { score: 65, label: 'Added public API discovery endpoint', color: '#fbbf24' },
              { score: 67, label: 'Added blog post targeting "audit logging for AI agents"', color: '#a3e635' },
              { score: 73, label: 'Added agent-card.json, MCP server card, OAuth metadata', color: '#34d399' },
              { score: 82, label: 'Split JSON-LD into separate blocks, Ed25519 key, og:image', color: '#22d3ee' },
              { score: 87, label: 'Added llms-full.txt, pricing.md, index.md, modular llms.txt', color: '#38bdf8' },
              { score: 88, label: 'Added markdown links to llms.txt, PostalAddress schema', color: '#60a5fa' },
              { score: 'A', label: 'Grade A achieved — top 1% of all sites scanned', color: '#a78bfa' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 36, textAlign: 'right', fontSize: 13, fontWeight: 700, color: item.color, flexShrink: 0 }}>{item.score}</div>
                <div style={{ flex: 1, height: 6, background: '#0a1520', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: typeof item.score === 'number' ? `${item.score}%` : '100%', background: item.color, borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#7a9db5', flex: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* What is ora.run */}
          <div style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              What is ora.run and why does it matter?
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              Ora.run evaluates how ready a website or product is to be used by AI agents — not just humans. It scores across five layers: Discovery (can agents find you?), Identity (do agents understand you?), Auth & Access (can agents authenticate?), Agent Integration (have you built the plumbing?), and User Experience (can users interact with you through agents?).
            </p>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              This matters because AI agents are increasingly the interface between users and software. When a developer tells Claude to "add logging to my project," Claude needs to be able to discover Logwick, understand what it does, authenticate, and integrate it — all without human intervention. A high ora.run score means Logwick works natively in the agentic world.
            </p>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9 }}>
              Most developer tools score in the 40-60 range. Scoring 92 puts Logwick alongside companies that have dedicated engineering teams working on agent infrastructure. We did it in a single focused sprint.
            </p>
          </div>

          {/* What we built */}
          <div style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              What we actually built
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 24 }}>
              Here's every file and endpoint we added, organized by impact:
            </p>

            {[
              {
                category: 'Agent discovery files',
                color: '#38bdf8',
                items: [
                  ['/llms.txt', 'Plain text description of Logwick for AI agents — the AI equivalent of robots.txt. Includes when to use, constraints, API reference, and authentication.'],
                  ['/llms-full.txt', 'Complete product documentation in a single file — agents ingest everything in one request without crawling.'],
                  ['/pricing.md', 'Machine-readable pricing so agents can compare plans and make recommendations.'],
                  ['/index.md', 'Markdown version of the homepage for agents that prefer markdown over HTML.'],
                  ['/api/llms.txt and /docs/llms.txt', 'Per-section context files so agents can fetch scoped documentation.'],
                ]
              },
              {
                category: 'Well-known endpoints',
                color: '#a78bfa',
                items: [
                  ['/.well-known/api-catalog', 'RFC 9727 API catalog with linkset format, advertising all agent-accessible APIs.'],
                  ['/.well-known/agent-card.json', 'A2A agent card describing Logwick\'s capabilities and endpoints.'],
                  ['/.well-known/mcp/server-card.json', 'MCP server card so agents can preview the MCP server before connecting.'],
                  ['/.well-known/oauth-authorization-server', 'RFC 8414 OAuth metadata for agent authentication discovery.'],
                  ['/.well-known/oauth-protected-resource', 'RFC 9728 protected resource metadata.'],
                  ['/.well-known/http-message-signatures-directory', 'Ed25519 public key directory for RFC 9421 request signing.'],
                  ['/.well-known/openapi.json', 'OpenAPI spec at the standard well-known path.'],
                ]
              },
              {
                category: 'x402 pay-per-log',
                color: '#34d399',
                items: [
                  ['/api/v1/agent-log', 'AI agents pay $0.001 USDC on Base mainnet per log entry. No account required — payment is authentication.'],
                  ['/api/v1/agent-logs', 'Agents query their own logs by signing a message with their wallet — no account needed.'],
                  ['/api/v1/agent-stats', 'Stats by wallet address, same wallet signature pattern.'],
                  ['/api/discovery/resources', 'x402 discovery endpoint listing all payment-gated resources.'],
                ]
              },
              {
                category: 'API improvements',
                color: '#fbbf24',
                items: [
                  ['/api/v1 (public)', 'Public API discovery endpoint — no auth required, returns full API surface.'],
                  ['/api/v1/logs/stream', 'Server-Sent Events streaming endpoint for real-time log consumption.'],
                  ['/api/v1/guest-token', 'Guest API key with 1-hour expiry and 10-log limit — agents can test without signup.'],
                  ['JSON 404 handlers', 'Catch-all routes returning structured JSON instead of HTML error pages.'],
                  ['Rate limit headers', 'X-RateLimit-Limit, X-RateLimit-Window, Retry-After on all API routes.'],
                  ['429 + 5xx in OpenAPI', 'Documented error responses so agents know how to handle rate limits and failures.'],
                ]
              },
              {
                category: 'Structured data',
                color: '#fb923c',
                items: [
                  ['5 separate JSON-LD blocks', 'SoftwareApplication, Organization, FAQPage, WebSite with speakable, BreadcrumbList — each as separate script tags so scanners detect every type.'],
                  ['sameAs entity linking', 'GitHub, npm, PyPI, Twitter, LinkedIn — agents can disambiguate Logwick from other entities.'],
                  ['PostalAddress in Organization', 'Required for Organization schema completeness score.'],
                  ['Canonical URL + og:image', 'All four metadata signals for AI entity resolution.'],
                ]
              },
              {
                category: 'Content',
                color: '#f472b6',
                items: [
                  ['Blog post: audit logging for AI agents', 'Targets the exact use case query agents search for — full code examples for OpenAI, Anthropic, LangChain, MCP.'],
                  ['Blog post: how to log OpenAI API calls', 'Targets high-intent developer searches — drove significant citability score improvement.'],
                  ['/about, /contact, /compare', 'Trust anchor pages agents check to verify business legitimacy.'],
                  ['/status', 'Operational status page for agent error recovery.'],
                  ['Semantic H2 headings', '5 H2s added to homepage for better vector embedding and semantic retrieval.'],
                ]
              },
            ].map(section => (
              <div key={section.category} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: section.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>{section.category}</div>
                {section.items.map(([title, desc]) => (
                  <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                    <code style={{ fontSize: 11, color: section.color, background: '#07101a', padding: '2px 8px', borderRadius: 4, flexShrink: 0, height: 'fit-content', marginTop: 2 }}>{title}</code>
                    <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7 }}>{desc}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* What we learned */}
          <div style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              What we learned
            </h2>

            {[
              ['The biggest quick wins were the discovery files', 'Going from 32 to 60 in one push — nearly doubling the score — came entirely from adding llms.txt, openapi.json, and robots.txt. These took less than an hour to write and had the highest ROI of anything we built. If you do nothing else, add these three files.'],
              ['JSON-LD needs to be separate script blocks', 'We had all our schema types in a single array inside one script tag. The scanner only detected one type. Splitting into 5 separate script blocks — one per schema type — immediately gave us credit for all of them. This is not documented anywhere; we discovered it by watching the score change.'],
              ['Content makes you citable', 'The AI citability score jumped from partial to full only after we published the second blog post. The scanner checks whether LLMs would actually cite your content when answering questions. Technical documentation alone wasn\'t enough — it needed real articles with examples, use cases, and structure.'],
              ['x402 is genuinely novel but hard to detect', 'We implemented x402 pay-per-log correctly — payment-required headers, discovery endpoint, Base mainnet support — but the scanner still doesn\'t detect it. This is an early protocol and scanners haven\'t caught up. The implementation is real and working even if it doesn\'t score yet.'],
              ['Most gaps above 88 require platform approval or weeks of SEO', 'Above 88, the remaining points come from verified AI platform integrations (requires approval from Anthropic/OpenAI), brand authority in training data (requires press coverage and time), and streamable HTTP MCP (requires significant engineering). These aren\'t quick fixes.'],
            ].map(([title, body]) => (
              <div key={title} style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#e8f4fb', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.8 }}>{body}</div>
              </div>
            ))}
          </div>

          {/* Why it matters */}
          <div style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              Why this matters for Logwick users
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              Logwick is a tool for AI agents — it logs what AI agents do. It makes sense that Logwick itself should be fully accessible to AI agents. The infrastructure we built isn't just for a benchmark score. It means:
            </p>
            {[
              ['Claude can set up Logwick autonomously', 'Tell Claude to add logging to your project. It reads llms.txt, understands the API, installs the SDK, and wires it up. No human steps required beyond saying what you want.'],
              ['AI agents can log themselves without accounts', 'Via x402 pay-per-log on Base mainnet, any autonomous agent with a crypto wallet can start logging at $0.001 per entry — no signup, no API key, no human in the loop.'],
              ['Any AI assistant can recommend Logwick accurately', 'With 5 JSON-LD schema types, comprehensive llms.txt, and consistent metadata, ChatGPT, Claude, Gemini, and DeepSeek can all accurately describe what Logwick does and recommend it appropriately.'],
              ['Agents can query logs without human accounts', 'Via wallet-based identity — agents prove ownership of their wallet address and query only their own logs. No login, no password, just cryptographic proof.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <span style={{ color: '#34d399', flexShrink: 0, marginTop: 2 }}>✓</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e8f4fb', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* What's next */}
          <div style={{ marginBottom: 48, scrollMarginTop: 80 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1e3040' }}>
              What's next
            </h2>
            <p style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.9, marginBottom: 16 }}>
              The remaining points on the score require either platform approvals or significant engineering. The three items on our roadmap:
            </p>
            {[
              ['Streamable HTTP MCP transport', 'Upgrading the MCP server from stdio to HTTP transport so agents can connect without installing anything locally. This would unlock 6+ bonus points and more importantly make the MCP integration more useful.'],
              ['Press coverage and community presence', 'The brand authority gap is pure distribution — we need third-party mentions, Reddit discussions, and developer community presence. This is marketing work, not engineering.'],
              ['CLI tool', 'A command-line tool that lets developers and agents script interactions with Logwick without building API integrations from scratch.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#38bdf8', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: '#4a7a90', marginBottom: 12 }}>Verified by ora.run</div>
            <a href="https://ora.run/scan/logwick.io" target="_blank" rel="noreferrer">
              <img src="https://ora.run/api/badge/logwick.io" alt="ora agent readiness score" style={{ borderRadius: 8 }} />
            </a>
          </div>

          {/* CTA */}
          <div style={{ background: '#07101a', border: '1px solid #0ea5e9', borderRadius: 12, padding: '32px 28px', textAlign: 'center', marginTop: 48 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Try the most agent-ready logging tool available</div>
            <p style={{ fontSize: 14, color: '#94b8cc', marginBottom: 8, lineHeight: 1.7 }}>Free tier includes 5,000 logs/month. No credit card required.</p>
            <p style={{ fontSize: 12, color: '#4a7a90', marginBottom: 24 }}>Or just tell Claude: "Here are the Logwick docs: [paste from logwick.io/docs] — add Logwick to my project"</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/signup" style={{ padding: '12px 24px', background: '#0ea5e9', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Get started free →</a>
              <a href="https://ora.run/score/logwick.io" target="_blank" rel="noreferrer" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #1e3040', borderRadius: 8, color: '#a8c8dc', textDecoration: 'none', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>See our score →</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
