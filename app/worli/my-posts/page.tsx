'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { getSupabaseClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import { generateAnonymousId } from '@/lib/anonymousId'

interface Post {
  id: string
  title: string
  body: string
  user_id: string
  created_at: string
  category?: string
  likes?: number
  comment_count?: number
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Redirect to Worli homepage instead of login page
        router.push('/worli')
        return
      }

      try {
        const supabase = await getSupabaseClient()
        
        // Convert Firebase UID to UUID format for database query
        const firebaseUid = user.uid
        const uuidFromFirebase = firebaseUid.replace(/-/g, '').padEnd(32, '0').substring(0, 32)
        const formattedUuid = `${uuidFromFirebase.substring(0, 8)}-${uuidFromFirebase.substring(8, 12)}-${uuidFromFirebase.substring(12, 16)}-${uuidFromFirebase.substring(16, 20)}-${uuidFromFirebase.substring(20, 32)}`
        
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            comment_count:comments(count)
          `)
          .eq('user_id', formattedUuid)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform the data to flatten the comment_count
        const transformedData = (data || []).map(post => ({
          ...post,
          comment_count: post.comment_count?.[0]?.count || 0
        }))

        setPosts(transformedData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
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
            <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
            <p className="mt-2 text-gray-600">All your community posts in one place</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">You haven't created any posts yet.</p>
              <Link
                href="/worli/connect"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start a Discussion
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-800">{post.category || 'gc/worli'}</span>
                      <span className="mx-1">•</span>
                      <span>{generateAnonymousId(post.user_id)}</span>
                      <span className="mx-1">•</span>
                      <span>{timeAgo(post.created_at)}</span>
                    </div>
                    
                    <Link 
                      href={`/worli/connect/${post.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 block"
                    >
                      {post.title}
                    </Link>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {post.body.length > 200 ? `${post.body.substring(0, 200)}...` : post.body}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                        </svg>
                        {post.comment_count || 0}
                      </span>
                    </div>
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