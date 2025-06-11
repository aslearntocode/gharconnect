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
  const [isInvestmentDropdownOpen, setIsInvestmentDropdownOpen] = useState(false)
  const [isCreditDropdownOpen, setIsCreditDropdownOpen] = useState(false)
  const [isCreditScoreDropdownOpen, setIsCreditScoreDropdownOpen] = useState(false)
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false)
  const [isDeliveryDropdownOpen, setIsDeliveryDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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

  const handleMutualFundsDashboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('MF Dashboard clicked')

    if (!user) {
      console.log('No user, redirecting to login')
      router.push('/login')
      return
    }

    try {
      // Get the latest recommendation from Supabase
      const { data, error } = await supabase
        .from('mutual_fund_recommendations')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log('Latest MF recommendation query result:', { data, error })

      if (error) throw error

      if (data && data.length > 0) {
        const latestRec = data[0]
        console.log('Found MF recommendation:', latestRec)
        // Remove localStorage.setItem and just redirect with the ID
        router.push(`/recommendations/mutual-funds?id=${latestRec.id}`)
      } else {
        console.log('No MF recommendations found')
        router.push('/investment')
      }
    } catch (error) {
      console.error('Error fetching MF recommendations:', error)
      router.push('/investment')
    }
  }

  const handleStocksDashboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Stocks Dashboard clicked')

    if (!user) {
      console.log('No user, redirecting to login')
      router.push('/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('stock_recommendations')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log('Latest stock recommendation query result:', { data, error })

      if (error) throw error

      if (data && data.length > 0) {
        const latestRec = data[0]
        console.log('Found stock recommendation:', latestRec)
        router.push(`/recommendations/stocks?id=${latestRec.id}`)
      } else {
        console.log('No stock recommendations found')
        router.push('/investment')
      }
    } catch (error) {
      console.error('Error fetching stock recommendations:', error)
      router.push('/investment')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Stocks Dashboard', href: '/stocks-dashboard' },
    { name: 'Existing Portfolio Tracker', href: '/investment/portfolio-tracker' }
  ]

  return (
    <header className="bg-white shadow-md relative" style={{ zIndex: 1000 }}>
      <nav className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/GC.png" 
                alt="Brand Logo" 
                height={40} 
                width={40} 
                className="h-6 w-auto" 
                priority
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 ml-8">
              <Link href="/" className="text-black hover:text-gray-700 py-2 text-base">
                Home
              </Link>
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsCreditDropdownOpen(!isCreditDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-base"
                  >
                    Rent
                    <svg
                      className={`ml-2 h-5 w-5 transform inline-block ${isCreditDropdownOpen ? 'rotate-180' : ''}`}
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
                    ${isCreditDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '20rem'
                  }}
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {/* Left column */}
                    <div className="flex flex-col gap-y-2">
                      <Link href="/rent/t1" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsCreditDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T1</span>
                      </Link>
                      <Link href="/rent/t2" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsCreditDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T2</span>
                      </Link>
                      <Link href="/rent/t3" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsCreditDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T3</span>
                      </Link>
                    </div>
                    {/* Right column */}
                    <div className="flex flex-col gap-y-2">
                      <Link href="/rent/t4" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsCreditDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T4</span>
                      </Link>
                      <Link href="/rent/t5" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsCreditDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T5</span>
                      </Link>
                      <Link href="/rent/t6" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsCreditDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T6</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Commenting out Investments section
              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-lg mr-1"
                  >
                    Investments
                  </button>
                  <button 
                    onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                    className="p-1"
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className={`transition-transform duration-200 ${isInvestmentDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div 
                  className={`
                    fixed w-64 bg-white rounded-lg shadow-lg py-2
                    ${isInvestmentDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '36rem'
                  }}
                >
                  <Link 
                    href="/investment" 
                    className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                  >
                    <span className="text-base">Investment Allocation</span>
                  </Link>
                  {Boolean(user) && Boolean(hasRecommendationAccess) && (
                    <button
                      onClick={handleMutualFundsDashboard}
                      className="w-full flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">MF Dashboard</span>
                    </button>
                  )}
                  {Boolean(user) && Boolean(hasStockAccess) && (
                    <button
                      onClick={handleStocksDashboard}
                      className="w-full flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">Stocks Dashboard</span>
                    </button>
                  )}
                  {Boolean(user) && (
                    <Link 
                      href="/investment/portfolio-tracker" 
                      className="flex items-center px-4 py-3 text-black hover:bg-gray-50"
                    >
                      <span className="text-base">Existing Portfolio Tracker</span>
                    </Link>
                  )}
                </div>
              </div>
              */}

              <div className="relative" style={{ zIndex: 50 }}>
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsLoansDropdownOpen(!isLoansDropdownOpen)}
                    className="text-black hover:text-gray-700 py-2 text-base"
                  >
                    Sell
                    <svg
                      className={`ml-2 h-5 w-5 transform inline-block ${isLoansDropdownOpen ? 'rotate-180' : ''}`}
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
                    ${isLoansDropdownOpen ? 'block' : 'hidden'}
                  `}
                  style={{
                    zIndex: 1000,
                    top: '4rem',
                    left: '24rem'
                  }}
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {/* Left column */}
                    <div className="flex flex-col gap-y-2">
                      <Link href="/sell/t1" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsLoansDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T1</span>
                      </Link>
                      <Link href="/sell/t2" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsLoansDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T2</span>
                      </Link>
                      <Link href="/sell/t3" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsLoansDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T3</span>
                      </Link>
                    </div>
                    {/* Right column */}
                    <div className="flex flex-col gap-y-2">
                      <Link href="/sell/t4" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsLoansDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T4</span>
                      </Link>
                      <Link href="/sell/t5" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsLoansDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T5</span>
                      </Link>
                      <Link href="/sell/t6" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsLoansDropdownOpen(false)}>
                        <FiHome className="text-blue-600 w-5 h-5" />
                        <span>T6</span>
                      </Link>
                    </div>
                  </div>
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
                    left: '32rem'
                  }}
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <Link 
                      href="/services/laundry" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiDroplet className="w-5 h-5 text-blue-500" />
                      <span>Laundry</span>
                    </Link>
                    <Link 
                      href="/services/carpenter" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiTool className="w-5 h-5 text-yellow-600" />
                      <span>Carpenter</span>
                    </Link>
                    <Link 
                      href="/services/plumber" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiTool className="w-5 h-5 text-blue-600" />
                      <span>Plumber</span>
                    </Link>
                    <Link 
                      href="/services/electrician" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiZap className="w-5 h-5 text-yellow-500" />
                      <span>Electrician</span>
                    </Link>
                    <Link 
                      href="/services/cleaning" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiHome className="w-5 h-5 text-green-600" />
                      <span>Cleaning</span>
                    </Link>
                    <Link 
                      href="/services/painter" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiEdit className="w-5 h-5 text-pink-500" />
                      <span>Painter</span>
                    </Link>
                    <Link 
                      href="/services/gardener" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiHome className="w-5 h-5 text-green-600" />
                      <span>Gardener</span>
                    </Link>
                    <Link 
                      href="/services/ac-service" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiZap className="w-5 h-5 text-blue-500" />
                      <span>AC Service</span>
                    </Link>
                    <Link 
                      href="/services/pest-control" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiTool className="w-5 h-5 text-red-500" />
                      <span>Pest Control</span>
                    </Link>
                    <Link 
                      href="/services/physical-training" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiTrendingUp className="w-5 h-5 text-indigo-500" />
                      <span>Physical Training</span>
                    </Link>
                    <Link 
                      href="/services/yoga" 
                      className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded"
                      onClick={() => setIsCreditScoreDropdownOpen(false)}
                    >
                      <FiAward className="w-5 h-5 text-green-500" />
                      <span>Yoga</span>
                    </Link>
                    <Link 
                      href="/services/kids-classes" 
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
                    left: '40rem'
                  }}
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <Link href="/delivery/dairy" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                      <FiTruck className="w-5 h-5 text-blue-500" />
                      <span>Dairy</span>
                    </Link>
                    <Link href="/delivery/meat" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                      <FiTruck className="w-5 h-5 text-red-500" />
                      <span>Meat</span>
                    </Link>
                    <Link href="/delivery/vegetables" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                      <FiTruck className="w-5 h-5 text-green-500" />
                      <span>Vegetables</span>
                    </Link>
                    <Link href="/delivery/fruits" className="flex items-center gap-x-3 px-2 py-1 text-base text-black hover:bg-gray-50 rounded" onClick={() => setIsDeliveryDropdownOpen(false)}>
                      <FiTruck className="w-5 h-5 text-orange-500" />
                      <span>Fruits</span>
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
              <Link href="/login" className="text-black hover:text-gray-700 whitespace-nowrap">
                <Button variant="ghost" className="text-base py-2">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden py-2 w-full bg-white fixed bottom-0 left-0 border-t border-gray-200 shadow-lg" style={{ position: 'fixed', bottom: 0, zIndex: 9999 }}>
          <div className="flex justify-around items-center px-1 pb-6">
            <Link href="/" className="text-black hover:text-gray-700 flex flex-col items-center">
              <FiHome className="w-5 h-5 mb-0.5" />
              <span className="text-base font-semibold mt-1">Home</span>
            </Link>

            <div className="relative">
              <button 
                onClick={() => setIsCreditDropdownOpen(isCreditDropdownOpen => !isCreditDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <FiCreditCard className="w-5 h-5 mb-0.5" />
                <span className="text-base font-semibold mt-1">Rent</span>
              </button>
              {isCreditDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  <Link 
                    href="/rent/t1" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditDropdownOpen(false)}
                  >
                    T1
                  </Link>
                  <Link 
                    href="/rent/t2" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditDropdownOpen(false)}
                  >
                    T2
                  </Link>
                  <Link 
                    href="/rent/t3" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditDropdownOpen(false)}
                  >
                    T3
                  </Link>
                  <Link 
                    href="/rent/t4" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditDropdownOpen(false)}
                  >
                    T4
                  </Link>
                  <Link 
                    href="/rent/t5" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditDropdownOpen(false)}
                  >
                    T5
                  </Link>
                  <Link 
                    href="/rent/t6" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditDropdownOpen(false)}
                  >
                    T6
                  </Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsLoansDropdownOpen(isLoansDropdownOpen => !isLoansDropdownOpen)}
                className="text-black hover:text-gray-700 flex flex-col items-center"
              >
                <FiDollarSign className="w-5 h-5 mb-0.5" />
                <span className="text-base font-semibold mt-1">Sell</span>
              </button>
              {isLoansDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg py-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  <Link 
                    href="/sell/t1" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsLoansDropdownOpen(false)}
                  >
                    T1
                  </Link>
                  <Link 
                    href="/sell/t2" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsLoansDropdownOpen(false)}
                  >
                    T2
                  </Link>
                  <Link 
                    href="/sell/t3" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsLoansDropdownOpen(false)}
                  >
                    T3
                  </Link>
                  <Link 
                    href="/sell/t4" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsLoansDropdownOpen(false)}
                  >
                    T4
                  </Link>
                  <Link 
                    href="/sell/t5" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsLoansDropdownOpen(false)}
                  >
                    T5
                  </Link>
                  <Link 
                    href="/sell/t6" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsLoansDropdownOpen(false)}
                  >
                    T6
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
                  <Link href="/delivery/dairy" className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                    Dairy
                  </Link>
                  <Link href="/delivery/meat" className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                    Meat
                  </Link>
                  <Link href="/delivery/vegetables" className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                    Vegetables
                  </Link>
                  <Link href="/delivery/fruits" className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50" onClick={() => setIsDeliveryDropdownOpen(false)}>
                    Fruits
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
                    href="/services/laundry" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Laundry
                  </Link>
                  <Link 
                    href="/services/carpenter" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Carpenter
                  </Link>
                  <Link 
                    href="/services/plumber" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Plumber
                  </Link>
                  <Link 
                    href="/services/electrician" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Electrician
                  </Link>
                  <Link 
                    href="/services/cleaning" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Cleaning
                  </Link>
                  <Link 
                    href="/services/painter" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Painter
                  </Link>
                  <Link 
                    href="/services/gardener" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Gardener
                  </Link>
                  <Link 
                    href="/services/ac-service" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    AC Service
                  </Link>
                  <Link 
                    href="/services/pest-control" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Pest Control
                  </Link>
                  <Link 
                    href="/services/physical-training" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Physical Training
                  </Link>
                  <Link 
                    href="/services/yoga" 
                    className="flex items-center px-4 py-1 text-sm text-black hover:bg-gray-50"
                    onClick={() => setIsCreditScoreDropdownOpen(false)}
                  >
                    Yoga
                  </Link>
                  <Link 
                    href="/services/kids-classes" 
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