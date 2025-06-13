'use client'

import Link from 'next/link';
import SocietyImage from '@/components/SocietyImage';
import { useState } from 'react';

const societies = [
  {
    name: 'L&T Crescent Bay, Bhoiwada',
    href: '/parel',
    description: 'A premium residential complex in Parel.',
    image: '/cb.png',
  },
  {
    name: 'Ashok Gardens, Sewri',
    href: '/parel',
    description: 'A vibrant community in the heart of Sewri.',
    image: '/ag.png',
  },
  {
    name: 'Island City Centre (ICC), Bhoiwada',
    href: '/parel',
    description: 'Modern living with all amenities in Bhoiwada.',
    image: '/icc.png',
  },
  {
    name: 'Ashok Towers, Sewri',
    href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/at.png',
  },
  {
    name: 'Dosti Flamingo, Sewri',
    href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/df.png',
  },
  {
    name: 'Ruparel Ariana, Bhoiwada',
    href: '/parel',
    description: 'A peaceful society in Bhoiwada.',
    image: '/ra.png',
  },
  {
    name: 'Kalpataru Avana, Parel',
    href: '/parel',
    description: 'A luxurious society in Parel.',
    image: '/ka.png',
  },
  {
    name: 'Lodha Venezia, Parel',
    href: '/parel',
    description: 'A peaceful society in Parel.',
    image: '/lv.png',
  }
  
  // Add more societies as needed, with or without image
];

