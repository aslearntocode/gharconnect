'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import { FiHome } from 'react-icons/fi';
import { rentApartments } from '../data/rentApartments';

export default function RentPage() {
  // Group apartments by type
  const apartmentsByType = rentApartments.reduce((acc, apt) => {
    if (!acc[apt.type]) {
      acc[apt.type] = [];
    }
    acc[apt.type].push(apt);
    return acc;
  }, {} as Record<string, typeof rentApartments>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Rent Apartments</h1>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Home</h1>
            <p className="text-xl text-gray-600 mb-12">
              Browse available apartments and find the perfect fit for your needs
            </p>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((type) => {
              const apartments = apartmentsByType[type] || [];
              const availableCount = apartments.filter(apt => apt.status === 'available').length;
              
              return (
                <Link href={`/rent/${type.toLowerCase()}`} key={type} className="block group">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-200 flex items-center gap-4">
                    <FiHome className="text-4xl text-blue-600 flex-shrink-0" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                        {type} Apartment
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {availableCount > 0 
                          ? `${availableCount} ${availableCount === 1 ? 'property' : 'properties'} available`
                          : 'No properties available'}
                      </p>
                      {apartments.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Starting from ₹{Math.min(...apartments.map(apt => apt.monthlyRent)).toLocaleString()}/month
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
