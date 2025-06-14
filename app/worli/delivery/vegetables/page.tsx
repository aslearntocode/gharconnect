'use client';

import Header from '@/components/Header';
import { FiSearch } from 'react-icons/fi';
import { vegetableProducts } from '@/app/worli/data/delivery/vegetables';
import { VendorCard } from '@/components/VendorCard';

// Group products by brand to show as vendors
const vendors = Array.from(new Set(vegetableProducts.map(p => p.brand))).map(brand => ({
  name: brand,
  products: vegetableProducts.filter(p => p.brand === brand),
  mobile: '+91 98765 43210' // This should come from your data
}));

export default function VegetablesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Vegetable Vendors</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for vegetable vendors..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              disabled
            />
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor, index) => (
              <VendorCard
                key={index}
                vendor={vendor}
                type="delivery"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 