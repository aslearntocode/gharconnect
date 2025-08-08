'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithGoogle, signOutUser, debugSupabaseConfig, supabase } from '@/lib/supabase-auth'

export default function DebugAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      setUser(session?.user || null)
      console.log('Auth state changed:', session?.user?.email || 'null')
    })

    return () => subscription.unsubscribe()
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
    const info = debugSupabaseConfig()
    setDebugInfo(info)
    return info
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current User Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current User Status</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                  <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-gray-500">No user logged in</p>
              )}
            </CardContent>
          </Card>

          {/* Auth Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Auth Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestLogin} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Test Google Sign In'}
              </Button>
              
              <Button 
                onClick={handleSignOut} 
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
              
              <Button 
                onClick={getDebugInfo} 
                variant="secondary"
                className="w-full"
              >
                Get Debug Info
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Debug Info */}
          {Object.keys(debugInfo).length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 