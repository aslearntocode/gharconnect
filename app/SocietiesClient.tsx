'use client'

import Link from 'next/link';
import SocietyImage from '@/components/SocietyImage';
import { useState } from 'react';

const societies = [
  {
    name: 'L&T Crescent Bay',
    href: '/parel',
    description: 'A premium residential complex in Parel.',
    image: '/cb.png',
    area: 'parel'
  },
  {
    name: 'Ashok Gardens',
    href: '/parel',
    description: 'A vibrant community in the heart of Sewri.',
    image: '/ag.png',
    area: 'parel'
  },
  {
    name: 'Island City Centre',
    href: '/parel',
    description: 'Modern living with all amenities in Bhoiwada.',
    image: '/icc.png',
    area: 'parel'
  },
  {
    name: 'Ashok Towers',
    href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/at.png',
    area: 'parel'
  },
  {
    name: 'Dosti Flamingo',
    href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/df.png',
    area: 'parel'
  },
  {
    name: 'Ruparel Ariana',
    href: '/parel',
    description: 'A peaceful society in Bhoiwada.',
    image: '/ra.png',
    area: 'parel'
  },
  {
    name: 'Kalpataru Avana',
    href: '/parel',
    description: 'A luxurious society in Parel.',
    image: '/ka.png',
    area: 'parel'
  },
  {
    name: 'Lodha Venezia',
    href: '/parel',
    description: 'A peaceful society in Parel.',
    image: '/lv.png',
    area: 'parel'
  },
  {
    name: 'Lodha Park',
    href: '/worli',
    description: 'Luxurious living in the heart of Worli.',
    image: '/Lodha_Park.png',
    area: 'worli'
  },
  {
    name: 'Lodha World One',
    href: '/worli',
    description: 'India\'s tallest residential tower in Worli.',
    image: '/Lodha_World_One.png',
    area: 'worli'
  },
  {
    name: 'Indiabulls Blu',
    href: '/worli',
    description: 'Premium residential complex in Worli.',
    image: '/Indiabulls.png',
    area: 'worli'
  },
  {
    name: 'Raheja Imperia',
    href: '/worli',
    description: 'Premium residential complex in Worli.',
    image: '/Raheja_Imperia.png',
    area: 'worli'
  }
];

export default function SocietiesClient() {
  const [selectedArea, setSelectedArea] = useState('');

  const areas = [
    { name: 'Parel', value: 'parel' },
    { name: 'Worli', value: 'worli' }
  ];

  const filteredSocieties = selectedArea === '' ? [] : societies.filter(society => society.area === selectedArea);
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
                href={`/${selectedArea}`}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore {areas.find(a => a.value === selectedArea)?.name} Community
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
    </>
  );
} 