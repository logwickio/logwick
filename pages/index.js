import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

const EVENTS = [
  { action:'email_draft', agent:'GPT-4o', color:'#10b981', status:'success', tokens:312, lat:1842, user:'ops@acme.com', input:'Draft follow-up email to client re invoice #4821' },
  { action:'data_analysis', agent:'Claude 3.5', color:'#f97316', status:'success', tokens:891, lat:3210, user:'cfo@acme.com', input:'Summarize Q3 revenue trends from spreadsheet' },
  { action:'code_generation', agent:'Gemini 1.5', color:'#3b82f6', status:'error', tokens:88, lat:990, user:'dev@acme.com', input:'Write function to scrape competitor prices' },
  { action:'document_review', agent:'GPT-4o', color:'#10b981', status:'success', tokens:1204, lat:4100, user:'legal@acme.com', input:'Review NDA draft and flag unusual clauses' },
  { action:'customer_support', agent:'Claude 3.5', color:'#f97316', status:'success', tokens:203, lat:1550, user:'support@acme.com', input:'Customer account locked 3 days, no resolution' },
  { action:'content_moderation', agent:'Gemini 1.5', color:'#3b82f6', status:'success', tokens:145, lat:820, user:'ops@acme.com', input:'Review user-generated post before publishing' },
  { action:'summarization', agent:'GPT-4o', color:'#10b981', status:'success', tokens:677, lat:2200, user:'cfo@acme.com', input:'Summarize 12 meeting transcripts into brief' },
  { action:'classification', agent:'Claude 3.5', color:'#f97316', status:'error', tokens:44, lat:600, user:'dev@acme.com', input:'Classify 200 support tickets by urgency' },
]

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  return `${m}m ago`
}

