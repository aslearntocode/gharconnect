'use client'

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "./ProfileDropdown"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { signOut } from 'firebase/auth'
import { FiCreditCard, FiGift, FiDollarSign, FiDroplet, FiGlobe, FiTrendingUp, FiHome, FiBriefcase, FiAirplay, FiLayers, FiCreditCard as FiCard, FiBook, FiTruck, FiHome as FiHomeIcon, FiDollarSign as FiDollarIcon, FiBookOpen, FiAward, FiTool, FiZap, FiEdit } from 'react-icons/fi'

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false)
  const [isCreditScoreDropdownOpen, setIsCreditScoreDropdownOpen] = useState(false)
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    // Assuming URL structure is /society-name/...
    return pathParts[1] || 'parel' // Default to parel if no society in path
  }

  const currentSociety = getSocietyFromPath()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white shadow-md relative" style={{ zIndex: 1000 }}>
      <nav className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex items-center">
            <Link href={`/${currentSociety}`} className="flex items-center">
              <Image 
                src="/GC_Logo.png" 
                alt="Brand Logo" 
                height={56} 
                width={56} 
                className="h-6 w-auto" 
                priority
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 ml-8">
              <Link href={`/${currentSociety}`} className="text-black hover:text-gray-700 py-2 text-base">
                Home
              </Link>
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-base"
                  >
                    Properties
                    <svg
                      className={`ml-2 h-5 w-5 transform inline-block ${isPropertiesDropdownOpen ? 'rotate-180' : ''}`}
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
                    fixed w-48 bg-white rounded-lg shadow-lg py-2
                    ${isPropertiesDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '16rem'
                  }}
                >
                  <Link 
                    href={`/${currentSociety}/rent`}
                    className="flex items-center gap-x-3 px-4 py-2 text-base text-black hover:bg-gray-50"
                    onClick={() => setIsPropertiesDropdownOpen(false)}
                  >
                    <FiHome className="text-blue-600 w-5 h-5" />
                    <span>Rent</span>
                  </Link>
                  <Link 
                    href={`/${currentSociety}/sell`}
                    className="flex items-center gap-x-3 px-4 py-2 text-base text-black hover:bg-gray-50"
                    onClick={() => setIsPropertiesDropdownOpen(false)}
                  >
                    <FiHome className="text-blue-600 w-5 h-5" />
                    <span>Sell</span>
                  </Link>
                </div>
              </div>

              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsCreditScoreDropdownOpen(!isCreditScoreDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-base flex items-center"
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
                    fixed w-100 bg-white rounded-lg shadow-lg py-4 px-4
                    ${isCreditScoreDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '24rem'
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
                      href={`/${currentSociety}/services/house-cleaning`}
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiHome className="w-5 h-5 text-green-600" />
                      <span>Cleaning</span>
                    </Link>
                    <Link 
                      href={`/${currentSociety}/services/domestic-help`}
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiEdit className="w-5 h-5 text-pink-500" />
                      <span>Domestic Help</span>
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
                      <FiTool className="w-5 h-5 text-red-500" />
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
                      href={`/${currentSociety}/services/piegon-net`}
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiTool className="w-5 h-5 text-red-500" />
                      <span>Pigeon Net</span>
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

              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsDeliveryDropdownOpen(!isDeliveryDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-base"
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
                    fixed w-80 bg-white rounded-lg shadow-lg py-4 px-4
                    ${isDeliveryDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '32rem'
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
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link href={`/${currentSociety}/login`} className="text-black hover:text-gray-700 whitespace-nowrap">
                <Button variant="ghost" className="text-base py-2">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden py-2 w-full bg-white fixed bottom-0 left-0 border-t border-gray-200 shadow-lg" style={{ position: 'fixed', bottom: 0, zIndex: 9999 }}>
          <div className="flex justify-around items-center px-1 pb-6">
            <Link href={`/${currentSociety}`} className="text-black hover:text-gray-700 flex flex-col items-center">
              <FiHome className="w-5 h-5 mb-0.5" />
              <span className="text-base font-semibold mt-1">Home</span>
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsPropertiesDropdownOpen(isPropertiesDropdownOpen => !isPropertiesDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <FiHome className="w-5 h-5 mb-0.5" />
                <span className="text-base font-semibold mt-1">Properties</span>
              </button>
              {isPropertiesDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  <Link 
                    href={`/${currentSociety}/rent`}
                    className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsPropertiesDropdownOpen(false)}
                  >
                    Rent
                  </Link>
                  <Link 
                    href={`/${currentSociety}/sell`}
                    className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsPropertiesDropdownOpen(false)}
                  >
                    Sell
                  </Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsDeliveryDropdownOpen(isDeliveryDropdownOpen => !isDeliveryDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <FiTruck className="w-5 h-5 mb-0.5" />
                <span className="text-base font-semibold mt-1">Delivery</span>
              </button>
              {isDeliveryDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  <Link href={`/${currentSociety}/delivery/dairy`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                    Dairy
                  </Link>
                  <Link href={`/${currentSociety}/delivery/meat`} className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                    Meat
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
              <button 
                onClick={() => setIsCreditScoreDropdownOpen(isCreditScoreDropdownOpen => !isCreditScoreDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <FiTool className="w-5 h-5 mb-0.5" />
                <span className="text-base font-semibold mt-1">Services</span>
              </button>
              {isCreditScoreDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-64 bg-white rounded-lg shadow-lg py-2" style={{ right: 0, maxWidth: '90vw' }}>
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
                    href={`/${currentSociety}/services/house-cleaning`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Cleaning
                  </Link>
                  <Link 
                    href={`/${currentSociety}/services/domestic-help`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Domestic Help
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
                    href={`/${currentSociety}/services/kids-classes`}
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Kids Classes
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
} 