export default function BangaloreSharedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full bg-indigo-600 flex flex-col items-center justify-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Shared Accommodation in Bangalore</h1>
          <p className="text-indigo-100 text-base md:text-lg mt-2 text-center max-w-5xl">
            Find shared flats and rooms for rent in Bangalore.
          </p>
        </div>
      </div>
      
      {/* Back Button */}
      {/* <div className="max-w-6xl mx-auto w-full flex justify-start mt-4 mb-2 px-4">
        <a href="/bangalore" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-600 text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-all text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Other Types of Accommodation
        </a>
      </div> */}

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
              <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-xl text-gray-600 mb-6">
              We're working hard to bring you the best shared accommodation options in Bangalore.
            </p>
            <p className="text-gray-500 mb-8">
              Soon you'll be able to find verified shared flats, rooms, and co-living spaces with minimal brokerage fees.
            </p>
          </div>
          
          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-indigo-600 text-2xl mb-2">✓</div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-sm text-gray-600">All shared accommodations will be verified and safe</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-indigo-600 text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Minimal Brokerage</h3>
              <p className="text-sm text-gray-600">Save money with our low brokerage model</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-indigo-600 text-2xl mb-2">🏠</div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Based</h3>
              <p className="text-sm text-gray-600">Find shared spaces within your neighborhood</p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Notified</h3>
            <p className="text-gray-600 mb-4">We'll let you know when shared accommodation listings are available.</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 