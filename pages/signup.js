import { useState } from 'react'

export default function Signup() {
  const [step, setStep] = useState('form')
  const [orgName, setOrgName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    if (!orgName.trim()) { setError('Organization name is required'); return }
    setError(''); setLoading(true)
    const { getSupabase } = await import('../lib/supabase')
    const supabase = getSupabase()
    if (!supabase) { setError('Configuration error. Please try again.'); setLoading(false); return }
    const { data, error: authErr } = await supabase.auth.signUp({ email, password })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: data.user.id, orgName: orgName.trim(), email }),
    })
    const orgData = await res.json()
    if (!res.ok) { setError(orgData.error || 'Setup failed'); setLoading(false); return }
    setApiKey(orgData.apiKey)
    setStep('onboard')
    setLoading(false)
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (step === 'onboard') return (
    <div className="auth-shell">
      <div className="auth-card fade-up" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-mark"><svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}><path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="25" cy="24" r="3.5" fill="white"/></svg></div>
          <span className="auth-brand">Logwick</span>
        </div>
        <div style={{ fontSize: 22, fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--bright)', marginBottom: 8 }}>You're in. 🎉</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.7 }}>
          Your org is set up. Here's your first API key — <strong style={{ color: 'var(--error)' }}>copy it now</strong>, it won't be shown again.
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Your API Key</div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', lineHeight: 1.6 }}>{apiKey}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={copyKey}>
            {copied ? '✓ Copied!' : 'Copy API Key'}
          </button>
          <a href="/dashboard" className="btn" style={{ flex: 1, justifyContent: 'center' }}>Go to Dashboard →</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="auth-shell">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <div className="auth-mark"><svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}><path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="25" cy="24" r="3.5" fill="white"/></svg></div>
          <span className="auth-brand">Logwick</span>
        </div>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Free forever for up to 5,000 logs/month. No credit card required.</div>
        <form onSubmit={handleSignup}>
          <div className="auth-field">
            <label className="auth-label">Organization Name</label>
            <input className="input" type="text" placeholder="Acme Corp"
              value={orgName} onChange={e => setOrgName(e.target.value)} required autoFocus/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Work Email</label>
            <input className="input" type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)} required/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="input" type="password" placeholder="Min 8 characters"
              value={password} onChange={e => setPassword(e.target.value)} required minLength={8}/>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '11px' }}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>
        <div className="auth-link">Already have an account? <a href="/login">Sign in</a></div>
      </div>
    </div>
  )
}
