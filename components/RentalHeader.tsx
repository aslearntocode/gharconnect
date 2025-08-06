'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FiHome, FiSearch, FiPlus, FiFileText } from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'
import LoginModal from '@/components/LoginModal'
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "./ProfileDropdown"

export default function RentalHeader() {
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Extract city from pathname (e.g., /mumbai/rent -> mumbai)
  const getCityFromPath = () => {
    const pathParts = pathname.split('/')
    return pathParts[1] || 'mumbai' // Default to mumbai if no city in path
  }

  const currentCity = getCityFromPath()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      console.log('RentalHeader: Auth state changed, user:', user?.email || 'null');
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

  // Scroll detection for header color change
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change header color after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`absolute md:relative lg:fixed lg:top-0 left-0 right-0 z-50 transition-all duration-300 -mb-4 md:mb-0 ${
          isScrolled 
            ? 'lg:bg-gray-900/60 lg:backdrop-blur-sm shadow-lg lg:text-white' 
            : 'md:bg-white md:shadow-md text-black'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-0 md:px-1 sm:px-2 lg:px-2">
          <div className="flex justify-between h-16 items-center w-full">
            <div className="flex items-center">
              <Link href={`/${currentCity}/rent`} className="flex items-center">
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
                <Link 
                  href={`/${currentCity}/rent`} 
                  className={`py-2 text-base transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-700'
                  }`}
                >
                  Home
                </Link>
                
                <div className="relative" style={{ zIndex: 50 }}>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)}
                      className={`py-2 text-base flex items-center transition-colors duration-300 ${
                        isScrolled 
                          ? 'text-white hover:text-gray-300' 
                          : 'text-black hover:text-gray-700'
                      }`}
                    >
                      Rent
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
                      fixed w-56 bg-white rounded-lg shadow-lg py-2
                      ${isPropertiesDropdownOpen ? 'block' : 'hidden'}
                    `}
                    style={{
                      zIndex: 1000,
                      top: '4rem',
                      left: '16rem'
                    }}
                  >
                    <Link 
                      href={`/${currentCity}/rent/apartment`}
                      className="flex items-center gap-x-3 px-4 py-2 text-base text-black hover:bg-gray-50"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <FiSearch className="text-blue-600 w-5 h-5" />
                      <span>Apartments</span>
                    </Link>
                    <Link 
                      href={`/${currentCity}/rent/pg`}
                      className="flex items-center gap-x-3 px-4 py-2 text-base text-black hover:bg-gray-50"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <FiHome className="text-green-600 w-5 h-5" />
                      <span>PG Accommodation</span>
                    </Link>
                    {/* <Link 
                      href={`/${currentCity}/shared`}
                      className="flex items-center gap-x-3 px-4 py-2 text-base text-black hover:bg-gray-50"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <FiHome className="text-purple-600 w-5 h-5" />
                      <span>Shared Accommodation</span>
                    </Link> */}
                  </div>
                </div>
              </div>
              <Link 
                href={`/${currentCity}/list-apartment`} 
                className={`hidden md:block py-2 text-base ml-6 transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-white hover:text-gray-300' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                List
              </Link>
            </div>

            <div className="flex items-center">
              {user ? (
                <ProfileDropdown user={user} />
              ) : (
                <Button 
                  variant="ghost" 
                  className={`text-base py-2 transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-white hover:text-gray-300' 
                      : 'text-black hover:text-gray-700'
                  }`} 
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Log in
                </Button>
              )}
              <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                redirectPath={pathname}
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Bar - Fixed at Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 px-1">
          <Link 
            href={`/${currentCity}/rent`} 
            className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
          >
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setIsPropertiesDropdownOpen(isPropertiesDropdownOpen => !isPropertiesDropdownOpen)}
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
            >
              <FaBuilding className="w-6 h-6" />
              <span className="text-xs mt-1">Rent</span>
            </button>
            {isPropertiesDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-56 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                <Link 
                  href={`/${currentCity}/rent/apartment`}
                  className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-50"
                  onClick={() => setIsPropertiesDropdownOpen(false)}
                >
                  Apartments
                </Link>
                <Link 
                  href={`/${currentCity}/rent/pg`}
                  className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-50"
                  onClick={() => setIsPropertiesDropdownOpen(false)}
                >
                  PG Accommodation
                </Link>
                {/* <Link 
                  href={`/${currentCity}/shared`}
                  className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-50"
                  onClick={() => setIsPropertiesDropdownOpen(false)}
                >
                  Shared Accommodation
                </Link> */}
              </div>
            )}
          </div>
          
          <Link 
            href={`/${currentCity}/list-apartment`} 
            className="flex flex-col items-center text-black hover:text-gray-700 transition-colors duration-300"
          >
            <FiFileText className="w-6 h-6" />
            <span className="text-xs mt-1">List</span>
          </Link>
        </div>
      </div>
    </>
  )
} 