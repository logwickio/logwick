// pages/blog/index.js
import Head from 'next/head'
import { useRouter } from 'next/router'

const posts = [
  {
    slug: 'logwick-92-agent-ready-score',
    title: 'From 32 to 92: How We Built One of the Most Agent-Ready Developer Tools on the Internet',
    description: 'We took Logwick from 32 to 92/100 on ora.run's agent readiness benchmark — top 0.4% of 8,400 sites. Here's exactly what we built and why it matters.',
    date: 'May 2, 2026',
    tags: ['Behind the build', 'AI agents', 'Infrastructure'],
    readTime: '6 min read',
  },
  {
    slug: 'how-to-log-openai-api-calls',
    title: 'How to Log OpenAI API Calls in Production',
    description: 'Learn how to log every OpenAI API call in production — inputs, outputs, tokens, latency, and costs. Complete guide with code examples for GPT-4o and LangChain.',
    date: 'May 2, 2026',
    tags: ['Guide', 'OpenAI', 'Production'],
    readTime: '7 min read',
  },
  {
    slug: 'audit-logging-for-ai-agents',
    title: 'The Complete Guide to Audit Logging for AI Agents',
    description: 'Learn how to implement audit logging for AI agents and LLM applications. Complete guide with code examples for OpenAI, Anthropic, Gemini, and LangChain.',
    date: 'May 1, 2026',
    tags: ['Guide', 'AI agents', 'LLM observability'],
    readTime: '8 min read',
  }
]

export default function Blog() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Blog — Logwick</title>
        <meta name="description" content="Guides, tutorials, and insights on AI agent logging, LLM observability, and building AI applications in production." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
          <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Logwick Blog</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Guides & Tutorials</h1>
          <p style={{ fontSize: 14, color: '#94b8cc', lineHeight: 1.8, marginBottom: 48 }}>Insights on AI agent logging, LLM observability, and building AI applications in production.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(post => (
              <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 10, padding: '24px 28px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#0ea5e9'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e3040'}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, color: '#4a7a90', background: '#0a1520', border: '1px solid #1e3040', borderRadius: 4, padding: '2px 8px' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{post.title}</div>
                  <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.7, marginBottom: 12 }}>{post.description}</div>
                  <div style={{ fontSize: 11, color: '#4a7a90' }}>{post.date} · {post.readTime}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
