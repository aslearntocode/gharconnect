'use client';

import { FiChevronDown, FiChevronUp, FiPhone } from 'react-icons/fi';
import { VendorRating } from './VendorRating';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  };
  type: 'service' | 'delivery';
}

export function VendorCard({ vendor, type }: VendorCardProps) {
  const [expandedVendor, setExpandedVendor] = useState(false);
  const [vendorRatings, setVendorRatings] = useState<ServiceRating | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

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

  const toggleVendor = () => {
    setExpandedVendor(!expandedVendor);
  };

  const items = vendor.services || vendor.products || [];
  const itemType = vendor.services ? 'services' : 'products';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
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
              // Refresh ratings after a new rating is added
              window.location.reload();
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
                        <span className="text-gray-900 font-medium">₹{service.price.toFixed(2)}/{service.unit}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{item.description}</span>
                      <span className="text-gray-900 font-medium">₹{item.price.toFixed(2)}/{item.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 