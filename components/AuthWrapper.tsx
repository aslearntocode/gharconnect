"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Determine the society from the pathname
  const getSocietyFromPath = (path: string) => {
    if (path.startsWith('/cb-parel')) return 'cb-parel'
    if (path.startsWith('/ag-sewri')) return 'ag-sewri'
    return 'cb-parel' // default to cb-parel
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
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

    // Check for inactivity
    const interval = setInterval(() => {
      if (Date.now() - lastActivity >= TIMEOUT_DURATION) {
        signOut(auth)
        const society = getSocietyFromPath(pathname)
        router.push(`/${society}/login`)
      }
    }, 1000) // Check every second

    return () => {
      unsubscribe()
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      clearInterval(interval)
    }
  }, [router, lastActivity, pathname])

  return <>{children}</>
} 