'use client';

export default function AndheriPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Andheri Communities Coming Soon!
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-gray-600 text-lg mb-4">
            We're currently onboarding communities in Andheri, Marol, and Ghatkopar areas.
          </p>
          <p className="text-gray-600 text-lg mb-6">
            Stay tuned as we bring the power of community connection to your neighborhood!
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Onboarding in Progress
          </div>
        </div>
        <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
