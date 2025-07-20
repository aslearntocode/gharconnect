import Link from 'next/link';
import Head from 'next/head';

const rentalOptions = [
  {
    name: 'Apartments',
    description: 'Browse and rent full apartments in Bangalore. No brokerage, direct from owners.',
    href: '/bangalore/rent',
  },
  {
    name: 'PG Accommodation',
    description: 'Find Paying Guest (PG) accommodation options for students and working professionals.',
    href: '/bangalore/rent/pg',
  }
  // {
  //   name: 'Shared Accommodation',
  //   description: 'Explore shared flats and rooms for rent in Bangalore. Suitable for students.',
  //   href: '/bangalore/shared',
  // },
];

const bangaloreAreas = [
  {
    name: 'Indiranagar, Bangalore',
    description: 'Indiranagar, Domlur',
    href: '/indiranagar',
    status: 'coming-soon'
  },
  {
    name: 'Koramangala, Bangalore',
    description: 'Koramangala, Ejipura',
    href: '/koramangala',
    status: 'coming-soon'
  },
  {
    name: 'Whitefield, Bangalore',
    description: 'Whitefield, Marathahalli',
    href: '/whitefield',
    status: 'coming-soon'
  },
  {
    name: 'Jayanagar, Bangalore',
    description: 'Jayanagar, JP Nagar',
    href: '/jayanagar',
    status: 'coming-soon'
  },
  {
    name: 'Malleshwaram, Bangalore',
    description: 'Malleshwaram, Rajajinagar',
    href: '/malleshwaram',
    status: 'coming-soon'
  }
];

export default function BangaloreRentalOptions() {
  return (
    <>
      <Head>
        <title>Bangalore Rental Apartments - No Brokerage | GharConnect</title>
        <meta name="description" content="Find rental apartments in Bangalore with minimal brokerage fees. GharConnect offers the best rental deals in Bangalore with transparent pricing and no hidden charges." />
        <meta name="keywords" content="Bangalore rental apartments, Bangalore flats for rent, low brokerage rental Bangalore, Bangalore 1BHK rent, Bangalore 2BHK rent, Bangalore 3BHK rent, rental apartments Bangalore" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://gharconnect.in/bangalore" />
        <meta property="og:title" content="Bangalore Rental Apartments - No Brokerage | GharConnect" />
        <meta property="og:description" content="Find rental apartments in Bangalore with minimal brokerage fees. Transparent pricing, no hidden charges." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gharconnect.in/bangalore" />
        <meta property="og:site_name" content="GharConnect" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bangalore Rental Apartments - No Brokerage | GharConnect" />
        <meta name="twitter:description" content="Find rental apartments in Bangalore with minimal brokerage fees." />
      </Head>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4">
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
      <div className="w-full flex justify-start mb-6 max-w-6xl">
        <Link href="/" className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-blue-700 transition-all duration-300">
          &larr; Back to All Cities
        </Link>
      </div>
      <div className="w-full max-w-6xl space-y-8">
        {/* Find a Home in Bangalore Section */}
        <div className="bg-gradient-to-br from-white via-green-50 to-green-100 rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Find a Home in Bangalore with No Brokerage</h2>
          <p className="text-gray-600 text-sm mb-6 text-center">Choose the type of rental accommodation you are looking for in Bangalore with no brokerage.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rentalOptions.map((option) => (
              <div key={option.name} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-4 py-3">
                  <h3 className="text-sm font-bold mb-1 text-gray-900">{option.name}</h3>
                  <p className="text-gray-600 text-xs mb-2">{option.description}</p>
                  <Link href={option.href} className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold text-xs px-2 py-1 rounded hover:from-green-700 hover:to-blue-700 transition-all duration-300">
                    Explore
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Society Services Section */}
        <div className="bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Society Services</h2>
          <p className="text-gray-600 text-sm mb-6 text-center">Connect with your society, find domestic help, drivers, and stay updated with your community.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bangaloreAreas.map((area) => (
              <div
                key={area.name}
                className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${area.status === 'coming-soon' ? 'opacity-75' : 'hover:border-indigo-500'} transition-all duration-300`}
              >
                {area.status === 'active' ? (
                  <Link href={area.href} className="block group h-full">
                    <div className="px-4 py-3">
                      <h3 className="text-sm font-bold mb-1 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {area.name}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2">
                        {area.description}
                      </p>
                      <div className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs px-2 py-1 rounded group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                        Explore Community
                        <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="block h-full">
                    <div className="bg-gray-100 px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-700">
                          {area.name}
                        </h3>
                        <span className="bg-yellow-500 text-yellow-900 text-xs px-1 py-0.5 rounded-full font-bold">
                          SOON
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">
                        {area.description}
                      </p>
                      <div className="inline-flex items-center bg-gray-400 text-white font-semibold text-xs px-2 py-1 rounded cursor-not-allowed">
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
    </div>
    </>
  );
} 