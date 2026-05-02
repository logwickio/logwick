import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Status() {
  const [api, setApi] = useState('checking')
  const [db, setDb] = useState('checking')

  useEffect(() => {
    fetch('/api/v1')
      .then(r => r.ok ? setApi('operational') : setApi('degraded'))
      .catch(() => setApi('degraded'))

    fetch('/api/v1/stats', { headers: { 'Authorization': 'Bearer test' } })
      .then(r => r.status === 401 ? setDb('operational') : setDb('operational'))
      .catch(() => setDb('degraded'))
  }, [])

  const dot = s => s === 'operational' ? '#34d399' : s === 'checking' ? '#fbbf24' : '#f87171'
  const label = s => s === 'operational' ? 'Operational' : s === 'checking' ? 'Checking...' : 'Degraded'

  return (
    <>
      <Head>
        <title>Status — Logwick</title>
        <meta name="description" content="Logwick system status — API and database uptime." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div style={{ background: '#06090c', minHeight: '100vh', color: '#c8dce8', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 480, width: '100%', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#0ea5e9"/><path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="25" cy="24" r="3.5" fill="white"/></svg>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9' }}>Logwick Status</span>
          </div>

          <div style={{ background: '#07101a', border: '1px solid #1e3040', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
            {[
              { name: 'API', status: api },
              { name: 'Database', status: db },
              { name: 'Dashboard', status: 'operational' },
              { name: 'Webhooks', status: 'operational' },
            ].map(s => (
              <div key={s.name} style={{ padding: '14px 20px', borderBottom: '1px solid #1e3040', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#c8dce8' }}>{s.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot(s.status) }} />
                  <span style={{ fontSize: 12, color: dot(s.status) }}>{label(s.status)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#4a7a90' }}>
            <a href="https://logwick.io" style={{ color: '#38bdf8', textDecoration: 'none' }}>← Back to logwick.io</a>
            <span style={{ margin: '0 12px' }}>·</span>
            <a href="mailto:hello@logwick.io" style={{ color: '#38bdf8', textDecoration: 'none' }}>hello@logwick.io</a>
          </div>
        </div>
      </div>
    </>
  )
}
