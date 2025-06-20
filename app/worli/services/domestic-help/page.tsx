"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { useMediaQuery } from 'react-responsive';
import { VendorRating } from '@/components/VendorRating';
import { useRouter } from 'next/navigation';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TIME_SLOTS = [
  { start: 9, end: 10, label: "9-10am" },
  { start: 10, end: 11, label: "10-11am" },
  { start: 11, end: 12, label: "11-12pm" },
  { start: 12, end: 13, label: "12-1pm" },
  { start: 13, end: 14, label: "1-2pm" },
  { start: 14, end: 15, label: "2-3pm" },
  { start: 15, end: 16, label: "3-4pm" },
  { start: 16, end: 17, label: "4-5pm" },
  { start: 17, end: 18, label: "5-6pm" },
  { start: 18, end: 19, label: "6-7pm" },
  { start: 19, end: 20, label: "7-8pm" },
];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function VendorSearchPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [vendorRatings, setVendorRatings] = useState<Record<string, { rating: number; count: number }>>({});
  const [showReviews, setShowReviews] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();

  // Fetch all vendors (distinct by vendor_id)
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayDateString = `${year}-${month}-${day}`;

      const { data, error } = await supabase
        .from("vendor_weekly_availability")
        .select("vendor_id, Name, Mobile_No, area, societies, date, services")
        .gte("date", todayDateString)
        .order("date", { ascending: true });
      if (!error && data) {
        // Group by vendor_id, get latest area/societies
        const vendorMap: Record<string, any> = {};
        data.forEach((row: any) => {
          if (!vendorMap[row.vendor_id]) {
            vendorMap[row.vendor_id] = row;
          }
        });
        setVendors(Object.values(vendorMap));
      }
      setLoading(false);
    };
    fetchVendors();
  }, []);

  // Fetch ratings for all vendors
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('card_id, rating');

        if (error) {
          console.error('Error fetching ratings:', error);
          return;
        }

        const ratings: Record<string, { rating: number; count: number }> = {};
        data?.forEach(review => {
          if (!ratings[review.card_id]) {
            ratings[review.card_id] = { rating: 0, count: 0 };
          }
          ratings[review.card_id].rating += review.rating;
          ratings[review.card_id].count += 1;
        });

        // Calculate average ratings
        Object.keys(ratings).forEach(vendorId => {
          ratings[vendorId].rating = ratings[vendorId].rating / ratings[vendorId].count;
        });

        setVendorRatings(ratings);
      } catch (err) {
        console.error('Error in fetchRatings:', err);
      }
    };

    fetchRatings();
  }, [supabase]);

  // Fetch reviews for a specific vendor
  const fetchReviews = async (vendorId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('card_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      if (data) {
        setReviews(prev => ({
          ...prev,
          [vendorId]: data
        }));
      }
    } catch (err) {
      console.error('Error in fetchReviews:', err);
    }
  };

  // Toggle reviews for a vendor
  const toggleReviews = async (vendorId: string) => {
    if (!showReviews[vendorId]) {
      await fetchReviews(vendorId);
    }
    setShowReviews(prev => ({
      ...prev,
      [vendorId]: !prev[vendorId]
    }));
  };

  // Filtered vendors
  const filteredVendors = vendors.filter(vendor => {
    const societies = Array.isArray(vendor.societies)
      ? vendor.societies
      : typeof vendor.societies === "string"
      ? vendor.societies.replace(/[{}"]+/g, "").split(",").filter(Boolean)
      : [];
    
    // Search query filter
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = !searchQuery || 
      (vendor.Name || vendor.vendor_name || '').toLowerCase().includes(searchLower) ||
      String(vendor.Mobile_No || '').toLowerCase().includes(searchLower) ||
      (vendor.area || '').toLowerCase().includes(searchLower) ||
      societies.some((society: string) => society.toLowerCase().includes(searchLower)) ||
      (vendor.services || '').toLowerCase().includes(searchLower);

    return searchMatch;
  });

  // Fetch 7-day grid for selected vendor
  const [vendorSlots, setVendorSlots] = useState<any[]>([]);
  useEffect(() => {
    if (!selectedVendor) return;
    const fetchSlots = async () => {
      setLoading(true);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayDateString = `${year}-${month}-${day}`;

      const { data, error } = await supabase
        .from("vendor_weekly_availability")
        .select("*")
        .eq("vendor_id", selectedVendor.vendor_id)
        .gte("date", todayDateString)
        .order("date", { ascending: true });
      if (!error && data) setVendorSlots(data);
      setLoading(false);
    };
    fetchSlots();
  }, [selectedVendor]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Indigo Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Domestic Help</h1>
        </div>
      </div>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-center font-medium">
            This page is to find temporary workers if you have an urgent need e.g. when your cook or cleaner are on sudden leave. Please do not try to hire from here as that will set wrong precedence and spoil the intent with which this functionality is built.
          </p>
        </div>
        {/* <h1 className="text-3xl font-bold mb-6">Find a Vendor</h1> */}
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search by name, mobile, area, societies, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none text-base"
            />
          </div>
        </div>
        {/* Vendor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {filteredVendors.map(vendor => (
            <div key={vendor.vendor_id}>
              <Card
                className={`p-4 border-2 transition-all duration-200 ${selectedVendor?.vendor_id === vendor.vendor_id ? "border-indigo-600 ring-2 ring-indigo-200" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-lg">{vendor.Name || vendor.vendor_name || (vendor.vendor_id ? vendor.vendor_id.slice(0, 8) + '...' : '')}</div>
                  <VendorRating
                    vendorId={vendor.vendor_id}
                    vendorName={vendor.Name || vendor.vendor_name || vendor.vendor_id}
                    vendorType="service"
                    onRatingAdded={() => {
                      router.refresh();
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600 mb-1">Mobile: {vendor.Mobile_No || 'N/A'}</div>
                <div className="text-sm text-gray-600 mb-1">Area: {vendor.area}</div>
                <div className="text-sm text-gray-600 mb-1">Societies: {Array.isArray(vendor.societies) ? vendor.societies.join(", ") : String(vendor.societies).replace(/[{}"]+/g, "").split(",").filter(Boolean).join(", ")}</div>
                {vendor.services && (
                  <div className="text-sm text-gray-600 mb-1">Services: {typeof vendor.services === 'string' && vendor.services.trim().toLowerCase() === 'both'
                    ? 'Both (Cleaning and Cooking)'
                    : Array.isArray(vendor.services)
                      ? vendor.services.join(', ')
                      : vendor.services}
                  </div>
                )}
                {vendorRatings[vendor.vendor_id] && (
                  <div className="flex items-center gap-1 text-yellow-500 mt-2 mb-3">
                    <span className="text-sm font-medium">
                      {vendorRatings[vendor.vendor_id].rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({vendorRatings[vendor.vendor_id].count})
                    </span>
                  </div>
                )}
                {vendorRatings[vendor.vendor_id] && vendorRatings[vendor.vendor_id].count > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReviews(vendor.vendor_id);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
                  >
                    {showReviews[vendor.vendor_id] ? (
                      <>
                        <FiChevronUp className="w-4 h-4" />
                        Hide Reviews
                      </>
                    ) : (
                      <>
                        <FiChevronDown className="w-4 h-4" />
                        View Reviews
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVendor(selectedVendor?.vendor_id === vendor.vendor_id ? null : vendor);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  {selectedVendor?.vendor_id === vendor.vendor_id ? (
                    <>
                      <FiChevronUp className="w-4 h-4" />
                      Hide Availability
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="w-4 h-4" />
                      View Availability
                    </>
                  )}
                </button>
              </Card>
              {/* Reviews section */}
              {showReviews[vendor.vendor_id] && reviews[vendor.vendor_id] && (
                <Card className="mt-2 p-4 bg-gray-50">
                  <div className="space-y-4">
                    {reviews[vendor.vendor_id].map((review, index) => (
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
                </Card>
              )}
              {/* On mobile, show availability right below the selected vendor card */}
              {isMobile && selectedVendor?.vendor_id === vendor.vendor_id && (
                <div className="overflow-x-auto mt-2">
                  <div>
                    {vendorSlots.map((row, idx) => {
                      const availableSlots = TIME_SLOTS.filter(slot => row[`slot_${slot.start}_${slot.end}`]);
                      if (availableSlots.length === 0) return null;
                      return (
                        <div key={row.date} className={idx !== 0 ? "mt-1 pt-1 border-t border-gray-100" : ""}>
                          <span className="font-medium text-xs mr-2 align-middle">
                            {new Date(row.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {availableSlots.map(slot => (
                            <span key={slot.label} className="inline-block px-1.5 py-0.5 text-[11px] font-semibold bg-green-100 text-green-700 rounded mr-1 align-middle">
                              {slot.label}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* 7-day grid for selected vendor (desktop only) */}
        {!isMobile && selectedVendor && (
          <Card className="p-6 w-full mb-8">
            <h2 className="text-xl font-semibold mb-2">Availability for {selectedVendor.Name || selectedVendor.vendor_name || (selectedVendor.vendor_id ? selectedVendor.vendor_id.slice(0, 8) + '...' : '')}</h2>
            <div className="text-base text-gray-700 mb-4">
              Mobile: {selectedVendor.Mobile_No || 'N/A'}
              {selectedVendor.services && (
                <span className="ml-4 text-gray-500">
                  Services: {typeof selectedVendor.services === 'string' && selectedVendor.services.trim().toLowerCase() === 'both'
                    ? 'Both (Cleaning and Cooking)'
                    : Array.isArray(selectedVendor.services)
                      ? selectedVendor.services.join(', ')
                      : selectedVendor.services}
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <div>
                {vendorSlots.map((row, idx) => {
                  const availableSlots = TIME_SLOTS.filter(slot => row[`slot_${slot.start}_${slot.end}`]);
                  if (availableSlots.length === 0) return null;
                  return (
                    <div key={row.date} className={idx !== 0 ? "mt-1 pt-1 border-t border-gray-100" : ""}>
                      <span className="font-medium text-xs mr-2 align-middle">
                        {new Date(row.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {availableSlots.map(slot => (
                        <span key={slot.label} className="inline-block px-1.5 py-0.5 text-[11px] font-semibold bg-green-100 text-green-700 rounded mr-1 align-middle">
                          {slot.label}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}