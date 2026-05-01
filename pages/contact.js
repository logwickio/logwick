// pages/contact.js
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Contact() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Contact — Logwick</title>
        <meta name="description" content="Get in touch with the Logwick team. Questions about pricing, enterprise plans, or technical support." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '96px 24px 80px' }}>
          <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Contact</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#f1f5f9', marginBottom: 24 }}>Get in touch</h1>
          <p style={{ fontSize: 15, color: '#94b8cc', lineHeight: 1.8, marginBottom: 40 }}>Questions about Logwick, pricing, enterprise plans, or technical support? We're here to help.</p>
          {[
            { type: 'General', email: 'hello@logwick.io', desc: 'Questions, feedback, product inquiries' },
            { type: 'Support', email: 'hello@logwick.io', desc: 'Technical issues, billing, account help' },
            { type: 'Enterprise', email: 'hello@logwick.io', desc: 'Custom plans, compliance, SLA requirements' },
          ].map(item => (
            <div key={item.type} style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{item.type}</div>
              <a href={`mailto:${item.email}`} style={{ fontSize: 15, color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>{item.email}</a>
              <div style={{ fontSize: 12, color: '#7a9db5', marginTop: 4 }}>{item.desc}</div>
            </div>
          ))}
          <div style={{ marginTop: 40, padding: '20px', background: '#07101a', border: '1px solid #1e3040', borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: '#94b8cc', lineHeight: 1.8 }}>
              <strong style={{ color: '#e8f4fb' }}>Logwick</strong><br/>
              hello@logwick.io<br/>
              <a href="https://logwick.io" style={{ color: '#38bdf8' }}>logwick.io</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
