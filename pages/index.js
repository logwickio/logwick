import { useEffect } from 'react'
import { useRouter } from 'next/router'

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
          --accent:#38bdf8;--text:#cbd5e1;--muted:#64748b;
          --bright:#f1f5f9;--success:#34d399;--error:#f87171;
        }
        body{background:var(--bg);color:var(--text);font-family:'JetBrains Mono',monospace;overflow-x:hidden;}
        a{color:inherit;text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;text-align:center;position:relative;overflow:hidden;}
        .grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,#000 30%,transparent 80%);opacity:0.3;}
        .glow{position:absolute;top:-10%;left:50%;transform:translateX(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%);pointer-events:none;}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:20px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);font-size:10px;color:var(--accent);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:28px;animation:fadeUp 0.5s ease both;}
        .dot{width:6px;height:6px;border-radius:50%;background:var(--success);box-shadow:0 0 6px var(--success);animation:pulse 2s infinite;}
        h1{font-family:'Syne',sans-serif;font-size:clamp(32px,6vw,72px);font-weight:800;color:var(--bright);line-height:1.05;letter-spacing:-0.03em;max-width:780px;margin-bottom:20px;animation:fadeUp 0.5s 0.1s ease both;}
        h1 span{background:linear-gradient(90deg,var(--accent),#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .sub{font-size:14px;color:var(--muted);line-height:1.8;max-width:500px;margin-bottom:36px;animation:fadeUp 0.5s 0.2s ease both;}
        .actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;animation:fadeUp 0.5s 0.3s ease both;margin-bottom:60px;}
        .btn-primary{padding:13px 28px;background:linear-gradient(135deg,var(--accent),#0284c7);border:none;border-radius:8px;font-size:12px;font-weight:700;color:#fff;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;transition:transform 0.15s,opacity 0.15s;}
        .btn-primary:hover{transform:translateY(-1px);opacity:0.9;}
        .btn-ghost{padding:13px 28px;background:transparent;border:1px solid var(--border);border-radius:8px;font-size:12px;color:var(--muted);cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;transition:border-color 0.2s,color 0.2s;}
        .btn-ghost:hover{border-color:var(--muted);color:var(--text);}
        .preview{width:100%;max-width:820px;border-radius:12px;overflow:hidden;border:1px solid var(--border);box-shadow:0 32px 80px rgba(0,0,0,0.5);animation:fadeUp 0.6s 0.4s ease both;background:var(--surface);}
        .pbar{padding:10px 14px;background:#070d12;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;}
        .pdot{width:8px;height:8px;border-radius:50%;}
        .purl{flex:1;background:rgba(56,189,248,0.05);border:1px solid var(--border);border-radius:4px;padding:4px 10px;font-size:10px;color:var(--muted);text-align:center;}
        .pcontent{padding:14px;display:flex;flex-direction:column;gap:8px;}
        .pstats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
        .pstat{background:#070d12;border:1px solid var(--border);border-radius:6px;padding:10px 12px;}
        .psl{font-size:8px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;}
        .psv{font-size:18px;font-weight:800;color:var(--bright);font-family:'Syne',sans-serif;}
        .prow{background:#070d12;border:1px solid var(--border);border-radius:6px;padding:10px 14px;display:flex;align-items:center;gap:10px;font-size:11px;}
        .badge{font-size:8px;padding:2px 6px;border-radius:3px;font-weight:700;letter-spacing:0.06em;}
        .pmeta{font-size:9px;color:var(--muted);margin-left:auto;}
        .features{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin:0 auto;max-width:900px;}
        .feat{background:var(--surface);padding:28px 24px;transition:background 0.2s;}
        .feat:hover{background:#131f2e;}
        .ficon{width:36px;height:36px;border-radius:8px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:14px;}
        .ftitle{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--bright);margin-bottom:8px;}
        .fdesc{font-size:11px;color:var(--muted);line-height:1.75;}
        .section{padding:80px 24px;max-width:960px;margin:0 auto;}
        .eyebrow2{font-size:9px;color:var(--accent);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:14px;}
        .stitle{font-family:'Syne',sans-serif;font-size:clamp(24px,4vw,40px);font-weight:800;color:var(--bright);line-height:1.1;letter-spacing:-0.02em;margin-bottom:12px;}
        .ssub{font-size:13px;color:var(--muted);line-height:1.8;max-width:500px;margin-bottom:40px;}
        .pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .plan{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px 24px;position:relative;}
        .plan.featured{border-color:var(--accent);background:#0d1a24;}
        .pbadge{position:absolute;top:-10px;left:50%;transform:translateX(-50%);padding:3px 12px;background:var(--accent);border-radius:20px;font-size:9px;font-weight:700;color:#fff;letter-spacing:0.08em;text-transform:uppercase;}
        .pname{font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:var(--bright);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;}
        .pprice{font-family:'Syne',sans-serif;font-size:34px;font-weight:800;color:var(--bright);letter-spacing:-0.02em;margin:12px 0 4px;}
        .pprice span{font-size:13px;font-weight:400;color:var(--muted);}
        .pdesc{font-size:11px;color:var(--muted);margin-bottom:18px;line-height:1.6;}
        .pfeats{list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:22px;}
        .pfeats li{font-size:11px;color:var(--text);display:flex;gap:8px;align-items:flex-start;}
        .pfeats li::before{content:'✓';color:var(--success);flex-shrink:0;}
        .pfeats li.off{color:var(--muted);}
        .pfeats li.off::before{content:'—';color:var(--muted);}
        .pbtn{width:100%;padding:11px;border-radius:7px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:all 0.2s;}
        .pbtn.primary{background:linear-gradient(135deg,var(--accent),#0284c7);border:none;color:#fff;}
        .pbtn.ghost{background:transparent;border:1px solid var(--border);color:var(--muted);}
        .pbtn:hover{opacity:0.85;transform:translateY(-1px);}
        .cta{text-align:center;padding:80px 24px;border-top:1px solid var(--border);position:relative;}
        .ctaglow{position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);pointer-events:none;}
        .cta h2{font-family:'Syne',sans-serif;font-size:clamp(26px,5vw,48px);font-weight:800;color:var(--bright);line-height:1.1;letter-spacing:-0.02em;margin-bottom:14px;}
        .cta p{font-size:13px;color:var(--muted);margin-bottom:32px;line-height:1.7;}
        footer{padding:40px;border-top:1px solid var(--border);display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;}
        .fbrand{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--bright);margin-bottom:8px;}
        .fdesc2{font-size:11px;color:var(--muted);line-height:1.75;max-width:220px;}
        .fcol h4{font-size:9px;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;}
        .fcol a{display:block;font-size:11px;color:var(--muted);margin-bottom:7px;transition:color 0.2s;}
        .fcol a:hover{color:var(--text);}
        .fbot{padding:18px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-size:10px;color:var(--muted);}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 40px;transition:all 0.3s;}
        nav.scrolled{background:rgba(10,15,20,0.92);border-bottom:1px solid var(--border);backdrop-filter:blur(12px);}
        .nlogo{display:flex;align-items:center;gap:10px;}
        .nmark{width:28px;height:28px;border-radius:6px;background:linear-gradient(135deg,var(--accent),#0284c7);display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;}
        .nbrand{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--bright);}
        .nlinks{display:flex;gap:24px;align-items:center;}
        .nlinks a{font-size:11px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s;}
        .nlinks a:hover{color:var(--text);}
        .ncta{padding:7px 16px;background:var(--accent);border-radius:6px;font-size:11px;font-weight:600;color:#fff;letter-spacing:0.06em;text-transform:uppercase;}
        .logos{padding:28px 40px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;background:rgba(15,25,35,0.5);}
        .ll{font-size:9px;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase;}
        .li{font-size:11px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;font-family:'Syne',sans-serif;font-weight:700;opacity:0.4;}
        @media(max-width:768px){nav{padding:14px 20px;}.nlinks{display:none;}.features,.pricing{grid-template-columns:1fr;}footer{grid-template-columns:1fr 1fr;padding:28px 20px;}.fbot{padding:14px 20px;flex-direction:column;gap:6px;}.section{padding:56px 20px;}}
      `}</style>

      <nav id="nav">
        <div className="nlogo">
          <div className="nmark">▣</div>
          <span className="nbrand">Logwick</span>
        </div>
        <div className="nlinks">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/login">Sign in</a>
          <a href="/signup" className="ncta">Get started free</a>
        </div>
      </nav>

      <div className="hero">
        <div className="grid"></div>
        <div className="glow"></div>
        <div className="eyebrow"><span className="dot"></span>Now live — free to start</div>
        <h1>Leave a trail.<br/><span>Every AI action, logged.</span></h1>
        <p className="sub">Logwick captures every prompt, response, and error your AI agents produce — searchable, exportable, and always there when you need it.</p>
        <div className="actions">
          <a href="/signup"><button className="btn-primary">Start for free →</button></a>
          <a href="#features"><button className="btn-ghost">See how it works</button></a>
        </div>
        <div className="preview">
          <div className="pbar">
            <div className="pdot" style={{background:'#ef4444'}}></div>
            <div className="pdot" style={{background:'#f59e0b'}}></div>
            <div className="pdot" style={{background:'#10b981'}}></div>
            <div className="purl">app.logwick.io/dashboard</div>
          </div>
          <div className="pcontent">
            <div className="pstats">
              <div className="pstat"><div className="psl">Total Logs</div><div className="psv" style={{color:'#f1f5f9'}}>14,820</div></div>
              <div className="pstat"><div className="psl">Success Rate</div><div className="psv" style={{color:'#34d399'}}>94.2%</div></div>
              <div className="pstat"><div className="psl">Errors</div><div className="psv" style={{color:'#f87171'}}>862</div></div>
              <div className="pstat"><div className="psl">Avg Latency</div><div className="psv" style={{color:'#f1f5f9'}}>1,240ms</div></div>
            </div>
            <div className="prow">
              <span style={{fontSize:12,fontWeight:600,color:'#cbd5e1',fontFamily:'Syne,sans-serif'}}>email_draft</span>
              <span className="badge" style={{background:'#0a2010',color:'#34d399',border:'1px solid #0a3320'}}>success</span>
              <span className="badge" style={{background:'#10b98118',color:'#10b981'}}>GPT-4o</span>
              <span className="pmeta">ops@acme.com · 312 tok · 1842ms · 2m ago</span>
            </div>
            <div className="prow">
              <span style={{fontSize:12,fontWeight:600,color:'#cbd5e1',fontFamily:'Syne,sans-serif'}}>data_analysis</span>
              <span className="badge" style={{background:'#0a2010',color:'#34d399',border:'1px solid #0a3320'}}>success</span>
              <span className="badge" style={{background:'#f9731618',color:'#f97316'}}>Claude 3.5</span>
              <span className="pmeta">cfo@acme.com · 891 tok · 3210ms · 17m ago</span>
            </div>
            <div className="prow">
              <span style={{fontSize:12,fontWeight:600,color:'#cbd5e1',fontFamily:'Syne,sans-serif'}}>code_generation</span>
              <span className="badge" style={{background:'#1a0505',color:'#f87171',border:'1px solid #3a0a0a'}}>error</span>
              <span className="badge" style={{background:'#3b82f618',color:'#3b82f6'}}>Gemini 1.5</span>
              <span className="pmeta">dev@acme.com · 88 tok · 990ms · 45m ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="logos">
        <span className="ll">Works with</span>
        <span className="li">GPT-4o</span>
        <span className="li">Claude</span>
        <span className="li">Gemini</span>
        <span className="li">Mistral</span>
        <span className="li">LangChain</span>
        <span className="li">CrewAI</span>
        <span className="li">Any LLM</span>
      </div>

      <div className="section" id="features">
        <div className="eyebrow2">Features</div>
        <div className="stitle">Everything you need to trust your AI stack</div>
        <div className="ssub">One API endpoint. Instant visibility across every agent, model, and workflow your team runs.</div>
        <div className="features">
          <div className="feat"><div className="ficon">⬛</div><div className="ftitle">Universal Log Ingestion</div><div className="fdesc">One REST endpoint accepts logs from any AI agent or model. POST and forget — storage, indexing, and retention handled automatically.</div></div>
          <div className="feat"><div className="ficon">🔍</div><div className="ftitle">Instant Search & Filter</div><div className="fdesc">Search by agent, user, action, status, and date range. Find any event in milliseconds across millions of records.</div></div>
          <div className="feat"><div className="ficon">⚡</div><div className="ftitle">Webhook Alerts</div><div className="fdesc">Get notified the moment an error rate spikes. Send alerts to Slack, PagerDuty, or any endpoint you choose.</div></div>
          <div className="feat"><div className="ficon">↓</div><div className="ftitle">CSV Export</div><div className="fdesc">Export filtered logs anytime for compliance audits, legal review, or feeding into your own data pipelines.</div></div>
          <div className="feat"><div className="ficon">📊</div><div className="ftitle">Analytics Dashboard</div><div className="fdesc">Track success rates, error trends, token spend, latency, and cost over time. Know your AI bill before it surprises you.</div></div>
          <div className="feat"><div className="ficon">🔑</div><div className="ftitle">API Key Management</div><div className="fdesc">Issue scoped API keys per team or integration. Revoke instantly. Full audit of who logged what and when.</div></div>
        </div>
      </div>

      <div className="section" id="pricing" style={{paddingTop:0}}>
        <div className="eyebrow2">Pricing</div>
        <div className="stitle">Simple, usage-based pricing</div>
        <div className="ssub">Start free. Scale when you need it.</div>
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
              <li className="off">CSV export</li>
            </ul>
            <a href="/signup"><button className="pbtn ghost">Get started free</button></a>
          </div>
          <div className="plan featured">
            <div className="pbadge">Most popular</div>
            <div className="pname" style={{color:'#7dd3fc'}}>Pro</div>
            <div className="pprice">$29<span>/month</span></div>
            <div className="pdesc">For teams running AI agents in production who need full visibility.</div>
            <ul className="pfeats">
              <li>100,000 logs/month</li>
              <li>90-day retention</li>
              <li>10 API keys</li>
              <li>Dashboard & search</li>
              <li>Unlimited webhooks</li>
              <li>CSV export</li>
            </ul>
            <a href="/signup"><button className="pbtn primary">Start free trial</button></a>
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

      <div className="cta">
        <div className="ctaglow"></div>
        <h2>Start logging your<br/>AI agents today</h2>
        <p>Free forever for small projects. No credit card required.<br/>Your first 5,000 logs are on us.</p>
        <a href="/signup"><button className="btn-primary" style={{fontSize:13,padding:'14px 32px'}}>Create free account →</button></a>
      </div>

      <footer>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div className="nmark" style={{width:26,height:26,fontSize:11}}>▣</div>
            <div className="fbrand">Logwick</div>
          </div>
          <div className="fdesc2">The audit log for AI agents. Leave a trail. Know what your AI did, always.</div>
        </div>
        <div className="fcol"><h4>Product</h4><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="/dashboard">Dashboard</a></div>
        <div className="fcol"><h4>Developers</h4><a href="/dashboard">API Docs</a><a href="/signup">Get API Key</a></div>
        <div className="fcol"><h4>Company</h4><a href="mailto:hello@logwick.io">Contact</a><a href="#">Privacy</a><a href="#">Terms</a></div>
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
