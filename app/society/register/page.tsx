'use client'

import Link from 'next/link'

export default function SocietyRegistration() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              GharConnect
            </Link>
            <nav className="space-x-4">
              <Link href="/" className="text-gray-600 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/parel/faq" className="text-gray-600 hover:text-indigo-600">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Register Your Society
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
              Join the growing network of societies on GharConnect and unlock a world of benefits for your community.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Streamlined Communication - Build Your Own Notice Board</h3>
              <p className="text-indigo-100">
                Keep all residents informed with our integrated communication system. Share announcements, updates, and important notices instantly.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Key Personnel Information</h3>
              <p className="text-indigo-100">
                Make your society more transparent by sharing the contact details of the key personnel with the residents.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Address Registered Complaints</h3>
              <p className="text-indigo-100">
                Tenants can register their complaints with the society and get them resolved quickly.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Start Registration Process
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 