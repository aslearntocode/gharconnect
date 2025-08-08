'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-auth'
import { type Review } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import Image from 'next/image'

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      console.log('Auth state change - user:', user);
      if (!user) {
        // Redirect to login page
        router.push('/mumbai/community/login')
        return
      }

      try {
        console.log('Fetching reviews for user:', user.id);
        
        // First, let's check if there are any reviews in the table at all
        const { data: allReviews, error: allReviewsError } = await supabase
          .from('reviews')
          .select('*')
          .limit(5);
        console.log('All reviews in table (first 5):', { allReviews, allReviewsError });
        
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        console.log('Reviews query result:', { data, error });

        if (error) throw error

        setReviews(data || [])
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const getSentimentColor = (rating: number): string => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-blue-600'
    if (rating >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
            <p className="mt-2 text-gray-600">All your reviews in one place</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-6">You haven't reviewed any vendors yet.</p>
              <Link
                href="/mumbai/community"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Review the Vendor
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <Link 
                      href={`/parel/marketplace/${review.card_id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 block"
                    >
                      {review.card_name}
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`text-lg font-bold ${getSentimentColor(review.rating)}`}>
                        {review.rating} / 10
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at!).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 