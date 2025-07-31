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
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false)
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
    setHasAttemptedLogin(true)
    console.log('Starting Google login process...')

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      console.log('Initiating sign in with popup...')
      const result = await signInWithPopup(auth, provider)
      console.log('Sign in successful:', result.user?.email)
      
      if (result.user) {
        console.log('Checking if first time user...')
        const isFirstTime = await checkIfFirstTimeUser(result.user.uid)
        console.log('Is first time user:', isFirstTime)
        setIsFirstTimeUser(isFirstTime)
        
        if (!isFirstTime) {
          console.log('Not first time user, closing modal and redirecting...')
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
      
      // Handle specific Firebase errors gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup - this is not an error, just reset the state
        console.log('User closed the authentication popup')
        setError('')
        return
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled the popup request - also not an error
        console.log('User cancelled the authentication popup')
        setError('')
        return
      } else if (error.code === 'auth/popup-blocked') {
        // Popup was blocked by browser - show helpful message
        setError('Please allow popups for this site to sign in with Google')
      } else {
        // For other errors, show the error message
        setError(error.message || 'An error occurred during sign in')
      }
    } finally {
      setLoading(false)
      console.log('Login process completed')
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
    let timeoutId: NodeJS.Timeout;
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Only auto-close if the modal is open, we're not in the middle of a login process,
      // and we have attempted a login (to prevent immediate closing on modal open)
      if (user && isOpen && !loading && hasAttemptedLogin) {
        console.log('User authenticated, closing login modal');
        // Add a small delay to prevent race conditions
        timeoutId = setTimeout(() => {
          onClose()
          if (onLoginSuccess) {
            onLoginSuccess()
          } else {
            router.push(redirectPath)
          }
        }, 100);
      }
    });
    
    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, onClose, redirectPath, router, onLoginSuccess, loading, hasAttemptedLogin])

  // Reset hasAttemptedLogin when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasAttemptedLogin(false)
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