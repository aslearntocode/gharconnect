'use client'

import Header from "@/components/Header"

export default function AndheriTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Important information about using GharConnect platform and your responsibilities.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Important Disclaimer</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Vendor Responsibility Disclaimer:</strong> All vendors, service providers, and delivery services listed on GharConnect are not the responsibility of GharConnect. Users must take full ownership and responsibility when using any service or delivery option listed on this website.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Platform Usage</h2>
              <p className="text-gray-700 mb-4">
                GharConnect is a community platform designed to connect residents within societies. While we strive to provide accurate and helpful information, we do not endorse, guarantee, or take responsibility for any services, products, or vendors listed on our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. User Responsibility</h2>
              <p className="text-gray-700 mb-4">
                By using GharConnect, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>You are solely responsible for evaluating and selecting any service providers or vendors listed on the platform</li>
                <li>You will conduct your own due diligence before engaging with any service or delivery provider</li>
                <li>You understand that GharConnect is not liable for any issues, disputes, or problems that arise from your use of listed services</li>
                <li>You will take full ownership of any decisions made based on information found on the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Vendor Listings</h2>
              <p className="text-gray-700 mb-4">
                Vendors and service providers listed on GharConnect are independent entities. GharConnect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Does not verify, endorse, or guarantee the quality of services provided by listed vendors</li>
                <li>Is not responsible for any transactions, agreements, or disputes between users and vendors</li>
                <li>Does not act as an intermediary or agent for any vendor or service provider</li>
                <li>Reserves the right to remove or modify vendor listings at any time without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                GharConnect shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or any services listed thereon.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> gharconnectindia@gmail.com<br />
                  <strong>Phone:</strong> +91 9321314553
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 