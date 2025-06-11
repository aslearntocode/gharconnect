'use client';

import { useState, useEffect } from 'react';
import rewardsData from '../../rewards_conversion.json';
import Header from '@/components/Header';

interface RewardProgram {
  bank: string;
  reward_program: string;
  conversion_value: string;
  notes: string;
  highest_value: string;
}

export default function RewardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRewards, setFilteredRewards] = useState<RewardProgram[]>(rewardsData);

  useEffect(() => {
    const filtered = rewardsData.filter((reward) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        reward.bank.toLowerCase().includes(searchLower) ||
        reward.reward_program.toLowerCase().includes(searchLower)
      );
    });
    setFilteredRewards(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col">
      <Header />
      {/* Blue Header - match card category page width */}
      <div className="bg-blue-600 py-12 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Rewards Conversion</h1>
          <p className="text-lg font-medium opacity-90">Compare and find the best credit card rewards conversion rates for your needs</p>
        </div>
      </div>

      {/* Search Bar - match card category page */}
      <div className="w-full max-w-xs mx-auto md:max-w-2xl relative z-10 -mt-4 md:-mt-8 mb-6">
        <input
          type="text"
          placeholder="Search by bank or reward program..."
          className="w-full px-3 md:px-6 py-1.5 md:py-3 rounded-xl bg-white shadow-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base pr-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table-like Card List - improved mobile spacing */}
      <div className="w-full md:max-w-7xl md:mx-auto px-2 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
          {/* Desktop grid (unchanged) */}
          <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b text-gray-500 font-semibold text-sm">
            <div className="col-span-4 px-6">Bank & Program</div>
            <div className="col-span-2 px-6">Conversion Value</div>
            <div className="col-span-3 px-6">Notes</div>
            <div className="col-span-3 px-6">Highest Value</div>
          </div>
          {/* Desktop rows (unchanged) */}
          <div className="hidden md:block">
            {filteredRewards.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-lg">No rewards programs found matching your search.</div>
            )}
            {filteredRewards.map((reward, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-y-2 items-center px-6 py-6 border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <div className="col-span-4 min-w-0 px-6">
                  <div className="font-semibold text-lg text-gray-900 break-words whitespace-normal">{reward.bank}</div>
                  <div className="text-blue-600 text-sm break-words whitespace-normal">{reward.reward_program}</div>
                </div>
                <div className="col-span-2 text-gray-800 font-medium text-base px-6 break-words whitespace-normal">{reward.conversion_value}</div>
                <div className="col-span-3 text-gray-600 text-sm px-6 break-words whitespace-normal">{reward.notes}</div>
                <div className="col-span-3 text-green-700 text-sm font-semibold px-6 break-words whitespace-normal">{reward.highest_value}</div>
              </div>
            ))}
          </div>
          {/* Mobile grid with horizontal scroll */}
          <div className="md:hidden">
            <div className="overflow-x-auto w-full">
              <div className="grid grid-cols-[180px_140px_220px_220px] min-w-[760px] px-2 py-4 border-b text-gray-500 font-semibold text-sm">
                <div className="px-2">Bank & Program</div>
                <div className="px-2">Conversion Value</div>
                <div className="px-2">Notes</div>
                <div className="px-2">Highest Value</div>
              </div>
              {filteredRewards.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-lg">No rewards programs found matching your search.</div>
              )}
              {filteredRewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[180px_140px_220px_220px] min-w-[760px] gap-y-2 items-center px-2 py-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <div className="min-w-0 px-2">
                    <div className="font-semibold text-lg text-gray-900 break-words whitespace-normal">{reward.bank}</div>
                    <div className="text-blue-600 text-sm break-words whitespace-normal">{reward.reward_program}</div>
                  </div>
                  <div className="text-gray-800 font-medium text-base px-2 break-words whitespace-normal">{reward.conversion_value}</div>
                  <div className="text-gray-600 text-sm px-2 break-words whitespace-normal">{reward.notes}</div>
                  <div className="text-green-700 text-sm font-semibold px-2 break-words whitespace-normal">{reward.highest_value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 flex-shrink-0" /> {/* Spacer for footer */}
    </div>
  );
} 