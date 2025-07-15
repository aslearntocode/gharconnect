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

const rentalCities = [
  {
    name: 'Mumbai',
    description: 'Mumbai, Navi Mumbai, Thane',
    href: '/mumbai',
    status: 'active'
  },
  {
    name: 'Bangalore',
    description: 'Bangalore',
    href: '/bangalore/rent',
    status: 'active'
  },
  {
    name: 'Pune',
    description: 'Pune',
    href: '/pune',
    status: 'coming-soon'
  },
  {
    name: 'Hyderabad',
    description: 'Hyderabad, Secunderabad',
    href: '/hyderabad',
    status: 'coming-soon'
  },
  {
    name: 'Delhi',
    description: 'Delhi, NCR',
    href: '/delhi',
    status: 'coming-soon'
  },
  {
    name: 'Chennai',
    description: 'Chennai',
    href: '/chennai',
    status: 'coming-soon'
  }
];

export default function SocietiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center mb-4">
        <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">GharConnect</h1> 
      </header>
      {/* Website Description */}
      <div className="w-full flex justify-center mb-8 px-4">
        <p className="max-w-6xl text-center text-gray-600 text-sm md:text-lg leading-relaxed">
          One Powerful Platform.
          Whether you're renting, or hiring a domestic help or a driver - GharConnect.in has it all!
        </p>
      </div>
      {/* Main Sections */}
      <div className="max-w-7xl mx-auto w-full px-4 mb-12">
        {/* Choose a City Section */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Choose a City</h2>
          <p className="text-gray-600 text-sm mb-8 text-center">Select a city to explore rental properties and society services</p>
          
          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rentalCities.map((city) => (
              <div
                key={city.name}
                className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${city.status === 'coming-soon' ? 'opacity-75' : 'hover:border-indigo-500'} transition-all duration-300`}
              >
                {city.status === 'active' ? (
                  <div className="block group h-full">
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {city.description}
                      </p>
                      <div className="flex flex-row gap-2">
                        <Link href={city.href.includes('/rent') ? city.href : `${city.href}/rent`} className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-3 py-2 rounded transition-all duration-300">
                          Rentals
                          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                        {city.name === 'Bangalore' ? (
                          <div className="inline-flex items-center justify-center bg-gray-400 text-white font-semibold text-xs px-3 py-2 rounded cursor-not-allowed">
                            Society Services
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        ) : (
                          <Link href={`${city.href}/services`} className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-2 rounded transition-all duration-300">
                            Society Services
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="block h-full">
                    <div className="bg-gray-100 px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-700">
                          {city.name}
                        </h3>
                        <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                          SOON
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {city.description}
                      </p>
                      <div className="inline-flex items-center bg-gray-400 text-white font-semibold text-sm px-3 py-2 rounded cursor-not-allowed">
                        Explore City
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
      <Footer />
    </div>
  );
} 