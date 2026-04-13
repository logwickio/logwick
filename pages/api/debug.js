export default function handler(req, res) {
  res.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    urlStart: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 20) || 'MISSING',
  })
}
