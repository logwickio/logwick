// pages/about.js
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function About() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>About — Logwick</title>
        <meta name="description" content="Logwick is the audit log for AI agents. Built to give developers full visibility into what their AI agents are doing in production." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Logwick",
          "url": "https://logwick.io",
          "logo": "https://logwick.io/favicon.svg",
          "description": "The audit log for AI agents. Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it.",
          "email": "hello@logwick.io",
          "foundingDate": "2026",
          "sameAs": ["https://github.com/logwickio", "https://npmjs.com/package/logwick", "https://pypi.org/project/logwick", "https://twitter.com/logwickio"],
          "contactPoint": { "@type": "ContactPoint", "email": "hello@logwick.io", "contactType": "customer support" }
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
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '96px 24px 80px' }}>
          <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>About</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 24 }}>The audit log for AI agents</h1>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8, marginBottom: 24 }}>Logwick was built to solve a specific problem: when an AI agent does something wrong in production, most teams have no idea what happened. No logs, no trail, nothing to investigate.</p>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8, marginBottom: 24 }}>We built Logwick to give developers complete visibility into every action their AI agents take — every prompt, every response, every error, every cost. One line of code after your AI call. Full audit trail. Always.</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, marginTop: 40 }}>What we believe</h2>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8, marginBottom: 16 }}>AI agents are fundamentally different from traditional software. They're non-deterministic, they make decisions, and they fail in ways you can't predict from reading the code. The tooling for understanding them needs to be different too.</p>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8, marginBottom: 16 }}>We believe every developer building with AI APIs deserves a complete audit trail without complexity, expensive contracts, or weeks of setup. That's why Logwick is one line of code, free to start, and works with any model or framework.</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, marginTop: 40 }}>What makes Logwick different</h2>
          {[
            ['Native Claude MCP integration', 'Query your logs in plain English via Claude Desktop. Ask what your agents did yesterday. Get real answers.'],
            ['x402 pay-per-log', 'AI agents can log their own actions without a human creating an account. Pay $0.001 USDC per log on Base mainnet.'],
            ['Simple pricing', '$29/month Pro tier vs $249/month for comparable tools. Built for developers and small teams, not just enterprise.'],
            ['One line of code', 'No complex configuration, no agents to deploy, no infrastructure to manage. Add one call after your AI request.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#e8f4fb', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, marginTop: 40 }}>Contact</h2>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8 }}>Questions, feedback, or enterprise inquiries — email us at <a href="mailto:hello@logwick.io" style={{ color: '#38bdf8' }}>hello@logwick.io</a></p>
        </div>
      </div>
    </>
  )
}
