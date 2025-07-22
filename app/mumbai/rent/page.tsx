'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MumbaiRentTypeSelection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const packages = [
    {
      name: 'Bronze',
      price: '₹0',
      icon: '🥉',
      description: 'Basic listing',
      features: [
        'Listing on the Website',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Silver',
      price: '₹999',
      originalPrice: '₹2,999',
      icon: '🥈',
      description: 'For property owners who want essential services',
      features: [
        'Property Promotion on the Website',
        '5 Property Showings on Owner\'s Behalf',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-gray-200',
      bgColor: 'bg-gray-100'
    },
    {
      name: 'Gold',
      price: '₹2,999',
      originalPrice: '₹4,999',
      icon: '🥇',
      description: 'Premium services for your property',
      features: [
        'Everything in Silver',
        'Professional Property Photoshoot',
        '5 Additional Property Showings on Owner\'s Behalf',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-yellow-400',
      bgColor: 'bg-yellow-100',
      isPopular: true
    },
    {
      name: 'Platinum',
      price: '₹4,999',
      originalPrice: '₹6,999',
      icon: '💎',
      description: 'Complete peace of mind for property owners',
      features: [
        'Everything in Gold',
        'Timely Property Readiness Services including Painting, Carpentry, Repairing, etc.',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-100'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % packages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + packages.length) % packages.length);
  };

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
            <h2 className="text-xl font-bold mb-2">Premium Apartments</h2>
            <p className="text-gray-700 mb-4">Browse and rent premium apartments in Mumbai. No brokerage, direct from owners.</p>
            <Link href="/mumbai/rent/apartment" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow transition-all">
              Explore
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          {/* PG Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full max-w-md flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2">Premium PG Accommodation</h2>
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
              <p className="text-lg text-gray-600 max-w-5xl mx-auto">
                Comprehensive packages designed to make property listing hassle-free <br/>
                <span className="text-lg text-gray-500 font-bold text-indigo-600">No Brokerage Ever</span>
              </p>
            </div>
            
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {packages.map((pkg, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <div className={`bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-shadow border-2 ${pkg.borderColor} relative h-80 flex flex-col`}>
                          {pkg.isPopular && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <span className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold">MOST POPULAR</span>
                            </div>
                          )}
                          <div className={`w-12 h-12 ${pkg.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-xl">{pkg.icon}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                          <div className="text-2xl font-bold text-indigo-600 mb-1">
                            {pkg.originalPrice ? (
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm md:text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                                <span className="text-lg md:text-2xl text-indigo-600 transform -rotate-2 bg-yellow-100 px-2 py-1 rounded-lg shadow-sm">{pkg.price}</span>
                              </div>
                            ) : (
                              pkg.price
                            )}
                          </div>
                          <p className="text-gray-600 text-xs mb-4">
                            {pkg.description}
                          </p>
                          <ul className="text-left text-gray-700 space-y-2 mb-4 flex-grow">
                            {pkg.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-3 max-w-7xl mx-auto">
              {/* Bronze Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-orange-300">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥉</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Bronze</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">₹0</div>
                <p className="text-gray-600 text-xs mb-3">
                  Basic listing
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Listing on the Website</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
              </div>

              {/* Silver Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-gray-200">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥈</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Silver</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400 line-through">₹2,999</span>
                    <span className="text-xl text-indigo-600 transform -rotate-1 bg-yellow-100 px-1.5 py-0.5 rounded shadow-sm">₹999</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3">
                  For property owners who want essential services
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Property Promotion on the Website</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Legal Paperwork</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">5 Property Showings on Owner's Behalf</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
              </div>

              {/* Gold Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-yellow-400 relative">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">MOST POPULAR</span>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥇</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Gold</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400 line-through">₹4,999</span>
                    <span className="text-xl text-indigo-600 transform -rotate-1 bg-yellow-100 px-1.5 py-0.5 rounded shadow-sm">₹2,999</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3">
                  Premium services for your property
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Everything in Silver</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Professional Property Photoshoot</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">5 Additional Property Showings on Owner's Behalf</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
              </div>

              {/* Platinum Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-purple-400">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">💎</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Platinum</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400 line-through">₹6,999</span>
                    <span className="text-xl text-indigo-600 transform -rotate-1 bg-yellow-100 px-1.5 py-0.5 rounded shadow-sm">₹4,999</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-3">
                  Complete peace of mind for property owners
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Everything in Gold</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Timely Property Readiness Services including Painting, Carpentry, Repairing, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Important Note */}
            <div className="text-center mt-8 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> Legal paperwork costs and property readiness services (painting, carpentry, etc.) are to be borne by the property owner. We provide the service coordination and quality assurance.
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
