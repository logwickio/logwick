import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const { getSupabase } = await import('../lib/supabase')
      const supabase = getSupabase()
      if (!supabase) return
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        const publicRoutes = ['/', '/login', '/signup']
        const isPublic = publicRoutes.includes(router.pathname)
        if (event === 'SIGNED_OUT' && !isPublic) router.push('/login')
        if (event === 'SIGNED_IN' && isPublic) router.push('/dashboard')
      })
      return () => subscription.unsubscribe()
    }
    initAuth()
  }, [router])

  return <Component {...pageProps} />
}
