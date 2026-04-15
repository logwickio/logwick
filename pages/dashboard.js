import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'

const AGENT_COLORS = {
  'gpt-4o': '#10b981', 'gpt-4': '#10b981',
  'claude-3-5-sonnet': '#f97316', 'claude': '#f97316',
  'gemini-1-5-pro': '#3b82f6', 'gemini': '#3b82f6',
  'mistral': '#a855f7', 'llama': '#ec4899',
}
function agentColor(agent = '') {
  const key = Object.keys(AGENT_COLORS).find(k => agent.toLowerCase().includes(k))
  return key ? AGENT_COLORS[key] : '#60a5fa'
}
const STATUS = {
  success: { bg: '#051a0e', border: '#0a3320', text: '#34d399', dot: '#10b981' },
  error:   { bg: '#1a0505', border: '#3a0a0a', text: '#f87171', dot: '#ef4444' },
  pending: { bg: '#1a1505', border: '#3a2e0a', text: '#fbbf24', dot: '#f59e0b' },
}
function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime(), m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
function fmtTs(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '2px 8px', borderRadius: 20, background: s.bg, border: `1px solid ${s.border}`, color: s.text, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />{status}
    </span>
  )
}
function AgentTag({ agent }) {
  const color = agentColor(agent)
  return <span style={{ fontSize: 12, padding: '2px 7px', borderRadius: 4, background: color + '18', border: `1px solid ${color}33`, color, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{agent}</span>
}
function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: t.type === 'error' ? '#1a0505' : '#051a0e', border: `1px solid ${t.type === 'error' ? '#3a0a0a' : '#0a3320'}`, color: t.type === 'error' ? '#f87171' : '#34d399', padding: '10px 16px', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', maxWidth: 300 }}>
          {t.type === 'error' ? '⚠ ' : '✓ '}{t.msg}
        </div>
      ))}
    </div>
  )
}
function Spinner() {
  return <div style={{ width: 16, height: 16, border: '2px solid #0f1e28', borderTop: '2px solid #0ea5e9', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
}

export default function Dashboard() {
  const router = useRouter()
  const [view, setView] = useState('dashboard')
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPricing, setShowPricing] = useState(false)
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [logsLoading, setLogsLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [fStatus, setFStatus] = useState('all')
  const [fAgent, setFAgent] = useState('all')
  const [fAction, setFAction] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [stats, setStats] = useState(null)
  const [apiKeys, setApiKeys] = useState([])
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyResult, setNewKeyResult] = useState(null)
  const [webhooks, setWebhooks] = useState([])
  const [newWH, setNewWH] = useState({ label: '', url: '', events: ['error'] })
  const [settings, setSettings] = useState({ orgName: '', email: '', alertThreshold: 10, retentionDays: 90, slackWebhook: '' })
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  function toast(msg, type = 'success') {
    const id = ++toastId.current
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }

  useEffect(() => {
    const init = async () => {
      const { getSupabase } = await import('../lib/supabase')
      const supabase = getSupabase()
      if (!supabase) { router.push('/login'); return }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setToken(session.access_token)
      setLoading(false)
    }
    init()
  }, [router])

  const authFetch = useCallback(async (url, options = {}) => {
    if (!token) return null
    const res = await fetch(url, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }, [token])

  const fetchLogs = useCallback(async (reset = false) => {
    if (!token) return
    setLogsLoading(true)
    const params = new URLSearchParams({ limit: '50', offset: reset ? '0' : String(offset) })
    if (fStatus !== 'all') params.set('status', fStatus)
    if (fAgent !== 'all')  params.set('agent', fAgent)
    if (fAction !== 'all') params.set('action', fAction)
    if (dateFrom) params.set('from', dateFrom)
    if (dateTo)   params.set('to', dateTo)
    if (search)   params.set('search', search)
    const res = await authFetch(`/api/dashboard/logs?${params}`)
    if (!res) return
    const data = await res.json()
    if (reset) { setLogs(data.logs || []); setOffset(0) }
    else setLogs(p => [...p, ...(data.logs || [])])
    setTotal(data.total || 0)
    setLogsLoading(false)
  }, [token, fStatus, fAgent, fAction, dateFrom, dateTo, search, offset, authFetch])

  const fetchStats = useCallback(async () => {
    if (!token) return
    const res = await authFetch('/api/dashboard/stats')
    if (!res) return
    const data = await res.json()
    setStats(data)
  }, [token, authFetch])

  const fetchKeys = useCallback(async () => {
    if (!token) return
    const res = await authFetch('/api/dashboard/keys')
    if (!res) return
    const data = await res.json()
    setApiKeys(data.keys || [])
  }, [token, authFetch])

  const fetchWebhooks = useCallback(async () => {
    if (!token) return
    const res = await authFetch('/api/dashboard/webhooks')
    if (!res) return
    const data = await res.json()
    setWebhooks(data.webhooks || [])
  }, [token, authFetch])

  useEffect(() => {
    if (!token) return
    fetchStats()
    fetchLogs(true)
  }, [token])

  useEffect(() => {
    if (!token) return
    const t = setTimeout(() => fetchLogs(true), 300)
    return () => clearTimeout(t)
  }, [fStatus, fAgent, fAction, dateFrom, dateTo, search, token])

  useEffect(() => {
    if (!token) return
    if (view === 'api') fetchKeys()
    if (view === 'webhooks') fetchWebhooks()
  }, [view, token])

  async function handleDeleteLog(id) {
    await authFetch('/api/dashboard/logs', { method: 'DELETE', body: JSON.stringify({ id }) })
    setLogs(p => p.filter(l => l.id !== id))
    if (selected?.id === id) setSelected(null)
    setTotal(p => p - 1)
    toast('Entry deleted')
    fetchStats()
  }

  async function handleExportCSV() {
    if (!token) return
    const params = new URLSearchParams({ format: 'csv', limit: '1000' })
    if (fStatus !== 'all') params.set('status', fStatus)
    if (search) params.set('search', search)
    const res = await authFetch(`/api/dashboard/logs?${params}`)
    if (!res) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'logwick_logs.csv'; a.click()
    toast(`Exported records`)
  }

  async function handleGenerateKey() {
    if (!newKeyName.trim()) return
    const res = await authFetch('/api/dashboard/keys', { method: 'POST', body: JSON.stringify({ name: newKeyName.trim() }) })
    if (!res) return
    const data = await res.json()
    if (!res.ok) { toast(data.error, 'error'); return }
    setNewKeyResult(data.key)
    setNewKeyName('')
    fetchKeys()
    toast('API key generated — copy it now, shown once')
  }

  async function handleRevokeKey(id) {
    await authFetch('/api/dashboard/keys', { method: 'DELETE', body: JSON.stringify({ id }) })
    fetchKeys()
    toast('Key revoked')
  }

  async function handleAddWebhook() {
    if (!newWH.url || !newWH.label) return
    const res = await authFetch('/api/dashboard/webhooks', { method: 'POST', body: JSON.stringify(newWH) })
    if (!res || !res.ok) { toast('Failed to add webhook', 'error'); return }
    setNewWH({ label: '', url: '', events: ['error'] })
    fetchWebhooks()
    toast('Webhook added')
  }

  async function handleToggleWebhook(id, active) {
    await authFetch('/api/dashboard/webhooks', { method: 'PATCH', body: JSON.stringify({ id, active }) })
    fetchWebhooks()
  }

  async function handleDeleteWebhook(id) {
    await authFetch('/api/dashboard/webhooks', { method: 'DELETE', body: JSON.stringify({ id }) })
    fetchWebhooks()
    toast('Webhook removed')
  }

  async function handleManageSubscription() {
    const res = await authFetch('/api/billing/portal', { method: 'POST' })
    if (!res) return
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else toast('Could not open billing portal', 'error')
  }

  async function handleSignOut() {
    const { getSupabase } = await import('../lib/supabase')
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
    router.push('/login')
  }

  const agents  = [...new Set(logs.map(l => l.agent).filter(Boolean))]
  const actions = [...new Set(logs.map(l => l.action).filter(Boolean))]

  function MiniChart() {
    const daily = stats?.daily || []
    const max = Math.max(...daily.map(d => d.total), 1)
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 52 }}>
        {daily.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: '100%', background: '#0d1f2c', borderRadius: 3, height: 44, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
              <div style={{ width: '100%', background: '#0ea5e9', borderRadius: 3, height: `${Math.round((d.total / max) * 100)}%`, minHeight: d.total ? 2 : 0 }} />
            </div>
            <div style={{ fontSize: 8, color: '#4a7a90' }}>{d.date?.slice(5)}</div>
          </div>
        ))}
      </div>
    )
  }

  const S = {
    shell: { display: 'flex', height: '100vh', background: '#06090c', overflow: 'hidden' },
    nav: { width: 200, background: '#06090c', borderRight: '1px solid #0e1c26', display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0 },
    navLogo: { padding: '0 18px 20px', borderBottom: '1px solid #0e1c26', marginBottom: 16 },
    navMark: { width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', marginBottom: 8 },
    navBrand: { fontSize: 15, fontFamily: 'var(--font-sans)', fontWeight: 800, color: '#d4e8f5', letterSpacing: '0.04em' },
    navSub: { fontSize: 13, color: '#4a7a90', letterSpacing: '0.14em', textTransform: 'uppercase' },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', cursor: 'pointer', background: active ? '#0d1f2c' : 'transparent', borderLeft: active ? '2px solid #0ea5e9' : '2px solid transparent', color: active ? '#7dd3fc' : '#2a4555', fontSize: 13, transition: 'all 0.15s', userSelect: 'none' }),
    navBottom: { marginTop: 'auto', padding: '16px 18px', borderTop: '1px solid #0e1c26', display: 'flex', flexDirection: 'column', gap: 8 },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topbar: { borderBottom: '1px solid #0e1c26', padding: '13px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
    pageTitle: { fontSize: 17, fontFamily: 'var(--font-sans)', fontWeight: 700, color: '#d4e8f5' },
    statsRow: { display: 'flex', borderBottom: '1px solid #0e1c26', background: '#070d12', flexShrink: 0 },
    statCell: (last) => ({ padding: '16px 20px', borderRight: last ? 'none' : '1px solid #0e1c26', flex: 1, minWidth: 0 }),
    statLabel: { fontSize: 13, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 },
    statVal: { fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-sans)', color: '#d4e8f5', letterSpacing: '-0.02em', lineHeight: 1 },
    statSub: { fontSize: 13, color: '#4a7a90', marginTop: 3 },
    content: { flex: 1, overflow: 'hidden', display: 'flex' },
    logPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: selected ? '1px solid #0e1c26' : 'none' },
    toolbar: { padding: '10px 14px', display: 'flex', gap: 7, borderBottom: '1px solid #0e1c26', background: '#070d12', flexWrap: 'wrap', flexShrink: 0 },
    searchBox: { flex: 1, minWidth: 140, background: '#0a1820', border: '1px solid #0e1c26', borderRadius: 6, padding: '7px 12px', color: '#b8cdd8', fontSize: 13, outline: 'none' },
    sel: { background: '#0a1820', border: '1px solid #0e1c26', borderRadius: 6, padding: '7px 10px', color: '#b8cdd8', fontSize: 13, outline: 'none', cursor: 'pointer' },
    countBar: { padding: '6px 16px', fontSize: 13, color: '#4a7a90', borderBottom: '1px solid #080f14', display: 'flex', justifyContent: 'space-between', background: '#06090c', flexShrink: 0 },
    logList: { overflowY: 'auto', flex: 1 },
    logRow: (sel) => ({ padding: '11px 16px', borderBottom: '1px solid #080f14', cursor: 'pointer', background: sel ? '#0a1820' : 'transparent', borderLeft: sel ? '3px solid #0ea5e9' : '3px solid transparent', transition: 'background 0.1s' }),
    detail: { width: '44%', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 },
    detailScroll: { overflowY: 'auto', flex: 1, padding: 18 },
    block: { background: '#07101a', border: '1px solid #0e1c26', borderRadius: 8, overflow: 'hidden', marginBottom: 10 },
    blockHead: { padding: '8px 14px', borderBottom: '1px solid #0a1820', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase' },
    blockBody: { padding: '12px 14px', fontSize: 13, color: '#94b8cc', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
    metaCell: { padding: '9px 14px', borderBottom: '1px solid #0a1820' },
    metaK: { fontSize: 13, color: '#4a7a90', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 },
    metaV: { fontSize: 13, color: '#94b8cc' },
    sidebar: { width: 240, borderLeft: '1px solid #0e1c26', padding: 16, overflowY: 'auto', flexShrink: 0 },
    sideLabel: { fontSize: 13, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 },
    scrollContent: { flex: 1, overflowY: 'auto', padding: 24 },
    block2: { background: '#07101a', border: '1px solid #0e1c26', borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(6px)' },
    modal: { background: '#0a1218', border: '1px solid #1c2e3a', borderRadius: 12, padding: 24, width: 460, maxWidth: '92vw', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '85vh', overflowY: 'auto' },
    fLabel: { fontSize: 13, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 },
    fInput: { width: '100%', background: '#07101a', border: '1px solid #0e1c26', borderRadius: 6, padding: '8px 12px', color: '#b8cdd8', fontSize: 13, outline: 'none' },
    fSel: { width: '100%', background: '#07101a', border: '1px solid #0e1c26', borderRadius: 6, padding: '8px 12px', color: '#b8cdd8', fontSize: 13, outline: 'none', cursor: 'pointer' },
    fTA: { width: '100%', background: '#07101a', border: '1px solid #0e1c26', borderRadius: 6, padding: '8px 12px', color: '#b8cdd8', fontSize: 13, outline: 'none', minHeight: 70, resize: 'vertical' },
  }

  function btn(variant = 'default', extra = {}) {
    return { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 600, letterSpacing: '0.04em', border: variant === 'primary' ? 'none' : variant === 'danger' ? '1px solid #2e1010' : '1px solid #1c2e3a', background: variant === 'primary' ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : 'transparent', color: variant === 'primary' ? '#fff' : variant === 'danger' ? '#ef4444' : '#4a7a90', ...extra }
  }

  const navItems = [
    { id: 'dashboard', icon: '⬛', label: 'Dashboard' },
    { id: 'api',       icon: '⟨/⟩', label: 'API Docs'  },
    { id: 'webhooks',  icon: '⚡',   label: 'Webhooks'  },
    { id: 'settings',  icon: '⚙',    label: 'Settings'  },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06090c' }}>
      <Spinner />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  function renderDashboard() {
    return (
      <>
        <div style={S.statsRow}>
          {[
            { label: 'Total Logs', value: (stats?.total ?? 0).toLocaleString(), sub: `${stats?.monthly_used ?? 0} this month` },
            { label: 'Success Rate', value: stats ? `${stats.success_rate}%` : '—', sub: 'last 30 days' },
            { label: 'Error Rate', value: stats ? `${stats.error_rate}%` : '—', sub: 'flagged events', accent: stats?.error_rate > 10 ? '#f87171' : undefined },
            { label: 'Avg Latency', value: stats ? `${stats.avg_latency}ms` : '—', sub: 'response time' },
            { label: 'Token Spend', value: stats ? (stats.total_tokens ?? 0).toLocaleString() : '—', sub: 'tokens processed' },
            { label: 'Total Cost', value: stats ? `$${Number(stats.total_cost ?? 0).toFixed(4)}` : '—', sub: 'estimated spend', accent: '#34d399' },
          ].map((s, i, arr) => (
            <div key={i} style={S.statCell(i === arr.length - 1)}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={{ ...S.statVal, color: s.accent || '#d4e8f5' }}>{s.value}</div>
              <div style={S.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={S.content}>
          <div style={S.logPanel}>
            <div style={S.toolbar}>
              <input style={S.searchBox} placeholder="Search logs…" value={search} onChange={e => setSearch(e.target.value)} />
              <select style={S.sel} value={fStatus} onChange={e => setFStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="pending">Pending</option>
              </select>
              <select style={S.sel} value={fAgent} onChange={e => setFAgent(e.target.value)}>
                <option value="all">All Agents</option>
                {agents.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select style={S.sel} value={fAction} onChange={e => setFAction(e.target.value)}>
                <option value="all">All Actions</option>
                {actions.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <input type="date" style={{ ...S.sel, fontSize: 10 }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <input type="date" style={{ ...S.sel, fontSize: 10 }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              <button style={btn()} onClick={handleExportCSV}>↓ CSV</button>
            </div>
            <div style={S.countBar}>
              <span>{total.toLocaleString()} entries{logsLoading ? ' · loading…' : ''}</span>
              {(search || fStatus !== 'all' || fAgent !== 'all' || fAction !== 'all' || dateFrom || dateTo) && (
                <span style={{ cursor: 'pointer', color: '#5a8a9f' }} onClick={() => { setSearch(''); setFStatus('all'); setFAgent('all'); setFAction('all'); setDateFrom(''); setDateTo('') }}>× clear filters</span>
              )}
            </div>
            <div style={S.logList}>
              {logs.length === 0 && !logsLoading ? (
                <div style={{ padding: 48, textAlign: 'center', color: '#4a7a90', fontSize: 12 }}>No logs yet. Use your API key to start ingesting events.</div>
              ) : logs.map(log => (
                <div key={log.id} style={S.logRow(selected?.id === log.id)} onClick={() => setSelected(p => p?.id === log.id ? null : log)}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#c4dde8', fontFamily: 'var(--font-sans)' }}>{log.action}</span>
                        <AgentTag agent={log.agent} />
                        <StatusPill status={log.status} />
                      </div>
                      <div style={{ fontSize: 12, color: '#4a7a90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', marginBottom: 3 }}>{log.input}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#4a7a90' }}>
                        <span>{timeAgo(log.created_at)}</span>
                        {log.tokens && <span>{log.tokens} tok</span>}
                        {log.latency_ms && <span>{log.latency_ms}ms</span>}
                        {log.cost_usd && <span>${Number(log.cost_usd).toFixed(4)}</span>}
                        {log.user_ref && <span>{log.user_ref}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {logs.length < total && (
                <div style={{ padding: 16, textAlign: 'center' }}>
                  <button style={btn()} onClick={() => { setOffset(logs.length); fetchLogs(false) }}>
                    {logsLoading ? <Spinner /> : `Load more (${total - logs.length} remaining)`}
                  </button>
                </div>
              )}
            </div>
          </div>
          {selected ? (
            <div style={S.detail}>
              <div style={{ padding: '11px 14px', borderBottom: '1px solid #0e1c26', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#07101a', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#d4e8f5', fontFamily: 'var(--font-sans)' }}>{selected.action}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={btn('danger')} onClick={() => handleDeleteLog(selected.id)}>Delete</button>
                  <button style={btn()} onClick={() => setSelected(null)}>✕</button>
                </div>
              </div>
              <div style={S.detailScroll}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  <StatusPill status={selected.status} />
                  <AgentTag agent={selected.agent} />
                </div>
                <div style={S.block}>
                  <div style={S.blockHead}><span>Metadata</span></div>
                  <div style={S.metaGrid}>
                    {[['Log ID', selected.id], ['Timestamp', fmtTs(selected.created_at)], ['User', selected.user_ref || '—'], ['Latency', selected.latency_ms ? `${selected.latency_ms}ms` : '—'], ['Tokens', selected.tokens ?? '—'], ['Cost', selected.cost_usd ? `$${Number(selected.cost_usd).toFixed(4)}` : '—']].map(([k, v]) => (
                      <div key={k} style={S.metaCell}>
                        <div style={S.metaK}>{k}</div>
                        <div style={{ ...S.metaV, color: k === 'Cost' ? '#34d399' : undefined, wordBreak: 'break-all' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {selected.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                    {selected.tags.map(t => <span key={t} style={{ fontSize: 13, padding: '2px 7px', borderRadius: 4, background: '#0a1820', color: '#5a8a9f', border: '1px solid #0e1c26' }}>#{t}</span>)}
                  </div>
                )}
                {selected.input && <div style={S.block}><div style={S.blockHead}><span>Input</span></div><div style={S.blockBody}>{selected.input}</div></div>}
                {selected.output && <div style={S.block}><div style={S.blockHead}><span>Output</span><StatusPill status={selected.status} /></div><div style={S.blockBody}>{selected.output}</div></div>}
              </div>
            </div>
          ) : (
            <div style={S.sidebar}>
              <div style={{ marginBottom: 20 }}>
                <div style={S.sideLabel}>Activity (7 days)</div>
                <MiniChart />
              </div>
              {stats?.agents?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={S.sideLabel}>By Agent</div>
                  {stats.agents.slice(0, 6).map(a => (
                    <div key={a.agent} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                      <div style={{ fontSize: 13, color: agentColor(a.agent), width: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.agent}</div>
                      <div style={{ flex: 1, height: 5, background: '#0d1f2c', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${(a.total / (stats.agents[0]?.total || 1)) * 100}%`, background: agentColor(a.agent), borderRadius: 3 }} />
                      </div>
                      <div style={{ fontSize: 13, color: '#4a7a90', width: 24, textAlign: 'right' }}>{a.total}</div>
                    </div>
                  ))}
                </div>
              )}
              {stats?.monthly_limit && (
                <div>
                  <div style={S.sideLabel}>Plan Usage</div>
                  <div style={{ fontSize: 13, color: '#5a8a9f', marginBottom: 6 }}>{stats.monthly_used?.toLocaleString()} / {stats.monthly_limit?.toLocaleString()}</div>
                  <div style={{ height: 5, background: '#0d1f2c', borderRadius: 3 }}>
                    <div style={{ height: '100%', borderRadius: 3, background: stats.monthly_used / stats.monthly_limit > 0.8 ? '#ef4444' : '#0ea5e9', width: `${Math.min(100, (stats.monthly_used / stats.monthly_limit) * 100)}%` }} />
                  </div>
                  <div style={{ fontSize: 13, color: '#4a7a90', marginTop: 4 }}>{stats.org_plan} plan</div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    )
  }

  function renderAPI() {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://logwick.vercel.app'
    return (
      <div style={S.scrollContent}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-sans)', fontWeight: 800, color: '#d4e8f5', marginBottom: 6 }}>API Reference</div>
          <div style={{ fontSize: 13, color: '#5a8a9f', marginBottom: 24, lineHeight: 1.7 }}>
            Base URL: <span style={{ color: '#0ea5e9' }}>{origin}/api/v1</span><br />
            Auth: <code style={{ color: '#94b8cc' }}>Authorization: Bearer sk-lw-...</code>
          </div>
          <div style={{ ...S.block2 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #0a1820', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#d4e8f5', fontFamily: 'var(--font-sans)' }}>API Keys</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input style={{ ...S.fInput, width: 140, padding: '5px 10px' }} placeholder="Key name…" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
                <button style={btn('primary')} onClick={handleGenerateKey}>Generate</button>
              </div>
            </div>
            {newKeyResult && (
              <div style={{ margin: '12px 16px', padding: '12px 14px', background: '#051a0e', border: '1px solid #0a3320', borderRadius: 6 }}>
                <div style={{ fontSize: 13, color: '#4a7a90', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Key — Copy now, shown once</div>
                <div style={{ fontSize: 13, color: '#34d399', wordBreak: 'break-all', marginBottom: 8 }}>{newKeyResult}</div>
                <button style={btn()} onClick={() => { navigator.clipboard.writeText(newKeyResult); toast('Copied!') }}>Copy</button>
                <button style={{ ...btn(), marginLeft: 6 }} onClick={() => setNewKeyResult(null)}>Dismiss</button>
              </div>
            )}
            {apiKeys.map(k => (
              <div key={k.id} style={{ padding: '12px 16px', borderBottom: '1px solid #0a1820', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#b8cdd8', fontFamily: 'var(--font-sans)', marginBottom: 3 }}>{k.name}</div>
                  <div style={{ fontSize: 12, color: '#4a7a90' }}>{k.key_prefix}… · {k.call_count?.toLocaleString() ?? 0} calls · Last used {k.last_used_at ? timeAgo(k.last_used_at) : 'never'}</div>
                </div>
                <button style={btn('danger')} onClick={() => handleRevokeKey(k.id)}>Revoke</button>
              </div>
            ))}
          </div>
          {[
            { method: 'POST', path: '/v1/logs', title: 'Ingest a log', code: `curl -X POST ${origin}/api/v1/logs \\\n  -H "Authorization: Bearer sk-lw-your-key" \\\n  -H "Content-Type: application/json" \\\n  -d '{"agent":"gpt-4o","action":"email_draft","status":"success","input":"...","output":"...","tokens":312,"latency_ms":1842}'` },
            { method: 'GET', path: '/v1/logs', title: 'Query logs', code: `curl "${origin}/api/v1/logs?status=error&limit=50" \\\n  -H "Authorization: Bearer sk-lw-your-key"` },
            { method: 'GET', path: '/v1/stats', title: 'Get statistics', code: `curl "${origin}/api/v1/stats?days=30" \\\n  -H "Authorization: Bearer sk-lw-your-key"` },
          ].map((ep, i) => (
            <div key={i} style={S.block2}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #0a1820', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: ep.method === 'POST' ? '#0a2010' : '#0a1a30', color: ep.method === 'POST' ? '#34d399' : '#60a5fa' }}>{ep.method}</span>
                  <code style={{ fontSize: 13, color: '#94b8cc' }}>{ep.path}</code>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#b8cdd8', fontFamily: 'var(--font-sans)' }}>{ep.title}</span>
                </div>
                <button style={btn()} onClick={() => { navigator.clipboard.writeText(ep.code); toast('Copied') }}>Copy</button>
              </div>
              <pre style={{ padding: '16px', fontSize: 12, color: '#94b8cc', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>{ep.code}</pre>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderWebhooks() {
    return (
      <div style={S.scrollContent}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-sans)', fontWeight: 800, color: '#d4e8f5', marginBottom: 6 }}>Webhooks</div>
          <div style={{ fontSize: 13, color: '#5a8a9f', marginBottom: 24, lineHeight: 1.7 }}>POST to your endpoints when matching events are ingested.</div>
          <div style={{ ...S.block2, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#b8cdd8', fontFamily: 'var(--font-sans)', marginBottom: 12 }}>Add Webhook</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div><div style={S.fLabel}>Label</div><input style={S.fInput} placeholder="Slack alerts" value={newWH.label} onChange={e => setNewWH(p => ({ ...p, label: e.target.value }))} /></div>
              <div><div style={S.fLabel}>Trigger On</div>
                <select style={S.fSel} value={newWH.events[0]} onChange={e => setNewWH(p => ({ ...p, events: [e.target.value] }))}>
                  <option value="error">Errors only</option>
                  <option value="success">Successes</option>
                  <option value="all">All events</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}><div style={S.fLabel}>Endpoint URL</div><input style={S.fInput} placeholder="https://hooks.slack.com/…" value={newWH.url} onChange={e => setNewWH(p => ({ ...p, url: e.target.value }))} /></div>
            <button style={btn('primary')} onClick={handleAddWebhook}>Add Webhook</button>
          </div>
          {webhooks.map(w => (
            <div key={w.id} style={{ ...S.block2, marginBottom: 8 }}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#b8cdd8', fontFamily: 'var(--font-sans)' }}>{w.label}</span>
                    <span style={{ fontSize: 13, padding: '2px 6px', borderRadius: 4, background: w.active ? '#051a0e' : '#0d0d0d', color: w.active ? '#34d399' : '#2a4555', border: `1px solid ${w.active ? '#0a3320' : '#1c2e3a'}`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{w.active ? 'active' : 'paused'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4a7a90', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.url}</div>
                </div>
                <button style={btn()} onClick={() => handleToggleWebhook(w.id, !w.active)}>{w.active ? 'Pause' : 'Enable'}</button>
                <button style={btn('danger')} onClick={() => handleDeleteWebhook(w.id)}>Remove</button>
              </div>
            </div>
          ))}
          {webhooks.length === 0 && <div style={{ fontSize: 13, color: '#4a7a90', padding: '20px 0' }}>No webhooks yet.</div>}
        </div>
      </div>
    )
  }

  function renderSettings() {
    return (
      <div style={S.scrollContent}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-sans)', fontWeight: 800, color: '#d4e8f5', marginBottom: 24 }}>Settings</div>
          <div style={{ ...S.block2, marginBottom: 16 }}>
            <div style={{ padding: '9px 16px', borderBottom: '1px solid #0a1820', fontSize: 13, color: '#4a7a90', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Plan</div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#7dd3fc', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', marginBottom: 8 }}>{stats?.org_plan || 'free'}</div>
              <div style={{ fontSize: 13, color: '#5a8a9f', marginBottom: 12 }}>{stats?.monthly_used?.toLocaleString() ?? 0} / {stats?.monthly_limit?.toLocaleString() ?? 5000} logs this month</div>
              <button style={{ ...btn('primary'), display: 'inline-flex' }} onClick={() => setShowPricing(true)}>Upgrade plan →</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn()} onClick={handleManageSubscription}>Manage subscription</button>
              <button style={btn('danger')} onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.shell}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <Toast toasts={toasts} />
      {showPricing && (
        <div style={S.overlay} onClick={e => e.target === e.currentTarget && setShowPricing(false)}>
          <div style={{...S.modal, maxWidth: 560, gap: 0, padding: 0, overflow: 'hidden'}}>
            <div style={{padding: '20px 24px', borderBottom: '1px solid #1c2e3a'}}>
              <div style={{fontSize: 18, fontFamily: 'var(--font-sans)', fontWeight: 800, color: '#d4e8f5', marginBottom: 4}}>Upgrade to Pro</div>
              <div style={{fontSize: 12, color: '#4a7a90'}}>Everything you need to run AI agents in production with full visibility.</div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#1c2e3a'}}>
              <div style={{background: '#07101a', padding: '20px 24px'}}>
                <div style={{fontSize: 11, fontWeight: 700, color: '#4a7a90', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12}}>Free</div>
                <div style={{fontSize: 28, fontWeight: 800, color: '#d4e8f5', fontFamily: 'var(--font-sans)', marginBottom: 16}}>$0<span style={{fontSize: 13, fontWeight: 400, color: '#4a7a90'}}>/mo</span></div>
                {['5,000 logs/month','7-day retention','1 API key','Dashboard & search'].map(f => (
                  <div key={f} style={{fontSize: 12, color: '#4a7a90', marginBottom: 8, display: 'flex', gap: 8}}><span style={{color: '#34d399'}}>✓</span>{f}</div>
                ))}
                {['Webhooks','CSV export'].map(f => (
                  <div key={f} style={{fontSize: 12, color: '#2a4555', marginBottom: 8, display: 'flex', gap: 8}}><span>—</span>{f}</div>
                ))}
              </div>
              <div style={{background: '#08111c', padding: '20px 24px', border: '1px solid #0ea5e9', position: 'relative'}}>
                <div style={{position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#0ea5e9', borderRadius: 20, padding: '2px 12px', fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase'}}>Most popular</div>
                <div style={{fontSize: 11, fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12}}>Pro</div>
                <div style={{fontSize: 28, fontWeight: 800, color: '#d4e8f5', fontFamily: 'var(--font-sans)', marginBottom: 16}}>$29<span style={{fontSize: 13, fontWeight: 400, color: '#4a7a90'}}>/mo</span></div>
                {['100,000 logs/month','90-day retention','10 API keys','Dashboard & search','Unlimited webhooks','CSV export'].map(f => (
                  <div key={f} style={{fontSize: 12, color: '#94b8cc', marginBottom: 8, display: 'flex', gap: 8}}><span style={{color: '#34d399'}}>✓</span>{f}</div>
                ))}
              </div>
            </div>
            <div style={{padding: '20px 24px', display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid #1c2e3a'}}>
              <button style={btn()} onClick={() => setShowPricing(false)}>Maybe later</button>
              <a href="https://buy.stripe.com/fZu3co57kgpt1j72xYcIE00"><button style={btn('primary')} onClick={() => setShowPricing(false)}>Upgrade to Pro →</button></a>
            </div>
          </div>
        </div>
      )}
      <div style={S.nav}>
        <div style={S.navLogo}>
          <div style={S.navMark}>▣</div>
          <div style={S.navBrand}>Logwick</div>
          <div style={S.navSub}>Leave a trail.</div>
        </div>
        {navItems.map(n => (
          <div key={n.id} style={S.navItem(view === n.id)} onClick={() => { setView(n.id); setSelected(null) }}>
            <span style={{ width: 16, textAlign: 'center' }}>{n.icon}</span>{n.label}
          </div>
        ))}
        <div style={S.navBottom}>
          <div style={{ fontSize: 12, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stats?.org_plan || 'free'} plan</div>
          <div style={{ fontSize: 13, color: '#4a7a90', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite', boxShadow: '0 0 5px #10b981', display: 'inline-block' }} />
            {total.toLocaleString()} records
          </div>
        </div>
      </div>
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.pageTitle}>{navItems.find(n => n.id === view)?.label}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {view === 'dashboard' && <button style={btn()} onClick={handleExportCSV}>↓ Export CSV</button>}
            {view === 'dashboard' && <button style={btn()} onClick={() => { fetchLogs(true); fetchStats() }}>{logsLoading ? <Spinner /> : '↻ Refresh'}</button>}
          </div>
        </div>
        {view === 'dashboard' && renderDashboard()}
        {view === 'api'       && <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>{renderAPI()}</div>}
        {view === 'webhooks'  && <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>{renderWebhooks()}</div>}
        {view === 'settings'  && <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>{renderSettings()}</div>}
      </div>
    </div>
  )
}
