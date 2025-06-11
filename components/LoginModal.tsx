'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import Image from 'next/image'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export default function LoginModal({ isOpen, onClose, redirectPath = '/' }: LoginModalProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      // Set prompt to select_account to force account picker
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        onClose()
        router.push(redirectPath)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // If user is already authenticated, close the modal and redirect
  useEffect(() => {
    if (auth.currentUser) {
      onClose()
      router.push(redirectPath)
    }
  }, [onClose, redirectPath, router])

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mb-8 w-full">
            <div className="text-2xl font-bold text-center text-gray-900">Welcome Back</div>
            <p className="text-gray-500 text-center mt-2">Sign in to access your account</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg text-sm border border-red-100 w-full">
              {error}
            </div>
          )}

          <div className="space-y-6 w-full">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="text-base font-medium text-gray-700">
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </div>
            </button>

            <div className="text-sm text-gray-500 text-center">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  )
} 