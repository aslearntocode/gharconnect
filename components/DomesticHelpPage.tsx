"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { useMediaQuery } from 'react-responsive';
import { VendorRating } from '@/components/VendorRating';
import { useRouter, usePathname } from 'next/navigation';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import LoginModal from '@/components/LoginModal';

// Utility function to get current area from URL path
const getCurrentArea = (pathname: string): string => {
  const pathSegments = pathname.split('/');
  // URL pattern: /{area}/services/domestic-help
  const areaIndex = pathSegments.findIndex(segment => 
    ['parel', 'worli', 'bandra', 'juhu', 'malad', 'powai', 'thane', 'andheri'].includes(segment)
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
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [vendorRatings, setVendorRatings] = useState<Record<string, { rating: number; count: number }>>({});
  const [showReviews, setShowReviews] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  const pathname = usePathname();
  const currentArea = getCurrentArea(pathname);
  const [activeTab, setActiveTab] = useState<'temporary' | 'permanent'>('temporary');
  const [permanentVendors, setPermanentVendors] = useState<any[]>([]);
  const [vendorAvailabilities, setVendorAvailabilities] = useState<Record<string, any[]>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openVendorId, setOpenVendorId] = useState<string | null>(null);
  const [showNumberMap, setShowNumberMap] = useState<Record<string, boolean>>({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingVendorId, setPendingVendorId] = useState<string | null>(null);

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
        .select("vendor_id, name, mobile_no, area, societies, date, services, morning, afternoon, evening")
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
    const fetchPermanentVendors = async () => {
      const { data, error } = await supabase
        .from('vendor_permanent_availability')
        .select('*');
      if (!error && data) {
        // Filter by current area after fetching all data
        const filteredData = data.filter((row: any) => {
          const vendorArea = (row.area || '').toLowerCase();
          const currentAreaLower = currentArea.toLowerCase();
          return vendorArea.includes(currentAreaLower) || currentAreaLower.includes(vendorArea);
        });
        
        // Group by vendor_id, aggregate slots
        const vendorMap: Record<string, any> = {};
        filteredData.forEach((row: any) => {
          if (!vendorMap[row.vendor_id]) {
            vendorMap[row.vendor_id] = {
              ...row,
              slots: {},
            };
          }
          vendorMap[row.vendor_id].slots[row.slot_type] = row;
        });
        setPermanentVendors(Object.values(vendorMap));
      }
    };
    if (activeTab === 'permanent') fetchPermanentVendors();
  }, [activeTab, supabase, currentArea]); // Re-fetch when area changes

  useEffect(() => {
    if (activeTab === 'permanent') {
      setSelectedVendor(null);
    }
  }, [activeTab]);

  // Helper to check if user is logged in
  const isLoggedIn = typeof window !== 'undefined' && (window as any).firebase?.auth?.currentUser;

  const handleShowNumber = (vendorId: string) => {
    if (isLoggedIn) {
      setShowNumberMap((prev) => ({ ...prev, [vendorId]: true }));
    } else {
      setPendingVendorId(vendorId);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Indigo Banner */}
      <div className="relative">
        <div className="w-full h-32 bg-indigo-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Domestic Help & Drivers - {currentArea.charAt(0).toUpperCase() + currentArea.slice(1)}</h1>
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
                return (
                  <Card key={vendorId} className="p-4 border-2 border-gray-200 mb-6">
                    <div className="font-bold text-lg mb-1">{vendor.name || vendor.vendor_id?.slice(0, 8) + '...'}</div>
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
                    <button
                      className="mt-2 mb-2 px-4 py-1 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
                      onClick={() => setOpenVendorId(openVendorId === vendorId ? null : vendorId)}
                    >
                      {openVendorId === vendorId ? 'Hide Availability' : 'View Availability'}
                    </button>
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
              .map((vendor) => (
                <Card key={vendor.vendor_id} className="p-4 border-2 border-gray-200 mb-6">
                  <div className="font-bold text-lg mb-1">{vendor.name || vendor.vendor_id?.slice(0, 8) + '...'}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    Mobile: {!showNumberMap[vendor.vendor_id] ? (
                      <button
                        onClick={() => handleShowNumber(vendor.vendor_id)}
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
                  <div className="text-sm text-gray-600 mb-1">Area: {vendor.area}</div>
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
                </Card>
              ))}
          </div>
        )}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
} 