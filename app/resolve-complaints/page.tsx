'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { auth } from '@/lib/firebase'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Header from '@/components/Header'

export default function ResolveComplaints() {
  const router = useRouter()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    issuer: '',
    complaint: ''
  })

  // Check authentication status when component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Pre-fill form data when user is logged in
        setFormData(prev => ({
          ...prev,
          name: user.displayName || '',
          email: user.email || ''
        }))
      }
    })

    return () => unsubscribe()
  }, [])

  // Handle any form interaction
  const handleFormInteraction = () => {
    if (!auth.currentUser) {
      setIsLoginModalOpen(true)
      return false
    }
    return true
  }

  const handleFormClick = (e: React.MouseEvent) => {
    if (!handleFormInteraction()) {
      e.preventDefault()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!handleFormInteraction()) {
      return
    }
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!handleFormInteraction()) {
      return
    }

    try {
      // First, validate the data
      const complaintData = {
        user_id: auth.currentUser!.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        product: formData.product,
        issuer: formData.issuer,
        complaint: formData.complaint.trim(),
        status: 'pending'
      }

      const { data, error } = await supabase
        .from('complaints')
        .insert([complaintData])
        .select('id, created_at')
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('No data returned from insert')
      }

      // Reset form
      setFormData({
        name: auth.currentUser!.displayName || '',
        email: auth.currentUser!.email || '',
        phone: '',
        product: '',
        issuer: '',
        complaint: ''
      })

      // Show success message with complaint ID
      alert(`Your complaint has been submitted successfully! Reference ID: ${data.id}`)
    } catch (error) {
      console.error('Error submitting complaint:', error instanceof Error ? error.message : 'Unknown error')
      alert('There was an error submitting your complaint. Please try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Having Issues with Financial Products?</h2>
            <p className="text-base text-gray-600">Our credit experts are here to help you understand the issue better and get it resolved</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Form Section */}
            <div className="max-w-lg">
              <form 
                className="space-y-4 bg-white rounded-xl shadow-lg p-6"
                onClick={handleFormClick}
                onSubmit={handleFormSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                      disabled={!!auth.currentUser}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                      disabled={!!auth.currentUser}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Financial Product</label>
                  <select
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a product</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="personal-loan">Personal Loan</option>
                    <option value="home-loan">Home Loan</option>
                    <option value="car-loan">Car Loan</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1">Issuer Name</label>
                  <select
                    id="issuer"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select issuer</option>
                    <option value="axis">Axis Bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="idfc">IDFC FIRST Bank</option>
                    <option value="yes">Yes Bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue</label>
                  <textarea
                    id="complaint"
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your issue in detail"
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Issue
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Our credit experts will review your complaint and get back to you within 24-48 hours
                </p>
              </form>
            </div>

            {/* Contact Options Section */}
            <div className="space-y-6">
              {/* Call Us Option */}
              <div 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = 'tel:+919321314553'}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">Speak directly with our credit experts</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-medium">
                  +91 93213 14553
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* WhatsApp Option */}
              <div 
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => window.open('https://wa.me/919321314553', '_blank')}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Chat With Us</h3>
                    <p className="text-gray-600">Get instant support via WhatsApp</p>
                  </div>
                </div>
                <div className="flex items-center text-green-600 font-medium">
                  Start Chat
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Us?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Expert guidance throughout the resolution process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Professional handling of your concerns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Regular updates on your complaint status</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
              Please login to submit your complaint. This will help us track and manage your complaints better.
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