'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { FiHome } from 'react-icons/fi';

const buildings = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function RentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Properties for Rent</h1>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Link href={`/ag-sewri/rent/${building}`} key={building} className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                  <FiHome className="text-4xl text-indigo-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Building {building}</h2>
                    <p className="text-gray-600 text-sm">View available properties</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 