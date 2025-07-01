'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import Image from 'next/image'
import { FirstTimeLoginForm } from './FirstTimeLoginForm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
  onLoginSuccess?: () => void
  suppressProfileUpdate?: boolean
}

export default function LoginModal({ isOpen, onClose, redirectPath = '/', onLoginSuccess, suppressProfileUpdate }: LoginModalProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const checkIfFirstTimeUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - this is a first-time user
          return true
        }
        console.error('Error checking user profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return true
      }

      return !data
    } catch (error) {
      console.error('Error checking user profile:', error)
      return true
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        const isFirstTime = await checkIfFirstTimeUser(result.user.uid)
        setIsFirstTimeUser(isFirstTime)
        
        if (!isFirstTime) {
          onClose()
          if (onLoginSuccess) {
            onLoginSuccess()
          } else {
            router.push(redirectPath)
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileComplete = () => {
    onClose()
    if (onLoginSuccess) {
      onLoginSuccess()
    } else {
      router.push(redirectPath)
    }
  }

  // If user is already authenticated, close the modal and redirect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && isOpen) {
        onClose()
        if (onLoginSuccess) {
          onLoginSuccess()
        } else {
          router.push(redirectPath)
        }
      }
    });
    
    return () => unsubscribe();
  }, [isOpen, onClose, redirectPath, router, onLoginSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-8">
        <DialogHeader>
          <DialogTitle>
            {isFirstTimeUser && !suppressProfileUpdate ? 'Complete Your Profile' : 'Sign in to GharConnect'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        {isFirstTimeUser && !suppressProfileUpdate ? (
          <FirstTimeLoginForm onComplete={handleProfileComplete} />
        ) : (
          <>
            {/* Trust Message - Improved for Mobile */}
            <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 sm:gap-3 shadow-sm">
              <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="#e0e7ff"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2.5"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-blue-800 mb-1 text-base sm:text-lg">Why Login?</div>
                <div className="text-blue-900 font-medium text-sm sm:text-base mb-1 sm:mb-0">
                  Login to <span className="font-bold">apply for rentals, find & rate service providers and get verified domestic help in your area.</span>
                </div>
                <div className="mt-2 text-blue-700 text-xs italic font-medium sm:text-sm" style={{ fontFamily: 'Georgia, serif', opacity: 0.95 }}>
                  <span className="font-semibold not-italic">We only access your name and email.</span> <span className="italic">No other data is stored.</span>
                </div>
              </div>
            </div>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 