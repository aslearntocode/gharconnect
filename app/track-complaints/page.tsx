'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

interface Complaint {
  id: string
  created_at: string
  product: string
  issuer: string
  complaint: string
  status: string
}

export default function TrackComplaints() {
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndFetchComplaints = async () => {
      if (!auth.currentUser) {
        setIsLoginModalOpen(true)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .eq('user_id', auth.currentUser.uid)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching complaints:', error)
          throw error
        }

        setComplaints(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchComplaints()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Track Your Complaints</h2>
            <p className="text-base text-gray-600">View the status of all your submitted complaints</p>
          </div>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints Found</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any complaints yet.</p>
                <button
                  onClick={() => router.push('/resolve-complaints')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register a New Complaint
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <li key={complaint.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">
                              {complaint.product} - {complaint.issuer}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Reference ID: {complaint.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(complaint.created_at)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {complaint.complaint}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Dialog
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Login Required
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-6">
              Please login to view your complaint status.
            </Dialog.Description>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsLoginModalOpen(false)
                  router.push('/login')
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLoginModalOpen(false)
                  router.push('/signup')
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Create Account
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
} 