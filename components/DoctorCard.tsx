'use client';

import { useState } from 'react';
import { Doctor } from '@/app/parel/data/services/doctors';
import { FiPhone, FiMapPin, FiClock, FiAward, FiBookOpen, FiPlusSquare } from 'react-icons/fi';
import LoginModal from './LoginModal';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleShowNumber = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 h-full flex flex-col">
        <div className="p-6 flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
              <p className="text-indigo-600 font-semibold">{doctor.specialization}</p>
            </div>
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full flex-shrink-0">
              <FiPlusSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p className="flex items-start"><FiAward className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" /><span>{doctor.qualification}</span></p>
            <p className="flex items-center"><FiBookOpen className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" /><span>{doctor.experience} experience</span></p>
            <p className="flex items-start"><FiMapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" /><span>{doctor.address}</span></p>
            <p className="flex items-center"><FiClock className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" /><span>{doctor.timing}</span></p>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-lg font-bold text-gray-800">{doctor.consultationFee}</p>
          {showPhoneNumber ? (
            <a href={`tel:${doctor.phone}`} className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm">
              <FiPhone className="w-4 h-4 mr-2" />
              {doctor.phone}
            </a>
          ) : (
            <button onClick={handleShowNumber} className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm">
              <FiPhone className="w-4 h-4 mr-2" />
              Log-in to view
            </button>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          setShowPhoneNumber(true);
        }}
      />
    </>
  );
} 