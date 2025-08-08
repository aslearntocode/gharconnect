'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testStorageAccess, testStorageUpload } from '@/lib/supabase'
import { supabase } from '@/lib/supabase-auth'
import { toast } from 'sonner'

export default function StorageDebug() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    connection: boolean | null
    storage: boolean | null
    upload: boolean | null
  }>({
    connection: null,
    storage: null,
    upload: null
  })

  const runTests = async () => {
    setTesting(true)
    setResults({ connection: null, storage: null, upload: null })

    try {
      // Test 1: Storage access
      console.log('Testing storage access...')
      const storageResult = await testStorageAccess()
      setResults(prev => ({ ...prev, storage: storageResult }))
      
      if (!storageResult) {
        toast.error('Storage access failed - check bucket configuration')
        return
      }

      // Test 2: Upload (if user is authenticated)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (user) {
        console.log('Testing storage upload...')
        const uploadResult = await testStorageUpload(user.id)
        setResults(prev => ({ ...prev, upload: uploadResult }))
        
        if (!uploadResult) {
          toast.error('Storage upload failed - check RLS policies')
          return
        }
      } else {
        toast.warning('User not authenticated - skipping upload test')
      }

      toast.success('Storage tests completed!')
    } catch (error) {
      console.error('Test error:', error)
      toast.error('Test failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Storage Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Running Tests...' : 'Test Storage Access'}
        </Button>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Storage Access:</span>
            <span className={results.storage === null ? 'text-gray-400' : results.storage ? 'text-green-600' : 'text-red-600'}>
              {results.storage === null ? 'Not tested' : results.storage ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Upload Test:</span>
            <span className={results.upload === null ? 'text-gray-400' : results.upload ? 'text-green-600' : 'text-red-600'}>
              {results.upload === null ? 'Not tested' : results.upload ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-600 mt-4">
          <p>Check browser console for detailed error messages.</p>
          <p>If upload fails, you need to configure RLS policies in Supabase.</p>
        </div>
      </CardContent>
    </Card>
  )
} 