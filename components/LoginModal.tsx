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
      <DialogContent className="sm:max-w-md p-8 rounded-2xl shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/GC_Logo.png" alt="GharConnect" width={100} height={100} />
        </div>
        {/* Title & Subtitle */}
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold mb-2">
            {isFirstTimeUser && !suppressProfileUpdate ? 'Complete Your Profile' : 'Sign in to GharConnect'}
          </DialogTitle>
          <div className="text-center text-gray-600 mb-6">
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
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mb-4"
            >
              <Image src="/google.svg" alt="Google" width={24} height={24} className="mr-3" />
              <span className="text-base font-medium text-gray-700">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
            {/* Info/Privacy */}
            <div className="mt-6 text-xs text-gray-500 text-center">
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