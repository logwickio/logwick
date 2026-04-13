// pages/index.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getSupabase } from '../lib/supabase'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/dashboard' : '/login')
    })
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06090c' }}>
      <div style={{ width: 20, height: 20, border: '2px solid #0f1e28', borderTop: '2px solid #0ea5e9', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
