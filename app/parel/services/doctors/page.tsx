'use client'

import { useState } from 'react';
import { doctors } from '@/app/parel/data/services/doctors';
import { FiSearch, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import Header from "@/components/Header";

// Function to mask phone number
const maskPhoneNumber = (phone: string) => {
  return '**********';
};

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.society.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Doctors</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, specialization or society..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
            />
          </div>
        </div>
      </div>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Find trusted medical professionals near your society.
            </p>
            <p className="text-indigo-600 font-bold max-w-3xl mx-auto">
              Contacts only available for verified users. If you are verified then login, if not then login now and WhatsApp your lease document police verified page screenshot to +919321314553
            </p>
          </div>

          {/* Doctors Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.qualification}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.specialization}</div>
                        <div className="text-sm text-gray-500">Fee: {doctor.consultationFee}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.experience}</div>
                        <div className="text-sm text-gray-500">{doctor.languages.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiPhone className="mr-2" />
                          {isVerified ? doctor.phone : maskPhoneNumber(doctor.phone)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiMapPin className="mr-2" />
                          {doctor.society}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiClock className="mr-2" />
                          {doctor.timing}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 