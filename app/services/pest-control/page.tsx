'use client';

import Header from '@/components/Header';
import { FiSearch, FiTool, FiPhone } from 'react-icons/fi';
import { pestControlServices } from '@/app/data/services/pest-control';

export default function PestControlPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Pest Control Services</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for pest control services..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              disabled
            />
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pestControlServices && pestControlServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex items-center gap-4">
                <FiTool className="text-4xl text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                  <a href={`tel:${service.mobile}`} className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 mb-2">
                    <FiPhone className="w-4 h-4 mr-1" />
                    {service.mobile}
                  </a>
                  <div className="flex items-center gap-4 mb-1">
                    <span className="text-blue-600 font-bold text-base">₹{service.price}</span>
                    <span className="text-gray-500 text-sm">{service.duration}</span>
                  </div>
                  <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full w-max">{service.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
