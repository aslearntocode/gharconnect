'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BangaloreRentTypeSelection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
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
        '5 More Property Showings on Owner\'s Behalf',
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
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-xl md:text-4xl font-bold text-white text-center px-4">Find a Home in Bangalore with No Brokerage</h1>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* <p className="text-gray-700 text-lg text-center mb-8">Choose the type of rental accommodation you are looking for in Bangalore with no brokerage.</p>  */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
            {/* Apartments Card */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {/* Mobile: Only heading and button */}
                <div className="md:hidden flex flex-col items-center text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Premium Apartments
                  </h3>
                  <Link 
                    href="/bangalore/rent/apartment"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                  >
                    Explore
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                
                {/* Desktop: Full card content */}
                <div className="hidden md:block">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Premium Apartments
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    Browse and rent premium apartments in Bangalore. No brokerage, direct from owners.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Verified listings
                    </div>
                    <Link 
                      href="/bangalore/rent/apartment"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Explore
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* PG Card */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                  {/* Mobile: Only heading and button */}
                  <div className="md:hidden flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Premium PG Accommodation
                    </h3>
                    <button 
                      className="inline-flex items-center bg-gray-400 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Soon
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                
                {/* Desktop: Full card content */}
                <div className="hidden md:block">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Premium PG Accommodation
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    Find Paying Guest (PG) accommodation options for students and working professionals.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Coming Soon
                    </div>
                    <button 
                      className="inline-flex items-center bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg cursor-not-allowed"
                      disabled
                    >
                      Explore
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Why You Should List Your Property With Us Section */}
      <div className="w-full max-w-7xl mx-auto">
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
                        <div className={`bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-shadow border-2 ${pkg.borderColor} relative h-80 flex flex-col pb-6`}>
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
                          {/* Pay Now Button for Silver, Gold, and Platinum */}
                          {pkg.name !== 'Bronze' ? (
                            <button 
                              onClick={() => {
                                setSelectedPackage(pkg.name);
                                setShowQRModal(true);
                              }}
                              className={`inline-flex items-center justify-center w-full font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                                pkg.name === 'Silver' ? 'bg-green-600 hover:bg-green-700 text-white' :
                                pkg.name === 'Gold' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                                pkg.name === 'Platinum' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                                'bg-gray-400 text-white'
                              }`}
                            >
                              Pay Now
                            </button>
                          ) : (
                            <div className="h-10"></div>
                          )}
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
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-orange-300 flex flex-col h-full">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥉</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Bronze</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">₹0</div>
                <p className="text-gray-600 text-xs mb-3">
                  Basic listing
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
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
                <div className="h-10"></div>
              </div>

              {/* Silver Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-gray-200 flex flex-col h-full">
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
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
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
                {/* Payment Links - Commented out for now
                <a 
                  href="https://payments-test.cashfree.com/links?code=d8ua85k5ah00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </a>
                */}
                <button 
                  onClick={() => {
                    setSelectedPackage('Silver');
                    setShowQRModal(true);
                  }}
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </button>
              </div>

              {/* Gold Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-yellow-400 relative flex flex-col h-full">
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
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
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
                    <span className="text-xs leading-tight">5 More Property Showings on Owner's Behalf</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
                {/* Payment Links - Commented out for now
                <a 
                  href="https://payments-test.cashfree.com/links?code=D8uaaoua4h00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </a>
                */}
                <button 
                  onClick={() => {
                    setSelectedPackage('Gold');
                    setShowQRModal(true);
                  }}
                  className="inline-flex items-center justify-center w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </button>
              </div>

              {/* Platinum Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-purple-400 flex flex-col h-full">
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
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
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
                {/* Payment Links - Commented out for now
                <a 
                  href="https://payments-test.cashfree.com/links?code=m8uaar6t2h00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </a>
                */}
                <button 
                  onClick={() => {
                    setSelectedPackage('Platinum');
                    setShowQRModal(true);
                  }}
                  className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </button>
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
                href="/bangalore/list-apartment" 
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
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Pay for {selectedPackage} Package</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-2xl">G</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">GharConnect</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="bg-white rounded-lg p-4 mb-3">
                  {/* QR Code */}
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <img 
                      src="/GC_QR.jpeg" 
                      alt="GharConnect QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">UPI ID: gharconnectindia@okicici</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code with any UPI app to complete your payment for the {selectedPackage} package.
              </p>
              
              <button 
                onClick={() => setShowQRModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
