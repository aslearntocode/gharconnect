import React from 'react';
import { CheckCircleIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Header from '@/components/Header';

interface ConfirmationPageProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ title, message, buttonText, buttonLink }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
          <div>
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </div>

          <div className="mt-8">
            <Link
              href={buttonLink}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage; 