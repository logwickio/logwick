import { getSupabaseAdmin } from '../../../lib/supabase'
import { generateApiKey } from '../../../lib/apiKeys'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, orgName, email } = req.body
  if (!userId || !orgName) return res.status(400).json({ error: 'userId and orgName required' })

  const supabase = getSupabaseAdmin()

  const slug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) + '-' + Math.random().toString(36).slice(2, 6)

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({ name: orgName, slug, plan: 'free', log_limit: 5000, retention_days: 7 })
    .select().single()

  if (orgErr) {
    console.error(orgErr)
    return res.status(500).json({ error: 'Failed to create organization' })
  }

  await supabase.from('org_members').insert({ org_id: org.id, user_id: userId, role: 'owner' })
  await supabase.from('org_settings').insert({ org_id: org.id })

  const { key, keyHash, keyPrefix } = generateApiKey()
  const { data: keyData } = await supabase
    .from('api_keys')
    .insert({ org_id: org.id, name: 'Default', key_hash: keyHash, key_prefix: keyPrefix, created_by: userId })
    .select('id').single()

  // Send welcome email
  try {
    await resend.emails.send({
      from: 'Logwick <hello@logwick.io>',
      to: email,
      subject: 'Welcome to Logwick — your API key is inside',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width"/>
        </head>
        <body style="margin:0;padding:0;background:#0a0f14;font-family:'JetBrains Mono',monospace;">
          <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

            <!-- Logo -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
              <div style="width:32px;height:32px;border-radius:7px;background:linear-gradient(135deg,#38bdf8,#0284c7);display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;font-weight:bold;">▣</div>
              <span style="font-size:18px;font-weight:800;color:#f1f5f9;letter-spacing:0.04em;">Logwick</span>
            </div>

            <!-- Heading -->
            <h1 style="font-size:24px;font-weight:800;color:#f1f5f9;margin:0 0 12px;line-height:1.2;">
              Welcome to Logwick, ${orgName} 👋
            </h1>
            <p style="font-size:14px;color:#7a9db5;line-height:1.8;margin:0 0 28px;">
              Your account is live. Here's your API key — keep it safe, it won't be shown again after this email.
            </p>

            <!-- API Key -->
            <div style="background:#07101a;border:1px solid #1e3040;border-radius:8px;overflow:hidden;margin-bottom:28px;">
              <div style="padding:10px 16px;border-bottom:1px solid #1e3040;font-size:10px;color:#4a7a90;letter-spacing:0.1em;text-transform:uppercase;">
                Your API Key
              </div>
              <div style="padding:14px 16px;font-size:13px;color:#38bdf8;word-break:break-all;line-height:1.6;">
                ${key}
              </div>
            </div>

            <!-- Quick start -->
            <div style="background:#07101a;border:1px solid #1e3040;border-radius:8px;overflow:hidden;margin-bottom:28px;">
              <div style="padding:10px 16px;border-bottom:1px solid #1e3040;font-size:10px;color:#4a7a90;letter-spacing:0.1em;text-transform:uppercase;">
                Quick start — add this after your AI call
              </div>
              <pre style="padding:16px;font-size:11px;color:#6a9ab5;line-height:1.75;margin:0;overflow-x:auto;white-space:pre;">fetch('https://logwick.io/api/v1/logs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${key}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agent:  'gpt-4o',
    action: 'your_action',
    status: 'success',
    input:  prompt,
    output: result,
    tokens: usage.total_tokens
  })
}).catch(() => {})</pre>
            </div>

            <!-- What's included -->
            <div style="margin-bottom:28px;">
              <p style="font-size:13px;color:#7a9db5;line-height:1.8;margin:0 0 12px;">
                Your free plan includes:
              </p>
              ${['5,000 logs/month', '7-day retention', 'CSV export', 'Full dashboard & search'].map(f => `
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                  <span style="color:#34d399;font-size:12px;">✓</span>
                  <span style="font-size:13px;color:#7a9db5;">${f}</span>
                </div>
              `).join('')}
            </div>

            <!-- MCP Section -->
            <div style="background:#07101a;border:1px solid rgba(14,165,233,0.3);border-radius:8px;overflow:hidden;margin-bottom:28px;">
              <div style="padding:10px 16px;border-bottom:1px solid #1e3040;font-size:10px;color:#38bdf8;letter-spacing:0.1em;text-transform:uppercase;">
                ✦ Claude MCP Integration — Ask Claude about your logs
              </div>
              <div style="padding:14px 16px;">
                <p style="font-size:13px;color:#7a9db5;line-height:1.7;margin:0 0 12px;">Connect Logwick to Claude Desktop and ask questions in plain English:</p>
                <div style="font-size:12px;color:#38bdf8;font-family:'JetBrains Mono',monospace;line-height:2;margin-bottom:12px;">
                  "Show me my last 10 error logs"<br/>
                  "What was my success rate this week?"<br/>
                  "How many tokens did I spend yesterday?"
                </div>
                <div style="background:#060c14;border-radius:6px;padding:12px;font-size:11px;color:#6a9ab5;font-family:'JetBrains Mono',monospace;line-height:1.75;">
                  // Add to claude_desktop_config.json<br/>
                  {<br/>
                  &nbsp;&nbsp;"mcpServers": {<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;"logwick": {<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y", "@logwick/mcp"],<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"env": { "LOGWICK_API_KEY": "${key}" }<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;}<br/>
                  &nbsp;&nbsp;}<br/>
                  }
                </div>
              </div>
            </div>

            <!-- CTA -->
            <a href="https://logwick.io/dashboard" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#38bdf8,#0284c7);border-radius:7px;font-size:12px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:32px;">
              Go to your dashboard →
            </a>

            <!-- Footer -->
            <div style="border-top:1px solid #1e3040;padding-top:20px;margin-top:8px;">
              <p style="font-size:11px;color:#334155;line-height:1.7;margin:0;">
                Questions? Reply to this email or reach us at <a href="mailto:hello@logwick.io" style="color:#38bdf8;text-decoration:none;">hello@logwick.io</a><br/>
                Logwick · Leave a trail.
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    })
  } catch (emailErr) {
    console.error('Welcome email failed:', emailErr)
    // Don't fail signup if email fails
  }

  return res.status(201).json({
    orgId:   org.id,
    orgSlug: org.slug,
    apiKey:  key,
    keyId:   keyData?.id,
  })
}
