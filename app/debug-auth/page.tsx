'use client'

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithGoogle, signOutUser, debugFirebaseConfig } from '@/lib/auth-utils'

export default function DebugAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user)
      console.log('Auth state changed:', user?.email || 'null')
    })

    return () => unsubscribe()
  }, [])

  const handleTestLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Starting test login...')
      const result = await signInWithGoogle()
      
      if (result.success) {
        console.log('Test login successful:', result.user?.email)
      } else {
        console.error('Test login failed:', result.error)
        setError(result.error || 'Login failed')
      }
    } catch (error: any) {
      console.error('Test login error:', error)
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      console.log('Signed out successfully')
    } catch (error: any) {
      console.error('Sign out error:', error)
      setError(error.message || 'Sign out failed')
    }
  }

  const getDebugInfo = () => {
    const info = debugFirebaseConfig()
    setDebugInfo(info)
    return info
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Firebase Auth Debug</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            <strong>Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}
          </p>
          {user && (
            <div className="mb-4">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Display Name:</strong> {user.displayName}</p>
            </div>
          )}
          
          <div className="space-x-2">
            <Button 
              onClick={handleTestLogin} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Testing...' : 'Test Google Login'}
            </Button>
            
            {user && (
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            )}
            
            <Button 
              onClick={async () => {
                try {
                  await signOutUser()
                  setError('')
                  console.log('Auth state cleared')
                } catch (error: any) {
                  setError('Failed to clear auth state: ' + error.message)
                }
              }}
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              Clear Auth State
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={getDebugInfo}
            variant="outline"
            className="mb-4"
          >
            Get Debug Info
          </Button>
          
          {Object.keys(debugInfo).length > 0 && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 