// lib/webhooks.js
import { getSupabaseAdmin } from './supabase'

/**
 * Fire webhooks for a log entry.
 * Runs async — does not block the API response.
 */
export async function dispatchWebhooks(orgId, log) {
  const supabase = getSupabaseAdmin()

  // Fetch active webhooks for this org
  const { data: hooks } = await supabase
    .from('webhooks')
    .select('*')
    .eq('org_id', orgId)
    .eq('active', true)

  if (!hooks?.length) return

  const payload = {
    event: `log.${log.status}`,
    timestamp: new Date().toISOString(),
    log,
  }

  await Promise.allSettled(
    hooks
      .filter(hook => {
        const events = hook.events || ['error']
        return events.includes('all') || events.includes(log.status)
      })
      .map(async hook => {
        let statusCode = null
        let responseText = ''
        let success = false

        try {
          const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Logwick-Webhook/1.0',
          }

          // Optionally sign with HMAC if secret set
          if (hook.secret) {
            const { createHmac } = await import('crypto')
            const sig = createHmac('sha256', hook.secret)
              .update(JSON.stringify(payload))
              .digest('hex')
            headers['X-Logwick-Signature'] = `sha256=${sig}`
          }

          const res = await fetch(hook.url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000),
          })

          statusCode = res.status
          responseText = await res.text().catch(() => '')
          success = res.ok
        } catch (err) {
          responseText = err.message
        }

        // Record delivery attempt
        await supabase.from('webhook_deliveries').insert({
          webhook_id: hook.id,
          log_id: log.id,
          status_code: statusCode,
          success,
          response: responseText.slice(0, 500),
        })
      })
  )
}