function LiveDemo() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({ total: 0, errors: 0, rate: null, avgLat: null })
  const [detail, setDetail] = useState(null)
  const [caption, setCaption] = useState('Watching for incoming AI events…')
  const [visibleIds, setVisibleIds] = useState(new Set())
  const latencies = useRef([])
  const eventIndex = useRef(0)
  const captionPhase = useRef(0)
  const detailOpened = useRef(false)
  const timers = useRef([])

  const CAPTIONS = [
    (e) => `New event ingested via API → ${e.agent} ran ${e.action.replace(/_/g,' ')}`,
    (e) => `Status: ${e.status} · ${e.tokens} tokens · ${e.lat}ms latency`,
    () => `Click any row to inspect the full prompt and response`,
    () => `All events are searchable, filterable, and exportable`,
  ]

  function addLog(ev) {
    const id = Date.now() + Math.random()
    const log = { ...ev, ts: Date.now(), id }
    setLogs(prev => [log, ...prev].slice(0, 6))
    setVisibleIds(prev => new Set([...prev, id]))
    latencies.current.push(ev.lat)
    setStats(prev => {
      const total = prev.total + 1
      const errors = prev.errors + (ev.status === 'error' ? 1 : 0)
      const avg = Math.round(latencies.current.reduce((a,b)=>a+b,0) / latencies.current.length)
      return { total, errors, rate: Math.round(((total-errors)/total)*100), avgLat: avg }
    })
    setCaption(CAPTIONS[captionPhase.current % CAPTIONS.length](ev))
    captionPhase.current++
  }

  function step() {
    const ev = EVENTS[eventIndex.current % EVENTS.length]
    eventIndex.current++
    addLog(ev)
    if (eventIndex.current === 4 && !detailOpened.current) {
      const t = setTimeout(() => {
        setDetail(ev)
        setCaption('Click any row to inspect → full prompt, output, metadata')
        detailOpened.current = true
      }, 900)
      timers.current.push(t)
    }
  }

  useEffect(() => {
    const t1 = setTimeout(() => step(), 500)
    const t2 = setTimeout(() => step(), 2000)
    const t3 = setTimeout(() => step(), 3500)
    const t4 = setTimeout(() => step(), 5000)
    const t5 = setTimeout(() => step(), 6500)
    const t6 = setTimeout(() => step(), 8000)
    const iv = setInterval(() => step(), 3400)
    timers.current.push(t1,t2,t3,t4,t5,t6,iv)
    return () => timers.current.forEach(t => { clearTimeout(t); clearInterval(t) })
  }, [])

  const s = {
    wrap: { fontFamily:"'JetBrains Mono',monospace", background:'#0a0f14', borderRadius:12, overflow:'hidden', border:'1px solid #1e3040', maxWidth:820, margin:'0 auto' },
    bar: { background:'#070c10', padding:'10px 14px', borderBottom:'1px solid #1e3040', display:'flex', alignItems:'center', gap:8 },
    url: { flex:1, background:'rgba(56,189,248,0.05)', border:'1px solid #1e3040', borderRadius:4, padding:'3px 10px', fontSize:10, color:'#64748b', textAlign:'center' },
    body: { display:'flex', height:320 },
    nav: { width:130, background:'#07100a', borderRight:'1px solid #1e3040', padding:'12px 0', flexShrink:0 },
    logo: { padding:'0 12px 12px', borderBottom:'1px solid #1e3040', marginBottom:10 },
    mark: { width:22, height:22, borderRadius:5, background:'linear-gradient(135deg,#38bdf8,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff', marginBottom:4 },
    brand: { fontSize:11, fontWeight:700, color:'#f1f5f9', letterSpacing:'0.04em' },
    sub: { fontSize:8, color:'#a8c8dc', letterSpacing:'0.12em', textTransform:'uppercase' },
    navItem: (active) => ({ padding:'6px 12px', fontSize:9, color: active ? '#ffffff':'#a8c8dc', background: active ? '#0d1923':'transparent', borderLeft: active ? '2px solid #38bdf8':'2px solid transparent', display:'flex', alignItems:'center', gap:6 }),
    main: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
    statsRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom:'1px solid #1e3040', background:'#07100a', flexShrink:0 },
    stat: (last) => ({ padding:'8px 10px', borderRight: last ? 'none':'1px solid #1e3040' }),
    sl: { fontSize:8, color:'#a8c8dc', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:2 },
    sv: { fontSize:15, fontWeight:700, color:'#f1f5f9' },
    toolbar: { padding:'6px 10px', borderBottom:'1px solid #1e3040', background:'#07100a', display:'flex', gap:5, alignItems:'center', flexShrink:0 },
    search: { flex:1, background:'#0a1520', border:'1px solid #1e3040', borderRadius:4, padding:'3px 8px', fontSize:9, color:'#94a3b8' },
    filter: { background:'#0a1520', border:'1px solid #1e3040', borderRadius:4, padding:'3px 7px', fontSize:9, color:'#64748b' },
    logList: { flex:1, overflow:'hidden' },
    logRow: (isNew) => ({ padding:'8px 10px', borderBottom:'1px solid #0d1923', display:'flex', alignItems:'flex-start', gap:7, cursor:'pointer', background: isNew ? 'rgba(56,189,248,0.03)':'transparent', transition:'background 0.3s' }),
    action: { fontSize:10, fontWeight:600, color:'#cbd5e1', marginBottom:2 },
    meta: { fontSize:8, color:'#a8c8dc' },
    badge: (status) => ({ fontSize:7, padding:'2px 5px', borderRadius:3, fontWeight:700, letterSpacing:'0.05em', flexShrink:0, marginTop:1, background: status==='success'?'#0a2010':'#1a0505', color: status==='success'?'#34d399':'#f87171', border: `1px solid ${status==='success'?'#0a3320':'#3a0a0a'}` }),
    agentBadge: (color) => ({ fontSize:7, padding:'2px 5px', borderRadius:3, fontWeight:700, flexShrink:0, marginTop:1, background:`${color}18`, color, border:`1px solid ${color}33` }),
    detail: (open) => ({ width: open ? 170 : 0, background:'#07100a', borderLeft:'1px solid #1e3040', overflow:'hidden', flexShrink:0, transition:'width 0.3s ease' }),
    detailInner: { padding:12, width:170 },
    detailTitle: { fontSize:10, fontWeight:600, color:'#f1f5f9', marginBottom:8, borderBottom:'1px solid #1e3040', paddingBottom:6 },
    dk: { fontSize:7, color:'#a8c8dc', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:2 },
    dv: { fontSize:9, color:'#94a3b8', marginBottom:6 },
    caption: { background:'#0a0f14', borderTop:'1px solid #1e3040', padding:'8px 14px', fontSize:10, color:'#64748b', textAlign:'center', minHeight:34, display:'flex', alignItems:'center', justifyContent:'center' },
    liveDot: { width:5, height:5, borderRadius:'50%', background:'#34d399', boxShadow:'0 0 4px #34d399', display:'inline-block', marginRight:5, animation:'pulse 2s infinite' },
  }

  return (
    <div style={s.wrap}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}} .log-anim{animation:fadeIn 0.35s ease both}`}</style>
      <div style={s.bar}>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#ef4444'}}/>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#f59e0b'}}/>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#10b981'}}/>
        <div style={s.url}>app.logwick.io/dashboard</div>
      </div>

      <div style={s.body}>
        {/* Nav */}
        <div style={s.nav}>
          <div style={s.logo}>
            <div style={s.mark}>
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
              <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="25" cy="24" r="3.5" fill="white"/>
            </svg>
          </div>
            <div style={s.brand}>Logwick</div>
            <div style={s.sub}>Leave a trail.</div>
          </div>
          {[['⬛','Dashboard',true],['⟨/⟩','API Docs',false],['⚡','Webhooks',false],['⚙','Settings',false]].map(([icon,label,active]) => (
            <div key={label} style={s.navItem(active)}><span>{icon}</span>{label}</div>
          ))}
        </div>

        {/* Main */}
        <div style={s.main}>
          {/* Stats */}
          <div style={s.statsRow}>
            {[
              ['Total Logs', stats.total || 0, '#f1f5f9'],
              ['Success Rate', stats.rate != null ? `${stats.rate}%` : '—', '#34d399'],
              ['Errors', stats.errors, '#f87171'],
              ['Avg Latency', stats.avgLat != null ? `${stats.avgLat}ms` : '—', '#f1f5f9'],
            ].map(([label,val,color],i) => (
              <div key={label} style={s.stat(i===3)}>
                <div style={s.sl}>{label}</div>
                <div style={{...s.sv, color}}>{val}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <div style={s.search}>Search logs…</div>
            <div style={s.filter}>All status ▾</div>
            <div style={s.filter}>All agents ▾</div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',fontSize:8,color:'#a8c8dc'}}>
              <span style={s.liveDot}/>Live
            </div>
          </div>

          {/* Log list + detail */}
          <div style={{display:'flex',flex:1,overflow:'hidden'}}>
            <div style={s.logList}>
              {logs.map((log, i) => (
                <div key={log.id} className="log-anim" style={s.logRow(i===0)} onClick={() => setDetail(log)}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={s.action}>{log.action.replace(/_/g,' ')}</div>
                    <div style={s.meta}>{log.user} · {log.tokens} tok · {log.lat}ms · {timeAgo(log.ts)}</div>
                  </div>
                  <span style={s.agentBadge(log.color)}>{log.agent}</span>
                  <span style={s.badge(log.status)}>{log.status}</span>
                </div>
              ))}
            </div>

            {/* Detail pane */}
            <div style={s.detail(!!detail)}>
              {detail && (
                <div style={s.detailInner}>
                  <div style={s.detailTitle}>{detail.action.replace(/_/g,' ')}</div>
                  {[
                    ['Agent', detail.agent],
                    ['Status', detail.status],
                    ['Tokens', detail.tokens],
                    ['Latency', `${detail.lat}ms`],
                    ['User', detail.user],
                    ['Input', detail.input],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <div style={s.dk}>{k}</div>
                      <div style={{...s.dv, color: k==='Status' ? (detail.status==='success'?'#34d399':'#f87171') : '#94a3b8', wordBreak:'break-word', lineHeight:1.5}}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div style={s.caption}>{caption}</div>
    </div>
  )
}

const DOCS_MSG = `Here are the Logwick docs:

