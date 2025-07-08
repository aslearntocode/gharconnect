'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { vendors } from '@/app/worli/data/services/tailor';
import { VendorCard } from '@/components/VendorCard';
import { FiSearch, FiScissors } from 'react-icons/fi';
import { searchVendors } from '@/utils/searchUtils';

export default function TailorPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter vendors based on search query
  const filteredVendors = searchVendors(vendors, searchQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">Tailor Services <FiScissors className="inline-block mb-1 text-purple-500" /></h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for tailor services..."
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tailor services found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor, index) => (
                <VendorCard
                  key={index}
                  vendor={vendor}
                  type="service"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 