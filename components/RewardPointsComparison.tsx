import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import rewardsConversion from '../rewards_conversion.json';

interface RewardConversion {
  bank: string;
  reward_program: string;
  conversion_value: string;
  notes: string;
  highest_value: string;
}

export default function RewardPointsComparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RewardConversion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const results = (rewardsConversion as RewardConversion[]).filter(conversion => {
      const searchableText = `
        ${conversion.bank.toLowerCase()} 
        ${conversion.reward_program.toLowerCase()}
      `.replace(/\s+/g, ' ').trim();

      return searchTerms.every(term => searchableText.includes(term));
    }).sort((a, b) => {
      const scoreConversion = (conversion: RewardConversion, term: string) => {
        let score = 0;
        const termLower = term.toLowerCase();
        
        if (conversion.bank.toLowerCase().includes(termLower)) score += 10;
        if (conversion.reward_program.toLowerCase().includes(termLower)) score += 8;
        
        return score;
      }

      const scoreA = searchTerms.reduce((sum, term) => sum + scoreConversion(a, term), 0);
      const scoreB = searchTerms.reduce((sum, term) => sum + scoreConversion(b, term), 0);
      
      return scoreB - scoreA;
    });

    setSearchResults(results);
  };

  // Calculate dropdown position after render
  const updateDropdownPos = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Update dropdown position when searching
  React.useEffect(() => {
    if (isSearching && searchResults.length > 0) {
      updateDropdownPos();
    }
  }, [isSearching, searchResults.length]);

  return (
    <div className="relative py-16 bg-[#f5f6fd] overflow-hidden">
      {/* Grid background pattern */}
      <div aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[2.2rem] font-bold mb-2">Reward Points Conversion Rates</h2>
          <p className="text-base text-gray-600">Find out how much your reward points are worth across different banks</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for your bank..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Dropdown rendered in a portal */}
            {isSearching && searchResults.length > 0 && typeof window !== 'undefined' && createPortal(
              <div
                className="absolute z-[9999] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto"
                style={{
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  position: 'absolute',
                }}
              >
                {searchResults.map((conversion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{conversion.bank}</div>
                    <div className="text-sm text-gray-500">{conversion.reward_program}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Conversion Value:</span> {conversion.conversion_value}
                    </div>
                    {conversion.highest_value && (
                      <div className="text-sm text-green-600 mt-1">
                        <span className="font-medium">Best Value:</span> {conversion.highest_value}
                      </div>
                    )}
                    {conversion.notes && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Notes:</span> {conversion.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 