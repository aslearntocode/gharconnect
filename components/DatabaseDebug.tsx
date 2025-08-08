"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DatabaseDebug() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testDatabaseAccess = async () => {
    setLoading(true)
    const testResults: any = {}

    try {
      // Test 1: Apartments
      console.log('Testing apartments...')
      const { data: apartments, error: apartmentsError } = await supabase
        .from('apartments')
        .select('*')
        .limit(3)
      
      testResults.apartments = {
        success: !apartmentsError,
        count: apartments?.length || 0,
        error: apartmentsError?.message,
        data: apartments
      }

      // Test 2: Reviews
      console.log('Testing reviews...')
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .limit(3)
      
      testResults.reviews = {
        success: !reviewsError,
        count: reviews?.length || 0,
        error: reviewsError?.message,
        data: reviews
      }

      // Test 3: Property Reviews
      console.log('Testing property_reviews...')
      const { data: propertyReviews, error: propertyReviewsError } = await supabase
        .from('property_reviews')
        .select('*')
        .limit(3)
      
      testResults.propertyReviews = {
        success: !propertyReviewsError,
        count: propertyReviews?.length || 0,
        error: propertyReviewsError?.message,
        data: propertyReviews
      }

      // Test 4: Posts
      console.log('Testing posts...')
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .limit(3)
      
      testResults.posts = {
        success: !postsError,
        count: posts?.length || 0,
        error: postsError?.message,
        data: posts
      }

      // Test 5: Comments
      console.log('Testing comments...')
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .limit(3)
      
      testResults.comments = {
        success: !commentsError,
        count: comments?.length || 0,
        error: commentsError?.message,
        data: comments
      }

      // Test 6: Insert anonymous review
      console.log('Testing anonymous review insertion...')
      const testReview = {
        user_id: `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_name: `Anonymous_${Math.random().toString(36).substr(2, 6)}`,
        card_id: 'test_vendor_debug',
        card_name: 'Test Vendor Debug',
        rating: 5,
        comment: 'Test review from debug component'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('reviews')
        .insert([testReview])
        .select()
      
      testResults.insertReview = {
        success: !insertError,
        error: insertError?.message,
        data: insertData
      }

      // Clean up test review
      if (insertData?.[0]?.id) {
        await supabase
          .from('reviews')
          .delete()
          .eq('id', insertData[0].id)
      }

    } catch (error) {
      console.error('Database test failed:', error)
      testResults.error = error
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Access Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testDatabaseAccess} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Testing...' : 'Test Database Access'}
        </Button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            {Object.entries(results).map(([key, result]: [string, any]) => (
              <div key={key} className="border rounded p-3">
                <h3 className="font-semibold text-lg mb-2">{key}</h3>
                <div className="text-sm">
                  <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
                  {result.count !== undefined && (
                    <p><strong>Count:</strong> {result.count}</p>
                  )}
                  {result.error && (
                    <p><strong>Error:</strong> <span className="text-red-500">{result.error}</span></p>
                  )}
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-500">View Data</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 