'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Disclaimer from '@/components/Disclaimer';
import { 
  FiTruck,
  FiCircle
} from 'react-icons/fi';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      {/* Blue Banner */}
      <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
        <h1 className="text-xl md:text-4xl font-bold text-white text-center px-4">Delivery Vendors Rated by Community</h1>
      </div>
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Delivery Services */}
            <Link href="/mumbai/community/delivery/dairy" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-blue-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Dairy</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/meat" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-red-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Meat</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/eggs" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiCircle className="text-2xl md:text-3xl text-yellow-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Eggs</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/flowers" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <span className="text-2xl md:text-3xl text-pink-500 flex-shrink-0 mb-1 md:mb-2">💐</span>
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Flowers</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/vegetables" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-green-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Vegetables</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/fruits" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-orange-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Fruits</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/dry-fruits" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-amber-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Dry Fruits</h2>
              </div>
            </Link>
            <Link href="/mumbai/community/delivery/pharmacy" className="block group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-4 border border-gray-100 group-hover:border-indigo-200 flex flex-col items-center justify-center text-center h-20 md:h-auto min-h-[80px] md:min-h-0 overflow-hidden">
                <FiTruck className="text-2xl md:text-3xl text-indigo-500 flex-shrink-0 mb-1 md:mb-2" />
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-none">Pharmacy</h2>
              </div>
            </Link>
          </div>
        </div>
        <Disclaimer />
      </main>
    </div>
  );
} 