'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import Testimonials from "@/components/Testimonials"
import Header from "@/components/Header"
import { getSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { FiCreditCard, FiGift, FiDollarSign, FiDroplet, FiGlobe, FiTrendingUp, FiHome, FiBriefcase, FiAirplay, FiLayers, FiCreditCard as FiCard, FiBook, FiTruck, FiHome as FiHomeIcon, FiDollarSign as FiDollarSignIcon, FiBookOpen, FiAward, FiTool, FiZap, FiEdit, FiShield, FiFileText, FiGrid } from 'react-icons/fi'
import DoctorsContainer from "@/components/DoctorsContainer"
import TravelDiariesContainer from "@/components/TravelDiariesContainer"
import Head from 'next/head'
import VideoEmbed from '@/components/VideoEmbed'
import Poll from '@/components/Poll'


interface AllocationItem {
  name: string;
  value: number;
}

interface ReportData {
  created_at: string;
  report_analysis: {
    first_block?: {
      score_value?: number;
    };
    score_details?: {
      score?: number;
    };
  };
}

export default function Home() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('distribution') // 'distribution' or 'offer'
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [proTipPosition, setProTipPosition] = useState(100)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatForm, setChatForm] = useState({
    name: '',
    message: ''
  })
  const [user, setUser] = useState<User | null>(null)
  const [latestReport, setLatestReport] = useState<{
    date: string;
    type: string;
    score?: number;
    openAccounts?: number;
    closedAccounts?: number;
    totalCreditLimit?: string;
    report_analysis?: any;
  } | null>(null)
  const [latestAllocation, setLatestAllocation] = useState<AllocationItem[] | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [activeCard, setActiveCard] = useState<'investment' | 'credit'>('investment')
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [lastTouchTime, setLastTouchTime] = useState(0)
  const TOUCH_DELAY = 500 // Minimum time between touches in milliseconds
  const TOUCH_THRESHOLD = 10 // Pixel threshold to determine if it's a tap or scroll
  const [activeServiceCard, setActiveServiceCard] = useState('credit') // Add this new state
  const [isMobile, setIsMobile] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    issuer: '',
    complaint: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [touchMoved, setTouchMoved] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [currentAdCarouselIndex, setCurrentAdCarouselIndex] = useState(0);

  const testimonials = [
    {
      initial: 'R',
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      color: 'bg-indigo-600',
      text: 'I appreciate that this app doesn\'t share my data with other companies. Unlike other platforms, I haven\'t received any unsolicited calls from lenders. It\'s refreshing to use a service that respects user privacy!'
    },
    {
      initial: 'P',
      name: 'Priya Patel',
      role: 'Business Owner',
      color: 'bg-purple-600',
      text: 'The ability to compare all credit cards in one place saved me so much time! I could easily see the benefits, fees, and rewards of each card without visiting multiple websites. Found my perfect card in minutes!'
    },
    {
      initial: 'A',
      name: 'Amit Kumar',
      role: 'Medical Professional',
      color: 'bg-green-600',
      text: 'The personalized recommendations were spot-on! The app understood my spending habits and suggested cards that perfectly matched my lifestyle. No more guesswork in choosing the right credit card.'
    },
    {
      initial: 'N',
      name: 'Neha Gupta',
      role: 'Financial Analyst',
      color: 'bg-red-600',
      text: 'What impressed me most was the transparency. No hidden charges, no spam calls, and clear comparison of all features. It\'s rare to find such an honest financial comparison platform.'
    },
    {
      initial: 'S',
      name: 'Suresh Reddy',
      role: 'Retired Professional',
      color: 'bg-yellow-600',
      text: 'The user-friendly interface made it easy for me to understand different credit card options. I could filter cards based on my needs and compare them side by side. Highly recommended!'
    },
    {
      initial: 'M',
      name: 'Meera Desai',
      role: 'Freelancer',
      color: 'bg-indigo-600',
      text: 'I was skeptical at first, but the app proved me wrong. No unwanted calls, no data sharing, and most importantly, it helped me find a card with great rewards for my business expenses.'
    }
  ]

  const mainActionCards = [
    {
      id: 'rent',
      title: 'Tenant',
      description: 'Find your perfect rental property',
      icon: FiHome,
      href: '/thane/rent/',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'list-property',
      title: 'Landlord',
      description: 'List Your Property for Rent',
      icon: FiHome,
      href: '/thane/rent-apartment',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'services',
      title: 'Local Services',
      description: 'Book trusted home services',
      icon: FiTool,
      href: '#',
      onClick: (e: React.MouseEvent) => { e.preventDefault(); document.getElementById('services-categories')?.scrollIntoView({ behavior: 'smooth' }); },
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'delivery',
      title: 'Local Delivery',
      description: 'Get essentials delivered to your door',
      icon: FiTruck,
      href: '#',
      onClick: (e: React.MouseEvent) => { e.preventDefault(); document.getElementById('delivery-categories')?.scrollIntoView({ behavior: 'smooth' }); },
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  const nextSlide = () => {
    if (isMobile) {
      setCurrentCarouselIndex((prev) => (prev + 1) % mainActionCards.length);
    } else {
      setCurrentCarouselIndex((prev) => (prev + 2) % mainActionCards.length);
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentCarouselIndex((prev) => (prev - 1 + mainActionCards.length) % mainActionCards.length);
    } else {
      setCurrentCarouselIndex((prev) => (prev - 2 + mainActionCards.length) % mainActionCards.length);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((current) => 
        current === testimonials.length - 3 ? 0 : current + 1
      )
    }, 8000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  useEffect(() => {
    const animateProTip = () => {
      setProTipPosition((prev) => {
        if (prev <= -100) {
          return 100
        }
        return prev - 1
      })
    }

    const interval = setInterval(animateProTip, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        const supabase = await getSupabaseClient()
        const { data, error } = await supabase
          .from('credit_reports')
          .select('created_at, report_analysis')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data) {
          try {
            // Parse the report_analysis if it's a string
            const reportAnalysis = typeof data.report_analysis === 'string' 
              ? JSON.parse(data.report_analysis) 
              : data.report_analysis

            const score = reportAnalysis?.first_block?.score_value || reportAnalysis?.score_details?.score || 0
            
            // Fix: Properly format the date from Supabase
            const formattedDate = new Date(data.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
            
            const report = {
              date: formattedDate, // Use the formatted date
              type: 'Credit Analysis',
              score: parseInt(score)
            }
            setLatestReport(report)
          } catch (parseError) {
            console.error("Error parsing report data:", parseError)
            setLatestReport(null)
          }
        } else {
          setLatestReport(null)
        }
      } else {
        setLatestReport(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchAllocation = async () => {
      if (user) {
        const supabase = await getSupabaseClient()
        const { data, error } = await supabase
          .from('investment_records')
          .select('allocation')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data?.allocation) {
          setLatestAllocation(data.allocation);
        }
      }
    };

    fetchAllocation();
  }, [user]);

  useEffect(() => {
    const fetchReport = async () => {
      if (user) {  // Only fetch if user is logged in
        const supabase = await getSupabaseClient()
        const { data: reports } = await supabase
          .from('credit_reports')
          .select('*')
          .eq('user_id', user.uid)  // Filter by user_id
          .order('created_at', { ascending: false })
          .limit(1);

        if (reports && reports[0]) {
          // Format the date from created_at
          const formattedDate = new Date(reports[0].created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          // Parse the report_analysis JSON if it's stored as a string
          const parsedReport = {
            ...reports[0],
            report_analysis: typeof reports[0].report_analysis === 'string' 
              ? JSON.parse(reports[0].report_analysis)
              : reports[0].report_analysis,
            formattedDate // Add the formatted date to the parsed report
          };
          setReportData(parsedReport);
        }
      }
    };

    fetchReport();
  }, [user]); // Add user to dependency array

  // Debug log for render
  console.log("Render state:", { user: !!user, latestReport })

  useEffect(() => {
    if (user) {
      // Pre-fill form data when user is logged in
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle chat submission
    setChatForm({ name: '', message: '' })
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX)
    setTouchMoved(false)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.touches[0].clientX)
    setTouchMoved(true)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchMoved) return
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Handle card click
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    // Implement search functionality
    setIsSearching(false)
  }

  // Notification carousel messages
  const notificationMessages = [
    {
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: 'We respect your privacy — no calls, no data sharing, unless you request it.'
    },
    {
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: 'We respect your privacy — no calls, no data sharing, unless you request it.'
    },
    {
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Explore freely, there is no hidden subscription fee, walk away if you find one.'
    }
  ];
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationIndex((prev) => (prev + 1) % notificationMessages.length);
    }, 5000); // 5 seconds per message
    return () => clearInterval(interval);
  }, [notificationMessages.length]);

  // Auto-play advertisement carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdCarouselIndex((prev) => (prev + 1) % 3);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Rent, Services & Delivery in Thane | GharConnect</title>
        <meta name="description" content="Find rental properties, local services, and delivery options in Thane. Connect with residents, businesses, and property owners on GharConnect." />
      </Head>
      <main className="min-h-screen bg-white">
        <Header />
        {/* Notification Bar */}
        <div className="w-full mt-2 mb-4">
          <div className="bg-yellow-100 text-yellow-900 px-4 md:px-0 py-2 text-center font-medium shadow-sm rounded-none md:rounded-md w-full text-base md:text-lg">
            We have a rental property available at Crescent Bay from 5th July 2025. Contact us at 9321314553.
          </div>
        </div>
        {/* Floating Info Cards */}
        <div className="fixed right-4 top-52 md:top-44 z-50 flex flex-col gap-4">
        </div>
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-4">
            <div className="flex flex-col items-center mb-8">
              <div className="text-sm md:text-3xl font-bold md:font-medium text-center text-indigo-700">
              Connecting Residents, Businesses, and Property Owners Within a Location
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <h1 className="text-[24px] md:text-[48px] leading-tight font-bold mb-6 text-center md:text-left flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <span className="text-black">Welcome to GharConnect </span>
                  <span className="text-indigo-600">@Thane</span>
                  <Link href="/" className="ml-2 text-indigo-600 text-xs md:text-sm font-semibold underline hover:no-underline transition-all">
                    Click here to go to other areas
                  </Link>
                </h1>
                <p className="text-lg text-gray-600 mb-4 md:mb-8">
                  Your one-stop community platform for renting, selling, services, and delivery in your society. Explore all the services available in your society.
                </p>
              </div>
              {/* Right Content - Main Offerings */}
              <div className="relative">
                {/* Grid Container */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                  {mainActionCards.map((card) => {
                    const IconComponent = card.icon;
                    return (
                      <Link 
                        key={card.id} 
                        href={card.href} 
                        onClick={card.onClick}
                        className="group"
                      >
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 p-4 md:p-6 flex items-center gap-x-3 md:gap-x-5 group hover:bg-gray-50 cursor-pointer h-full">
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-gray-900 text-sm md:text-lg">
                              {card.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advertisement Section */}
        <div className="bg-white py-3 md:py-4 mb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-3 md:p-4 relative">
              {/* Sponsored Label */}
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Advertisement
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Left Side - School Details */}
                <div className="flex-1 flex items-center space-x-4 mt-8 md:mt-0">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">🏫</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">Casa Vista Montessori Preschool</h3>
                    <p className="text-gray-600 text-sm md:text-base">📍 Sion West, Mumbai • Admissions Open for 2025-26</p>
                    <p className="text-gray-600 text-sm md:text-base">📞 Contact: 9820297119, 9820963632</p>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      <a href="https://www.instagram.com/casa_vista_montessori/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center underline hover:text-blue-700">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M224 202.66A53.34 53.34 0 1 0 277.34 256 53.38 53.38 0 0 0 224 202.66Zm124.71-41a54 54 0 0 0-30.22-30.22C293.19 120 256 118.13 224 118.13s-69.19 1.87-94.49 13.31a54 54 0 0 0-30.22 30.22C120 162.81 118.13 200 118.13 232s1.87 69.19 13.31 94.49a54 54 0 0 0 30.22 30.22C162.81 392 200 393.87 232 393.87s69.19-1.87 94.49-13.31a54 54 0 0 0 30.22-30.22C392 349.19 393.87 312 393.87 280s-1.87-69.19-13.31-94.49ZM224 338a82 82 0 1 1 82-82 82 82 0 0 1-82 82Zm85.4-148.6a19.2 19.2 0 1 1-19.2-19.2 19.2 19.2 0 0 1 19.2 19.2ZM398.8 80A80 80 0 0 0 368 51.2C347.2 32 320.8 32 224 32S100.8 32 80 51.2A80 80 0 0 0 51.2 80C32 100.8 32 127.2 32 224s0 123.2 19.2 144A80 80 0 0 0 80 460.8C100.8 480 127.2 480 224 480s123.2 0 144-19.2a80 80 0 0 0 28.8-28.8C480 347.2 480 320.8 480 224s0-123.2-19.2-144ZM432 368a48 48 0 0 1-27.31 27.31C380.8 408 353.6 416 224 416s-156.8-8-180.69-20.69A48 48 0 0 1 16 368C8 353.6 0 326.4 0 224s8-129.6 20.69-144A48 48 0 0 1 48 51.2C62.4 40 89.6 32 192 32s129.6 8 144 19.2A48 48 0 0 1 432 80c12.69 14.4 20.69 41.6 20.69 144s-8 129.6-20.69 144Z"/></svg>
                        @casa_vista_montessori
                      </a>
                    </p>
                    <div className="sr-only">
                      <p>
                        <a href="/thane" className="underline hover:text-blue-700">Montessori schools in South Bombay</a> |
                        <a href="/thane" className="underline hover:text-blue-700">Montessori school in Sion</a> |
                        <a href="/thane" className="underline hover:text-blue-700">best Montessori schools</a>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Photo Carousel */}
                <div className="relative w-60 h-36 md:w-96 md:h-56 rounded-lg overflow-hidden flex-shrink-0">
                  {/* Sample images - replace with actual business photos */}
                  <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" 
                       style={{ transform: `translateX(-${currentAdCarouselIndex * 100}%)` }}>
                    <div className="w-full flex-shrink-0 h-full">
                      <img 
                        src="/Ads/IMG_1.png" 
                        alt="School Advertisement 1" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-full flex-shrink-0 h-full">
                      <img 
                        src="/Ads/IMG_2.png" 
                        alt="School Advertisement 2" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-full flex-shrink-0 h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl md:text-5xl mb-2">🎓</div>
                        <p className="text-sm md:text-base font-semibold">Admissions Open</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Dots */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAdCarouselIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentAdCarouselIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Management Services Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white overflow-hidden my-0 pt-2 md:pt-3">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-transparent to-indigo-600/50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-8 relative">
              {/* Left Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Why Collaborate With Us?
                </h3>
                <p className="text-lg text-white/90 mb-6 max-w-4xl">
                Community outreach is a powerful way to connect with neighbors and strengthen the sense of belonging.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-8 w-full">
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center w-full h-full min-h-[340px] justify-between">
                    <span className="text-3xl mb-2">🏠</span>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-none">List Your Property With Us</h4>
                    <ul className="text-gray-600 text-md list-disc pl-4 text-left mt-2 space-y-1">
                      <li>Save on brokerage fees – We charge only 10% of one month's rent.</li>
                      <li>Find genuine tenants from within your community.</li>
                      <li>Renovation support – Get the property ready for the next tenant with our expert services.</li>
                    </ul>
                    <div className="flex flex-row justify-center items-end gap-3 md:gap-4 mt-4 w-full grow">
                      <a 
                        href="/thane/rent-apartment" 
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded text-xs font-semibold transition-all duration-300 shadow-md"
                        style={{ minHeight: '36px' }}
                      >
                        <span className="hidden md:inline">List Your Property With Us</span>
                        <span className="md:hidden">List Property</span>
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center w-full h-full min-h-[340px] justify-between">
                    <span className="text-3xl mb-2">🧑‍💼</span>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-none">List Your Business With Us</h4>
                    <ul className="text-gray-600 text-md list-disc pl-4 text-left mt-2 space-y-1">
                      <li>Reach more customers right where they live.</li>
                      <li>Build trust by getting rated and reviewed by the community.</li>
                      <li>Zero commission – You keep 100% of your earnings.</li>
                    </ul>
                    <div className="flex flex-row justify-center items-end gap-3 md:gap-4 mt-4 w-full grow">
                      <a 
                        href="https://wa.me/919321314553?text=I%20want%20to%20list%20my%20business%20in%20Thane" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded text-xs font-semibold transition-all duration-300 shadow-md"
                        style={{ minHeight: '36px' }}
                      >
                        <span className="hidden md:inline">WhatsApp Details on 9321314553</span>
                        <span className="md:hidden">WhatsApp to List</span>
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center w-full h-full min-h-[340px] justify-between">
                    <span className="text-3xl mb-2">📄</span>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-none">What GharConnect Offers</h4>
                    <ul className="text-gray-600 text-md list-disc pl-4 text-left mt-2 space-y-1">
                      <li>Verified property listings in your society.</li>
                      <li>Local vendors you can trust—rated by residents.</li>
                      <li>Domestic help and drivers who meet your needs.</li>
                      <li>A stronger, better-connected community with fewer hassles.</li>
                    </ul>
                    <div className="flex flex-row justify-center items-end gap-3 md:gap-4 mt-4 w-full grow">
                      <div style={{ minHeight: '36px' }} className="inline-block" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Delivery Categories Section */}
        <div id="delivery-categories" className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2 md:mb-3">Delivery Categories</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Order fresh essentials delivered to your door</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Link href="/thane/delivery/dairy" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🥛</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Dairy</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Fresh milk, cheese, paneer, butter, and more</p>
                </div>
              </Link>
              <Link href="/thane/delivery/meat" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🍗</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Meat</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Quality meat and poultry, hygienically packed</p>
                </div>
              </Link>
              <Link href="/thane/delivery/vegetables" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🥦</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Vegetables</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Farm-fresh vegetables delivered daily/weekly</p>
                </div>
              </Link>
              <Link href="/thane/delivery/fruits" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🍎</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Fruits</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Seasonal and exotic fruits, handpicked for you</p>
                </div>
              </Link>
              <Link href="/thane/delivery/dry-fruits" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🥜</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Dry Fruits</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Premium quality dry fruits and nuts</p>
                </div>
              </Link>
              <Link href="/thane/delivery/pharmacy" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">💊</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Pharmacy</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">All types of medicines available</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Domestic Help Container */}
        <div className="bg-indigo-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Looking for Domestic Help & Drivers?</h2>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
                The domestic help and drivers put in their availability for the next 10 days 
                and you can book them for a few hours or for a few days to meet your emergency needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/thane/services/domestic-help"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
                >
                  For Hiring - Click Here
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a 
                  href="https://gharconnect.in/vendor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors duration-200"
                >
                  Looking for Work - Click Here
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services Categories Section */}
        <div id="services-categories" className="bg-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2 md:mb-3">Services Categories</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Book trusted home and personal services</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Link href="/thane/services/laundry" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiDroplet className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Laundry</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Professional laundry and dry cleaning</p>
                </div>
              </Link>
              <Link href="/thane/services/carpenter" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-yellow-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Carpenter</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Woodwork, repairs, and furniture</p>
                </div>
              </Link>
              <Link href="/thane/services/plumber" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Plumber</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Leak repairs, fittings, and more</p>
                </div>
              </Link>
              <Link href="/thane/services/electrician" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiZap className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-yellow-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Electrician</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Wiring, repairs, and installations</p>
                </div>
              </Link>
              <Link href="/thane/services/domestic-help" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center md:items-center md:justify-start">
                  <FiHome className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Domestic Help & Drivers</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Helpers for urgent needs</p>
                </div>
              </Link>
              <Link href="/thane/services/car-clean" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiEdit className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-pink-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Car Clean</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Daily Car Cleaning</p>
                </div>
              </Link>
              <Link href="/thane/services/painter" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiEdit className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-pink-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Painter</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Wall painting and touch-ups</p>
                </div>
              </Link>
              <Link href="/thane/services/gardener" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiHome className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Gardener</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Garden care and landscaping</p>
                </div>
              </Link>
              <Link href="/thane/services/ac-service" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiZap className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">AC Service</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">AC repair and maintenance</p>
                </div>
              </Link>
              <Link href="/thane/services/pest-control" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiShield className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-red-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Pest Control</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Termite and pest removal</p>
                </div>
              </Link>
              <Link href="/thane/services/laptop-repair" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-red-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Laptop Repair</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Laptop repair & maintenance</p>
                </div>
              </Link>
              <Link href="/thane/services/electronics-repair" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-red-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Electronics Repair</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Electronics repair & maintenance</p>
                </div>
              </Link>
              <Link href="/thane/services/notary" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiFileText className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Notary</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Legal document notarization</p>
                </div>
              </Link>
              <Link href="/thane/services/piegon-net" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiGrid className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Pigeon Net</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Pigeon net installation</p>
                </div>
              </Link>
              <Link href="/thane/services/physical-training" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTrendingUp className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-indigo-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Physical Training</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Personal and group training</p>
                </div>
              </Link>
              <Link href="/thane/services/yoga" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiAward className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Yoga</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Yoga classes and workshops</p>
                </div>
              </Link>
              <Link href="/thane/services/kids-classes" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiBookOpen className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-orange-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Kids Classes</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Learning and fun for kids</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Doctors Container */}
        <DoctorsContainer />

        {/* Property to Rent Container */}
        <div className="max-w-4xl mx-auto mt-12 mb-16 px-4">
          <div className="rounded-2xl border border-gray-200 shadow-md bg-white flex flex-col md:flex-row items-stretch p-0 md:p-0 gap-6 md:gap-0 relative overflow-hidden">
            {/* Left Image as Card (faded background) */}
            <div className="hidden md:block absolute top-0 bottom-0 left-0 h-full w-[260px]">
              <img src="/Keys_IMG.png" alt="Keys illustration" className="h-full w-full object-contain rounded-l-2xl shadow-md" style={{opacity:0.25}} />
              <div className="absolute inset-0 bg-white rounded-l-2xl" style={{opacity:0.25}}></div>
            </div>
            {/* Right Image as Card */}
            <div className="hidden md:block absolute top-0 bottom-0 right-0 h-full w-[260px]">
              <img src="/House_IMG.png" alt="House illustration" className="h-full w-full object-contain rounded-r-2xl shadow-md bg-white" />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full min-h-[180px] md:pl-[260px] md:pr-[260px] p-6 md:p-0">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Have a property to rent?</h2>
              <p className="text-gray-600 mb-4">List your property & connect with clients faster!</p>
              <a href="/thane/rent-apartment" className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-base shadow-lg">
                List Your Property
              </a>
            </div>
          </div>
        </div>
        {/* Travel Diaries Container */}
        <TravelDiariesContainer />
        
        {/* Community Poll */}
        <Poll location="thane" />
      </main>
    </>
  )
}

