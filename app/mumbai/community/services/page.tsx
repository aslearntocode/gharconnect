'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { 
  FiDroplet, 
  FiTool, 
  FiZap, 
  FiHome, 
  FiEdit, 
  FiTrendingUp, 
  FiAward, 
  FiBookOpen,
  FiUsers,
  FiTruck,
  FiMonitor,
  FiScissors,
  FiFileText,
  FiShield,
  FiHeart
} from 'react-icons/fi';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      {/* Blue Banner */}
      <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
        <h1 className="text-xl md:text-4xl font-bold text-white text-center px-4">Service Providers Rated by Community</h1>
      </div>
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Home Maintenance Services */}
            <Link href="/mumbai/community/services/laundry" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiDroplet className="text-2xl md:text-3xl text-blue-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Laundry</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/carpenter" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTool className="text-2xl md:text-3xl text-yellow-600 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Carpenter</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/tailor" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiScissors className="text-2xl md:text-3xl text-purple-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Tailor</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/plumber" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTool className="text-2xl md:text-3xl text-blue-600 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Plumber</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/electrician" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiZap className="text-2xl md:text-3xl text-yellow-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Electrician</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/domestic-help" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiUsers className="text-2xl md:text-3xl text-indigo-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Domestic Help</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/car-clean" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-blue-600 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Car Clean</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/painter" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiEdit className="text-2xl md:text-3xl text-pink-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Painter</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/gardener" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiHome className="text-2xl md:text-3xl text-green-600 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Gardener</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/ac-service" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiZap className="text-2xl md:text-3xl text-blue-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">AC Service</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/pest-control" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiShield className="text-2xl md:text-3xl text-red-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Pest Control</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/laptop-repair" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiMonitor className="text-2xl md:text-3xl text-indigo-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Laptop Repair</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/electronics-repair" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiMonitor className="text-2xl md:text-3xl text-blue-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Electronics Repair</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/scrap-dealer" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTool className="text-2xl md:text-3xl text-gray-600 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Scrap Dealer</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/notary" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiFileText className="text-2xl md:text-3xl text-green-600 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Notary</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/piegon-net" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiShield className="text-2xl md:text-3xl text-purple-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Pigeon Net</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/movers-packers" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-orange-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Movers & Packers</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/physical-training" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTrendingUp className="text-2xl md:text-3xl text-indigo-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Physical Training</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/yoga" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiAward className="text-2xl md:text-3xl text-green-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Yoga</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/massage" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiHeart className="text-2xl md:text-3xl text-pink-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Massage</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/services/kids-classes" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiBookOpen className="text-2xl md:text-3xl text-orange-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Kids Classes</h2>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 