INSTALL
npm install logwick

QUICK START
import { LogwickClient } from 'logwick'
const logwick = new LogwickClient({ apiKey: process.env.LOGWICK_API_KEY })
logwick.fire({ agent: 'gpt-4o', action: 'my_action', status: 'success', input: userPrompt, output: result, tokens: 312 })

OPENAI WRAPPER
const result = await logwick.openai(() => openai.chat.completions.create({ model: 'gpt-4o', messages }), { action: 'email_draft', user: req.user.email })

ANTHROPIC WRAPPER
const result = await logwick.anthropic(() => anthropic.messages.create({ model: 'claude-3-5-sonnet-20241022', messages, max_tokens: 1024 }), { action: 'document_review' })

PYTHON
import logwick
logwick.init(api_key='your-key')
logwick.fire({ 'agent': 'gpt-4o', 'action': 'my_action', 'status': 'success', 'input': prompt, 'output': result })

Now add Logwick to my project.`

function HeroCopyBtn() {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(DOCS_MSG).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }).catch(() => {
        const ta = document.createElement('textarea')
        ta.value = DOCS_MSG
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      })
    }
  }
  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
        background: copied ? 'rgba(52,211,153,0.1)' : 'rgba(14,165,233,0.08)',
        border: copied ? '1px solid #34d399' : '1px solid rgba(14,165,233,0.3)',
        borderRadius: 8, color: copied ? '#34d399' : '#38bdf8',
        fontSize: 13, fontFamily: "'JetBrains Mono',monospace",
        cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none',
        outline: 'none', width: '100%', justifyContent: 'center',
        letterSpacing: '0.02em'
      }}
    >
      {copied ? '✓ Copied — paste into your AI assistant' : '⊕ Copy docs for your AI assistant'}
    </button>
  )
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { getSupabase } = await import('../lib/supabase')
      const supabase = getSupabase()
      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.replace('/dashboard')
    }
    check()
  }, [router])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#0a0f14;--surface:#0f1923;--border:#1e3040;
          --accent:#38bdf8;--text:#cbd5e1;--muted:#8bafc4;
          --bright:#f1f5f9;--success:#34d399;
        }
        body{background:var(--bg);color:var(--text);font-family:'JetBrains Mono',monospace;overflow-x:hidden;}
        a{color:inherit;text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;transition:all 0.3s;}
        nav.scrolled{background:rgba(10,15,20,0.92);border-bottom:1px solid var(--border);backdrop-filter:blur(12px);}
        .nlogo{display:flex;align-items:center;gap:10px;}
        .nmark{width:32px;height:32px;border-radius:7px;background:linear-gradient(135deg,var(--accent),#0284c7);display:flex;align-items:center;justify-content:center;padding:6px;overflow:hidden;}
        .nbrand{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--bright);}
        .nlinks{display:flex;gap:24px;align-items:center;}
        .nlinks a{font-size:11px;color:#8bafc4;letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s;}
        .nlinks a:hover{color:var(--text);}
        .ncta{padding:7px 16px;background:var(--accent);border-radius:6px;font-size:11px;font-weight:600;color:#fff !important;letter-spacing:0.06em;text-transform:uppercase;}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px 24px 60px;text-align:center;position:relative;overflow:hidden;}
        .grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,#000 30%,transparent 80%);opacity:0.3;}
        .glow{position:absolute;top:-10%;left:50%;transform:translateX(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%);pointer-events:none;}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:20px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);font-size:10px;color:var(--accent);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;animation:fadeUp 0.5s ease both;}
        .live-dot{width:6px;height:6px;border-radius:50%;background:var(--success);box-shadow:0 0 6px var(--success);animation:pulse 2s infinite;}
        h1{font-family:'Syne',sans-serif;font-size:clamp(32px,6vw,68px);font-weight:800;color:var(--bright);line-height:1.05;letter-spacing:-0.03em;max-width:780px;margin-bottom:20px;animation:fadeUp 0.5s 0.1s ease both;}
        h1 span{background:linear-gradient(90deg,var(--accent),#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .sub{font-size:14px;color:#94b8cc;line-height:1.8;max-width:500px;margin-bottom:36px;animation:fadeUp 0.5s 0.2s ease both;}
        .actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;animation:fadeUp 0.5s 0.3s ease both;margin-bottom:52px;}
        .btn-primary{padding:13px 28px;background:linear-gradient(135deg,var(--accent),#0284c7);border:none;border-radius:8px;font-size:12px;font-weight:700;color:#fff;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;transition:transform 0.15s,opacity 0.15s;}
        .btn-primary:hover{transform:translateY(-1px);opacity:0.9;}
        .btn-ghost{padding:13px 28px;background:transparent;border:1px solid var(--border);border-radius:8px;font-size:12px;color:var(--muted);cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;transition:border-color 0.2s,color 0.2s;}
        .btn-ghost:hover{border-color:var(--muted);color:var(--text);}
        .demo-wrap-outer{width:100%;max-width:820px;animation:fadeUp 0.6s 0.4s ease both;}
        .demo-label{font-size:9px;color:#8bafc4;letter-spacing:0.12em;text-transform:uppercase;text-align:center;margin-bottom:10px;}
        .logos{padding:28px 40px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;background:rgba(15,25,35,0.5);}
        .ll{font-size:9px;color:#8bafc4;letter-spacing:0.14em;text-transform:uppercase;}
        .li{font-size:11px;color:#8bafc4;letter-spacing:0.08em;text-transform:uppercase;font-family:'Syne',sans-serif;font-weight:700;opacity:0.4;}
        .section{padding:80px 24px;max-width:960px;margin:0 auto;}
        .eyebrow2{font-size:9px;color:var(--accent);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:14px;}
        .stitle{font-family:'Syne',sans-serif;font-size:clamp(24px,4vw,40px);font-weight:800;color:var(--bright);line-height:1.1;letter-spacing:-0.02em;margin-bottom:12px;}
        .ssub{font-size:13px;color:#94b8cc;line-height:1.8;max-width:500px;margin-bottom:40px;}
        .features{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;border:1px solid var(--border);border-radius:12px;overflow:hidden;}
        .feat{background:var(--surface);padding:28px 24px;transition:background 0.2s;}
        .feat:hover{background:#131f2e;}
        .ficon{width:36px;height:36px;border-radius:8px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:14px;}
        .ftitle{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--bright);margin-bottom:8px;}
        .fdesc{font-size:11px;color:#94b8cc;line-height:1.75;}
        .how{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;position:relative;}
        .how::before{content:'';position:absolute;top:20px;left:calc(16.67% + 16px);right:calc(16.67% + 16px);height:1px;background:linear-gradient(90deg,transparent,var(--border),var(--border),transparent);}
        .step{text-align:center;}
        .step-num{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#0284c7);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;margin:0 auto 16px;position:relative;z-index:1;}
        .step-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--bright);margin-bottom:8px;}
        .step-desc{font-size:11px;color:#94b8cc;line-height:1.75;}
        .code-block{background:#040810;border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-top:40px;}
        .code-head{padding:10px 16px;background:#060b0f;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:9px;color:#8bafc4;letter-spacing:0.1em;text-transform:uppercase;}
        pre{padding:20px;font-size:11px;color:#94b8cc;line-height:1.75;overflow-x:auto;white-space:pre;}
        .pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .plan{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px 24px;position:relative;}
        .plan.featured{border-color:var(--accent);background:#0d1a24;}
        .pbadge{position:absolute;top:-10px;left:50%;transform:translateX(-50%);padding:3px 12px;background:var(--accent);border-radius:20px;font-size:9px;font-weight:700;color:#fff;letter-spacing:0.08em;text-transform:uppercase;}
        .pname{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:var(--bright);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;}
        .pprice{font-family:'Syne',sans-serif;font-size:34px;font-weight:800;color:var(--bright);letter-spacing:-0.02em;margin:12px 0 4px;}
        .pprice span{font-size:13px;font-weight:400;color:var(--muted);}
        .pdesc{font-size:11px;color:#94b8cc;margin-bottom:18px;line-height:1.6;}
        .pfeats{list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:22px;}
        .pfeats li{font-size:11px;color:var(--text);display:flex;gap:8px;align-items:flex-start;}
        .pfeats li::before{content:'✓';color:var(--success);flex-shrink:0;}
        .pfeats li.off{color:var(--muted);}
        .pfeats li.off::before{content:'—';color:var(--muted);}
        .pbtn{width:100%;padding:11px;border-radius:7px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:all 0.2s;}
        .pbtn.primary{background:linear-gradient(135deg,var(--accent),#0284c7);border:none;color:#fff;}
        .pbtn.ghost{background:transparent;border:1px solid var(--border);color:var(--muted);}
        .pbtn:hover{opacity:0.85;transform:translateY(-1px);}
        .cta-section{text-align:center;padding:80px 24px;border-top:1px solid var(--border);position:relative;overflow:hidden;}
        .cta-glow{position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);pointer-events:none;}
        .cta-section h2{font-family:'Syne',sans-serif;font-size:clamp(26px,5vw,48px);font-weight:800;color:var(--bright);line-height:1.1;letter-spacing:-0.02em;margin-bottom:14px;}
        .cta-section p{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.7;}
        footer{padding:40px;border-top:1px solid var(--border);display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;}
        .fbrand{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--bright);margin-bottom:8px;}
        .fdesc2{font-size:11px;color:#94b8cc;line-height:1.75;max-width:220px;}
        .fcol h4{font-size:9px;color:#8bafc4;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;}
        .fcol a{display:block;font-size:11px;color:var(--muted);margin-bottom:7px;transition:color 0.2s;}
        .fcol a:hover{color:var(--text);}
        .fbot{padding:18px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-size:10px;color:var(--muted);}
        @media(max-width:768px){
          nav{padding:14px 20px;}.nlinks{display:none;}
          .features,.pricing,.how{grid-template-columns:1fr;}
          .how::before{display:none;}
          footer{grid-template-columns:1fr 1fr;padding:28px 20px;}
          .fbot{padding:14px 20px;flex-direction:column;gap:6px;}
          .section{padding:56px 20px;}
          .logos{padding:24px 20px;gap:24px;}
        }
      `}</style>

      <nav id="nav">
        <div className="nlogo">
          <div className="nmark">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
            <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="25" cy="24" r="3.5" fill="white"/>
          </svg>
        </div>
          <span className="nbrand">Logwick</span>
        </div>
        <div className="nlinks">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/blog">Blog</a>
          <a href="/docs">Docs</a>
          <a href="/login">Sign in</a>
          <a href="/signup" className="ncta">Get started free</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="grid"/>
        <div className="glow"/>
        <div className="eyebrow"><span className="live-dot"/>Now live — free to start</div>
        <h1 style={{marginBottom:16}}>The audit log<br/><span>for AI agents.</span></h1>
        <div style={{fontSize:'clamp(18px,3vw,28px)',color:'#94b8cc',fontFamily:"'Syne',sans-serif",fontWeight:600,marginBottom:8,letterSpacing:'-0.01em'}}>Leave a trail. Know what your AI did, always.</div>
        <p className="sub">Logwick captures every prompt, response, and error your AI agents produce — searchable, exportable, and always there when you need it.</p>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16,marginTop:-8,position:'relative',zIndex:10}}>
          <HeroCopyBtn />
          <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(14,165,233,0.05)',border:'1px solid rgba(14,165,233,0.15)',borderRadius:40,padding:'10px 20px'}}>
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
              <rect width="36" height="36" rx="8" fill="#0284c7"/>
              <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="25" cy="24" r="3.5" fill="white"/>
            </svg>
            <span style={{fontSize:13,color:'#38bdf8',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.02em'}}>AI agents can now log themselves. No account needed — pay $0.001 USDC per log.</span>
          </div>
        </div>
        <div className="actions">
          <a href="/signup"><button className="btn-primary">Start for free →</button></a>
          <a href="#how-it-works"><button className="btn-ghost">See how it works</button></a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: 8, pointerEvents: 'all', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Syne',sans-serif", marginBottom: 8 }}>Try the most agent-ready logging tool available</div>
            <a href="https://ora.run/score/logwick.io" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '14px 20px', textDecoration: 'none', transition: 'border-color 0.2s', pointerEvents: 'all', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)'}
            >
              <img src="https://ora.run/api/badge/logwick.io" alt="ora agent readiness score 92/100" style={{ height: 44, borderRadius: 6, display: 'block' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', fontFamily: "'Syne',sans-serif", marginBottom: 2 }}>#2 of 8,400 sites</div>
                <div style={{ fontSize: 11, color: '#4a7a90', fontFamily: "'JetBrains Mono',monospace" }}>92/100 · Grade A · Verified by ora.run</div>
              </div>
            </a>
          </div>
        </div>
        <div className="demo-wrap-outer">
          <div className="demo-label">Live demo — watch events stream in</div>
          <LiveDemo />
        </div>
      </div>

      {/* Logos */}
      <div className="logos">
        <span className="ll">Works with</span>
        {['GPT-4o','Claude','Gemini','Mistral','LangChain','CrewAI','MCP','Any LLM'].map(l => <span key={l} className="li">{l}</span>)}
      </div>

      {/* Features */}
      <div className="section" id="features">
        <div className="eyebrow2">Features</div>
        <h2 className="stitle">Everything you need to trust your AI stack</h2>
        <div className="ssub">One API endpoint. Instant visibility across every agent, model, and workflow — including native Claude MCP integration.</div>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginTop:16}}>
          {[
            'Unlike Braintrust — no $249/mo platform required',
            'Unlike LangSmith — works without LangChain',
            'Unlike Helicone — any model, not just OpenAI',
          ].map(t => (
            <span key={t} style={{fontSize:11,color:'#4a7a90',background:'#07101a',border:'1px solid #1e3040',borderRadius:20,padding:'4px 12px'}}>{t}</span>
          ))}
        </div>
        <div className="features">
          {[
            ['⬛','Universal log ingestion','One REST endpoint accepts logs from any AI agent or model. POST and forget — storage, indexing, and retention handled automatically.'],
            ['🔍','Instant search & filter','Search by agent, user, action, status, and date range. Find any event in milliseconds across millions of records.'],
            ['⚡','Webhook alerts','Get notified the moment an error rate spikes. Send alerts to Slack, PagerDuty, or any endpoint you choose.'],
            ['↓','CSV export','Export filtered logs anytime for compliance audits, legal review, or your own data pipelines.'],
            ['📊','Analytics dashboard','Track success rates, error trends, token spend, latency, and cost over time. Know your AI bill before it surprises you.'],
            ['🔑','API key management','Issue scoped API keys per team or integration. Revoke instantly. Full audit of who logged what and when.'],
            ['🤖','Claude MCP integration','Ask Claude what your AI agents did in plain English. Connect Logwick to Claude Desktop in 2 minutes via MCP.'],
          ].map(([icon,title,desc]) => (
            <div key={title} className="feat">
              <div className="ficon">{icon}</div>
              <div className="ftitle">{title}</div>
              <div className="fdesc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="section" id="how-it-works" style={{paddingTop:0}}>
        <div className="eyebrow2">How it works</div>
        <h2 className="stitle">Up and running in minutes</h2>
        <div className="ssub">Two ways to get started — let your AI assistant do it for you, or add one line of code yourself.</div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,background:'#1e3040',borderRadius:12,overflow:'hidden',marginBottom:40}}>
          <div style={{background:'#07101a',padding:'28px 28px 32px'}}>
            <div style={{fontSize:10,color:'#38bdf8',letterSpacing:'0.14em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace",marginBottom:14}}>Option 1 — Let your AI do it</div>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              {[
                ['1','Sign up and get your key','Create a free account at logwick.io and copy your API key from the dashboard.'],
                ['2','Open your AI assistant','Open Claude, ChatGPT, Gemini, or any AI assistant you use for coding.'],
                ['3','Say this to your AI','"Here are the Logwick docs: [paste from logwick.io/docs]. Add Logwick to my project."'],
              ].map(([num,title,desc]) => (
                <div key={num} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e9,#0284c7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{num}</div>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:'#e8f4fb',marginBottom:4}}>{title}</div>
                    <div style={{fontSize:12,color:'#a8c8dc',lineHeight:1.7,fontStyle:num==='3'?'italic':undefined}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:'#06090c',padding:'28px 28px 32px'}}>
            <div style={{fontSize:10,color:'#a8c8dc',letterSpacing:'0.14em',textTransform:'uppercase',fontFamily:"'JetBrains Mono',monospace",marginBottom:14}}>Option 2 — Add it yourself</div>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              {[
                ['1','Create an account','Sign up free, generate your API key, and get your ingestion endpoint. No credit card required.'],
                ['2','Instrument your agents','After each AI call in your code, POST the input, output, agent, and status to Logwick. Takes about 3 minutes.'],
                ['3','Get instant visibility','Your dashboard populates in real time. Set up webhook alerts, export reports, and always have a full audit trail.'],
              ].map(([num,title,desc]) => (
                <div key={num} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'#0a1a28',border:'1px solid #1e3040',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#a8c8dc',flexShrink:0}}>{num}</div>
                  <div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:'#c8dce8',marginBottom:4}}>{title}</div>
                    <div style={{fontSize:12,color:'#7a9db5',lineHeight:1.7}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="code-block">
          <div className="code-head"><span>Node.js — add one call after your AI request</span></div>
          <pre>{`const start = Date.now()
const result = await openai.chat.completions.create({ model: 'gpt-4o', messages })

// One line — fire and forget
fetch('https://logwick.io/api/v1/logs', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer sk-lw-your-key', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent:      'gpt-4o',
    action:     'email_draft',
    status:     'success',
    input:      userPrompt,
    output:     result.choices[0].message.content,
    tokens:     result.usage.total_tokens,
    latency_ms: Date.now() - start,
    user:       req.user.email,
  })
}).catch(() => {})

// That's it. It's in your dashboard.`}</pre>
        </div>
      </div>

      {/* MCP Section */}
      <div className="section" style={{paddingTop:0}}>
        <div style={{background:"#07101a",border:"1px solid #0ea5e9",borderRadius:12,overflow:"hidden",maxWidth:860,margin:"0 auto"}}>
          <div style={{padding:"28px 32px",borderBottom:"1px solid #1e3040",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{width:44,height:44,borderRadius:10,background:"linear-gradient(135deg,#38bdf8,#0284c7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:26,height:26}}>
                <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="25" cy="24" r="3.5" fill="white"/>
              </svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:"#38bdf8",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>New — Claude MCP Integration</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"#f1f5f9",lineHeight:1.1,marginBottom:6}}>Ask Claude what your AI agents did</div>
              <div style={{fontSize:13,color:"#7a9db5",lineHeight:1.7}}>Connect Logwick to Claude Desktop in 2 minutes. Query your logs, investigate errors, and log actions — all through natural language.</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#1e3040"}}>
            <div style={{background:"#07101a",padding:"20px 24px"}}>
              <div style={{fontSize:11,color:"#a8c8dc",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>Without Logwick MCP</div>
              {["Open dashboard","Filter by date","Search for errors","Copy log IDs","Cross-reference manually"].map(t => (
                <div key={t} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,fontSize:13,color:"#a8c8dc"}}>
                  <span style={{color:"#ef4444"}}>✕</span>{t}
                </div>
              ))}
            </div>
            <div style={{background:"#060e16",padding:"20px 24px"}}>
              <div style={{fontSize:11,color:"#38bdf8",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace",marginBottom:12}}>With Logwick MCP</div>
              {[
                '"Show me errors from yesterday"',
                '"How much did we spend on tokens?"',
                '"Find all failed email_draft actions"',
                '"Log this GPT-4o call for me"',
                '"What was our success rate this week?"',
              ].map(t => (
                <div key={t} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,fontSize:12,color:"#94b8cc",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.5}}>
                  <span style={{color:"#34d399",flexShrink:0}}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"20px 24px",background:"#07101a",borderTop:"1px solid #1e3040"}}>
            <div style={{fontSize:11,color:"#a8c8dc",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace",marginBottom:10}}>Add to claude_desktop_config.json</div>
            <pre style={{fontSize:12,color:"#c8dce8",lineHeight:1.75,margin:0,overflowX:"auto",whiteSpace:"pre"}}>{`{
  "mcpServers": {
    "logwick": {
      "command": "npx",
      "args": ["-y", "@logwick/mcp"],
      "env": { "LOGWICK_API_KEY": "sk-lw-your-key" }
    }
  }
}`}</pre>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="section" id="faq" style={{paddingTop:0}}>
        <div className="eyebrow2">FAQ</div>
        <h2 className="stitle">Common questions</h2>
        <div className="ssub">Everything developers ask before adding Logwick to a project.</div>
        <div style={{maxWidth:720,margin:'0 auto',display:'flex',flexDirection:'column',gap:2}}>
          {[
            ['Will this slow down my app?','No. Every log call is fire and forget — your AI response returns to your user first, the log sends in the background. Zero latency impact.'],
            ['Is my data safe?','Yes. Every account is fully isolated with row-level security enforced at the database level. Your logs are never accessible to other accounts, ever.'],
            ['What if I want to leave?','Export everything as CSV anytime from your dashboard. No lock-in, no exit fees, no questions asked.'],
            ['Do I need to change how I write AI calls?','No. You add one line after your existing AI call. Nothing about how you call GPT, Claude, or Gemini changes.'],
            ['What happens when I hit the free limit?','Your dashboard shows you how close you are. When you hit 5,000 logs, new logs stop recording until you upgrade or the month resets. Nothing in your app breaks.'],
            ['Does it work with my stack?','Yes. Any language, any framework, any AI model. Node.js, Python, LangChain, Next.js, FastAPI — if you can make an HTTP request you can use Logwick.'],
          ].map(([q, a], i) => (
            <details key={i} style={{background:'#07101a',border:'1px solid #1e3040',borderRadius:8,overflow:'hidden'}}>
              <summary style={{padding:'16px 20px',fontSize:14,fontWeight:700,color:'#e8f4fb',cursor:'pointer',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Syne',sans-serif"}}>
                {q}
                <span style={{color:'#38bdf8',fontSize:18,flexShrink:0,marginLeft:16}}>+</span>
              </summary>
              <div style={{padding:'0 20px 16px',fontSize:13,color:'#c8dce8',lineHeight:1.8,borderTop:'1px solid #1e3040',paddingTop:14}}>{a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="section" id="pricing" style={{paddingTop:0}}>
        <div className="eyebrow2">Pricing</div>
        <h2 className="stitle">Simple, usage-based pricing</h2>
        <div className="ssub">Start free. Scale when you need it. No surprise bills.</div>
        <div className="pricing">
          <div className="plan">
            <div className="pname">Free</div>
            <div className="pprice">$0<span>/month</span></div>
            <div className="pdesc">For individuals and side projects getting started with AI auditing.</div>
            <ul className="pfeats">
              <li>5,000 logs/month</li>
              <li>7-day retention</li>
              <li>1 API key</li>
              <li>Dashboard & search</li>
              <li className="off">Webhooks</li>
              <li>CSV export</li>
            </ul>
            <a href="/signup"><button className="pbtn ghost">Get started free</button></a>
          </div>
          <div className="plan featured">
            <div className="pbadge">Most popular</div>
            <div className="pname" style={{color:'#7dd3fc'}}>Pro</div>
            <div className="pprice">$29<span>/month</span></div>
            <div className="pdesc">For teams running AI agents in production who need full visibility and alerts.</div>
            <ul className="pfeats">
              <li>100,000 logs/month</li>
              <li>90-day retention</li>
              <li>10 API keys</li>
              <li>Dashboard & search</li>
              <li>Unlimited webhooks</li>
              <li>CSV export</li>
            </ul>
            <a href="https://buy.stripe.com/fZu3co57kgpt1j72xYcIE00"><button className="pbtn primary">Upgrade to Pro →</button></a>
          </div>
          <div className="plan">
            <div className="pname">Enterprise</div>
            <div className="pprice" style={{fontSize:26}}>Custom</div>
            <div className="pdesc">For organizations with compliance requirements or high volume needs.</div>
            <ul className="pfeats">
              <li>Unlimited logs</li>
              <li>Custom retention</li>
              <li>Unlimited API keys</li>
              <li>SSO / SAML</li>
              <li>SLA guarantee</li>
              <li>Dedicated support</li>
            </ul>
            <a href="mailto:hello@logwick.io"><button className="pbtn ghost">Talk to sales</button></a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-glow"/>
        <h2>Start logging your<br/>AI agents today</h2>
        <p>Free forever for small projects. No credit card required.<br/>Your first 5,000 logs are on us. MCP integration included.</p>
        <a href="/signup"><button className="btn-primary" style={{fontSize:13,padding:'14px 32px'}}>Create free account →</button></a>
      </div>

      {/* Footer */}
      <footer>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div className="nmark" style={{width:26,height:26,padding:5}}>
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
                <path d="M11 8 L11 24 L25 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="25" cy="24" r="3.5" fill="white"/>
              </svg>
            </div>
            <div className="fbrand">Logwick</div>
          </div>
          <div className="fdesc2">The audit log for AI agents. Leave a trail. Know what your AI did, always.</div>
        </div>
        <div className="fcol"><h4>Product</h4><a href="#features">Features</a>
          <a href="/docs">Docs</a><a href="#pricing">Pricing</a><a href="/dashboard">Dashboard</a></div>
        <div className="fcol"><h4>Developers</h4><a href="/dashboard">API Docs</a><a href="/signup">Get API key</a></div>
        <div className="fcol"><h4>Company</h4><a href="/about">About</a><a href="/compare">Compare</a><a href="/contact">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div>
      </footer>
      <div className="fbot">
        <span>© 2026 Logwick. All rights reserved.</span>
        <span>Leave a trail.</span>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        window.addEventListener('scroll', () => {
          document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40)
        })
      `}} />
    </>
  )
}

export async function getServerSideProps({ req, res, query }) {
  if (query.mode === 'agent') {
    const data = {
      name: 'Logwick',
      description: 'The audit log for AI agents',
      version: '1.0.0',
      capabilities: ['logging', 'querying', 'streaming', 'webhooks', 'mcp', 'x402'],
      endpoints: {
        ingest: 'POST https://logwick.io/api/v1/logs',
        query: 'GET https://logwick.io/api/v1/logs',
        stream: 'GET https://logwick.io/api/v1/logs/stream',
        stats: 'GET https://logwick.io/api/v1/stats',
        agentLog: 'POST https://logwick.io/api/v1/agent-log',
        discovery: 'GET https://logwick.io/api/v1',
      },
      authentication: {
        apiKey: 'Authorization: Bearer sk-lw-your-key',
        x402: 'X-Payment header with USDC payment on Base mainnet',
      },
      pricing: {
        free: '$0/month — 5000 logs',
        pro: '$29/month — 100000 logs',
        payPerLog: '$0.001 USDC via x402',
      },
      docs: 'https://logwick.io/docs',
      openapi: 'https://logwick.io/openapi.json',
      llmsTxt: 'https://logwick.io/llms.txt',
      llmsFullTxt: 'https://logwick.io/llms-full.txt',
      mcp: 'npx @logwick/mcp',
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data, null, 2))
    return { props: {} }
  }
  return { props: {} }
}
