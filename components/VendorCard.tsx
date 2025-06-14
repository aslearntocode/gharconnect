'use client';

import { FiChevronDown, FiChevronUp, FiPhone, FiX } from 'react-icons/fi';
import { VendorRating } from './VendorRating';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface ServiceRating {
  rating: number;
  count: number;
}

interface VendorCardProps {
  vendor: {
    name: string;
    services?: any[];
    products?: any[];
    mobile: string;
    photo?: string;
  };
  type: 'service' | 'delivery';
}

export function VendorCard({ vendor, type }: VendorCardProps) {
  const [expandedVendor, setExpandedVendor] = useState(false);
  const [vendorRatings, setVendorRatings] = useState<ServiceRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('card_id', vendor.name);

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
  }, [vendor.name, supabase]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('card_id', vendor.name)
        .order('created_at', { ascending: false });

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

  const items = vendor.services || vendor.products || [];
  const itemType = vendor.services ? 'services' : 'products';

  const formatPrice = (price: number | string, unit: string) => {
    if (typeof price === 'string') {
      return `${price}/${unit}`;
    }
    return `₹${price.toFixed(2)}/${unit}`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        {vendor.photo && (
          <div 
            className="w-full h-48 overflow-hidden rounded-t-lg cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img 
              src={vendor.photo} 
              alt={vendor.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {vendor.name}
            </h2>
            <VendorRating
              vendorId={vendor.name}
              vendorName={vendor.name}
              vendorType={type}
              onRatingAdded={() => {
                router.refresh();
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {items.length} {itemType} available
          </p>
          <a 
            href={`tel:${vendor.mobile}`}
            className="text-blue-600 text-sm font-medium hover:text-blue-700 block mb-3"
          >
            {vendor.mobile}
          </a>
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
                      <div className="flex justify-between items-center text-sm">
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
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{review.user_name}</span>
                    <span className="text-sm text-yellow-500 font-medium">{review.rating}/10</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && vendor.photo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={vendor.photo}
              alt={vendor.name}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close image"
            >
              <FiX size={24} className="text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </>
  );
} 