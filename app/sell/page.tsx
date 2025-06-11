'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import { FiHome } from 'react-icons/fi';

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Sell Apartments</h1>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">List Your Property for Sale</h1>
            <p className="text-xl text-gray-600 mb-12">
              Choose your apartment type and reach buyers in your society
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/sell/t1" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">T1 Apartment</h2>
                  <p className="text-gray-600 text-sm">Ideal for Couples and Small Families</p>
                </div>
              </div>
            </Link>
            <Link href="/sell/t2" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">T2 Apartment</h2>
                  <p className="text-gray-600 text-sm">Ideal for Couples and Small Families</p>
                </div>
              </div>
            </Link>
            <Link href="/sell/t3" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">T3 Apartment</h2>
                  <p className="text-gray-600 text-sm">Ideal for Couples and Small Families</p>
                </div>
              </div>
            </Link>
            <Link href="/sell/t4" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">T4 Apartment</h2>
                  <p className="text-gray-600 text-sm">Ideal for Large Families</p>
                </div>
              </div>
            </Link>
            <Link href="/sell/t5" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">T5 Apartment</h2>
                  <p className="text-gray-600 text-sm">Ideal for Large Families</p>
                </div>
              </div>
            </Link>
            <Link href="/sell/t6" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">T6 Apartment</h2>
                  <p className="text-gray-600 text-sm">Ideal for Large Families</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
