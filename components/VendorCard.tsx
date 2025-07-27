'use client';

import { FiChevronDown, FiChevronUp, FiPhone, FiX, FiChevronLeft, FiChevronRight, FiGlobe } from 'react-icons/fi';
import { VendorRating } from './VendorRating';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import LoginModal from './LoginModal';
import { auth } from '@/lib/firebase';

interface ServiceRating {
  rating: number;
  count: number;
}

interface VendorCardProps {
  vendor: {
    name: string;
    services?: any[];
    products?: any[];
    mobile?: string;
    mobile_no?: string;
    photo?: string;
    photos?: string[];
    social_media?: string;
    areaServed?: string | string[];
    buildingServed?: string | string[];
    id?: string; // Added for new vendorId logic
    vendor_id?: string; // Added for new vendorId logic
  };
  type: 'service' | 'delivery';
}

export function VendorCard({ vendor, type }: VendorCardProps) {
  const [expandedVendor, setExpandedVendor] = useState(false);
  const [vendorRatings, setVendorRatings] = useState<ServiceRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [imageError, setImageError] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  // Generate a stable vendor ID
  const generateVendorId = (vendor: any): string => {
    console.log('Generating vendor ID for vendor:', vendor);
    
    // Ensure vendor is an object
    if (!vendor || typeof vendor !== 'object') {
      console.error('Invalid vendor object:', vendor);
      return `vendor_unknown_${Date.now()}`;
    }
    
    // If vendor has an id or vendor_id, use that
    if (vendor.id && typeof vendor.id === 'string' && vendor.id.trim() !== '') {
      console.log('Using vendor.id:', vendor.id);
      return vendor.id;
    }
    if (vendor.vendor_id && typeof vendor.vendor_id === 'string' && vendor.vendor_id.trim() !== '') {
      console.log('Using vendor.vendor_id:', vendor.vendor_id);
      return vendor.vendor_id;
    }
    
    // If vendor has a name, use that as the ID
    if (vendor.name && typeof vendor.name === 'string' && vendor.name.trim() !== '') {
      console.log('Using vendor.name as ID:', vendor.name);
      return vendor.name;
    }
    
    // If no name, create a hash based on vendor properties
    console.log('No name found, creating hash from vendor properties');
    const vendorString = JSON.stringify({
      mobile: vendor.mobile || vendor.mobile_no,
      services: vendor.services,
      products: vendor.products,
      areaServed: vendor.areaServed,
      buildingServed: vendor.buildingServed
    });
    
    let hash = 0;
    for (let i = 0; i < vendorString.length; i++) {
      const char = vendorString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const generatedId = `vendor_${Math.abs(hash).toString(36).substring(0, 8)}`;
    console.log('Generated hash ID:', generatedId);
    
    // Ensure we always return a string and never null
    const result = String(generatedId || `vendor_${Date.now()}`);
    console.log('Final vendor ID result:', result, 'type:', typeof result);
    return result;
  };

  // Track user authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    return pathParts[1] || 'parel' // Default to parel if no society in path
  }

  const currentSociety = getSocietyFromPath();

  // Get all available photos (only include defined, non-empty strings)
  const photos = (vendor.photos && Array.isArray(vendor.photos) && vendor.photos.length > 0)
    ? vendor.photos.filter(Boolean)
    : (vendor.photo ? [vendor.photo] : []);
  
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const vendorId = generateVendorId(vendor);
        
        console.log('Fetching ratings for vendor:', { vendorId, vendorName: vendor.name, vendor });
        
        // Try to fetch ratings with the generated vendor ID
        let { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('card_id', vendorId);

        // If no ratings found with the generated ID, try with vendor name as fallback
        if (!data || data.length === 0) {
          console.log('No ratings found with generated ID, trying with vendor name');
          const fallbackId = vendor.name || `vendor_${Date.now()}`;
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('reviews')
            .select('rating')
            .eq('card_id', fallbackId);
          
          if (fallbackData && fallbackData.length > 0) {
            data = fallbackData;
            error = fallbackError;
          }
        }

        if (error) {
          console.error('Error fetching ratings:', error);
          setError('Failed to load ratings');
          return;
        }

        if (data && data.length > 0) {
          const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
          setVendorRatings({
            rating: totalRating / data.length,
            count: data.length
          });
        }
      } catch (err) {
        console.error('Error in fetchRatings:', err);
        setError('An unexpected error occurred while loading ratings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [vendor.id, vendor.vendor_id, vendor.name, supabase]);

  // Create a function to refresh ratings that can be called from VendorRating
  const refreshRatings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const vendorId = generateVendorId(vendor);
      
      console.log('Refreshing ratings for vendor:', { vendorId, vendorName: vendor.name, vendor });
      
      // Try to fetch ratings with the generated vendor ID
      let { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('card_id', vendorId);

      // If no ratings found with the generated ID, try with vendor name as fallback
      if (!data || data.length === 0) {
        console.log('No ratings found with generated ID, trying with vendor name');
        const fallbackId = vendor.name || `vendor_${Date.now()}`;
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('card_id', fallbackId);
        
        if (fallbackData && fallbackData.length > 0) {
          data = fallbackData;
          error = fallbackError;
        }
      }

      if (error) {
        console.error('Error refreshing ratings:', error);
        setError('Failed to refresh ratings');
        return;
      }

      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, item) => sum + item.rating, 0);
        setVendorRatings({
          rating: totalRating / data.length,
          count: data.length
        });
      } else {
        // If no ratings found, reset the ratings
        setVendorRatings(null);
      }
    } catch (err) {
      console.error('Error in refreshRatings:', err);
      setError('An unexpected error occurred while refreshing ratings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const vendorId = generateVendorId(vendor);
      
      console.log('Fetching reviews for vendor:', { vendorId, vendorName: vendor.name });
      
      // Try to fetch reviews with the generated vendor ID
      let { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('card_id', vendorId)
        .order('created_at', { ascending: false });

      // If no reviews found with the generated ID, try with vendor name as fallback
      if (!data || data.length === 0) {
        console.log('No reviews found with generated ID, trying with vendor name');
        const fallbackId = vendor.name || `vendor_${Date.now()}`;
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('reviews')
          .select('*')
          .eq('card_id', fallbackId)
          .order('created_at', { ascending: false });
        
        if (fallbackData && fallbackData.length > 0) {
          data = fallbackData;
          error = fallbackError;
        }
      }

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      if (data) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Error in fetchReviews:', err);
    }
  };

  const toggleReviews = async () => {
    if (!showReviews) {
      await fetchReviews();
    }
    setShowReviews(!showReviews);
  };

  const toggleVendor = () => {
    setExpandedVendor(!expandedVendor);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const items = vendor.services || vendor.products || [];
  const itemType = vendor.services ? 'services' : 'products';

  const formatPrice = (price: number | string | undefined | null, unit: string) => {
    if (price === undefined || price === null || price === '') {
      return `N/A${unit ? `/${unit}` : ''}`;
    }
    if (typeof price === 'string') {
      return `${price}/${unit}`;
    }
    if (typeof price === 'number' && !isNaN(price)) {
      return `₹${price.toFixed(2)}/${unit}`;
    }
    return `N/A${unit ? `/${unit}` : ''}`;
  };

  const handleShowNumber = () => {
    if (user) {
      setShowNumber(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert('Phone number copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openWhatsApp = (phoneNumber: string) => {
    // Remove any non-digit characters except + for WhatsApp
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const mobileNumber = vendor.mobile_no || vendor.mobile;

  // Function to split and clean phone numbers
  const getPhoneNumbers = (phoneString: string | undefined): string[] => {
    if (!phoneString) return [];
    
    // Split by common separators and clean up
    const numbers = phoneString
      .split(/[\/,;|]/) // Split by /, comma, semicolon, or pipe
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
    return numbers;
  };

  const phoneNumbers = getPhoneNumbers(mobileNumber);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        {Array.isArray(photos) && photos.length > 0 && !imageError && (
          <div 
            className="w-full h-48 overflow-hidden rounded-t-lg cursor-pointer relative bg-gray-100 flex items-center justify-center"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img 
              src={photos[currentPhotoIndex]}
              alt={vendor.name}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
            {photos.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {photos.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {vendor.name}
            </h2>
            {(() => {
              const vendorId = generateVendorId(vendor);
              console.log('Passing vendor ID to VendorRating:', { 
                vendorId, 
                vendorIdType: typeof vendorId,
                vendorName: vendor.name,
                vendor: vendor 
              });
              return (
                <VendorRating
                  vendorId={vendorId}
                  vendorName={vendor.name || 'Unknown Vendor'}
                  vendorType={type}
                  onRatingAdded={() => {
                    console.log('Rating added, refreshing ratings...');
                    refreshRatings();
                  }}
                />
              );
            })()}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {items.length} {itemType} available
          </p>
          {!showNumber ? (
            <button
              onClick={handleShowNumber}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 block mb-3 underline focus:outline-none"
            >
              Log-in to view number
            </button>
          ) : (
            <div className="mb-3">
              {phoneNumbers.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {phoneNumbers.map((number, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span 
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer flex items-center gap-1" 
                        onClick={() => openWhatsApp(number)}
                        title="Click to open WhatsApp"
                      >
                        <span className="text-green-500">📱</span>
                        {number}
                      </span>
                      <button
                        onClick={() => copyToClipboard(number)}
                        className="text-gray-500 hover:text-gray-700 text-sm p-1 rounded hover:bg-gray-100"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 text-sm">No phone number available</span>
              )}
            </div>
          )}
          
          {/* WhatsApp Group Link for Eggs */}
          {type === 'delivery' && vendor.name.includes('Egg') && (
            <a 
              href="https://chat.whatsapp.com/HjgzZ8awaP63Hz1ncunFZW"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-sm font-medium hover:text-green-700 block mb-3 underline focus:outline-none"
            >
              or Join WhatsApp Group Here
            </a>
          )}
          
          {/* Learn More About Eggs Link */}
          {type === 'delivery' && vendor.name.includes('Egg') && (
            <a 
              href={`/${currentSociety}/blog/eggs-types`}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 block mb-3 underline focus:outline-none"
            >
              Learn about the difference between farm and country eggs
            </a>
          )}
          
          {/* Area Served and Building Served */}
          <div className="mb-3 space-y-1">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Area Served:</span> {Array.isArray(vendor.areaServed) && vendor.areaServed.length > 0 ? vendor.areaServed.join(', ') : ''}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Building Served:</span> {Array.isArray(vendor.buildingServed) && vendor.buildingServed.length > 0 ? vendor.buildingServed.join(', ') : ''}
            </div>
          </div>
          
          {/* Social Media Handle */}
          {vendor.social_media && vendor.social_media.trim() !== '' && (
            <a 
              href={vendor.social_media}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 text-sm font-medium hover:text-green-700 mb-3"
            >
              <FiGlobe className="w-4 h-4" />
              <span>View Social</span>
            </a>
          )}
          
          {vendorRatings && (
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              <span className="text-sm font-medium">
                {vendorRatings.rating.toFixed(1)}
              </span>
              <span className="text-gray-500 text-xs">
                ({vendorRatings.count})
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleVendor}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {expandedVendor ? (
                <>
                  <FiChevronUp className="w-4 h-4" />
                  Hide {itemType}
                </>
              ) : (
                <>
                  <FiChevronDown className="w-4 h-4" />
                  View {itemType}
                </>
              )}
            </button>
            {vendorRatings && vendorRatings.count > 0 && (
              <button
                onClick={toggleReviews}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showReviews ? (
                  <>
                    <FiChevronUp className="w-4 h-4" />
                    Hide Reviews
                  </>
                ) : (
                  <>
                    <FiChevronDown className="w-4 h-4" />
                    Show Reviews
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        {expandedVendor && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{item.name}</h3>
                  <div className="space-y-1">
                    {item.services ? (
                      item.services.map((service: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{service.type}</span>
                          <span className="text-gray-900 font-medium">{formatPrice(service.price, service.unit)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between items-center text-sm gap-4">
                        <span className="text-gray-600">{item.description}</span>
                        <span className="text-gray-900 font-medium">{formatPrice(item.price, item.unit)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {showReviews && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Reviews</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.floor(vendorRatings?.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {vendorRatings?.rating.toFixed(1)} out of 10
                </span>
                <span className="text-sm text-gray-500">
                  ({vendorRatings?.count} reviews)
                </span>
              </div>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {review.user_name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {review.user_name || 'Anonymous'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 10 }).map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          className={`w-3 h-3 ${
                            starIndex < review.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs font-medium text-gray-600 ml-1">
                        {review.rating}/10
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {reviews.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No reviews yet</p>
                <p className="text-gray-400 text-xs mt-1">Be the first to review this vendor!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && photos.length > 0 && !imageError && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <div className="relative">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10"
              >
                <FiX className="w-6 h-6" />
              </button>
              <img
                src={photos[currentPhotoIndex]}
                alt={vendor.name}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={() => setImageError(true)}
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          setShowNumber(true);
        }}
      />
    </>
  );
} 