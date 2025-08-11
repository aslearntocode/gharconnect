'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { FiSearch } from 'react-icons/fi';
import { vendors } from '@/app/mumbai/community/data/delivery/dairy';
import { VendorCard } from '@/components/VendorCard';
import { searchVendors } from '@/utils/searchUtils';
import Disclaimer from '@/components/Disclaimer';

export default function DairyPage() {
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
        <div className="w-full h-32 bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white relative z-10 flex items-center gap-3">
            <span className="text-4xl">🥛</span>
            Dairy Vendors
          </h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-xl flex items-center px-6 py-4 gap-3 border border-gray-100">
            <FiSearch className="text-indigo-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for dairy products, vendors..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Info Section */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <span className="text-3xl">🥛</span>
                Fresh Dairy Products
              </h2>
              <p className="text-gray-700 mb-4 max-w-3xl mx-auto">
                Get fresh milk, paneer, curd, and other dairy products from trusted local vendors.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Trusted vendors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Competitive prices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Area Selector */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-2 inline-flex flex-wrap gap-2 border border-gray-100">
              {['Parel', 'Worli', 'Bandra', 'Mahalaxmi', 'Juhu', 'Powai', 'Malad', 'Andheri', 'Goregaon', 'Thane'].map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedArea === area
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <span className="text-lg">
                    {area === 'Parel' ? '🏢' : 
                     area === 'Worli' ? '🌉' : 
                     area === 'Bandra' ? '🌊' : 
                     area === 'Mahalaxmi' ? '🏛️' : 
                     area === 'Juhu' ? '🏖️' : 
                     area === 'Powai' ? '🏞️' : 
                     area === 'Malad' ? '🏘️' : 
                     area === 'Andheri' ? '🏪' : 
                     area === 'Goregaon' ? '🌳' : 
                     area === 'Thane' ? '🌆' : '📍'}
                  </span>
                  {area}
                </button>
              ))}
            </div>
          </div>
          
          {/* Vendor Count */}
          {filteredVendors.length > 0 && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-indigo-600 font-semibold">{filteredVendors.length}</span>
                <span className="text-gray-600">dairy vendor{filteredVendors.length !== 1 ? 's' : ''} found in {selectedArea}</span>
              </div>
            </div>
          )}
          
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? `No dairy vendors found for "${searchQuery}" in ${selectedArea}` : `No dairy vendors available in ${selectedArea}`}
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => setSelectedArea('Parel')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Change Area
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Disclaimer />
      </main>
    </div>
  );
} 