export default function SocietiesClient() {
  const [selectedArea, setSelectedArea] = useState('');

  const areas = [
    { name: 'Parel', value: 'parel' }
  ];

  const filteredSocieties = selectedArea === '' ? [] : societies;
  const first5 = filteredSocieties.slice(0, 5);
  const rest = filteredSocieties.slice(5);

  return (
    <>
      {/* Area Selection Dropdown */}
      <div className="w-full flex justify-center mb-2 md:mb-8 px-4">
        <div className="max-w-xl w-full">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none text-lg"
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area.value} value={area.value}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <main
        className={
          `${selectedArea ? 'py-8 md:py-12 lg:py-16' : 'py-8 md:py-8'} bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4 -mt-8 md:min-h-0`
        }
      >
        <div className="max-w-7xl mx-auto">
          {selectedArea && (
            <div className="flex justify-center mb-8">
              <Link
                href="/parel"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore {areas.find(a => a.value === selectedArea)?.name} Market
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Show societies only if area is selected */}
          {selectedArea && (
            <>
              {/* Mobile grid: show all societies in 2 columns */}
              <section className="grid grid-cols-2 gap-4 mb-8 block md:hidden">
                {filteredSocieties.map((society) => {
                  const isNonClickable = society.name === 'L&T Crescent Bay, Bhoiwada' || society.name === 'Ashok Gardens, Sewri';
                  const CardContent = (
                    <article className="bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center cursor-pointer border border-gray-200 group-hover:border-indigo-500 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-indigo-200 h-48 min-h-[10rem] max-h-56 justify-between">
                      {society.image ? (
                        <SocietyImage
                          src={society.image}
                          alt={`${society.name} - ${society.description}`}
                          className="w-16 h-16 object-cover rounded-2xl mb-2 border border-gray-100 shadow-lg group-hover:ring-2 group-hover:ring-indigo-300 transition-all duration-300 bg-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-2 bg-gray-100 text-gray-400 text-2xl font-bold border border-gray-100 shadow-lg" aria-label="No image available">
                          ?
                        </div>
                      )}
                      <h3 className="text-lg font-extrabold font-sans text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors text-center drop-shadow-sm flex-1 flex items-center justify-center">{society.name}</h3>
                      <p className="text-gray-600 text-center text-xs flex-1 flex items-center justify-center font-medium">{society.description}</p>
                    </article>
                  );

                  return isNonClickable ? (
                    <div key={society.name} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                      {CardContent}
                    </div>
                  ) : (
                    <Link key={society.name} href={society.href} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                      {CardContent}
                    </Link>
                  );
                })}
              </section>
              {/* Desktop: keep the current split and layout */}
              <section aria-label="Featured Societies" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 hidden md:grid">
                {first5.map((society) => {
                  const isNonClickable = society.name === 'L&T Crescent Bay, Bhoiwada' || society.name === 'Ashok Gardens, Sewri';
                  const CardContent = (
                    <article className="bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center cursor-pointer border border-gray-200 group-hover:border-indigo-500 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-indigo-200 h-48 min-h-[10rem] max-h-56 justify-between">
                      {society.image ? (
                        <SocietyImage
                          src={society.image}
                          alt={`${society.name} - ${society.description}`}
                          className="w-16 h-16 object-cover rounded-2xl mb-2 border border-gray-100 shadow-lg group-hover:ring-2 group-hover:ring-indigo-300 transition-all duration-300 bg-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-2 bg-gray-100 text-gray-400 text-2xl font-bold border border-gray-100 shadow-lg" aria-label="No image available">
                          ?
                        </div>
                      )}
                      <h3 className="text-lg font-extrabold font-sans text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors text-center drop-shadow-sm flex-1 flex items-center justify-center">{society.name}</h3>
                      <p className="text-gray-600 text-center text-xs flex-1 flex items-center justify-center font-medium">{society.description}</p>
                    </article>
                  );

                  return isNonClickable ? (
                    <div key={society.name} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                      {CardContent}
                    </div>
                  ) : (
                    <Link key={society.name} href={society.href} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                      {CardContent}
                    </Link>
                  );
                })}
              </section>
              {/* Rest of the societies */}
              {rest.length > 0 && (
                <section aria-label="More Societies" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 mb-8 md:mb-4 hidden md:grid">
                  {rest.map((society) => {
                    const isNonClickable = society.name === 'L&T Crescent Bay, Bhoiwada' || society.name === 'Ashok Gardens, Sewri';
                    const CardContent = (
                      <article className="bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center cursor-pointer border border-gray-200 group-hover:border-indigo-500 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-indigo-200 h-48 min-h-[10rem] max-h-56 justify-between">
                        {society.image ? (
                          <SocietyImage
                            src={society.image}
                            alt={`${society.name} - ${society.description}`}
                            className="w-16 h-16 object-cover rounded-2xl mb-2 border border-gray-100 shadow-lg group-hover:ring-2 group-hover:ring-indigo-300 transition-all duration-300 bg-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-2 bg-gray-100 text-gray-400 text-2xl font-bold border border-gray-100 shadow-lg" aria-label="No image available">
                            ?
                          </div>
                        )}
                        <h3 className="text-lg font-extrabold font-sans text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors text-center drop-shadow-sm flex-1 flex items-center justify-center">{society.name}</h3>
                        <p className="text-gray-600 text-center text-xs flex-1 flex items-center justify-center font-medium">{society.description}</p>
                      </article>
                    );

                    return isNonClickable ? (
                      <div key={society.name} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                        {CardContent}
                      </div>
                    ) : (
                      <Link key={society.name} href={society.href} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
                        {CardContent}
                      </Link>
                    );
                  })}
                </section>
              )}
            </>
          )}
        </div>
      </main>
      {/* Sponsored Advertisement - move up on mobile if no area is selected */}
      <section
        aria-label="Sponsored Advertisement"
        className={`relative w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white overflow-hidden ${selectedArea ? 'mt-0' : 'mt-2 md:mt-0'} ${selectedArea ? '' : 'mb-0 md:mb-0'} ${selectedArea ? '' : 'block'}`}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-transparent to-indigo-600/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
            {/* Sponsored Ad Label */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                Sponsored Ad
              </span>
            </div>
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-indigo-400/20 rounded-full text-sm font-medium mb-4">
                Shop Now
              </span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Buy Latest Products from thedivinehands.com
              </h3>
              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                Discover a curated selection of unique, high-quality products. Shop the latest arrivals and exclusive collections only at thedivinehands.com.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a 
                  href="https://thedivinehands.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Shop Now
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
            {/* Right Content - Categories */}
            <div className="hidden md:grid flex-1 grid-cols-2 sm:grid-cols-2 gap-4">
              <a href="https://www.thedivinehands.com/whole-foods/categories/healthy-treats" target="_blank" rel="noopener noreferrer" className="bg-indigo-400/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center border border-indigo-300/20 text-center hover:bg-indigo-400/20 transition">
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                    {/* Cupcake icon */}
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c-1.657 0-3 1.343-3 3 0 .512.13 1.002.36 1.42C7.56 8.09 6 9.94 6 12c0 2.21 1.79 4 4 4h4c2.21 0 4-1.79 4-4 0-2.06-1.56-3.91-3.36-4.58A2.99 2.99 0 0015 6c0-1.657-1.343-3-3-3zM8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <h4 className="text-sm sm:text-lg font-semibold text-white">Healthier Treats</h4>
                </div>
                <p className="text-white/80 text-sm">Delicious sweets and snacks made with healthier ingredients.</p>
              </a>
              <a href="https://www.thedivinehands.com/whole-foods/categories/healthy-bites" target="_blank" rel="noopener noreferrer" className="bg-indigo-400/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center border border-indigo-300/20 text-center hover:bg-indigo-400/20 transition">
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                    {/* Apple icon */}
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 9.4c.28-.34.5-.7.5-1.4 0-1.1-.9-2-2-2-.5 0-.96.18-1.32.48C13.24 6.18 12.77 6 12.25 6c-1.1 0-2 .9-2 2 0 .7.22 1.06.5 1.4C8.5 10.5 7 12.36 7 14.5c0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.14-1.5-4-3.5-5.1z" />
                    </svg>
                  </div>
                  <h4 className="text-sm sm:text-lg font-semibold text-white">Healthier Bites</h4>
                </div>
                <p className="text-white/80 text-sm">Nutritious and tasty snacks for guilt-free munching.</p>
              </a>
              <a href="https://www.thedivinehands.com/whole-foods/categories/pickles" target="_blank" rel="noopener noreferrer" className="bg-indigo-400/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center border border-indigo-300/20 text-center hover:bg-indigo-400/20 transition">
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                    {/* Jar icon */}
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7V5a3 3 0 016 0v2" />
                    </svg>
                  </div>
                  <h4 className="text-sm sm:text-lg font-semibold text-white">Pickles & Condiments</h4>
                </div>
                <p className="text-white/80 text-sm">Traditional and innovative pickles, spreads, and more.</p>
              </a>
              <a href="https://www.thedivinehands.com/whole-foods/categories/spice-blends" target="_blank" rel="noopener noreferrer" className="bg-indigo-400/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center border border-indigo-300/20 text-center hover:bg-indigo-400/20 transition">
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                    {/* Star/spice icon */}
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" strokeWidth="2" />
                    </svg>
                  </div>
                  <h4 className="text-sm sm:text-lg font-semibold text-white">Spice Blends</h4>
                </div>
                <p className="text-white/80 text-sm">Aromatic and flavorful spice mixes for every kitchen.</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 