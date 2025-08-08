'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Auth context
  const authContext = useAuth()
  const user = authContext?.currentUser || null
  const authLoading = authContext?.loading ?? true

  // Set mounted state
  useEffect(() => {
    setMounted(true)
    setIsClient(true)
    setLoading(false)
  }, [])

  // Error boundary
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleError = (error: ErrorEvent) => {
        console.error('Global error caught:', error)
        setHasError(true)
      }

      window.addEventListener('error', handleError)
      return () => window.removeEventListener('error', handleError)
    }
  }, [])

  // Scroll detection
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const handleScroll = () => {
        const scrollTop = window.scrollY
        setIsScrolled(scrollTop > 50)
      }

      window.addEventListener('scroll', handleScroll)
      handleScroll() // Set initial state

      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [mounted])

  // Mobile detection
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [mounted])

  // Show error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render children with client state
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
} 