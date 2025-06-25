import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GharConnect - Society Connect Platform',
  description: 'Connect with your society members, manage amenities, and stay updated with your community. Join GharConnect for seamless society management.',
  keywords: 'society management, community platform, residential complex, society amenities, Mumbai societies',
  openGraph: {
    title: 'GharConnect - Society Connect Platform',
    description: 'Connect with your society members, manage amenities, and stay updated with your community.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GharConnect',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GharConnect - Society Connect Platform',
    description: 'Connect with your society members, manage amenities, and stay updated with your community.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

const communities = [
  {
    name: 'Parel, Mumbai',
    description: 'Parel, Sewri, Bhoiwada',
    href: '/parel',
    buildings: [
      'L&T Crescent Bay',
      'Ashok Gardens', 
      'Island City Centre',
      'Ashok Towers',
      'Dosti Flamingo',
      'Ruparel Ariana',
      'Kalpataru Avana',
      'Lodha Venezia',
      'Runwal Nirvana',
      'Celestia Spaces'
    ],
    status: 'active'
  },
  {
    name: 'Worli, Mumbai',
    description: 'Worli, Lower Parel',
    href: '/worli',
    buildings: [
      'Lodha Park',
      'Lodha World One',
      'Indiabulls Blu',
      'Raheja Imperia'
    ],
    status: 'active'
  },
  {
    name: 'Bandra, Mumbai',
    description: 'Bandra, Khar',
    href: '#',
    buildings: [
      'Coming Soon'
    ],
    status: 'coming-soon'
  },
  {
    name: 'Andheri, Mumbai',
    description: 'Andheri, Marol, Santacruz',
    href: '#',
    buildings: [
      'Coming Soon'
    ],
    status: 'coming-soon'
  },
  {
    name: 'Juhu, Mumbai',
    description: 'Juhu, Vile Parle',
    href: '#',
    buildings: [
      'Coming Soon'
    ],
    status: 'coming-soon'
  },
  {
    name: 'Malad, Mumbai',
    description: 'Malad, Kandivali, Borivali',
    href: '#',
    buildings: [
      'Coming Soon'
    ],
    status: 'coming-soon'
  },
  {
    name: 'Powai, Mumbai',
    description: 'Powai',
    href: '#',
    buildings: [
      'Coming Soon'
    ],
    status: 'coming-soon'
  },
  {
    name: 'Thane, Mumbai',
    description: 'Thane, Ghodbunder Road',
    href: '#',
    buildings: [
      'Coming Soon'
    ],
    status: 'coming-soon'
  }
];

export default function SocietiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple, distinct header for societies selection */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">GharConnect</h1>
          <span className="ml-2 text-sm text-gray-400 font-medium hidden sm:inline">Premium Community Platform</span>
        </div>
      </header>
      
      {/* Website Description */}
      <div className="w-full flex justify-center mb-8 px-4">
        <p className="max-w-6xl text-center text-gray-600 text-sm md:text-lg leading-relaxed">
          Your Society. Your Network. One Powerful Platform. <br />
          Whether you're renting, house-hunting, or hiring a domestic help or a driver - GharConnect.in has it all!
        </p>
      </div>

      {/* Communities Section */}
      <div className="flex-grow px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {communities.map((community) => (
              <div
                key={community.name}
                className={`bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden ${community.status === 'coming-soon' ? 'opacity-75' : 'hover:border-indigo-500'}`}
              >
                {community.status === 'active' ? (
                  <Link href={community.href} className="block group h-full">
                    {/* Community Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 text-white">
                      <h2 className="text-lg font-bold mb-1 group-hover:text-indigo-100 transition-colors">
                        {community.name}
                      </h2>
                      <p className="text-indigo-100 text-xs">
                        {community.description}
                      </p>
                    </div>
                    {/* Card Content with flex and min-h */}
                    <div className="p-4 flex flex-col justify-between h-[220px]">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Buildings
                        </h3>
                        <div className="space-y-1">
                          {community.buildings.slice(0, 4).map((building) => (
                            <div key={building} className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 flex-shrink-0"></div>
                              <span className="text-xs font-medium truncate">{building}</span>
                            </div>
                          ))}
                          {community.buildings.length > 4 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{community.buildings.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Explore Button always at bottom */}
                      <div className="mt-4 pt-3 border-t border-gray-200 flex items-end">
                        <div className="inline-flex items-center text-indigo-600 font-semibold text-sm group-hover:text-indigo-700 transition-colors">
                          Explore Community
                          <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="block h-full">
                    {/* Community Header - Coming Soon */}
                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-4 text-white">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold mb-1">
                          {community.name}
                        </h2>
                        <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                          SOON
                        </span>
                      </div>
                      <p className="text-gray-200 text-xs">
                        {community.description}
                      </p>
                    </div>
                    {/* Card Content with flex and min-h */}
                    <div className="p-4 flex flex-col justify-between h-[220px]">
                      <div className="flex flex-col items-center justify-center flex-1">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-600 font-medium">Coming Soon</p>
                        <p className="text-xs text-gray-500 mt-1">We're expanding to this area</p>
                      </div>
                      {/* Disabled Explore Button for alignment */}
                      <div className="mt-4 pt-3 border-t border-gray-200 flex items-end">
                        <div className="inline-flex items-center text-gray-400 font-semibold text-sm cursor-not-allowed">
                          Explore Community
                          <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 