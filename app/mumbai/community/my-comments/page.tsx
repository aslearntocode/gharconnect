'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-auth'
import Header from '@/components/Header'
import Link from 'next/link'
import { generateAnonymousId } from '@/lib/anonymousId'

interface Comment {
  id: string
  post_id: string
  body: string
  user_id: string
  created_at: string
  parent_comment_id?: string
  likes?: number
  post?: {
    title: string
    category?: string
  }
}

export default function MyComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      if (!user) {
        // Redirect to Parel homepage instead of login page
        router.push('/parel')
        return
      }

      try {
        // Use Supabase user ID directly for database query
        const userId = user.id
        
        const { data, error } = await supabase
          .from('comments')
          .select(`
            *,
            post:posts(title, category)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        setComments(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const timeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return `${diff} sec. ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} min. ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr. ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 lg:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Comments</h1>
            <p className="mt-2 text-gray-600">All your community comments in one place</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-500 mb-6">You haven't commented on any posts yet.</p>
              <Link
                href="/mumbai/community/connect"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Join Discussions
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-800">{comment.post?.category || 'gc/parel'}</span>
                      <span className="mx-1">•</span>
                      <span>{generateAnonymousId(comment.user_id)}</span>
                      <span className="mx-1">•</span>
                      <span>{timeAgo(comment.created_at)}</span>
                    </div>
                    
                    {comment.post && (
                      <Link 
                        href={`/parel/connect/${comment.post_id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-2 block"
                      >
                        On: {comment.post.title}
                      </Link>
                    )}
                    
                    <p className="text-gray-700 mb-4">
                      {comment.body}
                    </p>

                    {comment.likes && comment.likes > 0 && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {comment.likes}
                      </div>
                    )}
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