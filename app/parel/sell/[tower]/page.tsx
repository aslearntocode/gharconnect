"use client";
import React, { useState } from 'react';
import { FiHome } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';

const bhkTypes = ['2 BHK', '3 BHK', '4 BHK', '5 BHK'];
const furnishedTypes = ['Not', 'Semi', 'Fully'];

// Generate apartment numbers: 0601, 0602, 0603, 0604
const apartmentNumbers = ['0601', '0602', '0603', '0604'];

const mockProperties = apartmentNumbers.map((aptNumber, i) => ({
  id: i + 1,
  name: aptNumber,
  size: bhkTypes[i % bhkTypes.length],
  area: `${1000 + (i % 10) * 50} sq.ft`,
  balconies: 1 + (i % 3),
  facing: (i % 2 === 0) ? 'Front' : 'Back',
  furnished: furnishedTypes[i % furnishedTypes.length],
  inMarket: true, // All these apartments are in market
  price: new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0 
  }).format(5000000 + (i * 500000)), // Starting from 50L, increasing by 5L for each apartment
}));

export default function TowerPage() {
  const params = useParams();
  const towerParam = Array.isArray(params?.tower) ? params.tower[0] : params?.tower;
  const tower = (towerParam || 'T1').toUpperCase();
  const [apartmentFilter, setApartmentFilter] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [furnishedFilter, setFurnishedFilter] = useState('');
  const [inMarketFilter, setInMarketFilter] = useState('');
  const [properties, setProperties] = useState(mockProperties);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleInMarket = (propertyId: number) => {
    if (!isAdmin) return;
    setProperties(properties.map(property => 
      property.id === propertyId 
        ? { ...property, inMarket: !property.inMarket }
        : property
    ));
  };

  const filteredProperties = properties.filter((property) => {
    const areaNum = parseInt(property.area);
    const minAreaNum = minArea ? parseInt(minArea) : null;
    const maxAreaNum = maxArea ? parseInt(maxArea) : null;
    return (
      (apartmentFilter === '' || property.name.toLowerCase().includes(apartmentFilter.toLowerCase())) &&
      (sizeFilter === '' || property.size === sizeFilter) &&
      (furnishedFilter === '' || property.furnished === furnishedFilter) &&
      (inMarketFilter === '' || (inMarketFilter === 'Y' ? property.inMarket : !property.inMarket)) &&
      (minAreaNum === null || areaNum >= minAreaNum) &&
      (maxAreaNum === null || areaNum <= maxAreaNum)
    );
  });

  return (
    <>
      <Header />
      <div className="relative">
        {/* Blue hero box */}
        <div className="bg-blue-600 text-white py-8 px-4 rounded-b-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{tower} Properties for Sale</h1>
        </div>
        {/* Filter bar, overlapping the blue box */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-4xl -bottom-7 z-10">
          <div className="flex flex-wrap gap-2 md:gap-4 bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-2 items-center justify-center">
            <input
              type="text"
              value={apartmentFilter}
              onChange={e => setApartmentFilter(e.target.value)}
              placeholder="Apartment number"
              className="w-28 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <input
              type="text"
              inputMode="numeric"
              value={minArea}
              onChange={e => setMinArea(e.target.value)}
              placeholder="Min Area"
              className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <input
              type="text"
              inputMode="numeric"
              value={maxArea}
              onChange={e => setMaxArea(e.target.value)}
              placeholder="Max Area"
              className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <select
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value)}
              className="w-24 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Size (BHK)</option>
              {bhkTypes.map(bhk => (
                <option key={bhk} value={bhk}>{bhk}</option>
              ))}
            </select>
            <select
              value={furnishedFilter}
              onChange={e => setFurnishedFilter(e.target.value)}
              className="w-24 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Furnished</option>
              {furnishedTypes.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={inMarketFilter}
              onChange={e => setInMarketFilter(e.target.value)}
              className="w-24 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">In Market</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-16 px-2 md:px-0">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-10 gap-2 px-4 py-2 bg-gray-50 rounded-t-lg border-b font-semibold text-gray-700 text-sm mb-2">
            <div className="col-span-1 flex items-center justify-start">Home</div>
            <div className="col-span-1 justify-start">Apartment</div>
            <div className="col-span-1 justify-start">Size</div>
            <div className="col-span-1 justify-start">Area</div>
            <div className="col-span-1 justify-start">Balconies</div>
            <div className="col-span-1 justify-start">Facing</div>
            <div className="col-span-1 justify-start">Furnished</div>
            <div className="col-span-1 justify-start">Price</div>
            <div className="col-span-1 justify-start">In Market</div>
            <div className="col-span-1 justify-start">Contact</div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {/* Desktop/tablet grid row */}
            {filteredProperties.map((property) => (
              <React.Fragment key={property.id}>
                <div className="hidden md:grid md:grid-cols-10 items-center border-b last:border-b-0 py-6 gap-6 md:gap-2">
                  <div className="col-span-1 flex items-center justify-start w-full">
                    <FiHome className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="col-span-1 text-lg font-semibold mb-1 md:mb-0 text-left">{property.name}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">{property.size}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">{property.area}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">{property.balconies}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">{property.facing}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">{property.furnished}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">{property.price}</div>
                  <div className="col-span-1 text-gray-700 text-sm text-left">
                    {isAdmin ? (
                      <button
                        onClick={() => toggleInMarket(property.id)}
                        className={`px-2 py-1 rounded font-medium text-xs transition ${
                          property.inMarket 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        } text-white cursor-pointer min-w-[70px] max-w-[90px] text-center`}
                      >
                        {property.inMarket ? 'Y' : 'N'}
                      </button>
                    ) : (
                      <span>{property.inMarket ? 'Y' : 'N'}</span>
                    )}
                  </div>
                  <div className="col-span-1 flex justify-start">
                    <button
                      className="px-2 py-1 rounded font-medium text-xs transition bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer min-w-[70px] max-w-[90px] text-left"
                    >
                      Contact
                    </button>
                  </div>
                </div>
                {/* Mobile horizontal scrollable grid row */}
                <div className="md:hidden border-b last:border-b-0 py-4 overflow-x-auto">
                  <div className="flex min-w-[800px] items-center gap-4">
                    <div className="flex items-center justify-start w-12 flex-shrink-0">
                      <FiHome className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="text-base font-semibold w-16 flex-shrink-0">{property.name}</div>
                    <div className="text-sm text-gray-700 w-16 flex-shrink-0">{property.size}</div>
                    <div className="text-sm text-gray-700 w-20 flex-shrink-0">{property.area}</div>
                    <div className="text-sm text-gray-700 w-14 flex-shrink-0">{property.balconies}</div>
                    <div className="text-sm text-gray-700 w-16 flex-shrink-0">{property.facing}</div>
                    <div className="text-sm text-gray-700 w-16 flex-shrink-0">{property.furnished}</div>
                    <div className="text-sm text-gray-700 w-24 flex-shrink-0">{property.price}</div>
                    <div className="text-sm text-gray-700 w-16 flex-shrink-0">
                      {isAdmin ? (
                        <button
                          onClick={() => toggleInMarket(property.id)}
                          className={`px-2 py-1 rounded font-medium text-xs transition ${
                            property.inMarket 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gray-600 hover:bg-gray-700'
                          } text-white cursor-pointer min-w-[60px]`}
                        >
                          {property.inMarket ? 'Y' : 'N'}
                        </button>
                      ) : (
                        <span>{property.inMarket ? 'Y' : 'N'}</span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        className="px-2 py-1 rounded font-medium text-xs transition bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer min-w-[60px]"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 