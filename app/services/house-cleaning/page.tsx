'use client';

import Header from '@/components/Header';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import { houseCleaningServices } from '@/app/data/services/house-cleaning';
import { useState } from 'react';

// Group services by brand to show as vendors
const vendors = Array.from(new Set(houseCleaningServices.map(p => p.brand))).map(brand => ({
  name: brand,
  services: houseCleaningServices.filter(p => p.brand === brand),
  mobile: '+91 98765 43210' // This should come from your data
}));

export default function HouseCleaningPage() {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const toggleVendor = (vendorName: string) => {
    setExpandedVendor(expandedVendor === vendorName ? null : vendorName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">House Cleaning Services</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for cleaning services..."
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
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {vendor.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {vendor.services.length} services available
                  </p>
                  <a 
                    href={`tel:${vendor.mobile}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 block mb-3"
                  >
                    {vendor.mobile}
                  </a>
                  <button
                    onClick={() => toggleVendor(vendor.name)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {expandedVendor === vendor.name ? (
                      <>
                        <FiChevronUp className="w-4 h-4" />
                        Hide Services
                      </>
                    ) : (
                      <>
                        <FiChevronDown className="w-4 h-4" />
                        View Services
                      </>
                    )}
                  </button>
                </div>
                {expandedVendor === vendor.name && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="space-y-4">
                      {vendor.services.map((service) => (
                        <div key={service.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">{service.name}</h3>
                          <div className="space-y-1">
                            {service.services.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{item.type}</span>
                                <span className="text-gray-900 font-medium">${item.price.toFixed(2)}/{item.unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 