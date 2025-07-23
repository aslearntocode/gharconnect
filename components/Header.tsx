'use client'

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "./ProfileDropdown"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { signOut } from 'firebase/auth'
import { FiCreditCard, FiGift, FiDollarSign, FiDroplet, FiGlobe, FiTrendingUp, FiHome, FiBriefcase, FiAirplay, FiLayers, FiCreditCard as FiCard, FiBook, FiTruck, FiHome as FiHomeIcon, FiDollarSign as FiDollarIcon, FiBookOpen, FiAward, FiTool, FiZap, FiEdit, FiShield, FiFileText, FiGrid, FiSearch, FiPlus, FiHeart, FiCircle, FiUsers } from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'

export default function Header({ isScrolled = false }: { isScrolled?: boolean }) {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false)
  const [isCreditScoreDropdownOpen, setIsCreditScoreDropdownOpen] = useState(false)
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false)
  const [isRentDropdownOpen, setIsRentDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    // Handle new URL structure: /mumbai/community/... or /bangalore/...
    if (pathParts[1] === 'mumbai' && pathParts[2] === 'community') {
      return 'mumbai/community'
    }
    if (pathParts[1] === 'bangalore') {
      return 'bangalore'
    }
    // Default to mumbai/community if no society in path
    return 'mumbai/community'
  }

  const currentSociety = getSocietyFromPath()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Header: Auth state changed, user:', user?.email || 'null');
      setUser(user)
      if (user?.uid) {
        try {
          // Any future user-specific checks can be added here
        } catch (error) {
          // Handle unexpected errors
          console.error('Unexpected error:', error)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Only run this handler for desktop (md and up)
      if (window.innerWidth >= 768) {
        if (!target.closest('button')?.contains(target) && !target.closest('.complaints-menu')?.contains(target)) {
          setIsCreditScoreDropdownOpen(false);
        }
      }
    };

    // Only add event listener for desktop
    if (isCreditScoreDropdownOpen && typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isCreditScoreDropdownOpen]);

  const handleLogout = async () => {
    try {
      // Get current pathname and pass it to logout page
      const currentPath = window.location.pathname;
      router.push(`/logout?from=${encodeURIComponent(currentPath)}`)
    } catch (error) {
      console.error('Error redirecting to logout:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page with the query
      router.push(`/mumbai/community/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <>
      <header 
        className={`lg:fixed lg:top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'lg:bg-gray-900/60 lg:backdrop-blur-sm shadow-lg lg:text-white' 
            : 'bg-white shadow-md text-black'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
          <div className="flex justify-between h-12 md:h-16 items-center w-full">
            <div className="flex items-center">
              <Link href={`/${currentSociety}`} className="flex items-center">
                <Image 
                  src="/GC_Logo.png" 
                  alt="Brand Logo" 
                  height={56} 
                  width={56} 
                  className="h-5 md:h-6 w-auto" 
                  priority
                />
              </Link>
              
              <div className="hidden md:flex items-center space-x-8 ml-8">
                <Link 
                  href={`/${currentSociety}`} 
                  className={`py-2 text-base transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-700'
                  }`}
                >
                  Home
                </Link>
                
                {/* Rent Dropdown */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setIsRentDropdownOpen(!isRentDropdownOpen)}
                      className={`py-2 text-base flex items-center transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Rent
                      <svg
                        className={`ml-2 h-5 w-5 transform inline-block ${isRentDropdownOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div 
                    className={`
                      absolute w-80 bg-white rounded-lg shadow-lg py-4 px-4
                      ${isRentDropdownOpen ? 'block' : 'hidden'}
                    `}
                    style={{
                      zIndex: 1000,
                      top: '2.5rem',
                      left: 0
                    }}
                  >
                    <div className="flex flex-col gap-y-2">
                      <Link href="/mumbai/rent/apartment" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsRentDropdownOpen(false)}>
                        <FiHome className="w-5 h-5 text-blue-500" />
                        <span>Apartment</span>
                      </Link>
                      <Link href="/mumbai/rent/pg" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsRentDropdownOpen(false)}>
                        <FiBriefcase className="w-5 h-5 text-green-500" />
                        <span>PG Accommodation</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Services Dropdown */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setIsCreditScoreDropdownOpen(!isCreditScoreDropdownOpen)}
                      className={`py-2 text-base flex items-center transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Services
                      <svg
                        className={`ml-2 h-5 w-5 transform inline-block ${isCreditScoreDropdownOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div 
                    className={`
                      absolute w-[32rem] bg-white rounded-lg shadow-lg py-4 px-4
                      ${isCreditScoreDropdownOpen ? 'block' : 'hidden'}
                    `}
                    style={{
                      zIndex: 1000,
                      top: '2.5rem',
                      left: 0
                    }}
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <Link 
                        href={`/${currentSociety}/services/laundry`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiDroplet className="w-5 h-5 text-blue-500" />
                        <span>Laundry</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/carpenter`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiTool className="w-5 h-5 text-yellow-600" />
                        <span>Carpenter</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/tailor`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiEdit className="w-5 h-5 text-pink-500" />
                        <span>Tailor</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/plumber`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiTool className="w-5 h-5 text-blue-600" />
                        <span>Plumber</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/electrician`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiZap className="w-5 h-5 text-yellow-500" />
                        <span>Electrician</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/domestic-help`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiUsers className="w-5 h-5 text-green-600" />
                        <span>Domestic Help & Drivers</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/car-clean`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <span className="w-5 h-5 text-blue-500 text-lg">🚗</span>
                        <span>Car Clean</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/painter`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiEdit className="w-5 h-5 text-pink-500" />
                        <span>Painter</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/gardener`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiHome className="w-5 h-5 text-green-600" />
                        <span>Gardener</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/ac-service`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiZap className="w-5 h-5 text-blue-500" />
                        <span>AC Service</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/pest-control`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiShield className="w-5 h-5 text-red-500" />
                        <span>Pest Control</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/laptop-repair`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiTool className="w-5 h-5 text-red-500" />
                        <span>Laptop Repair</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/electronics-repair`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiTool className="w-5 h-5 text-red-500" />
                        <span>Electronics Repair</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/scrap-dealer`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <span className="w-5 h-5 text-orange-500 text-lg">♻️</span>
                        <span>Scrap Dealer</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/notary`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiFileText className="w-5 h-5 text-blue-500" />
                        <span>Notary</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/piegon-net`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiGrid className="w-5 h-5 text-green-500" />
                        <span>Pigeon Net</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/movers-packers`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiTruck className="w-5 h-5 text-blue-500" />
                        <span>Movers & Packers</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/physical-training`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiTrendingUp className="w-5 h-5 text-indigo-500" />
                        <span>Physical Training</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/yoga`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiAward className="w-5 h-5 text-green-500" />
                        <span>Yoga</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/massage`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiHeart className="w-5 h-5 text-pink-500" />
                        <span>Massage</span>
                      </Link>
                      <Link 
                        href={`/${currentSociety}/services/kids-classes`}
                        className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                        onClick={() => setIsCreditScoreDropdownOpen(false)}
                      >
                        <FiBookOpen className="w-5 h-5 text-orange-500" />
                        <span>Kids Classes</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Delivery Dropdown */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setIsDeliveryDropdownOpen(!isDeliveryDropdownOpen)}
                      className={`py-2 text-base flex items-center transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Delivery
                      <svg
                        className={`ml-2 h-5 w-5 transform inline-block ${isDeliveryDropdownOpen ? 'rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div 
                    className={`
                      absolute w-80 bg-white rounded-lg shadow-lg py-4 px-4
                      ${isDeliveryDropdownOpen ? 'block' : 'hidden'}
                    `}
                    style={{
                      zIndex: 1000,
                      top: '2.5rem',
                      left: 0
                    }}
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <Link href={`/${currentSociety}/delivery/dairy`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiTruck className="w-5 h-5 text-blue-500" />
                        <span>Dairy</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/meat`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiTruck className="w-5 h-5 text-red-500" />
                        <span>Meat</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/eggs`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiCircle className="w-5 h-5 text-yellow-500" />
                        <span>Eggs</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/flowers`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <span className="w-5 h-5 text-pink-500 text-lg">💐</span>
                        <span>Flowers</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/vegetables`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiTruck className="w-5 h-5 text-green-500" />
                        <span>Vegetables</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/fruits`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiTruck className="w-5 h-5 text-orange-500" />
                        <span>Fruits</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/dry-fruits`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiTruck className="w-5 h-5 text-amber-500" />
                        <span>Dry Fruits</span>
                      </Link>
                      <Link href={`/${currentSociety}/delivery/pharmacy`} className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                        <FiTruck className="w-5 h-5 text-indigo-500" />
                        <span>Pharmacy</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <Link 
                      href={`/${currentSociety}/connect`}
                      className={`py-2 text-base transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Social
                    </Link>
                  </div>
                </div>

                {/* Search Box - Desktop */}
                <div className="ml-6">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search anything..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-80 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                          isScrolled 
                            ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-black placeholder-gray-500'
                        }`}
                      />
                      <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isScrolled ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {/* Search Box - Mobile */}
              <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search anything..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-56 md:w-64 pl-8 pr-3 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors duration-300 ${
                        isScrolled 
                          ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                          : 'border-gray-300 bg-white text-black placeholder-gray-500'
                      }`}
                    />
                    <FiSearch className={`absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 ${
                      isScrolled ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                  </div>
                </form>
              </div>

              {user ? (
                <ProfileDropdown user={user} />
              ) : (
                <Link href={`/${currentSociety}/login`} className={`whitespace-nowrap transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-white hover:text-gray-300' 
                    : 'text-black hover:text-gray-700'
                }`}>
                  <Button variant="ghost" className="text-sm md:text-base py-1 md:py-2">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Bar - Fixed at Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 px-1">
          <Link href={`/${currentSociety}`} className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300">
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <div className="relative">
            <button 
              onClick={() => setIsRentDropdownOpen(isRentDropdownOpen => !isRentDropdownOpen)}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FiHome className="w-6 h-6" />
              <span className="text-xs mt-1">Rent</span>
            </button>
            {isRentDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                <Link href="/mumbai/rent/apartment" className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsRentDropdownOpen(false)}>
                  Apartment
                </Link>
                <Link href="/mumbai/rent/pg" className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsRentDropdownOpen(false)}>
                  PG Accommodation
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsCreditScoreDropdownOpen(isCreditScoreDropdownOpen => !isCreditScoreDropdownOpen)}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FiTool className="w-6 h-6" />
              <span className="text-xs mt-1">Services</span>
            </button>
            {isCreditScoreDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-64 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)', maxWidth: '90vw', maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="max-h-[50vh] overflow-y-auto">
                  <Link 
                    href={`/${currentSociety}/services/laundry`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Laundry
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/carpenter`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Carpenter
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/tailor`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Tailor
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/plumber`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Plumber
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/electrician`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Electrician
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/domestic-help`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Domestic Help & Drivers
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/car-clean`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Car Clean
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/painter`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Painter
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/gardener`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Gardener
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/ac-service`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    AC Service
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/pest-control`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Pest Control
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/laptop-repair`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Laptop Repair
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/electronics-repair`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Electronics Repair
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/scrap-dealer`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Scrap Dealer
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/notary`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Notary
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/piegon-net`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Pigeon Net
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/movers-packers`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Movers & Packers
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/physical-training`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Physical Training
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/yoga`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Yoga
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/massage`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Massage
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/kids-classes`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Kids Classes
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsDeliveryDropdownOpen(isDeliveryDropdownOpen => !isDeliveryDropdownOpen)}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FiTruck className="w-6 h-6" />
              <span className="text-xs mt-1">Delivery</span>
            </button>
            {isDeliveryDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                <Link href={`/${currentSociety}/delivery/dairy`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Dairy
                </Link>
                <Link href={`/${currentSociety}/delivery/meat`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Meat
                </Link>
                <Link href={`/${currentSociety}/delivery/eggs`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Eggs
                </Link>
                <Link href={`/${currentSociety}/delivery/flowers`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Flowers
                </Link>
                <Link href={`/${currentSociety}/delivery/vegetables`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Vegetables
                </Link>
                <Link href={`/${currentSociety}/delivery/fruits`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Fruits
                </Link>
                <Link href={`/${currentSociety}/delivery/dry-fruits`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Dry Fruits
                </Link>
                <Link href={`/${currentSociety}/delivery/pharmacy`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                  Pharmacy
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <Link href={`/${currentSociety}/connect`} className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300">
              <FiUsers className="w-6 h-6" />
              <span className="text-xs mt-1">Social</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}