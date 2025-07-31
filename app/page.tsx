import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GharConnect - Community Platform for Rentals & Local Services',
  description: 'Find brokerage-free apartments for rent in Mumbai, Bangalore, and Pune. Connect with neighbors, discover local services, and join your community marketplace. No hidden charges, transparent pricing.',
  keywords: 'rental apartments, no brokerage, community platform, local services, society management, Mumbai rentals, Bangalore rentals, Pune rentals, domestic help, driver services, marketplace, neighborhood connect, society amenities, community discussions',
  openGraph: {
    title: 'GharConnect - Community Platform for Rentals & Local Services',
    description: 'Find brokerage-free apartments for rent in Mumbai, Bangalore, and Pune. Connect with neighbors, discover local services, and join your community marketplace.',
    type: 'website',
    url: 'https://gharconnect.in',
    siteName: 'GharConnect',
    locale: 'en_IN',
    images: [
      {
        url: 'https://gharconnect.in/GC_Logo.png',
        width: 1200,
        height: 630,
        alt: 'GharConnect - Community Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GharConnect - Community Platform for Rentals & Local Services',
    description: 'Find brokerage-free apartments for rent in Mumbai, Bangalore, and Pune. Connect with neighbors, discover local services.',
    images: ['https://gharconnect.in/GC_Logo.png'],
    creator: '@gharconnect',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://gharconnect.in',
  },
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
    href: '/mumbai/community',
    status: 'active'
  },
  {
    name: 'Bangalore',
    description: 'Bangalore',
    href: '/bangalore/community/',
    status: 'active'
  },
  {
    name: 'Pune',
    description: 'Pune',
    href: '/pune/community/',
    status: 'active'
  },
  {
    name: 'Hyderabad',
    description: 'Hyderabad, Secunderabad',
    href: '/hyderabad/community',
    status: 'coming-soon'
  },
  {
    name: 'Delhi',
    description: 'Delhi, NCR',
    href: '/delhi/community',
    status: 'coming-soon'
  },
  {
    name: 'Chennai',
    description: 'Chennai',
    href: '/chennai/community',
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

      {/* Main Content */}
      <main className="flex-1 px-2 py-0">
        <div className="max-w-6xl mx-auto">
          {/* Features Section */}
          <section className="bg-indigo-600 rounded-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-3">One Powerful Platform</h2>
              <p className="text-indigo-100 text-lg">
                Whether you're renting without a broker, or hiring a domestic help or ordering milk - <br />
                <strong className="text-white">GharConnect.in</strong> has it all!
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4">
              <div className="text-center">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-lg md:text-2xl">🏠</span>
                </div>
                <h3 className="text-white font-semibold text-xs md:text-lg mb-1 md:mb-2">Rentals with No Brokerage</h3>
                <p className="text-indigo-100 text-xs hidden md:block">
                  Find your perfect home without paying hefty brokerage fees. Direct deals with property owners.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-lg md:text-2xl">🔧</span>
                </div>
                <h3 className="text-white font-semibold text-xs md:text-lg mb-1 md:mb-2">Local Services & Delivery</h3>
                <p className="text-indigo-100 text-xs hidden md:block">
                  Connect with trusted local service providers for repairs, cleaning, delivery, and more.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-lg md:text-2xl">👥</span>
                </div>
                <h3 className="text-white font-semibold text-xs md:text-lg mb-1 md:mb-2">Connect with Residents</h3>
                <p className="text-indigo-100 text-xs hidden md:block">
                  Join your local community. Chat, share, and connect with neighbors in your area.
                </p>
              </div>
            </div>
          </section>

          {/* City Selection - Centered and Prominent */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-6">Choose a City</h2>

            {/* Cities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {rentalCities.map((city) => (
                <div
                  key={city.name}
                  className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${city.status === 'coming-soon' ? 'opacity-75' : 'hover:border-indigo-500 hover:shadow-lg'} transition-all duration-300`}
                >
                  {city.status === 'active' ? (
                    <Link href={city.name === 'Mumbai' ? '/mumbai/community' : city.href} className="block group h-full">
                      <div className="relative h-28 bg-gray-200">
                        <Image
                          src={`/images/home/${city.name.toLowerCase()}.png`}
                          alt={`${city.name} city`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <h3 className="text-lg font-bold mb-1 text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {city.description}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="block h-full">
                      <div className="relative h-28 bg-gray-200">
                        <Image
                          src={`/images/home/${city.name.toLowerCase()}.png`}
                          alt={`${city.name} city`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                            COMING SOON
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <h3 className="text-lg font-bold mb-1 text-gray-700">
                          {city.name}
                        </h3>
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
      </main>

      {/* Testimonials Section */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Customers Love Us
            </h2>
          </div>

          {/* Text Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Kritika Desai',
                rating: 5,
                headline: 'Helps us to find good properties',
                text: 'The site really helps us to find good properties in the least amount of time without any headache of brokerage. It is hassle free and easy to use.'
              },
              {
                name: 'Mona Singh',
                rating: 5,
                headline: "It's a nice experience",
                text: 'It was a nice experience with GharConnect. They helped me to find a new home to stay without any brokerage. Thankfully GharConnect helped me to get one with fully furnished rooms.'
              },
              {
                name: 'Rajesh Kumar',
                rating: 5,
                headline: 'Listed my property at GharConnect',
                text: 'The process to list was super easy and the team was professional. Gold package helped me get the property rented in no time.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <h5 className="font-bold text-gray-900 mb-2">{testimonial.headline}</h5>
                <p className="text-gray-600 text-sm leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 