import Link from 'next/link';

const communities = [
  {
    name: 'Parel, Mumbai',
    description: 'Parel, Sewri, Bhoiwada, Wadala',
    href: '/parel',
    status: 'active'
  },
  {
    name: 'Worli, Mumbai',
    description: 'Worli, Lower Parel',
    href: '/worli',
    status: 'active'
  },
  {
    name: 'Mahalaxmi, Mumbai',
    description: 'Mahalaxmi, Tardeo',
    href: '/mahalaxmi',
    status: 'coming-soon'
  },
  {
    name: 'Bandra, Mumbai',
    description: 'Bandra, Khar',
    href: '/bandra',
    status: 'coming-soon'
  },
  {
    name: 'Andheri, Mumbai',
    description: 'Andheri, Santacruz',
    href: '/andheri',
    status: 'coming-soon'
  },
  {
    name: 'Juhu, Mumbai',
    description: 'Juhu, Vile Parle',
    href: '/juhu',
    status: 'coming-soon'
  },
  {
    name: 'Malad, Mumbai',
    description: 'Malad, Kandivali, Borivali',
    href: '/malad',
    status: 'coming-soon'
  },
  {
    name: 'Powai, Mumbai',
    description: 'Powai, Chandivali',
    href: '/powai',
    status: 'coming-soon'
  },
  {
    name: 'Thane, Mumbai',
    description: 'Thane, Ghodbunder Road',
    href: '/thane',
    status: 'coming-soon'
  }
];

export default function MumbaiSocietyServices() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white py-8 px-2">
      {/* Back to All Cities Button */}
      <div className="w-full max-w-6xl mx-auto flex justify-start mb-2 px-2">
        <Link href="/" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-600 text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-all text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to All Cities
        </Link>
      </div>
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-xl shadow-md border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">Society Services</h2>
        <p className="text-gray-600 text-base mb-8 text-center">Connect with your society, find domestic help, drivers, and stay updated with your community.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((society) => (
            <div
              key={society.name}
              className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${society.status === 'coming-soon' ? 'opacity-75' : 'hover:border-indigo-500'} transition-all duration-300`}
            >
              {society.status === 'active' ? (
                <div className="block group h-full">
                  <div className="px-6 py-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {society.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {society.description}
                    </p>
                    <Link
                      href={society.href}
                      className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm px-3 py-2 rounded group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300"
                    >
                      Explore Community
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="block h-full">
                  <div className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-700">
                        {society.name}
                      </h3>
                      <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                        SOON
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {society.description}
                    </p>
                    <div className="inline-flex items-center bg-gray-400 text-white font-semibold text-sm px-3 py-2 rounded cursor-not-allowed">
                      Explore Community
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 