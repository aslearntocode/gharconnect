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
import { createClient } from '@supabase/supabase-js';
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
  const [statusFilter, setStatusFilter] = useState('');
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
    // Status filter - filter based on status column
    if (statusFilter) {
      if (statusFilter === 'active' && apt.status !== 'active') return false;
      if (statusFilter === 'inactive' && apt.status !== 'inactive') return false;
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
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Blue Banner */}
      <div className="relative">
        <div className="w-full bg-indigo-600 flex flex-col items-center justify-center py-4 md:py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center">Rental Apartments with No Brokerage</h1>
          <p className="text-indigo-100 text-base md:text-lg mt-2 text-center max-w-5xl">
            Discover premium rental apartments within your neighborhood.
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
      {/* ...rest of the UI goes here... */}
       {/* SEO Content Section - Low Brokerage Value Proposition */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4"></div>
          <div className="sr-only">
            <p>Location: Mumbai</p>
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
          <div className="flex gap-2 w-full md:w-auto">
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 md:flex-none md:min-w-[120px]" value={size} onChange={e => setSize(e.target.value)}>
              <option value="">Size (BHK)</option>
              <option value="2BHK">2 BHK</option>
              <option value="2.5BHK">2.5 BHK</option>
              <option value="3BHK">3 BHK</option>
              <option value="3.5BHK">3.5 BHK</option>
              <option value="4BHK">4 BHK</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 md:flex-none md:min-w-[120px]" value={furnished} onChange={e => setFurnished(e.target.value)}>
              <option value="">Furnished</option>
              <option value="Not">Not</option>
              <option value="Semi">Semi</option>
              <option value="Fully">Fully</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 md:flex-none md:min-w-[120px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
                occupancy={[apt.apartment_type || 'Apartment']}
                highlights={formatDescriptionAsBullets(apt.description || '').slice(0, 2)}
                rent={apt.rent_amount || 0}
                deposit={apt.security_deposit ? `₹${apt.security_deposit.toLocaleString()}` : undefined}
                availableFrom={apt.available_from}
                petFriendly={apt.pet_friendly}
                vegNonVegAllowed={apt.veg_non_veg_allowed}
                furnishingStatus={apt.furnishing_status}
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
      
      {/* Related Searches Section */}
      <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Nearby Localities */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Nearby Localities</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  'Lower Parel', 'Doctor Compound', 'Chinchpokli', 'Dadar East', 'Sewri',
                  'Jacob Circle', 'Worli', 'Prabhadevi', 'Dadar', 'Mahalakshmi',
                  'Wadala East', 'Dadar TT Road', 'Agripada', 'Byculla', 'South Bombay',
                  'Dadar West', 'Arya Nagar', 'Madanpura', 'Wadala'
                ].map((locality, index) => (
                  <Link 
                    key={index} 
                    href={`/mumbai/rent/apartment?locality=${locality.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-xs md:text-sm font-medium transition-colors"
                  >
                    2 BHK Flats for rent in {locality}
                  </Link>
                ))}
              </div>
            </div>

            {/* People Also Searched For */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">People Also Searched For</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  '1 BHK Flats for rent in Parel',
                  '3 BHK Flats for rent in Parel',
                  '4 BHK Flats for rent in Parel',
                  '1 RK Flats for rent in Parel',
                  '4+ BHK Flats for rent in Parel',
                  'Villas for rent in Parel',
                  'Fully Furnished Flats for rent in Parel',
                  'UnFurnished Flats for rent in Parel'
                ].map((search, index) => (
                  <Link 
                    key={index} 
                    href={`/mumbai/rent/apartment?search=${search.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-xs md:text-sm font-medium transition-colors"
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Localities */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Top Localities</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  'Andheri East', 'Ghansoli', 'Navi Mumbai', 'Kalyan West', 'Goregaon',
                  'Nerul', 'Mira Road East', 'Andheri West', 'Airoli', 'Chembur',
                  'Malad West', 'Borivali West', 'Kandivali West', 'Kopar Khairane', 'Powai',
                  'Kharghar', 'Goregaon West', 'Thane', 'Ulwe', 'Vashi'
                ].map((locality, index) => (
                  <Link 
                    key={index} 
                    href={`/mumbai/rent/apartment?locality=${locality.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-xs md:text-sm font-medium transition-colors"
                  >
                    2 BHK Flats for rent in {locality}
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Societies */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Top Societies</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  'Sai Siddhi Chs', 'L&T Crescent Bay', 'Ashok Gardens', 'Dosti Flamingoes',
                  'Shiwani Building', 'Habib Mansion', 'Divya Apartment', 'Ashok Towers',
                  'Choksi Mansion', 'Omkar Vedha', 'Om Residency', 'Tilak nagar varsha chs ltd',
                  'Nana Palkar Smruti samiti', 'Ruparel Ariana', 'Lodha Park',
                  'Ashok Tower C (Ashoka Towers)', 'World One', 'Piramal Heights', 'L&T Skyline'
                ].map((society, index) => (
                  <Link 
                    key={index} 
                    href={`/mumbai/rent/apartment?society=${society.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-xs md:text-sm font-medium transition-colors"
                  >
                    {society}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Inquiry Modal */}
      <PropertyInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        apartment={selectedApartment}
      />
      {/* Blue CTA Section */}
      <div className="w-full bg-indigo-600 p-4 md:py-12 mt-12 flex flex-col items-center justify-center max-w-md mx-auto md:max-w-none">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Have a Property to Rent?</h2>
        <p className="text-base md:text-lg text-white mb-6 max-w-2xl text-center">If you want to list your property for rent, then login and fill this form to reach potential tenants in your community or just WhatsApp us.</p>
        <Link href="/mumbai/list-apartment" className="inline-flex items-center bg-green-500 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:bg-green-600 transition-all text-base md:text-lg">
          List Your Property
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </div>
  );
} 