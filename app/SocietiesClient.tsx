'use client'

import Link from 'next/link';
import SocietyImage from '@/components/SocietyImage';
import { useState } from 'react';

const societies = [
  {
    name: 'L&T Crescent Bay',
    // href: '/parel',
    description: 'A premium residential complex in Parel.',
    image: '/cb.png',
    area: 'parel'
  },
  {
    name: 'Ashok Gardens',
    // href: '/parel',
    description: 'A vibrant community in the heart of Sewri.',
    image: '/ag.png',
    area: 'parel'
  },
  {
    name: 'Island City Centre',
    // href: '/parel',
    description: 'Modern living with all amenities in Bhoiwada.',
    image: '/icc.png',
    area: 'parel'
  },
  {
    name: 'Ashok Towers',
    // href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/at.png',
    area: 'parel'
  },
  {
    name: 'Dosti Flamingo',
    // href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/df.png',
    area: 'parel'
  },
  {
    name: 'Ruparel Ariana',
    // href: '/parel',
    description: 'A peaceful society in Bhoiwada.',
    image: '/ra.png',
    area: 'parel'
  },
  {
    name: 'Kalpataru Avana',
    // href: '/parel',
    description: 'A luxurious society in Parel.',
    image: '/ka.png',
    area: 'parel'
  },
  {
    name: 'Lodha Venezia',
    // href: '/parel',
    description: 'A peaceful society in Sewri.',
    image: '/lv.png',
    area: 'parel'
  },
  {name: 'Runwal Nirvana',
    // href: '/parel',
    description: 'A peaceful society in Bhoiwada.',
    image: '/rn.png',
    area: 'parel'
  },
  {
    name: 'Celestia Spaces',
    // href: '/worli',
    description: 'A newly built society in Sewri.',
    image: '/CS.png',
    area: 'parel'
  },
  {
    name: 'Lodha Park',
    // href: '/worli',
    description: 'Luxurious living in the heart of Worli.',
    image: '/Lodha_Park.png',
    area: 'worli'
  },
  {
    name: 'Lodha World One',
    // href: '/worli',
    description: 'India\'s tallest residential tower in Worli.',
    image: '/Lodha_World_One.png',
    area: 'worli'
  },
  {
    name: 'Indiabulls Blu',
    // href: '/worli',
    description: 'Premium residential complex in Worli.',
    image: '/Indiabulls.png',
    area: 'worli'
  },
  {
    name: 'Raheja Imperia',
    // href: '/worli',
    description: 'Premium residential complex in Worli.',
    image: '/Raheja_Imperia.png',
    area: 'worli'
  },
  // Bandra Societies
  {
    name: 'Bandra West Society',
    description: 'Premium residential complex in Bandra West.',
    image: '/cb.png',
    area: 'bandra'
  },
  {
    name: 'Khar East Community',
    description: 'A vibrant community in Khar East.',
    image: '/ag.png',
    area: 'bandra'
  },
  {
    name: 'Santacruz Towers',
    description: 'Modern living with all amenities in Santacruz.',
    image: '/icc.png',
    area: 'bandra'
  },
  {
    name: 'Bandra East Gardens',
    description: 'A peaceful society in Bandra East.',
    image: '/at.png',
    area: 'bandra'
  },
  {
    name: 'Khar West Residences',
    description: 'Luxurious living in Khar West.',
    image: '/df.png',
    area: 'bandra'
  },
  // Juhu Societies
  {
    name: 'Juhu Beach Residences',
    description: 'Premium beachfront living in Juhu.',
    image: '/ra.png',
    area: 'juhu'
  },
  {
    name: 'Vile Parle Gardens',
    description: 'A peaceful community in Vile Parle.',
    image: '/ka.png',
    area: 'juhu'
  },
  {
    name: 'Andheri West Society',
    description: 'Modern living in Andheri West.',
    image: '/lv.png',
    area: 'juhu'
  },
  {
    name: 'Juhu Tara Road',
    description: 'Exclusive living on Juhu Tara Road.',
    image: '/rn.png',
    area: 'juhu'
  },
  {
    name: 'Vile Parle East',
    description: 'A vibrant community in Vile Parle East.',
    image: '/CS.png',
    area: 'juhu'
  },
  // Malad Societies
  {
    name: 'Malad West Complex',
    description: 'Premium residential complex in Malad West.',
    image: '/Lodha_Park.png',
    area: 'malad'
  },
  {
    name: 'Kandivali East',
    description: 'A peaceful community in Kandivali East.',
    image: '/Lodha_World_One.png',
    area: 'malad'
  },
  {
    name: 'Malad East Gardens',
    description: 'Modern living in Malad East.',
    image: '/Indiabulls.png',
    area: 'malad'
  },
  {
    name: 'Kandivali West',
    description: 'A vibrant society in Kandivali West.',
    image: '/Raheja_Imperia.png',
    area: 'malad'
  },
  {
    name: 'Malad Central',
    description: 'Central location living in Malad.',
    image: '/cb.png',
    area: 'malad'
  },
  // Powai Societies
  {
    name: 'Powai Lake View',
    description: 'Premium lakefront living in Powai.',
    image: '/ag.png',
    area: 'powai'
  },
  {
    name: 'Hiranandani Gardens',
    description: 'Luxurious living in Hiranandani Gardens.',
    image: '/icc.png',
    area: 'powai'
  },
  {
    name: 'Powai Central',
    description: 'Central location in Powai.',
    image: '/at.png',
    area: 'powai'
  },
  {
    name: 'IIT Powai',
    description: 'Near IIT Bombay campus.',
    image: '/df.png',
    area: 'powai'
  },
  {
    name: 'Powai West',
    description: 'Peaceful living in Powai West.',
    image: '/ra.png',
    area: 'powai'
  },
  // Thane Societies
  {
    name: 'Thane West Complex',
    description: 'Premium residential complex in Thane West.',
    image: '/ka.png',
    area: 'thane'
  },
  {
    name: 'Ghodbunder Road',
    description: 'Modern living on Ghodbunder Road.',
    image: '/lv.png',
    area: 'thane'
  },
  {
    name: 'Thane East Gardens',
    description: 'A peaceful community in Thane East.',
    image: '/rn.png',
    area: 'thane'
  },
  {
    name: 'Thane Central',
    description: 'Central location in Thane.',
    image: '/CS.png',
    area: 'thane'
  },
  {
    name: 'Thane Station Road',
    description: 'Convenient location near Thane station.',
    image: '/Lodha_Park.png',
    area: 'thane'
  },
  // Andheri Societies
  {
    name: 'Andheri West Society',
    description: 'Premium residential complex in Andheri West.',
    image: '/cb.png',
    area: 'andheri'
  },
  {
    name: 'Andheri East Gardens',
    description: 'A peaceful community in Andheri East.',
    image: '/ag.png',
    area: 'andheri'
  },
  {
    name: 'Andheri Central',
    description: 'Central location in Andheri.',
    image: '/icc.png',
    area: 'andheri'
  },
  {
    name: 'Andheri Station Road',
    description: 'Convenient location near Andheri station.',
    image: '/at.png',
    area: 'andheri'
  },
  {
    name: 'Andheri Metro',
    description: 'Modern living near Andheri Metro.',
    image: '/df.png',
    area: 'andheri'
  }
];

