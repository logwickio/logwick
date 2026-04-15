import { getSupabaseAdmin } from '../../../lib/supabase'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const rawBody = Buffer.concat(chunks)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  const supabase = getSupabaseAdmin()

  async function getOrgByEmail(email) {
    if (!email) return null
    const { data: userId } = await supabase.rpc('get_user_id_by_email', { p_email: email })
    if (!userId) return null
    const { data: member } = await supabase
      .from('org_members')
      .select('org_id')
      .eq('user_id', userId)
      .single()
    return member?.org_id || null
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email
    const orgId = await getOrgByEmail(email)
    if (orgId) {
      await supabase.from('organizations').update({
        plan: 'pro',
        log_limit: 100000,
        retention_days: 90
      }).eq('id', orgId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const customerId = subscription.customer
    const customer = await stripe.customers.retrieve(customerId)
    const email = customer.email
    const orgId = await getOrgByEmail(email)
    if (orgId) {
      await supabase.from('organizations').update({
        plan: 'free',
        log_limit: 5000,
        retention_days: 7
      }).eq('id', orgId)
    }
  }

  res.json({ received: true })
}
