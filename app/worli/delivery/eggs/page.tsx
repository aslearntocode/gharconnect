'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { FiSearch } from 'react-icons/fi';
import { vendors } from '@/app/worli/data/delivery/eggs';
import { VendorCard } from '@/components/VendorCard';
import { searchVendors } from '@/utils/searchUtils';

export default function EggsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter vendors based on search query
  const filteredVendors = searchVendors(vendors, searchQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Egg Vendors</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for egg vendors..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredVendors.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No egg vendors available yet. Check back soon!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((vendor, index) => (
                <VendorCard
                  key={index}
                  vendor={vendor}
                  type="delivery"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