export default function SocietiesClient() {
  const [selectedArea, setSelectedArea] = useState('');

  const areas = [
    { name: 'Parel, Mumbai (Parel, Sewri, Bhoiwada)', value: 'parel', displayName: 'Parel, Mumbai' },
    { name: 'Worli, Mumbai (Worli, Lower Parel)', value: 'worli', displayName: 'Worli, Mumbai' },
    { name: 'Bandra, Mumbai (Bandra, Khar, Santacruz)', value: 'bandra', displayName: 'Bandra, Mumbai' },
    { name: 'Juhu, Mumbai (Juhu, Vile Parle, Andheri)', value: 'juhu', displayName: 'Juhu, Mumbai' },
    { name: 'Malad, Mumbai (Malad, Kandivali, Andheri)', value: 'malad', displayName: 'Malad, Mumbai' },
    { name: 'Powai, Mumbai (Powai, Andheri)', value: 'powai', displayName: 'Powai, Mumbai' },
    { name: 'Thane, Mumbai (Thane, Ghodbunder Road)', value: 'thane', displayName: 'Thane, Mumbai' },
    { name: 'Andheri, Mumbai (Andheri, Vile Parle)', value: 'andheri', displayName: 'Andheri, Mumbai' }
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
                Explore {areas.find(a => a.value === selectedArea)?.displayName} Community
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
                {filteredSocieties.map((society) => (
                  <div key={society.name} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
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
                  </div>
                ))}
              </section>
              {/* Desktop: keep the current split and layout */}
              <section aria-label="Featured Societies" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 hidden md:grid">
                {first5.map((society) => (
                  <div key={society.name} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
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
                  </div>
                ))}
              </section>
              {/* Rest of the societies */}
              {rest.length > 0 && (
                <section aria-label="More Societies" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 mb-8 md:mb-4 hidden md:grid">
                  {rest.map((society) => (
                    <div key={society.name} className="block group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl">
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
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
} 