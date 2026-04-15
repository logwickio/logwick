import { getSupabaseAdmin } from '../../../lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function getUserOrg(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return null
  const supabase = getSupabaseAdmin()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  const { data } = await supabase
    .from('org_members')
    .select('org_id')
    .eq('user_id', user.id)
    .single()
  return { orgId: data?.org_id, email: user.email }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const userOrg = await getUserOrg(req)
  if (!userOrg) return res.status(401).json({ error: 'Not authenticated' })

  const { orgId, email } = userOrg

  const customers = await stripe.customers.list({ email, limit: 1 })
  
  let customerId = customers.data[0]?.id

  if (!customerId) {
    const customer = await stripe.customers.create({ email })
    customerId = customer.id
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: 'https://logwick.io/dashboard',
  })

  res.json({ url: session.url })
}
