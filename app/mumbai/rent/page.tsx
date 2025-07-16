'use client';

import Link from 'next/link';

export default function MumbaiRentTypeSelection() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-white to-indigo-50 pb-12 px-2 pt-8">
      {/* Back to All Cities Button */}
      <div className="w-full max-w-5xl mx-auto flex justify-start mb-2 px-2">
        <Link href="/" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-600 text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-all text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to All Cities
        </Link>
      </div>
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center mb-2 mt-2">Find a Home in Mumbai with No Brokerage</h1>
        <p className="text-gray-700 text-lg text-center mb-8">Choose the type of rental accommodation you are looking for in Mumbai with no brokerage.</p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Apartments Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full max-w-md flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2">Apartments</h2>
            <p className="text-gray-700 mb-4">Browse and rent full apartments in Mumbai. No brokerage, direct from owners.</p>
            <Link href="/mumbai/rent/apartment" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow transition-all">
              Explore
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          {/* PG Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full max-w-md flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2">PG Accommodation</h2>
            <p className="text-gray-700 mb-4">Find Paying Guest (PG) accommodation options for students and working professionals.</p>
            <Link href="/mumbai/rent/pg" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow transition-all">
              Explore
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Why You Should List Your Property With Us Section */}
      <div className="w-full max-w-7xl mx-auto mt-12">
        <div className="bg-gray-50 py-8 md:py-12 rounded-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List Your Property With Us?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience hassle-free property listing with our comprehensive services
              </p>
                        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {/* Benefit 1 */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                    </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Brokerage & No Listing Fees</h3>
                <p className="text-gray-600 text-sm">
                  It's absolutely free and absolutely simple!!! No hidden charges, no commission fees.
                </p>
                    </div>

              {/* Benefit 2 */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                  </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Legal <br/> Paperwork</h3>
                <p className="text-gray-600 text-sm">
                  We will help you with the legal paperwork and ensure that you are compliant with the law.
                </p>
                          </div>

              {/* Benefit 3 */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Managed Visits Service</h3>
                <p className="text-gray-600 text-sm">
                  GharConnect arranges and conducts property visits on behalf of the owner.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Photoshoot</h3>
                <p className="text-gray-600 text-sm">
                  Professional photoshoot service so people can see the apartment without actually visiting it.
                </p>
      </div>

              {/* Benefit 5 */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
            </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">On-Demand Services</h3>
                <p className="text-gray-600 text-sm">
                  Painting, carpentry and more services to get your house ready for the next tenant.
                </p>
            </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <a 
                href="/mumbai/list-apartment" 
                className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                List Your Property Now
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
            </div>
          </div>
        </div>
    </div>
  );
}
