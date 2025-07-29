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
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    // Handle new URL structure: /mumbai/community/... or /bangalore/... or /pune/...
    if (pathParts[1] === 'mumbai' && pathParts[2] === 'community') {
      return 'mumbai/community'
    }
    if (pathParts[1] === 'bangalore') {
      return 'bangalore'
    }
    if (pathParts[1] === 'pune') {
      return 'pune'
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
                  href={`/${currentSociety.includes('/community') ? currentSociety : `${currentSociety}/community`}`} 
                  className={`py-2 text-base transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-700'
                  }`}
                >
                  Home
                </Link>
                
                {/* Rent Link */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <Link 
                      href={`/${currentSociety.replace('/community', '')}/rent`}
                      className={`py-2 text-base transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Rent
                    </Link>
                  </div>
                </div>

                {/* Services Link */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <Link 
                      href={currentSociety === 'mumbai/community' ? `/${currentSociety}/services` : `/${currentSociety}/community/services`}
                      className={`py-2 text-base transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Services
                    </Link>
                  </div>
                </div>

                {/* Delivery Link */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <Link 
                      href={currentSociety === 'mumbai/community' ? `/${currentSociety}/delivery` : `/${currentSociety}/community/delivery`}
                      className={`py-2 text-base transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Delivery
                    </Link>
                  </div>
                </div>

                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <Link 
                      href={`/${currentSociety.includes('/community') ? currentSociety : `${currentSociety}/community`}/connect`}
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
          <Link href={`/${currentSociety.includes('/community') ? currentSociety : `${currentSociety}/community`}`} className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300">
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <div className="relative">
            <Link 
              href={`/${currentSociety.replace('/community', '')}/rent`}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FiHome className="w-6 h-6" />
              <span className="text-xs mt-1">Rent</span>
            </Link>
          </div>

          <div className="relative">
            <Link 
              href={currentSociety === 'mumbai/community' ? `/${currentSociety}/services` : `/${currentSociety}/community/services`}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FiTool className="w-6 h-6" />
              <span className="text-xs mt-1">Services</span>
            </Link>
          </div>

          <div className="relative">
            <Link 
              href={currentSociety === 'mumbai/community' ? `/${currentSociety}/delivery` : `/${currentSociety}/community/delivery`}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FiTruck className="w-6 h-6" />
              <span className="text-xs mt-1">Delivery</span>
            </Link>
          </div>

          <div className="relative">
            <Link href={`/${currentSociety.includes('/community') ? currentSociety : `${currentSociety}/community`}/connect`} className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300">
              <FiUsers className="w-6 h-6" />
              <span className="text-xs mt-1">Social</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}