// pages/compare.js
import Head from 'next/head'
import { useRouter } from 'next/router'

const competitors = [
  {
    name: 'Logwick',
    tagline: 'Simple audit logging for AI agents',
    price: '$0–$29/mo',
    setup: '3 minutes',
    highlight: true,
    features: {
      'One-line integration': true,
      'Free tier': true,
      'Claude MCP integration': true,
      'x402 pay-per-log': true,
      'No LangChain required': true,
      'Cross-model logging': true,
      'Webhook alerts': true,
      'CSV export': true,
      'Eval pipelines': false,
      'Dataset management': false,
    }
  },
  {
    name: 'Braintrust',
    tagline: 'Enterprise eval platform',
    price: '$249/mo',
    setup: 'Hours',
    highlight: false,
    features: {
      'One-line integration': false,
      'Free tier': false,
      'Claude MCP integration': false,
      'x402 pay-per-log': false,
      'No LangChain required': true,
      'Cross-model logging': true,
      'Webhook alerts': true,
      'CSV export': true,
      'Eval pipelines': true,
      'Dataset management': true,
    }
  },
  {
    name: 'LangSmith',
    tagline: 'LangChain tracing platform',
    price: '$39/user/mo',
    setup: '30+ mins',
    highlight: false,
    features: {
      'One-line integration': false,
      'Free tier': true,
      'Claude MCP integration': false,
      'x402 pay-per-log': false,
      'No LangChain required': false,
      'Cross-model logging': true,
      'Webhook alerts': false,
      'CSV export': true,
      'Eval pipelines': true,
      'Dataset management': true,
    }
  },
  {
    name: 'Helicone',
    tagline: 'OpenAI proxy logging',
    price: '$50/mo+',
    setup: '10 mins',
    highlight: false,
    features: {
      'One-line integration': false,
      'Free tier': true,
      'Claude MCP integration': false,
      'x402 pay-per-log': false,
      'No LangChain required': true,
      'Cross-model logging': false,
      'Webhook alerts': false,
      'CSV export': true,
      'Eval pipelines': false,
      'Dataset management': false,
    }
  },
]

const featureList = Object.keys(competitors[0].features)

export default function Compare() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Logwick vs Braintrust vs LangSmith — AI Agent Logging Comparison</title>
        <meta name="description" content="Compare Logwick with Braintrust, LangSmith, Helicone and other AI observability tools. See pricing, features, and setup time side by side." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Table",
          "name": "AI Agent Logging Tools Comparison",
          "description": "Comparison of Logwick, Braintrust, LangSmith, and Helicone for AI agent audit logging"
        })}} />
      </Head>
      <div style={{ background: '#06090c', minHeight: '100vh', color: '#c8dce8', fontFamily: "'JetBrains Mono', monospace" }}>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'rgba(6,9,12,0.95)', borderBottom: '1px solid #1e3040', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#0ea5e9"/><path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="25" cy="24" r="3.5" fill="white"/></svg>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#f1f5f9' }}>Logwick</span>
          </div>
          <div style={{ flex: 1 }} />
          <a href="/docs" style={{ fontSize: 12, color: '#a8c8dc', textDecoration: 'none' }}>Docs</a>
          <a href="/signup" style={{ fontSize: 12, color: '#fff', background: '#0ea5e9', padding: '6px 14px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>Get started free</a>
        </nav>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '96px 24px 80px' }}>
          <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Compare</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Logwick vs the alternatives</h1>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8, marginBottom: 48, maxWidth: 600 }}>How does Logwick compare to Braintrust, LangSmith, and Helicone for AI agent audit logging? Here's a side-by-side breakdown.</p>

          {/* Pricing row */}
          <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${competitors.length}, 1fr)`, gap: 1, background: '#1e3040', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ background: '#07101a', padding: '16px' }} />
            {competitors.map(c => (
              <div key={c.name} style={{ background: c.highlight ? '#08111c' : '#07101a', padding: '16px', border: c.highlight ? '2px solid #0ea5e9' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: c.highlight ? '#38bdf8' : '#e8f4fb', marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#4a7a90', marginBottom: 8 }}>{c.tagline}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: c.highlight ? '#38bdf8' : '#c8dce8' }}>{c.price}</div>
                <div style={{ fontSize: 11, color: '#4a7a90', marginTop: 4 }}>Setup: {c.setup}</div>
              </div>
            ))}

            {/* Feature rows */}
            {featureList.map((feature, i) => (
              <>
                <div key={`label-${i}`} style={{ background: '#07101a', padding: '12px 16px', fontSize: 12, color: '#a8c8dc', borderTop: '1px solid #1e3040' }}>{feature}</div>
                {competitors.map(c => (
                  <div key={`${c.name}-${feature}`} style={{ background: c.highlight ? '#060e16' : '#06090c', padding: '12px', textAlign: 'center', borderTop: '1px solid #1e3040' }}>
                    <span style={{ fontSize: 16, color: c.features[feature] ? '#34d399' : '#334155' }}>
                      {c.features[feature] ? '✓' : '—'}
                    </span>
                  </div>
                ))}
              </>
            ))}
          </div>

          {/* Why Logwick */}
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, marginTop: 48 }}>Why choose Logwick?</h2>
          {[
            ['Unlike Braintrust', 'Braintrust is an enterprise eval platform starting at $249/month that requires setting up evaluation pipelines, datasets, and scorers. Logwick is one line of code and $29/month — designed for teams that need logging fast, not a full ML platform.'],
            ['Unlike LangSmith', 'LangSmith is tightly coupled to LangChain. If you\'re using OpenAI, Anthropic, or Gemini directly, LangSmith requires significant configuration. Logwick works with any model or framework via a single POST request.'],
            ['Unlike Helicone', 'Helicone works by proxying your OpenAI API calls. This means it only captures one model\'s calls and adds a network hop to every request. Logwick is framework-agnostic and doesn\'t intercept your API traffic.'],
            ['Unique to Logwick', 'Native Claude Desktop MCP integration so you can query logs in plain English. x402 pay-per-log so AI agents can log themselves without creating an account. Both are unique to Logwick.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#38bdf8', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="/signup" style={{ display: 'inline-block', padding: '14px 28px', background: '#0ea5e9', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Get started free →</a>
          </div>
        </div>
      </div>
    </>
  )
}
