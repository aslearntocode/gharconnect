'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Header from "@/components/Header"
import TestimonialCarousel from "@/components/TestimonialCarousel"
import { FiHome, FiBriefcase, FiDroplet, FiTool, FiEdit, FiZap, FiUsers, FiShield, FiFileText, FiGrid, FiTruck, FiTrendingUp, FiAward, FiHeart, FiBookOpen, FiMonitor, FiScissors } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header isScrolled={false} />
      <main className="min-h-screen bg-white pt-12 md:pt-16">
        {/* Back to All Cities Button */}
        <div className="px-4 mb-4">
          <Link 
            href="/" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Cities
          </Link>
        </div>

        <div className="flex flex-col items-center mb-4 md:mb-8 mt-0 md:mt-2">
          <div className="text-sm md:text-3xl font-bold md:font-medium text-center text-indigo-700 italic bg-indigo-50 px-8 md:px-16 py-2 rounded-lg w-full max-w-1xl">
            Welcome to GharConnect @Mumbai where Property Owners, Residents and Businesses Connect
          </div>
        </div>

        {/* Rental Accommodation Section */}
        <div className="pt-6 md:pt-12 pb-12 md:pb-20 relative overflow-hidden transition-all duration-1000 ease-in-out bg-cover bg-center bg-no-repeat hero-section" style={{ backgroundImage: 'url(/images/home/mumbai.png)' }}>
          <div className="absolute inset-0 bg-black/40 md:bg-black/30 z-0 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Find a Home in Mumbai with No Brokerage
              </h2>
              <p className="text-base md:text-lg text-white max-w-3xl mx-auto leading-relaxed font-semibold">
                The only no brokerage platform that focuses on rental accommodations only.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
              {/* Premium Apartments Card */}
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="md:hidden flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Premium Apartments</h3>
                    <Link 
                      href="/mumbai/rent/apartment"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                    >
                      Explore
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="hidden md:block">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <FiHome className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Premium Apartments</h3>
                    </div>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      Browse and rent premium apartments in Mumbai. No brokerage, direct from owners.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Verified listings
                      </div>
                      <Link 
                        href="/mumbai/rent/apartment"
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
              
              {/* Premium PG Accommodation Card */}
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="md:hidden flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Premium PG Accommodation</h3>
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
                  
                  <div className="hidden md:block">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <FiBriefcase className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Premium PG Accommodation</h3>
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
        </div>

        {/* Delivery Categories Section */}
        <div id="delivery-categories" className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-3">Delivery Vendors Rated by Community</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Order fresh essentials delivered to your door</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-6">
              <Link href="/mumbai/community/delivery/dairy" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥛</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Dairy</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/meat" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🍗</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Meat</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/eggs" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥚</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Eggs</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/flowers" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">💐</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Flowers</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/vegetables" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥦</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Vegetables</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/fruits" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🍎</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Fruits</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/dry-fruits" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥜</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Dry Fruits</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/pharmacy" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">💊</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Pharmacy</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Services Categories Section */}
        <div id="services-categories" className="bg-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-3">Service Providers Rated by Community</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Book trusted home and personal services</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-6">
              <Link href="/mumbai/community/services/laundry" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiDroplet className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Laundry</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/carpenter" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiTool className="w-7 h-7 mb-2 text-yellow-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Carpenter</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/tailor" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiScissors className="w-7 h-7 mb-2 text-purple-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Tailor</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/plumber" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiTool className="w-7 h-7 mb-2 text-blue-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Plumber</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/electrician" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiZap className="w-7 h-7 mb-2 text-yellow-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Electrician</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/domestic-help" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiUsers className="w-7 h-7 mb-2 text-indigo-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Domestic Help</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/car-clean" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiTruck className="w-7 h-7 mb-2 text-blue-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Car Clean</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/painter" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiEdit className="w-7 h-7 mb-2 text-pink-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Painter</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/gardener" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiHome className="w-7 h-7 mb-2 text-green-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Gardener</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/ac-service" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiZap className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">AC Service</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/pest-control" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiShield className="w-7 h-7 mb-2 text-red-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Pest Control</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/laptop-repair" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiMonitor className="w-7 h-7 mb-2 text-indigo-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Laptop Repair</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/electronics-repair" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiMonitor className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Electronics Repair</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/scrap-dealer" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiTool className="w-7 h-7 mb-2 text-gray-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Scrap Dealer</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/notary" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiFileText className="w-7 h-7 mb-2 text-green-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Notary</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/piegon-net" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiShield className="w-7 h-7 mb-2 text-purple-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Pigeon Net</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/movers-packers" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiTruck className="w-7 h-7 mb-2 text-orange-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Movers & Packers</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/physical-training" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiTrendingUp className="w-7 h-7 mb-2 text-indigo-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Physical Training</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/yoga" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiAward className="w-7 h-7 mb-2 text-green-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Yoga</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/massage" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiHeart className="w-7 h-7 mb-2 text-pink-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Massage</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/kids-classes" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <FiBookOpen className="w-7 h-7 mb-2 text-orange-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Kids Classes</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/music-classes" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl h-20 md:h-28">
                  <span className="mb-2 text-2xl text-purple-500 lg:mb-3 lg:text-4xl">🎵</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Music Classes</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Numbers Since Launch Section */}
        <div className="bg-white py-6 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center mb-6 md:mb-10">Numbers Since Launch in Mar 2025</h2>
            <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-4 md:gap-8 md:gap-0 md:divide-x md:divide-gray-200">
              <div className="flex flex-col items-center px-4 md:px-8 lg:px-12">
                <span className="text-blue-700 text-2xl md:text-4xl font-bold mb-1">50+</span>
                <span className="text-gray-800 text-xs md:text-base text-center">
                  <span className="block md:hidden">Apartments<br/>Rented</span>
                  <span className="hidden md:block">Apartments Rented</span>
                </span>
              </div>
              <div className="flex flex-col items-center px-4 md:px-8 lg:px-12">
                <span className="text-blue-700 text-2xl md:text-4xl font-bold mb-1">500+</span>
                <span className="text-gray-800 text-xs md:text-base text-center">
                  <span className="block md:hidden">Service<br/>Providers</span>
                  <span className="hidden md:block">Service and Delivery<br/>Providers Listed</span>
                </span>
              </div>
              <div className="flex flex-col items-center px-4 md:px-8 lg:px-12">
                <span className="text-blue-700 text-2xl md:text-4xl font-bold mb-1">2</span>
                <span className="text-gray-800 text-xs md:text-base text-center">
                  <span className="block md:hidden">Cities<br/>Covered</span>
                  <span className="hidden md:block">Cities<br/>Covered</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <TestimonialCarousel />
      </main>
    </div>
  )
}

