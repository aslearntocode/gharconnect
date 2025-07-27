'use client'

import Header from '@/components/Header';
import { doctors } from '@/app/mumbai/community/data/services/doctors';
import { DoctorCard } from '@/components/DoctorCard';
import { FiShield } from 'react-icons/fi';
import { useState } from 'react';
import Disclaimer from '@/components/Disclaimer';

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Parel');

  const filteredDoctors = doctors.filter(doctor => {
    // First filter by search query
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.society.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then filter by selected area
    let matchesArea = true;
    if (doctor.areaServed) {
      matchesArea = doctor.areaServed.includes(selectedArea) || doctor.areaServed.includes('All');
    }
    
    return matchesSearch && matchesArea;
  });

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold">Doctors, Dieticians, and more</h1>
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl px-4 z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiShield className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor name, specialization, or society..."
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
            <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
              <button
                onClick={() => setSelectedArea('Parel')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedArea === 'Parel'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Parel
              </button>
              <button
                onClick={() => setSelectedArea('Worli')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedArea === 'Worli'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Worli
              </button>
            </div>
          </div>
          
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700">No doctors found for "{searchQuery}"</h2>
              <p className="text-gray-500 mt-2">Try searching for another specialization or name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
        <Disclaimer />
      </main>
    </div>
  );
} 