"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-auth"

const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Determine the society from the pathname
  const getSocietyFromPath = (path: string) => {
    if (path.startsWith('/mumbai/community')) return 'parel'
    if (path.startsWith('/ag-sewri')) return 'ag-sewri'
    return 'parel' // default to parel
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect to login if user is not authenticated and not already on login page
      if (!session?.user && !pathname.includes('/login') && !pathname.includes('/logout')) {
        const society = getSocietyFromPath(pathname)
        router.push(`/${society}/login`)
      }
    })

    const handleActivity = () => {
      setLastActivity(Date.now())
    }

    // Track user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)

    // Check for inactivity - DISABLED for now to prevent auto-logout issues
    // const interval = setInterval(() => {
    //   if (Date.now() - lastActivity >= TIMEOUT_DURATION) {
    //     supabase.auth.signOut()
    //     const society = getSocietyFromPath(pathname)
    //     router.push(`/${society}/login`)
    //   }
    // }, 1000) // Check every second

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      // clearInterval(interval)
    }
  }, [pathname, router])

  return <>{children}</>
} 