import React from 'react';
import { CheckCircleIcon, HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ApartmentFormData } from '@/lib/apartment-schema';

interface SuccessPageProps {
  apartmentData: ApartmentFormData;
  onListAnother: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ apartmentData, onListAnother }) => {
  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
        <div>
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Listing Created Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your property has been listed. Thank you for choosing GharConnect.
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-4 mt-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-blue-800">Next Step: Send Photos</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>To complete your listing, please WhatsApp your apartment photos to <strong className="font-semibold">+91 9321314553</strong>. Make sure to send them from the same phone number you've provided in the contact details.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={onListAnother}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            List Another Property
          </button>
          <Link 
            href="/"
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 