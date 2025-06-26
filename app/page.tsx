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
    status: 'active'
  },
  {
    name: 'Worli, Mumbai',
    description: 'Worli, Lower Parel',
    href: '/worli',
    status: 'active'
  },
  {
    name: 'Bandra, Mumbai',
    description: 'Bandra, Khar, Santacruz',
    href: '/bandra',
    status: 'active'
  },
  {
    name: 'Andheri, Mumbai',
    description: 'Andheri, Andheri West, Andheri East',
    href: '/andheri',
    status: 'active'
  },
  {
    name: 'Juhu, Mumbai',
    description: 'Juhu, Vile Parle, Andheri',
    href: '/juhu',
    status: 'active'
  },
  {
    name: 'Malad, Mumbai',
    description: 'Malad, Kandivali, Andheri',
    href: '/malad',
    status: 'active'
  },
  {
    name: 'Powai, Mumbai',
    description: 'Powai, Andheri',
    href: '/powai',
    status: 'active'
  },
  {
    name: 'Thane, Mumbai',
    description: 'Thane, Ghodbunder Road',
    href: '/thane',
    status: 'active'
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
                    {/* Community Header with Integrated Button */}
                    <div className="bg-white px-4 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-bold mb-1 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {community.name}
                      </h2>
                      <p className="text-gray-600 text-xs mb-3">
                        {community.description}
                      </p>
                      {/* Explore Button Integrated in Header */}
                      <div className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                        Explore Community
                        <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="block h-full">
                    {/* Community Header - Coming Soon */}
                    <div className="bg-gray-100 px-4 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold text-gray-700">
                          {community.name}
                        </h2>
                        <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                          SOON
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mb-3">
                        {community.description}
                      </p>
                      {/* Disabled Explore Button */}
                      <div className="inline-flex items-center bg-gray-400 text-white font-semibold text-xs px-3 py-1.5 rounded-lg cursor-not-allowed">
                        Explore Community
                        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      
      <Footer />
    </div>
  );
} 