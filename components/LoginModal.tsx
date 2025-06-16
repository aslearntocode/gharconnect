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
}

export default function LoginModal({ isOpen, onClose, redirectPath = '/', onLoginSuccess }: LoginModalProps) {
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
    if (auth.currentUser) {
      onClose()
      if (onLoginSuccess) {
        onLoginSuccess()
      } else {
        router.push(redirectPath)
      }
    }
  }, [onClose, redirectPath, router, onLoginSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isFirstTimeUser ? 'Complete Your Profile' : 'Sign in to GharConnect'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        {isFirstTimeUser ? (
          <FirstTimeLoginForm onComplete={handleProfileComplete} />
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  )
} 