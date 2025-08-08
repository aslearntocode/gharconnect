'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-auth'

export default function DebugOAuthPage() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const getOAuthConfig = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
      
      const oauthConfig = {
        supabaseUrl,
        projectRef,
        redirectUri: `https://${projectRef}.supabase.co/auth/v1/callback`,
        currentLocation: window.location.href,
        origin: window.location.origin,
      }
      
      setConfig(oauthConfig)
      console.log('OAuth Configuration:', oauthConfig)
    }

    getOAuthConfig()
  }, [])

  const testOAuth = async () => {
    try {
      console.log('Testing OAuth flow...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href,
        },
      })
      
      console.log('OAuth test result:', { data, error })
    } catch (error) {
      console.error('OAuth test error:', error)
    }
  }

  if (!config) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">OAuth Configuration Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Configuration Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Supabase URL:</strong> {config.supabaseUrl}</p>
              <p><strong>Project Reference:</strong> {config.projectRef}</p>
              <p><strong>Current Location:</strong> {config.currentLocation}</p>
              <p><strong>Origin:</strong> {config.origin}</p>
            </div>
          </div>

          {/* Required Redirect URIs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Required Redirect URIs</h2>
            <p className="text-sm text-gray-600 mb-4">Add these to your Google OAuth configuration:</p>
            <div className="space-y-2">
              <div className="bg-gray-100 p-3 rounded">
                <code className="text-sm break-all">{config.redirectUri}</code>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <code className="text-sm break-all">{config.origin}/auth/callback</code>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <code className="text-sm break-all">{config.origin}</code>
              </div>
            </div>
          </div>

          {/* Test OAuth */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Test OAuth Flow</h2>
            <button 
              onClick={testOAuth}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Google OAuth
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Click this button to test the OAuth flow. Check the console for debug information.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>Select your project</li>
              <li>Go to <strong>APIs & Services</strong> → <strong>Credentials</strong></li>
              <li>Find your OAuth 2.0 Client ID and click on it</li>
              <li>In <strong>Authorized redirect URIs</strong>, add the three URIs shown above</li>
              <li>Click <strong>Save</strong></li>
              <li>Test the OAuth flow again</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
} 