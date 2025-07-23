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
    name: 'Mumbai Community',
    description: 'Parel, Sewri, Bhoiwada, Wadala',
    href: '/mumbai/community',
    status: 'active'
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
    status: 'coming-soon'
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
                className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${city.status === 'coming-soon' ? 'opacity-75' : 'hover:border-indigo-500 hover:shadow-lg'} transition-all duration-300`}
              >
                {city.status === 'active' ? (
                  <Link href={city.name === 'Mumbai' ? '/mumbai/community' : city.href} className="block group h-full">
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {city.description}
                      </p>
                    </div>
                  </Link>
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
                      <p className="text-gray-600 text-sm">
                        {city.description}
                      </p>
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