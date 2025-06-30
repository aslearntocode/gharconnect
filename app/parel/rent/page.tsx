'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { FiHome, FiChevronDown, FiX, FiSearch, FiSmile, FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import React from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Apartment } from '@/types/apartment';
import SEOScript from '@/components/SEOScript';
import Lottie from 'react-lottie-player';
import { HiMagnifyingGlassCircle, HiFaceSmile, HiDocumentText } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function RentPage() {
  // Data states
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apartmentMedia, setApartmentMedia] = useState<{ [key: string]: string[] }>({});

  // Filter states
  const [building, setBuilding] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [size, setSize] = useState('');
  const [furnished, setFurnished] = useState('');
  const [inMarket, setInMarket] = useState('');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [photoModal, setPhotoModal] = useState<{ images: string[]; idx: number } | null>(null);
  const [expandedMobileIdx, setExpandedMobileIdx] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch apartments from Supabase and their media manifests
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('city', 'Mumbai')
          .eq('state', 'Maharashtra')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching apartments:', error);
          setError('Failed to load apartments');
        } else {
          setApartments(data || []);

          // Fetch manifest for each apartment
          const mediaMap: { [key: string]: string[] } = {};
          await Promise.all(
            (data || []).map(async (apt) => {
              if (apt.contact_phone) {
                try {
                  const res = await fetch(`/apartment-images/landlord_${apt.contact_phone}/manifest.json`);
                  if (res.ok) {
                    const files: string[] = await res.json();
                    mediaMap[apt.id!] = files.map(f => `/apartment-images/landlord_${apt.contact_phone}/${f}`);
                  } else {
                    mediaMap[apt.id!] = [];
                  }
                } catch (e) {
                  mediaMap[apt.id!] = [];
                }
              }
            })
          );
          setApartmentMedia(mediaMap);
        }
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError('Failed to load apartments');
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Function to get media for a specific apartment
  const getApartmentMedia = (apartmentId: string): string[] => {
    return apartmentMedia[apartmentId] || [];
  };

  // Function to convert description text into bullet points
  const formatDescriptionAsBullets = (description: string): string[] => {
    if (!description) return [];
    
    // Split by common delimiters and clean up
    const features = description
      .split(/[,;•\n]/) // Split by comma, semicolon, bullet, or newline
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0)
      .map(feature => feature.replace(/^[-•*]\s*/, '')); // Remove existing bullet points
    
    return features;
  };

  // Component for handling image and video loading with fallback
  const ApartmentMedia = ({ src, alt, className, onClick, style }: { 
    src: string; 
    alt: string; 
    className: string; 
    onClick?: () => void;
    style?: React.CSSProperties;
  }) => {
    const [mediaError, setMediaError] = useState(false);
    const [mediaLoaded, setMediaLoaded] = useState(false);
    const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov') || src.toLowerCase().endsWith('.avi');

    if (mediaError) {
      return null; // Don't render anything if media fails to load
    }

    if (isVideo) {
      return (
        <video
          src={src}
          className={className}
          onClick={onClick}
          onLoadedData={() => setMediaLoaded(true)}
          onError={() => setMediaError(true)}
          style={{ display: mediaLoaded ? 'block' : 'none', ...style }}
          muted
          loop
          playsInline
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        onLoad={() => setMediaLoaded(true)}
        onError={() => setMediaError(true)}
        style={{ display: mediaLoaded ? 'block' : 'none', ...style }}
      />
    );
  };

  // Filtering logic
  const filteredApartments = apartments.filter((apt) => {
    // Building name (tower)
    if (building && !apt.tower.toLowerCase().includes(building.toLowerCase())) return false;
    // Min area
    if (minArea && apt.carpet_area < parseInt(minArea)) return false;
    // Max area
    if (maxArea && apt.carpet_area > parseInt(maxArea)) return false;
    // Size (BHK)
    if (size && apt.apartment_type !== size) return false;
    // Furnished
    if (furnished) {
      if (furnished === 'Not' && apt.furnishing_status !== 'Unfurnished') return false;
      if (furnished === 'Semi' && apt.furnishing_status !== 'Semi-furnished') return false;
      if (furnished === 'Fully' && apt.furnishing_status !== 'Fully-furnished') return false;
    }
    // In Market - assume all apartments are available for now
    if (inMarket) {
      if (inMarket === 'Y' && apt.status !== 'available') return false;
      if (inMarket === 'N' && apt.status === 'available') return false;
    }
    return true;
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  async function getMediaUrlsForContactPhone(contact_phone: string): Promise<string[]> {
    // List all folders in rent-apartment-photos
    const { data: folders, error: listError } = await supabase
      .storage
      .from('rent-apartment-photos')
      .list('', { limit: 100 });
    if (listError) return [];
    // Find the folder that ends with _{contact_phone}
    const folder = folders.find(f => f.name.endsWith(`_${contact_phone}`));
    if (!folder) return [];
    // List all files in that folder
    const { data: files, error: filesError } = await supabase
      .storage
      .from('rent-apartment-photos')
      .list(folder.name, { limit: 100 });
    if (filesError) return [];
    // Get public URLs for each file
    return files
      .filter(f => !f.name.endsWith('.json'))
      .map(f => supabase.storage.from('rent-apartment-photos').getPublicUrl(`${folder.name}/${f.name}`).data.publicUrl);
  }

  function ApartmentGallery({ contact_phone }: { contact_phone: string }) {
    const [mediaUrls, setMediaUrls] = React.useState<string[]>([]);
    React.useEffect(() => {
      if (!contact_phone) return;
      getMediaUrlsForContactPhone(contact_phone).then(setMediaUrls);
    }, [contact_phone]);
    return (
      <div className="flex gap-2 overflow-x-auto md:w-1/3">
        {mediaUrls.map((url, i) =>
          url.match(/\.(mp4|mov|avi)$/i) ? (
            <video key={i} src={url} className="w-32 h-24 object-cover rounded-lg border" controls />
          ) : (
            <img key={i} src={url} alt={`Property media ${i + 1}`} className="w-32 h-24 object-cover rounded-lg border" />
          )
        )}
      </div>
    );
  }

  // Helper to include both images and videos for the lightbox
  const getMediaSlides = (media: string[] = []) =>
    media.map(url =>
      url.match(/\.(mp4|mov|avi)$/i)
        ? { src: url, type: "video" }
        : { src: url }
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full bg-indigo-600 flex flex-col items-center justify-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Rental Apartments</h1>
          <p className="text-indigo-100 text-base md:text-lg mt-2 text-center max-w-5xl">
            Discover premium rental apartments with transparent pricing and minimal brokerage fees
          </p>
        </div>
      </div>
      
      {/* SEO Content Section - Low Brokerage Value Proposition */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            {/* Value proposition moved to indigo banner above */}
          </div>
          
          
          {/* SEO Content for Search Engines */}
          <div className="sr-only">
            <p>Location: Parel</p>
            <p>Type: Rental</p>
            <p>Price Range: ₹15,000 to ₹1,00,000+</p>
            <p>Property Types: 1BHK, 2BHK, 3BHK, 4BHK</p>
          </div>
        </div>
      </div>
      
      {/* Filter Bar below the blue box */}
      <div className="w-full flex justify-center mt-[-1.5rem] mb-0">
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
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={size}
            onChange={e => setSize(e.target.value)}
          >
            <option value="">Size (BHK)</option>
            <option value="2BHK">2 BHK</option>
            <option value="3BHK">3 BHK</option>
            <option value="4BHK">4 BHK</option>
          </select>
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]"
            value={furnished}
            onChange={e => setFurnished(e.target.value)}
          >
            <option value="">Furnished</option>
            <option value="Not">Not</option>
            <option value="Semi">Semi</option>
            <option value="Fully">Fully</option>
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
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rent</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Furnished</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Available From</th>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform duration-200 ${expandedIdx === idx ? 'rotate-180' : ''}`}>
                          <FiChevronDown className="w-5 h-5 text-indigo-500 opacity-80 group-hover:opacity-100" />
                        </span>
                        <FiHome className="text-indigo-500 w-6 h-6" />
                      </div>
                    </td>
                    <td className="px-4 py-3">{apt.building_name || '-'}</td>
                    <td className="px-4 py-3">{apt.location || '-'}</td>
                    <td className="px-4 py-3">{apt.apartment_type || '-'}</td>
                    <td className="px-4 py-3">{apt.carpet_area ? `${apt.carpet_area} sq.ft` : '-'}</td>
                    <td className="px-4 py-3">{apt.rent_amount ? `₹${apt.rent_amount.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3">{apt.furnishing_status ? apt.furnishing_status.charAt(0).toUpperCase() + apt.furnishing_status.slice(1) : '-'}</td>
                    <td className="px-4 py-3">{apt.available_from ? new Date(apt.available_from).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 align-middle" style={{ minWidth: 180, maxWidth: 200, width: 180 }}>
                      <div className="flex items-center justify-center w-full h-full">
                        <Link
                          href={`/parel/apply-for-rent/${apt.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full sm:w-auto flex-grow text-center px-6 py-2.5 bg-indigo-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out"
                        >
                          Schedule a Visit
                        </Link>
                      </div>
                    </td>
                  </tr>
                  {expandedIdx === idx && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 px-6 py-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Images */}
                          {(apt.images ?? []).length > 0 && (
                            <div className="flex gap-2 overflow-x-auto md:w-1/3">
                              {(apt.images ?? []).map((url: string, i: number) =>
                                url.match(/\.(mp4|mov|avi)$/i) ? (
                                  <video
                                    key={i}
                                    src={url}
                                    className="w-32 h-24 object-cover rounded-lg border cursor-pointer"
                                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                                    controls
                                  />
                                ) : (
                                  <img
                                    key={i}
                                    src={url}
                                    alt={`Property media ${i + 1}`}
                                    className="w-32 h-24 object-cover rounded-lg border cursor-pointer"
                                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                                  />
                                )
                              )}
                              <Lightbox
                                open={lightboxOpen}
                                close={() => setLightboxOpen(false)}
                                slides={getMediaSlides(apt.images ?? []) as any}
                                index={lightboxIndex}
                                plugins={[Thumbnails, Zoom]}
                                render={{
                                  slide: ({ slide }) =>
                                    (slide as any).type === "video" ? (
                                      <video
                                        src={slide.src}
                                        controls
                                        style={{ width: "100%", height: "100%", background: "#000" }}
                                      />
                                    ) : undefined,
                                }}
                              />
                            </div>
                          )}
                          {/* Details */}
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="font-semibold">Description: </span>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {formatDescriptionAsBullets(apt.description || '').map((feature, i) => <li key={i}>{feature}</li>)}
                              </ul>
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Address: </span>
                              <span>{apt.building_name}, {apt.street_name}, {apt.city}, {apt.state} - {apt.pincode}</span>
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Rent: </span>
                              <span>₹{apt.rent_amount?.toLocaleString()}/month</span>
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Security Deposit: </span>
                              <span>₹{apt.security_deposit?.toLocaleString()}</span>
                            </div>
                            {apt.amenities && apt.amenities.length > 0 && (
                              <div>
                                <span className="font-semibold">Amenities: </span>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {apt.amenities.map((amenity, i) => <li key={i}>{amenity}</li>)}
                                </ul>
                              </div>
                            )}
                            <div className="text-sm text-gray-800 space-y-2 mt-4">
                              <p><span className="font-semibold">BHK Type:</span> {apt.apartment_type}</p>
                              <p><span className="font-semibold">Rent:</span> ₹{apt.rent_amount.toLocaleString()}</p>
                              <p><span className="font-semibold">Deposit:</span> ₹{apt.security_deposit.toLocaleString()}</p>
                              {/* Add other details you want to show */}
                            </div>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                              <Link
                                href={`/parel/apply-for-rent/${apt.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full sm:w-auto flex-grow text-center px-6 py-2.5 bg-indigo-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                Schedule a Visit
                              </Link>
                              <a 
                                href="https://wa.me/919321314553"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex-grow text-center px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
                              >
                                WhatsApp
                              </a>
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
                <div key={apt.id}>
                  <div
                    className={`bg-white rounded-xl shadow p-4 flex flex-col gap-2 cursor-pointer ${expandedMobileIdx === idx ? 'ring-2 ring-indigo-400' : ''}`}
                    onClick={() => setExpandedMobileIdx(expandedMobileIdx === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FiHome className="text-indigo-500 w-6 h-6" />
                      <span className="text-base font-semibold">{apt.building_name || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                      <div className="text-gray-500">Size</div>
                      <div>{apt.apartment_type || '-'}</div>
                      <div className="text-gray-500">Location</div>
                      <div>{apt.location || '-'}</div>
                      <div className="text-gray-500">Area</div>
                      <div>{apt.carpet_area ? `${apt.carpet_area} sq.ft` : '-'}</div>
                      <div className="text-gray-500">Rent</div>
                      <div>{apt.rent_amount ? `₹${apt.rent_amount.toLocaleString()}` : '-'}</div>
                      <div className="text-gray-500">Furnished</div>
                      <div>{apt.furnishing_status ? apt.furnishing_status.charAt(0).toUpperCase() + apt.furnishing_status.slice(1) : '-'}</div>
                      <div className="text-gray-500">Available</div>
                      <div>{apt.available_from ? new Date(apt.available_from).toLocaleDateString() : '-'}</div>
                    </div>
                    <Link
                      href={`/parel/apply-for-rent/${apt.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs inline-block"
                    >
                      Schedule a Visit
                    </Link>
                  </div>
                  {expandedMobileIdx === idx && (
                    <div className="bg-gray-50 rounded-b-xl px-4 py-4">
                      <div className="flex gap-2 overflow-x-auto mb-2">
                        {(apt.images ?? []).length > 0 && (
                          <div className="flex gap-2 overflow-x-auto">
                            {(apt.images ?? []).map((url: string, i: number) =>
                              url.match(/\.(mp4|mov|avi)$/i) ? (
                                <video
                                  key={i}
                                  src={url}
                                  className="w-32 h-24 object-cover rounded-lg border cursor-pointer"
                                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                                  controls
                                />
                              ) : (
                                <img
                                  key={i}
                                  src={url}
                                  alt={`Property media ${i + 1}`}
                                  className="w-32 h-24 object-cover rounded-lg border cursor-pointer"
                                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                                />
                              )
                            )}
                            <Lightbox
                              open={lightboxOpen}
                              close={() => setLightboxOpen(false)}
                              slides={getMediaSlides(apt.images ?? []) as any}
                              index={lightboxIndex}
                              plugins={[Thumbnails, Zoom]}
                              render={{
                                slide: ({ slide }) =>
                                  (slide as any).type === "video" ? (
                                    <video
                                      src={slide.src}
                                      controls
                                      style={{ width: "100%", height: "100%", background: "#000" }}
                                    />
                                  ) : undefined,
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Description: </span>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {formatDescriptionAsBullets(apt.description || '').map((feature, i) => <li key={i}>{feature}</li>)}
                        </ul>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Address: </span>
                        <span>{apt.building_name}, {apt.street_name}, {apt.city}, {apt.state} - {apt.pincode}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Security Deposit: </span>
                        <span>₹{apt.security_deposit?.toLocaleString()}</span>
                      </div>
                      {apt.amenities && apt.amenities.length > 0 && (
                        <div>
                          <span className="font-semibold">Amenities: </span>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {apt.amenities.map((amenity, i) => <li key={i}>{amenity}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Informational Feature Containers */}
      <section className="py-8 bg-white">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 px-2 sm:px-4">
          {/* Card 1: Icon Left, Text Right */}
          <motion.div
            className="flex flex-col md:flex-row items-center bg-gray-50 rounded-2xl shadow-lg p-10 md:p-16 min-h-[260px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0 md:mr-8 w-full md:w-1/3">
              <span className="inline-flex items-center justify-center rounded-full bg-indigo-100" style={{ width: 110, height: 110 }}>
                <HiMagnifyingGlassCircle className="text-indigo-500" size={80} />
              </span>
            </div>
            <div className="md:w-2/3 text-left">
              <h3 className="text-3xl font-bold mb-4">Eliminate the struggle of house hunting</h3>
              <p className="text-gray-700 text-lg leading-relaxed">With our community based approach, finding the right rental property that meets your needs and preferences is easier. We provide you with a list of properties within your vicinity that meet your requirements, saving you time and effort in your search.</p>
            </div>
          </motion.div>
          {/* Card 2: Icon Right, Text Left */}
          <motion.div
            className="flex flex-col md:flex-row-reverse items-center bg-gray-50 rounded-2xl shadow-lg p-10 md:p-16 min-h-[260px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="flex-shrink-0 flex justify-center md:justify-end mb-4 md:mb-0 md:ml-8 w-full md:w-1/3">
              <span className="inline-flex items-center justify-center rounded-full bg-green-100" style={{ width: 110, height: 110 }}>
                <HiFaceSmile className="text-green-500" size={80} />
              </span>
            </div>
            <div className="md:w-2/3 text-left">
              <h3 className="text-3xl font-bold mb-4">Hassle-free experience</h3>
              <p className="text-gray-700 text-lg leading-relaxed">We will ensure that you have a hassle-free experience before and during the tenancy period. We handle all the paperwork, rental agreements, and payments on your behalf, making the rental process more streamlined and convenient for you.</p>
            </div>
          </motion.div>
          {/* Card 3: Icon Left, Text Right */}
          <motion.div
            className="flex flex-col md:flex-row items-center bg-gray-50 rounded-2xl shadow-lg p-10 md:p-16 min-h-[260px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            <div className="flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0 md:mr-8 w-full md:w-1/3">
              <span className="inline-flex items-center justify-center rounded-full bg-pink-100" style={{ width: 110, height: 110 }}>
                <HiDocumentText className="text-pink-500" size={80} />
              </span>
            </div>
            <div className="md:w-2/3 text-left">
              <h3 className="text-3xl font-bold mb-4">Seamless Paperwork</h3>
              <p className="text-gray-700 text-lg leading-relaxed">The rental process involves a lot of paperwork, including rental agreements, security deposits, and utility bills. We handle all the paperwork for you, ensuring that it is completed accurately and in a timely manner.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="bg-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Have a Property to Rent?</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
              If you want to list your property for rent, then login and fill this form to reach potential tenants in your community or just WhatsApp us.
            </p>
            <a 
              href="/parel/rent-apartment"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
            >
              List Your Property
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* SEO Structured Data */}
      <SEOScript location="Parel" type="rent" />

      {/* Photo Modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPhotoModal(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <div className="relative">
              {photoModal.images.map((media, i) => {
                const isVideo = media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.mov') || media.toLowerCase().endsWith('.avi');
                const isActive = i === photoModal.idx;
                
                if (!isActive) return null;
                
                if (isVideo) {
                  return (
                    <video
                      key={i}
                      src={media}
                      className="max-w-full max-h-[80vh] object-contain"
                      controls
                      autoPlay
                      muted
                      loop
                    >
                      <source src={media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                }
                
                return (
                  <img
                    key={i}
                    src={media}
                    alt={`Property media ${i+1}`}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                );
              })}
            </div>
            
            {/* Navigation buttons */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <button
                onClick={() => setPhotoModal({
                  images: photoModal.images,
                  idx: photoModal.idx > 0 ? photoModal.idx - 1 : photoModal.images.length - 1
                })}
                className="pointer-events-auto bg-black bg-opacity-50 text-white p-2 rounded-full ml-4 hover:bg-opacity-75"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setPhotoModal({
                  images: photoModal.images,
                  idx: photoModal.idx < photoModal.images.length - 1 ? photoModal.idx + 1 : 0
                })}
                className="pointer-events-auto bg-black bg-opacity-50 text-white p-2 rounded-full mr-4 hover:bg-opacity-75"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Thumbnail navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {photoModal.images.map((media, i) => {
                const isVideo = media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.mov') || media.toLowerCase().endsWith('.avi');
                const isActive = i === photoModal.idx;
                
                return (
                  <button
                    key={i}
                    onClick={() => setPhotoModal({ images: photoModal.images, idx: i })}
                    className={`w-16 h-12 rounded overflow-hidden border-2 ${
                      isActive ? 'border-white' : 'border-gray-400'
                    }`}
                  >
                    {isVideo ? (
                      <video
                        src={media}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={media}
                        alt={`Thumbnail ${i+1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
