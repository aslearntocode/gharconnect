'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { FiSearch, FiDroplet, FiTool, FiZap, FiHome, FiEdit, FiTrendingUp, FiAward, FiBookOpen } from 'react-icons/fi';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-blue-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Home Services</h1>
        </div>
        {/* Filter/Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-7 w-full max-w-2xl z-10">
          <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-2">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a service..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-base"
              disabled
            />
            {/* Add more filter controls here if needed */}
          </div>
        </div>
      </div>
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Services</h1>
            <p className="text-xl text-gray-600 mb-12">
              Find trusted professionals for all your home service needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/parel/services/laundry" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiDroplet className="text-4xl text-blue-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Laundry</h2>
                  <p className="text-gray-600 text-sm">Professional laundry and dry cleaning</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/carpenter" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiTool className="text-4xl text-yellow-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Carpenter</h2>
                  <p className="text-gray-600 text-sm">Woodwork, repairs, and furniture</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/plumber" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiTool className="text-4xl text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Plumber</h2>
                  <p className="text-gray-600 text-sm">Leak repairs, fittings, and more</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/electrician" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiZap className="text-4xl text-yellow-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Electrician</h2>
                  <p className="text-gray-600 text-sm">Wiring, repairs, and installations</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/cleaning" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiHome className="text-4xl text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Cleaning</h2>
                  <p className="text-gray-600 text-sm">Home and office cleaning</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/painter" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiEdit className="text-4xl text-pink-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Painter</h2>
                  <p className="text-gray-600 text-sm">Wall painting and touch-ups</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/gardener" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiHome className="text-4xl text-green-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Gardener</h2>
                  <p className="text-gray-600 text-sm">Garden care and landscaping</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/ac-service" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiZap className="text-4xl text-blue-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">AC Service</h2>
                  <p className="text-gray-600 text-sm">AC repair and maintenance</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/pest-control" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiTool className="text-4xl text-red-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Pest Control</h2>
                  <p className="text-gray-600 text-sm">Termite and pest removal</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/physical-training" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiTrendingUp className="text-4xl text-indigo-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Physical Training</h2>
                  <p className="text-gray-600 text-sm">Personal and group training</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/yoga" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiAward className="text-4xl text-green-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Yoga</h2>
                  <p className="text-gray-600 text-sm">Yoga classes and workshops</p>
                </div>
              </div>
            </Link>
            <Link href="/parel/services/kids-classes" className="block group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-indigo-200 flex items-center gap-4">
                <FiBookOpen className="text-4xl text-orange-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Kids Classes</h2>
                  <p className="text-gray-600 text-sm">Learning and fun for kids</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 