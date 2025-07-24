'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { 
  FiSearch, 
  FiTruck,
  FiCircle
} from 'react-icons/fi';

export default function DeliveryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with the query
      window.location.href = `/mumbai/community/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-xl md:text-4xl font-bold text-white text-center px-4">Delivery Vendors Rated by Community</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a delivery service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
            />
            <button type="submit" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Search
            </button>
          </form>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
} 