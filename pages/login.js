import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { getSupabase } = await import('../lib/supabase')
    const supabase = getSupabase()
    if (!supabase) { setError('Configuration error. Please try again.'); setLoading(false); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <div className="auth-mark">▣</div>
          <span className="auth-brand">Logwick</span>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your AI audit dashboard</div>
        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="input" type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoFocus/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required/>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '11px' }}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
        <div className="auth-link">
          No account? <a href="/signup">Create one free</a>
        </div>
      </div>
    </div>
  )
}
