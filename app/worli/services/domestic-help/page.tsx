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
import LoginModal from '@/components/LoginModal';

const PERMANENT_SLOTS = [
  { id: 'morning', label: 'Morning', start: '07:00', end: '12:00' },
  { id: 'afternoon', label: 'Afternoon', start: '12:00', end: '17:00' },
  { id: 'evening', label: 'Evening', start: '17:00', end: '20:00' },
];

export default function VendorSearchPage() {
  const [activeTab, setActiveTab] = useState<'temporary' | 'permanent'>('temporary');
  const [permanentVendors, setPermanentVendors] = useState<any[]>([]);
  const [vendorAvailabilities, setVendorAvailabilities] = useState<Record<string, any[]>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [openVendorId, setOpenVendorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  const [showNumberMap, setShowNumberMap] = useState<Record<string, boolean>>({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingVendorId, setPendingVendorId] = useState<string | null>(null);

  // Helper to check if user is logged in
  const isLoggedIn = typeof window !== 'undefined' && (window as any).firebase?.auth?.currentUser;

  // Fetch temporary (weekly) availability
  useEffect(() => {
    const fetchVendors = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayDateString = `${year}-${month}-${day}`;
      const { data, error } = await supabase
        .from("vendor_weekly_availability")
        .select("vendor_id, name, mobile_no, area, societies, date, services, morning, afternoon, evening")
        .gte("date", todayDateString)
        .order("date", { ascending: true });
      if (!error && data) {
        const vendorMap: Record<string, any[]> = {};
        data.forEach((row: any) => {
          if (!vendorMap[row.vendor_id]) vendorMap[row.vendor_id] = [];
          vendorMap[row.vendor_id].push(row);
        });
        setVendorAvailabilities(vendorMap);
        if (error && typeof error === 'object' && 'message' in error) setFetchError((error as any).message);
        else setFetchError(null);
      }
    };
    fetchVendors();
  }, []);

  // Fetch permanent availability
  useEffect(() => {
    const fetchPermanentVendors = async () => {
      const { data, error } = await supabase
        .from('vendor_permanent_availability')
        .select('*');
      if (!error && data) {
        const vendorMap: Record<string, any> = {};
        data.forEach((row: any) => {
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
  }, [activeTab, supabase]);

  useEffect(() => {
    if (activeTab === 'permanent') {
      setOpenVendorId(null);
    }
  }, [activeTab]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-white">Domestic Help & Drivers</h1>
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
              .map(vendor => {
                const vendorId = vendor.vendor_id;
                return (
                  <div key={vendorId}>
                    <Card className="p-4 border-2 border-gray-200">
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
                      <div className="mt-2">
                        <div className="font-semibold text-sm mb-1">Permanent Slots:</div>
                        <div className="flex flex-wrap gap-2">
                          {PERMANENT_SLOTS.map(slot => (
                            vendor.slots[slot.id]?.is_available ? (
                              <span key={slot.id} className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                                {slot.label} ({slot.start} - {slot.end})
                              </span>
                            ) : null
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}