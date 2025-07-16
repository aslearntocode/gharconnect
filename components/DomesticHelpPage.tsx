"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { VendorRating } from './VendorRating';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import LoginModal from './LoginModal';
import { auth } from '@/lib/firebase';
import { useMediaQuery } from 'react-responsive';

// Utility function to get current area from URL path
const getCurrentArea = (pathname: string): string => {
  const pathSegments = pathname.split('/');
  // URL pattern: /{area}/services/domestic-help
  const areaIndex = pathSegments.findIndex(segment => 
    ['parel', 'worli', 'bandra', 'juhu', 'malad', 'powai', 'thane', 'andheri', 'mahalaxmi'].includes(segment)
  );
  return areaIndex !== -1 ? pathSegments[areaIndex] : 'parel'; // Default to parel if not found
};

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

const PERMANENT_SLOTS = [
  { id: 'morning', label: 'Morning', start: '07:00', end: '12:00' },
  { id: 'afternoon', label: 'Afternoon', start: '12:00', end: '17:00' },
  { id: 'evening', label: 'Evening', start: '17:00', end: '20:00' },
];

function getNext7Days() {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DomesticHelpPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [vendorAvailabilities, setVendorAvailabilities] = useState<Record<string, any[]>>({});
  const [permanentVendors, setPermanentVendors] = useState<any[]>([]);
  const [vendorRatings, setVendorRatings] = useState<Record<string, { rating: number; count: number }>>({});
  const [reviews, setReviews] = useState<Record<string, any[]>>({});
  const [showReviews, setShowReviews] = useState<Record<string, boolean>>({});
  const [openVendorId, setOpenVendorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'temporary' | 'permanent'>('temporary');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showNumberMap, setShowNumberMap] = useState<Record<string, boolean>>({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingVendorId, setPendingVendorId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const pathname = usePathname();
  const currentArea = getCurrentArea(pathname);

  // Use the same vendor ID generation logic as VendorCard and VendorRating
  const generateVendorId = (vendorId: string | null | undefined, vendorName?: string): string => {
    console.log('DomesticHelpPage: Generating vendor ID for:', { vendorId, vendorName, type: typeof vendorId });
    
    // If vendorId is a valid string, use it
    if (vendorId && typeof vendorId === 'string' && vendorId.trim() !== '') {
      console.log('DomesticHelpPage: Using provided vendorId:', vendorId);
      return vendorId;
    }
    
    // If vendorId is null/undefined/empty, use vendorName as fallback
    if (vendorName && typeof vendorName === 'string' && vendorName.trim() !== '') {
      console.log('DomesticHelpPage: Using vendorName as ID:', vendorName);
      return vendorName;
    }
    
    // Final fallback
    const fallbackId = `vendor_fallback_${Date.now()}`;
    console.log('DomesticHelpPage: Using fallback ID:', fallbackId);
    return fallbackId;
  };

  // Track user authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all vendors (distinct by vendor_id) - Area filtered
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
        .select("vendor_id, name, mobile_no, area, societies, date, services, morning, afternoon, evening, is_verified")
        .gte("date", todayDateString)
        .ilike("area", `%${currentArea}%`) // Filter for current area only
        .order("date", { ascending: true });
      console.log(`Fetched vendor_weekly_availability for ${currentArea}:`, data, error);
      if (!error && data) {
        // Group all rows by vendor_id
        const vendorMap: Record<string, any[]> = {};
        data.forEach((row: any) => {
          if (!vendorMap[row.vendor_id]) vendorMap[row.vendor_id] = [];
          vendorMap[row.vendor_id].push(row);
        });
        setVendorAvailabilities(vendorMap);
        if (error && typeof error === 'object' && 'message' in error) setFetchError((error as any).message);
        else setFetchError(null);
      }
      setLoading(false);
    };
    fetchVendors();
  }, [currentArea]); // Re-fetch when area changes

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

        console.log('DomesticHelpPage: Fetched ratings:', ratings);
        setVendorRatings(ratings);
      } catch (err) {
        console.error('Error in fetchRatings:', err);
      }
    };

    fetchRatings();
  }, [supabase]);

  // Create a function to refresh ratings that can be called from VendorRating
  const refreshRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('card_id, rating');

      if (error) {
        console.error('Error refreshing ratings:', error);
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

      console.log('DomesticHelpPage: Refreshed ratings:', ratings);
      setVendorRatings(ratings);
    } catch (err) {
      console.error('Error in refreshRatings:', err);
    }
  };

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
      (vendor.name || vendor.vendor_name || '').toLowerCase().includes(searchLower) ||
      String(vendor.mobile_no || '').toLowerCase().includes(searchLower) ||
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

  // Fetch permanent vendors
  useEffect(() => {
    const fetchSlots = async () => {
      const { data, error } = await supabase
        .from("vendor_permanent_availability")
        .select("vendor_id, name, mobile_no, area, societies, services, slot_type, slot_start_time, slot_end_time, is_verified")
        .ilike("area", `%${currentArea}%`)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Group by vendor_id and organize slots
        const vendorMap: Record<string, any> = {};
        data.forEach((row: any) => {
          if (!vendorMap[row.vendor_id]) {
            vendorMap[row.vendor_id] = {
              vendor_id: row.vendor_id,
              name: row.name,
              mobile_no: row.mobile_no,
              area: row.area,
              societies: row.societies,
              services: row.services,
              is_verified: row.is_verified,
              slots: {}
            };
          }
          vendorMap[row.vendor_id].slots[row.slot_type] = {
            slot_start_time: row.slot_start_time,
            slot_end_time: row.slot_end_time
          };
        });
        setPermanentVendors(Object.values(vendorMap));
      }
    };
    fetchSlots();
  }, [currentArea]);

  useEffect(() => {
    if (activeTab === 'permanent') {
      setSelectedVendor(null);
    }
  }, [activeTab]);

  // Helper to check if user is logged in
  const isLoggedIn = user !== null;

  const handleShowNumber = (vendorKey: string) => {
    if (isLoggedIn) {
      setShowNumberMap((prev) => ({ ...prev, [vendorKey]: true }));
    } else {
      setPendingVendorId(vendorKey);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    if (pendingVendorId) {
      setShowNumberMap((prev) => ({ ...prev, [pendingVendorId]: true }));
      setPendingVendorId(null);
    }
    setIsLoginModalOpen(false);
  };

  const formatArea = (area: string | any): string => {
    if (!area) return '';
    
    // If it's already a string without curly brackets, return as is
    if (typeof area === 'string' && !area.includes('{') && !area.includes('}')) {
      return area;
    }
    
    // If it's a JSON array string, parse and format it
    if (typeof area === 'string') {
      try {
        // Remove curly brackets and quotes, then split by comma
        const cleanArea = area.replace(/[{}"]/g, '').split(',').filter(Boolean);
        return cleanArea.join(', ');
      } catch (error) {
        // If parsing fails, return the original string
        return area;
      }
    }
    
    // If it's an array, join with commas
    if (Array.isArray(area)) {
      return area.join(', ');
    }
    
    return String(area);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:pt-16">
      <Header />
      {/* Indigo Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">Domestic Help & Drivers - {currentArea.charAt(0).toUpperCase() + currentArea.slice(1)}</h1>
        </div>
      </div>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        {fetchError && (
          <div className="bg-red-100 text-red-800 p-4 mb-4 rounded border border-red-300">
            Error fetching temporary availability: {fetchError}
          </div>
        )}
        {/* Tabs for Temporary and Permanent */}
        <div className="flex border-b border-gray-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('temporary')}
            className={`px-6 py-2 text-lg font-bold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeTab === 'temporary'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-current={activeTab === 'temporary' ? 'page' : undefined}
          >
            Temporary
          </button>
          <button
            onClick={() => setActiveTab('permanent')}
            className={`px-6 py-2 text-lg font-bold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeTab === 'permanent'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-current={activeTab === 'permanent' ? 'page' : undefined}
          >
            Permanent
          </button>
        </div>
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
        {activeTab === 'temporary' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {Object.entries(vendorAvailabilities)
              .filter(([_, availRows]) => {
                const vendor = availRows[0];
                const societies = Array.isArray(vendor.societies)
                  ? vendor.societies
                  : typeof vendor.societies === "string"
                    ? vendor.societies.replace(/[{}"]+/g, "").split(",").filter(Boolean)
                    : [];
                const searchLower = searchQuery.toLowerCase();
                return (
                  !searchQuery ||
                  (vendor.name || '').toLowerCase().includes(searchLower) ||
                  String(vendor.mobile_no || '').toLowerCase().includes(searchLower) ||
                  (vendor.area || '').toLowerCase().includes(searchLower) ||
                  societies.some((society: string) => society.toLowerCase().includes(searchLower)) ||
                  (vendor.services || '').toLowerCase().includes(searchLower)
                );
              })
              .map(([vendorId, availRows]) => {
                const vendor = availRows[0];
                const generatedVendorId = generateVendorId(vendorId, vendor.name);
                return (
                  <Card key={vendorId} className="p-4 border-2 border-gray-200 mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{vendor.name || vendor.vendor_id?.slice(0, 8) + '...'}</span>
                        {vendor.is_verified && (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" title="Verified Vendor" />
                        )}
                      </div>
                      <VendorRating
                        vendorId={generatedVendorId}
                        vendorName={vendor.name}
                        vendorType="service"
                        onRatingAdded={() => {
                          console.log('Rating added, refreshing ratings...');
                          // Refresh ratings after a new rating is added
                          refreshRatings();
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Mobile: {!showNumberMap[vendorId] ? (
                        <button
                          onClick={() => handleShowNumber(vendorId)}
                          className="text-blue-600 text-sm font-medium hover:text-blue-700 underline focus:outline-none"
                        >
                          Log-in to view number
                        </button>
                      ) : (
                        <a href={`tel:${vendor.mobile_no}`} className="text-blue-600 text-sm font-medium hover:text-blue-700">
                          {vendor.mobile_no}
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Area: {formatArea(vendor.area)}</div>
                    <div className="text-sm text-gray-600 mb-1">Societies: {Array.isArray(vendor.societies) ? vendor.societies.join(", ") : String(vendor.societies).replace(/[{}"]+/g, "").split(",").filter(Boolean).join(", ")}</div>
                    {vendor.services && (
                      <div className="text-sm text-gray-600 mb-1">Services: {typeof vendor.services === 'string' && vendor.services.trim().toLowerCase() === 'both'
                        ? 'Both (Cleaning and Cooking)'
                        : Array.isArray(vendor.services)
                          ? vendor.services.join(', ')
                          : vendor.services}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2 mb-2">
                      <button
                        className="mt-2 mb-2 px-4 py-1 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
                        onClick={() => setOpenVendorId(openVendorId === vendorId ? null : vendorId)}
                      >
                        {openVendorId === vendorId ? 'Hide Availability' : 'View Availability'}
                      </button>
                    </div>
                    <div>
                      {vendorRatings[generatedVendorId] && (
                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                          <span className="text-sm font-medium">
                            {vendorRatings[generatedVendorId].rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({vendorRatings[generatedVendorId].count})
                          </span>
                        </div>
                      )}
                      {vendorRatings[generatedVendorId] && vendorRatings[generatedVendorId].count > 0 && (
                        <button
                          onClick={() => toggleReviews(generatedVendorId)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
                        >
                          {showReviews[generatedVendorId] ? (
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
                      {showReviews[generatedVendorId] && reviews[generatedVendorId] && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <div className="space-y-4">
                            {reviews[generatedVendorId].map((review, index) => (
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
                    {openVendorId === vendorId && (
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full border text-center table-auto">
                          <thead>
                            <tr>
                              <th className="border px-3 py-2 bg-gray-100 text-base font-semibold whitespace-nowrap min-w-[120px]">Date</th>
                              <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Morning</th>
                              <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Afternoon</th>
                              <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Evening</th>
                            </tr>
                          </thead>
                          <tbody>
                            {availRows.map(row => (
                              <tr key={row.date}>
                                <td className="border px-3 py-2 font-medium whitespace-nowrap min-w-[120px] bg-white">
                                  {new Date(row.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="border px-3 py-2 bg-white">{row.morning ? '✔️' : ''}</td>
                                <td className="border px-3 py-2 bg-white">{row.afternoon ? '✔️' : ''}</td>
                                <td className="border px-3 py-2 bg-white">{row.evening ? '✔️' : ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                );
              })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {permanentVendors
              .filter(vendor => {
                const searchLower = searchQuery.toLowerCase();
                return (
                  !searchQuery ||
                  (vendor.name || '').toLowerCase().includes(searchLower) ||
                  String(vendor.mobile_no || '').toLowerCase().includes(searchLower) ||
                  (vendor.area || '').toLowerCase().includes(searchLower) ||
                  (vendor.services || '').toLowerCase().includes(searchLower)
                );
              })
              .map((vendor) => {
                // Use mobile_no as unique key if present, else fallback to vendor_id
                const vendorKey = vendor.mobile_no || vendor.vendor_id;
                const generatedVendorId = generateVendorId(vendor.vendor_id, vendor.name);
                return (
                  <Card key={vendorKey} className="p-4 border-2 border-gray-200 mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{vendor.name || vendor.vendor_id?.slice(0, 8) + '...'}</span>
                        {vendor.is_verified && (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" title="Verified Vendor" />
                        )}
                      </div>
                      <VendorRating
                        vendorId={generatedVendorId}
                        vendorName={vendor.name}
                        vendorType="service"
                        onRatingAdded={() => {
                          console.log('Rating added, refreshing ratings...');
                          // Refresh ratings after a new rating is added
                          refreshRatings();
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Mobile: {!showNumberMap[vendorKey] ? (
                        <button
                          onClick={() => handleShowNumber(vendorKey)}
                          className="text-blue-600 text-sm font-medium hover:text-blue-700 underline focus:outline-none"
                        >
                          Log-in to view number
                        </button>
                      ) : (
                        <a href={`tel:${vendor.mobile_no}`} className="text-blue-600 text-sm font-medium hover:text-blue-700">
                          {vendor.mobile_no}
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Area: {formatArea(vendor.area)}</div>
                    <div className="text-sm text-gray-600 mb-1">Societies: {Array.isArray(vendor.societies) ? vendor.societies.join(", ") : String(vendor.societies).replace(/[{}"]+/g, "").split(",").filter(Boolean).join(", ")}</div>
                    {vendor.services && (
                      <div className="text-sm text-gray-600 mb-1">Services: {typeof vendor.services === 'string' && vendor.services.trim().toLowerCase() === 'both'
                        ? 'Both (Cleaning and Cooking)'
                        : Array.isArray(vendor.services)
                          ? vendor.services.join(', ')
                          : vendor.services}
                      </div>
                    )}
                    <div className="mt-2 mb-2">
                      <div className="text-sm font-semibold text-gray-700 mb-1">Available Slots:</div>
                      {Object.entries(vendor.slots).map(([slotType, slotData]: [string, any]) => (
                        <div key={slotType} className="text-xs text-gray-600 mb-1">
                          {slotType.charAt(0).toUpperCase() + slotType.slice(1)}: {slotData.slot_start_time || '-'} - {slotData.slot_end_time || '-'}
                        </div>
                      ))}
                    </div>
                    <div>
                      {vendorRatings[generatedVendorId] && (
                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                          <span className="text-sm font-medium">
                            {vendorRatings[generatedVendorId].rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({vendorRatings[generatedVendorId].count})
                          </span>
                        </div>
                      )}
                      {vendorRatings[generatedVendorId] && vendorRatings[generatedVendorId].count > 0 && (
                        <button
                          onClick={() => toggleReviews(generatedVendorId)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
                        >
                          {showReviews[generatedVendorId] ? (
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
                      {showReviews[generatedVendorId] && reviews[generatedVendorId] && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <div className="space-y-4">
                            {reviews[generatedVendorId].map((review, index) => (
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
                  </Card>
                );
              })}
          </div>
        )}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
} 