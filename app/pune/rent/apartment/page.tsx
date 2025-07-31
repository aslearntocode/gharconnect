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
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function RentApartmentPage() {
  // Data states
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apartmentMedia, setApartmentMedia] = useState<{ [key: string]: string[] }>({});

  // Filter states
  const [building, setBuilding] = useState('');
  const [location, setLocation] = useState(''); // Add location filter state
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

  // Carousel states for packages
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const packages = [
    {
      name: 'Bronze',
      price: '₹0',
      icon: '🥉',
      description: 'Basic listing',
      features: [
        'Listing on the Website',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Silver',
      price: '₹999',
      originalPrice: '₹2,999',
      icon: '🥈',
      description: 'For property owners who want essential services',
      features: [
        'Property Promotion on the Website',
        '5 Property Showings on Owner\'s Behalf',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-gray-200',
      bgColor: 'bg-gray-100'
    },
    {
      name: 'Gold',
      price: '₹2,999',
      originalPrice: '₹4,999',
      icon: '🥇',
      description: 'Premium services for your property',
      features: [
        'Everything in Silver',
        'Professional Property Photoshoot',
        '5 More Property Showings on Owner\'s Behalf',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-yellow-400',
      bgColor: 'bg-yellow-100',
      isPopular: true
    },
    {
      name: 'Platinum',
      price: '₹4,999',
      originalPrice: '₹6,999',
      icon: '💎',
      description: 'Complete peace of mind for property owners',
      features: [
        'Everything in Gold',
        'Timely Property Readiness Services including Painting, Carpentry, Repairing, etc.',
        'Privacy of Owner\'s Contact Details'
      ],
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-100'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % packages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + packages.length) % packages.length);
  };

  // Fetch apartments from Supabase and their media manifests
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('city', 'Pune')
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
    // Location (area)
    if (location && !apt.location?.toLowerCase().includes(location.toLowerCase())) return false;
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
    <div className="min-h-screen bg-gray-50 pt-0 md:pt-16">
      <Header />
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
        <Link href="/pune/rent" className="inline-flex items-center px-3 py-1.5 bg-white border border-indigo-600 text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-all text-sm">
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
          <input type="text" placeholder="Location (Area)" className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]" value={location} onChange={e => setLocation(e.target.value)} />
          <input type="text" placeholder="Building name" className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[120px]" value={building} onChange={e => setBuilding(e.target.value)} />
          <input type="text" placeholder="Min Area" className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex-1 min-w-[100px]" value={minArea} onChange={e => setMinArea(e.target.value.replace(/\D/g, ''))} />
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
                code={apt.building_name || 'N/A'}
                address={apt.street_name ? `${apt.building_name}, ${apt.street_name}${apt.location ? `, ${apt.location}` : ''}` : `${apt.building_name || 'N/A'}${apt.location ? `, ${apt.location}` : ''}`}
                location={apt.location || 'Mumbai'}
                occupancy={[apt.apartment_type || 'Apartment']}
                highlights={formatDescriptionAsBullets(apt.description || '').slice(0, 2)}
                rent={apt.rent_amount || 0}
                deposit={apt.security_deposit ? `₹${apt.security_deposit.toLocaleString()}` : undefined}
                availableFrom={apt.available_from}
                petFriendly={apt.pet_friendly}
                vegNonVegAllowed={apt.veg_non_veg_allowed ? 'Non-Veg Allowed' : 'Veg Only'}
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
      
      {/* Why You Should List Your Property With Us Section */}
      <div className="w-full max-w-7xl mx-auto mt-12">
        <div className="bg-gray-50 py-8 md:py-12 rounded-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List Your Property With Us?</h2>
              <p className="text-lg text-gray-600 max-w-5xl mx-auto">
                Comprehensive packages designed to make property listing hassle-free <br/>
                <span className="text-lg text-gray-500 font-bold text-indigo-600">No Brokerage Ever</span>
              </p>
            </div>
            
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {packages.map((pkg, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <div className={`bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-shadow border-2 ${pkg.borderColor} relative h-80 flex flex-col pb-6`}>
                          {pkg.isPopular && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <span className="bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold">MOST POPULAR</span>
                            </div>
                          )}
                          <div className={`w-12 h-12 ${pkg.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-xl">{pkg.icon}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                          <div className="text-2xl font-bold text-indigo-600 mb-1">
                            {/* {pkg.originalPrice ? (
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-sm md:text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                                <span className="text-lg md:text-2xl text-indigo-600 transform -rotate-2 bg-yellow-100 px-2 py-1 rounded-lg shadow-sm">{pkg.price}</span>
                              </div>
                            ) : (
                              pkg.price
                            )} */}
                            {pkg.originalPrice ? pkg.originalPrice : pkg.price}
                          </div>
                          <p className="text-gray-600 text-xs mb-4">
                            {pkg.description}
                          </p>
                          <ul className="text-left text-gray-700 space-y-2 mb-4 flex-grow">
                            {pkg.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          {/* Pay Now Button for Silver, Gold, and Platinum */}
                          {pkg.name !== 'Bronze' ? (
                            <button 
                              onClick={() => {
                                setSelectedPackage(pkg.name);
                                setShowQRModal(true);
                              }}
                              className={`inline-flex items-center justify-center w-full font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                                pkg.name === 'Silver' ? 'bg-green-600 hover:bg-green-700 text-white' :
                                pkg.name === 'Gold' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                                pkg.name === 'Platinum' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                                'bg-gray-400 text-white'
                              }`}
                            >
                              Pay Now
                            </button>
                          ) : (
                            <div className="h-10"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-3 max-w-7xl mx-auto">
              {/* Bronze Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-orange-300 flex flex-col h-full">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥉</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Bronze</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">₹0</div>
                <p className="text-gray-600 text-xs mb-3">
                  Basic listing
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Listing on the Website</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
                <div className="h-10"></div>
              </div>

              {/* Silver Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-gray-200 flex flex-col h-full">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥈</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Silver</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  {/* <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400 line-through">₹2,999</span>
                    <span className="text-xl text-indigo-600 transform -rotate-1 bg-yellow-100 px-1.5 py-0.5 rounded shadow-sm">₹999</span>
                  </div> */}
                  ₹2,999
                </div>
                <p className="text-gray-600 text-xs mb-3">
                  For property owners who want essential services
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Property Promotion on the Website</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Legal Paperwork</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">5 Property Showings on Owner's Behalf</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
                {/* Payment Links - Commented out for now
                <a 
                  href="https://payments-test.cashfree.com/links?code=d8ua85k5ah00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </a>
                */}
                <button 
                  onClick={() => {
                    setSelectedPackage('Silver');
                    setShowQRModal(true);
                  }}
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </button>
              </div>

              {/* Gold Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-yellow-400 relative flex flex-col h-full">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">MOST POPULAR</span>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">🥇</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Gold</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  {/* <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400 line-through">₹4,999</span>
                    <span className="text-xl text-indigo-600 transform -rotate-1 bg-yellow-100 px-1.5 py-0.5 rounded shadow-sm">₹2,999</span>
                  </div> */}
                  ₹4,999
                </div>
                <p className="text-gray-600 text-xs mb-3">
                  Premium services for your property
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Everything in Silver</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Professional Property Photoshoot</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">5 More Property Showings on Owner's Behalf</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
                {/* Payment Links - Commented out for now
                <a 
                  href="https://payments-test.cashfree.com/links?code=D8uaaoua4h00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </a>
                */}
                <button 
                  onClick={() => {
                    setSelectedPackage('Gold');
                    setShowQRModal(true);
                  }}
                  className="inline-flex items-center justify-center w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </button>
              </div>

              {/* Platinum Package */}
              <div className="bg-white rounded-xl shadow-lg p-3 text-center hover:shadow-xl transition-shadow border-2 border-purple-400 flex flex-col h-full">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg">💎</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Platinum</h3>
                <div className="text-xl font-bold text-indigo-600 mb-1">
                  {/* <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400 line-through">₹6,999</span>
                    <span className="text-xl text-indigo-600 transform -rotate-1 bg-yellow-100 px-1.5 py-0.5 rounded shadow-sm">₹4,999</span>
                  </div> */}
                  ₹6,999
                </div>
                <p className="text-gray-600 text-xs mb-3">
                  Complete peace of mind for property owners
                </p>
                <ul className="text-left text-gray-700 space-y-1 mb-3 flex-grow">
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Everything in Gold</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Timely Property Readiness Services including Painting, Carpentry, Repairing, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs leading-tight">Privacy of Owner's Contact Details</span>
                  </li>
                </ul>
                {/* Payment Links - Commented out for now
                <a 
                  href="https://payments-test.cashfree.com/links?code=m8uaar6t2h00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </a>
                */}
                <button 
                  onClick={() => {
                    setSelectedPackage('Platinum');
                    setShowQRModal(true);
                  }}
                  className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Pay Now
                </button>
              </div>
            </div>

            {/* Important Note */}
            <div className="text-center mt-8 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> Legal paperwork costs and property readiness services (painting, carpentry, etc.) are to be borne by the property owner. We provide the service coordination and quality assurance.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <a 
                href="/pune/list-apartment" 
                className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                List Your Property Now
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
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
                    href={`/pune/rent/apartment?locality=${locality.toLowerCase().replace(/\s+/g, '-')}`}
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
                    href={`/pune/rent/apartment?search=${search.toLowerCase().replace(/\s+/g, '-')}`}
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
                    href={`/pune/rent/apartment?locality=${locality.toLowerCase().replace(/\s+/g, '-')}`}
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
                    href={`/pune/rent/apartment?society=${society.toLowerCase().replace(/\s+/g, '-')}`}
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
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Pay for {selectedPackage} Package</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-2xl">G</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">GharConnect</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="bg-white rounded-lg p-4 mb-3">
                  {/* QR Code */}
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <img 
                      src="/GC_QR.jpeg" 
                      alt="GharConnect QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">UPI ID: gharconnectindia@okicici</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code with any UPI app to complete your payment for the {selectedPackage} package.
              </p>
              
              <button 
                onClick={() => setShowQRModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Blue CTA Section */}
      <div className="w-full bg-indigo-600 p-4 md:py-12 mt-12 flex flex-col items-center justify-center max-w-md mx-auto md:max-w-none">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Have a Property to Rent?</h2>
        {/* <p className="text-base md:text-lg text-white mb-6 max-w-2xl text-center">If you want to list your property for rent, then login and fill this form to reach potential tenants in your community or just WhatsApp us.</p> */}
        <Link href="/pune/list-apartment" className="inline-flex items-center bg-green-500 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg hover:bg-green-600 transition-all text-base md:text-lg">
          List Your Property
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
      <Footer />
    </div>
  );
} 