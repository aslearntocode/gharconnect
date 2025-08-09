'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signOutUser } from '@/lib/supabase-auth'

function LogoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOutUser()
        console.log('Successfully signed out')
        
        // Wait a bit to ensure auth state has propagated
        setTimeout(() => {
          // Redirect to the specified page or default to home
          const returnUrl = searchParams.get('from') || '/'
          router.push(returnUrl)
        }, 1000)
      } catch (error) {
        console.error('Error during logout:', error)
        // Even if there's an error, redirect to home after a delay
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }

    handleLogout()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  )
}

export default function LogoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LogoutContent />
    </Suspense>
  )
} 