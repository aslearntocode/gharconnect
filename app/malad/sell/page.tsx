'use client';

import React from 'react';
import { FiHome, FiChevronDown, FiX } from 'react-icons/fi';
import { sellApartments } from '@/app/malad/data/sellApartments';
import { useState } from 'react';
import Header from '@/components/Header';

export default function SellPage() {
  // Filter states
  const [building, setBuilding] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inMarket, setInMarket] = useState('');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [photoModal, setPhotoModal] = useState<{ images: string[]; idx: number } | null>(null);
  const [expandedMobileIdx, setExpandedMobileIdx] = useState<number | null>(null);

  // Filtering logic
  const filteredApartments = sellApartments.filter((apt) => {
    // Building name (tower)
    if (building && !apt.tower.toLowerCase().includes(building.toLowerCase())) return false;
    // Min area
    if (minArea && apt.area < parseInt(minArea)) return false;
    // Max area
    if (maxArea && apt.area > parseInt(maxArea)) return false;
    // Size (BHK)
    if (size && `${apt.bedrooms} BHK` !== size) return false;
    // Min price
    if (minPrice && apt.price < parseInt(minPrice)) return false;
    // Max price
    if (maxPrice && apt.price > parseInt(maxPrice)) return false;
    // In Market
    if (inMarket) {
      if (inMarket === 'Y' && apt.status !== 'available') return false;
      if (inMarket === 'N' && apt.status === 'available') return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Properties for Sale</h1>
        </div>
      </div>
      {/* Filter Bar below the blue box */}
      <div className="w-full flex justify-center mt-0 mb-0">
        <div className="max-w-5xl w-full flex flex-wrap md:flex-nowrap justify-center gap-2 md:gap-4 bg-white rounded-2xl shadow-lg px-4 py-3">
          <input
            type="text"
            placeholder="Building name"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={building}
            onChange={e => setBuilding(e.target.value)}
          />
          <input
            type="text"
            placeholder="Min Area"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[100px]"
            value={minArea}
            onChange={e => setMinArea(e.target.value.replace(/\D/g, ''))}
          />
          <input
            type="text"
            placeholder="Max Area"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[100px]"
            value={maxArea}
            onChange={e => setMaxArea(e.target.value.replace(/\D/g, ''))}
          />
          <input
            type="text"
            placeholder="Min Price"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value.replace(/\D/g, ''))}
          />
          <input
            type="text"
            placeholder="Max Price"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value.replace(/\D/g, ''))}
          />
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={size}
            onChange={e => setSize(e.target.value)}
          >
            <option value="">Size (BHK)</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK</option>
          </select>
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={inMarket}
            onChange={e => setInMarket(e.target.value)}
          >
            <option value="">In Market</option>
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>
      </div>
      <main className="pt-4 md:pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mt-0 bg-white rounded-2xl shadow-lg overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200 md:table hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Home</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Building</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Floor</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">In Market</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApartments.map((apt, idx) => (
                <React.Fragment key={apt.id}>
                  <tr
                    className={`group transition-colors duration-150 cursor-pointer ${expandedIdx === idx ? 'bg-indigo-50 border-l-4 border-indigo-400 shadow' : 'hover:bg-indigo-50'}`}
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className={`transition-transform duration-200 ${expandedIdx === idx ? 'rotate-180' : ''}`}>
                        <FiChevronDown className="w-5 h-5 text-indigo-500 opacity-80 group-hover:opacity-100" />
                      </span>
                      <FiHome className="text-indigo-500 w-6 h-6" />
                    </td>
                    <td className="px-4 py-3">{apt.tower || '-'}</td>
                    <td className="px-4 py-3">{apt.bedrooms ? `${apt.bedrooms} BHK` : '-'}</td>
                    <td className="px-4 py-3">{apt.area ? `${apt.area} sq.ft` : '-'}</td>
                    <td className="px-4 py-3">{apt.price ? `₹${apt.price.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3">{apt.floor || '-'}</td>
                    <td className="px-4 py-3">{apt.status === 'available' ? 'Y' : 'N'}</td>
                    <td className="px-4 py-3">
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">Contact</button>
                    </td>
                  </tr>
                  {expandedIdx === idx && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 px-6 py-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Images */}
                          <div className="flex gap-2 overflow-x-auto md:w-1/3">
                            {apt.images && apt.images.length > 0 ? (
                              apt.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt={`Property photo ${i+1}`}
                                  className="w-32 h-24 object-cover rounded-lg border cursor-pointer hover:shadow-lg"
                                  onClick={() => setPhotoModal({ images: apt.images, idx: i })}
                                />
                              ))
                            ) : (
                              <div className="text-gray-400 italic">No images</div>
                            )}
                          </div>
                          {/* Details */}
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="font-semibold">Description: </span>
                              <span>{apt.description}</span>
                            </div>
                    <div>
                              <span className="font-semibold">Features: </span>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {apt.features && apt.features.length > 0 ? (
                                  apt.features.map((f, i) => <li key={i}>{f}</li>)
                                ) : (
                                  <li>No features listed</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Mobile Card Grid */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 gap-4">
              {filteredApartments.map((apt, idx) => (
                <div key={idx}>
                  <div
                    className={`bg-white rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer ${expandedMobileIdx === idx ? 'ring-2 ring-indigo-400' : ''}`}
                    onClick={() => setExpandedMobileIdx(expandedMobileIdx === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FiHome className="text-indigo-500 w-6 h-6" />
                      <span className="text-base font-semibold">{apt.tower || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                      <div className="text-gray-500">Size</div>
                      <div>{apt.bedrooms ? `${apt.bedrooms} BHK` : '-'}</div>
                      <div className="text-gray-500">Area</div>
                      <div>{apt.area ? `${apt.area} sq.ft` : '-'}</div>
                      <div className="text-gray-500">Price</div>
                      <div>{apt.price ? `₹${apt.price.toLocaleString()}` : '-'}</div>
                      <div className="text-gray-500">Floor</div>
                      <div>{apt.floor || '-'}</div>
                      <div className="text-gray-500">In Market</div>
                      <div>{apt.status === 'available' ? 'Y' : 'N'}</div>
                    </div>
                    <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm w-full">Contact</button>
                  </div>
                  {expandedMobileIdx === idx && (
                    <div className="bg-gray-50 rounded-b-xl px-4 py-4">
                      <div className="flex gap-2 overflow-x-auto mb-2">
                        {apt.images && apt.images.length > 0 ? (
                          apt.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`Property photo ${i+1}`}
                              className="w-32 h-24 object-cover rounded-lg border cursor-pointer hover:shadow-lg"
                              onClick={() => setPhotoModal({ images: apt.images, idx: i })}
                            />
                          ))
                        ) : (
                          <div className="text-gray-400 italic">No images</div>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Description: </span>
                        <span>{apt.description}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Features: </span>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {apt.features && apt.features.length > 0 ? (
                            apt.features.map((f, i) => <li key={i}>{f}</li>)
                          ) : (
                            <li>No features listed</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Photo Modal */}
          {photoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative max-w-2xl w-full flex flex-col items-center">
                <button
                  className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 z-10"
                  onClick={() => setPhotoModal(null)}
                  aria-label="Close"
                >
                  <FiX className="w-6 h-6" />
                </button>
                <div className="flex gap-4 overflow-x-auto py-8 px-2 w-full">
                  {photoModal.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Property photo ${i+1}`}
                      className="h-80 w-auto object-contain rounded-lg border bg-white"
                      style={{ minWidth: '320px' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
