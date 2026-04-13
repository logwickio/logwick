// pages/_app.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabase } from '../lib/supabase'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const supabase = getSupabase()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const publicRoutes = ['/', '/login', '/signup']
      const isPublic = publicRoutes.includes(router.pathname)

      if (event === 'SIGNED_OUT' && !isPublic) {
        router.push('/login')
      }
      if (event === 'SIGNED_IN' && isPublic) {
        router.push('/dashboard')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  return <Component {...pageProps} />
}
