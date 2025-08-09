'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { vendors } from '@/app/mumbai/community/data/services/car-clean';
import { VendorCard } from '@/components/VendorCard';
import { FiSearch } from 'react-icons/fi';
import { searchVendors } from '@/utils/searchUtils';
import Disclaimer from '@/components/Disclaimer';

export default function CarCleanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Parel');

  // Filter vendors based on search query and selected area
  const filteredVendors = searchVendors(vendors, searchQuery).filter(vendor => {
    // If vendor has areaServed property, filter by it
    if (vendor.areaServed) {
      return vendor.areaServed.includes(selectedArea) || vendor.areaServed.includes('All');
    }
    // If no areaServed property, show all vendors (fallback)
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative mt-12 md:mt-16">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Car Cleaning Services</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for car cleaning services..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Area Selector */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white rounded-lg shadow-md p-1 inline-flex flex-wrap gap-1">
              {['Parel', 'Worli', 'Bandra', 'Mahalaxmi', 'Juhu', 'Powai', 'Malad', 'Andheri', 'Goregaon', 'Thane'].map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    selectedArea === area
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          
          {filteredVendors.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No results found for "{searchQuery}"
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
        <Disclaimer />
      </main>
    </div>
  );
}
