'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import Image from 'next/image'
import { FirstTimeLoginForm } from './FirstTimeLoginForm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { signInWithGoogle } from '@/lib/auth-utils'

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
    if (loading) return; // Prevent multiple clicks
    
    setError('')
    setLoading(true)

    try {
      const result = await signInWithGoogle()
      
      if (result.success && result.user) {
        console.log('Sign in successful:', result.user.email)
        
        // Check if first time user
        const isFirstTime = await checkIfFirstTimeUser(result.user.uid)
        setIsFirstTimeUser(isFirstTime)
        
        if (!isFirstTime) {
          // Close modal and redirect
          onClose()
          if (onLoginSuccess) {
            onLoginSuccess()
          } else {
            router.push(redirectPath)
          }
        }
      } else {
        // Handle authentication errors
        const errorCode = result.errorCode
        const errorMessage = result.error || 'Authentication failed'
        
        if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
          // User closed or cancelled popup - not an error
          setError('')
        } else if (errorCode === 'auth/popup-blocked') {
          setError('Please allow popups for this site to sign in with Google')
        } else if (errorCode === 'auth/missing-or-invalid-nonce') {
          setError('Please try again')
        } else if (errorCode === 'auth/already-in-progress') {
          setError('Sign in already in progress')
        } else {
          setError(errorMessage)
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('')
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] max-h-[90vh] overflow-y-auto p-4 sm:p-8 rounded-2xl shadow-lg mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <Image src="/GC_Logo.png" alt="GharConnect" width={80} height={80} className="sm:w-[100px] sm:h-[100px]" />
        </div>
        {/* Title & Subtitle */}
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-semibold mb-2">
            {isFirstTimeUser && !suppressProfileUpdate ? 'Complete Your Profile' : 'Sign in to GharConnect'}
          </DialogTitle>
          <div className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {isFirstTimeUser && !suppressProfileUpdate
              ? 'Please complete your profile to continue.'
              : 'Choose your Google account to continue'}
          </div>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {isFirstTimeUser && !suppressProfileUpdate ? (
          <FirstTimeLoginForm onComplete={handleProfileComplete} />
        ) : (
          <>
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mb-4"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2 sm:mr-3 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base font-medium text-gray-700">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
            {/* Info/Privacy */}
            <div className="mt-4 sm:mt-6 text-xs text-gray-500 text-center">
              By continuing, Google will share your name, email address, and profile picture with GharConnect.<br />
              See our{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 