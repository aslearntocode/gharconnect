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

export default function RentApartmentPage() {
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
          .eq('city', 'Bangalore')
          .eq('state', 'Karnataka')
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

  // Filtering logic
  const filteredApartments = apartments.filter((apt: Apartment) => {
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

  // Helper to include both images and videos for the lightbox
  const getMediaSlides = (media: string[] = []) =>
    media.map(url =>
      url.match(/\.(mp4|mov|avi)$/i)
        ? { src: url, type: "video" }
        : { src: url }
    );

  // Helper to format description as bullet points
  const formatDescriptionAsBullets = (description: string): string[] => {
    if (!description) return [];
    return description
      .split(/[,;•\n]/)
      .map(feature => feature.trim())
      .filter(feature => feature.length > 0)
      .map(feature => feature.replace(/^[-•*]\s*/, ''));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full bg-indigo-600 flex flex-col items-center justify-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Rental Apartments with No Brokerage</h1>
          <p className="text-indigo-100 text-base md:text-lg mt-2 text-center max-w-5xl">
            Discover premium rental apartments within your neighborhood in Bangalore.
          </p>
        </div>
      </div>
      {/* Back Button */}
      {/* <div className="max-w-6xl mx-auto w-full flex justify-start mt-4 mb-2 px-4">
        <Link href="/bangalore/rent" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-600 text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-all text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Other Types of Accommodation
        </Link>
      </div> */}
      {/* ...rest of the UI goes here... */}
       {/* SEO Content Section - Low Brokerage Value Proposition */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4"></div>
          <div className="sr-only">
            <p>Location: Bangalore</p>
            <p>Type: Rental</p>
            <p>Price Range: ₹15,000 to ₹1,00,000+</p>
            <p>Property Types: 1BHK, 2BHK, 3BHK, 4BHK</p>
          </div>
        </div>
      </div>
      {/* Filter Bar below the blue box */}
      <div className="w-full flex justify-center mt-[-1.5rem] mb-0">
        <div className="max-w-5xl w-full flex flex-wrap md:flex-nowrap justify-center gap-2 md:gap-4 bg-white rounded-2xl shadow-lg px-4 py-3">
          <input type="text" placeholder="Building name" className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]" value={building} onChange={e => setBuilding(e.target.value)} />
          <input type="text" placeholder="Min Area" className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[100px]" value={minArea} onChange={e => setMinArea(e.target.value.replace(/\D/g, ''))} />
          <input type="text" placeholder="Max Area" className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[100px]" value={maxArea} onChange={e => setMaxArea(e.target.value.replace(/\D/g, ''))} />
          <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]" value={size} onChange={e => setSize(e.target.value)}>
            <option value="">Size (BHK)</option>
            <option value="2BHK">2 BHK</option>
            <option value="2.5BHK">2.5 BHK</option>
            <option value="3BHK">3 BHK</option>
            <option value="3.5BHK">3.5 BHK</option>
            <option value="4BHK">4 BHK</option>
          </select>
          <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]" value={furnished} onChange={e => setFurnished(e.target.value)}>
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
                location={apt.location || 'Bangalore'}
                occupancy={[apt.apartment_type || 'Apartment']}
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
            <p className="text-sm md:text-base text-gray-600">With our community based approach, finding the right rental property that meets your needs and preferences is easier. We provide you with a list of properties within your vicinity that meet your requirements and connect you directly with the owner.</p>
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
            <p className="text-sm md:text-base text-gray-600">We will ensure that you have a hassle-free experience by getting your property ready at the right time. We handle all tasks like painting, cleaning etc. and get the apartment ready on owner's behalf.</p>
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
            <p className="text-sm md:text-base text-gray-600">The rental process involves a lot of paperwork, including rental agreements, security deposits, and utility bills. We handle all the paperwork for you, ensuring that it is completed accurately and in a timely manner.</p>
          </div>
        </div>
      </div>
      {/* Blue CTA Section */}
      <div className="w-full bg-blue-700 p-4 md:py-12 mt-12 flex flex-col items-center justify-center max-w-md mx-auto md:max-w-none">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Have a Property to Rent?</h2>
        <p className="text-base md:text-lg text-white mb-6 max-w-2xl text-center">If you want to list your property for rent, then login and fill this form to reach potential tenants in your community or just WhatsApp us.</p>
        <Link href="/bangalore/list-apartment" className="inline-flex items-center bg-green-500 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:bg-green-600 transition-all text-base md:text-lg">
          List Your Property
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </div>
  );
}