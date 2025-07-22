'use client'

import { useRouter } from 'next/navigation'
import LoginModal from '@/components/LoginModal'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  
  // Get the current path before login was triggered
  const currentPath = typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('redirect') || 
    '/' : '/'

  // Ensure we're mounted before showing the modal
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <LoginModal 
      isOpen={true} 
      onClose={() => {
        router.back()
        // If there's no previous page, go to home
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            router.push('/')
          }
        }, 100)
      }}
      redirectPath={currentPath}
    />
  )
} 