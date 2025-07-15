'use client';

import Link from 'next/link';
import { FiHome, FiChevronDown, FiX, FiSearch, FiSmile, FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import React from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Apartment } from '@/types/apartment';
import SEOScript from '@/components/SEOScript';
import Lottie from 'react-lottie-player';
import { HiMagnifyingGlassCircle, HiFaceSmile, HiDocumentText } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import PropertyInquiryModal from '@/components/PropertyInquiryModal';
import PropertyCard from '@/components/PropertyCard';

export default function PGPage() {
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
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

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
          .eq('accommodation_type', 'PG') // Filter for PG accommodations
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching apartments:', error);
          setError('Failed to load PG accommodations');
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
        setError('Failed to load PG accommodations');
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
    // Building name (building_name)
    if (building && !apt.building_name?.toLowerCase().includes(building.toLowerCase())) return false;
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

  async function getMediaUrlsForContactPhone(contact_phone: string): Promise<string[]> {
    // Get shared Supabase client
    const supabase = await getSupabaseClient();
    
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
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full bg-indigo-600 flex flex-col items-center justify-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">PG Accommodation with No Brokerage</h1>
          <p className="text-indigo-100 text-base md:text-lg mt-2 text-center max-w-5xl">
            Discover premium PG accommodations within your neighborhood.
          </p>
        </div>
      </div>
      {/* Back Button */}
      {/* <div className="max-w-6xl mx-auto w-full flex justify-start mt-4 mb-2 px-4">
        <Link href="/mumbai/rent" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-600 text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-all text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Other Types of Accommodation
        </Link>
      </div> */}
      
      {/* SEO Content Section - Low Brokerage Value Proposition */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            {/* Value proposition moved to indigo banner above */}
          </div>
          
          
          {/* SEO Content for Search Engines */}
          <div className="sr-only">
            <p>Location: Mumbai</p>
            <p>Type: PG Accommodation</p>
            <p>Price Range: ₹5,000 to ₹25,000+</p>
            <p>Property Types: Single Room, Double Sharing, Triple Sharing</p>
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
            <option value="">Room Type</option>
            <option value="Single">Single Room</option>
            <option value="Double">Double Sharing</option>
            <option value="Triple">Triple Sharing</option>
            <option value="Dormitory">Dormitory</option>
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
        </div>
      </div>
      <main className="pt-4 md:pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mt-0 bg-white rounded-2xl shadow-lg overflow-x-auto">
          {/* Property Card Grid - Two per row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApartments.map((apt, idx) => (
              <PropertyCard
                key={apt.id}
                image={(apt.images && apt.images[0]) || '/default-apartment.jpg'}
                images={apt.images || []}
                propertyId={apt.id || ''}
                status={apt.status}
                isFavorite={false}
                code={apt.building_name || 'N/A'}
                address={apt.street_name ? `${apt.building_name}, ${apt.street_name}` : apt.building_name || 'N/A'}
                location={apt.location || 'Mumbai'}
                occupancy={[apt.apartment_type || 'Room']}
                highlights={formatDescriptionAsBullets(apt.description || '').slice(0, 2)}
                rent={apt.rent_amount || 0}
                deposit={apt.security_deposit ? `₹${apt.security_deposit.toLocaleString()}` : undefined}
                onBook={() => {
                                  setSelectedApartment(apt);
                                  setInquiryModalOpen(true);
                                }}
                onCall={() => {
                  window.open(`tel:${apt.contact_phone}`);
                          }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Property Inquiry Modal */}
      <PropertyInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        apartment={selectedApartment}
      />

      {/* Value Proposition Cards */}
      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 flex items-center gap-4 md:gap-8 w-full max-w-md mx-auto md:max-w-none md:w-auto">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-full bg-indigo-100">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Eliminate the struggle of paying brokerage</h2>
            <p className="text-sm md:text-base text-gray-600">With our community based approach, finding the right PG accommodation that meets your needs and preferences is easier. We provide you with a list of properties within your vicinity that meet your requirements and connect you directly with the owner.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 flex items-center gap-4 md:gap-8 w-full max-w-md mx-auto md:max-w-none md:w-auto">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-full bg-green-100">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" /></svg>
            </span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Hassle-free experience</h2>
            <p className="text-sm md:text-base text-gray-600">We will ensure that you have a hassle-free experience by getting your PG accommodation ready at the right time. We handle all tasks like cleaning, maintenance etc. and get the room ready on owner's behalf.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 flex items-center gap-4 md:gap-8 md:col-span-2 w-full max-w-md mx-auto md:max-w-none md:w-auto">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-full bg-pink-100">
              <svg className="w-6 h-6 md:w-10 md:h-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" /></svg>
            </span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Seamless Paperwork</h2>
            <p className="text-sm md:text-base text-gray-600">The PG accommodation process involves a lot of paperwork, including rental agreements, security deposits, and utility bills. We handle all the paperwork for you, ensuring that it is completed accurately and in a timely manner.</p>
          </div>
        </div>
      </div>

      {/* Blue CTA Section */}
      <div className="w-full bg-blue-700 p-4 md:py-12 mt-12 flex flex-col items-center justify-center max-w-md mx-auto md:max-w-none">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Have a PG Accommodation to Rent?</h2>
        <p className="text-base md:text-lg text-white mb-6 max-w-2xl text-center">If you want to list your PG accommodation for rent, then login and fill this form to reach potential tenants in your community or just WhatsApp us.</p>
        <Link href="/mumbai/list-apartment" className="inline-flex items-center bg-green-500 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:bg-green-600 transition-all text-base md:text-lg">
          List Your PG Accommodation
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
      
      {/* SEO Structured Data */}
      <SEOScript location="Mumbai" type="pg" />

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