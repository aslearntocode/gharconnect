'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import Testimonials from "@/components/Testimonials"
import Header from "@/components/Header"
import { getSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { FiCreditCard, FiGift, FiDollarSign, FiDroplet, FiGlobe, FiTrendingUp, FiHome, FiBriefcase, FiAirplay, FiLayers, FiCreditCard as FiCard, FiBook, FiTruck, FiHome as FiHomeIcon, FiBookOpen, FiAward, FiTool, FiZap, FiEdit, FiShield, FiFileText, FiGrid, FiUsers, FiHeart } from 'react-icons/fi'
import DoctorsContainer from "@/components/DoctorsContainer"
import TravelDiariesContainer from "@/components/TravelDiariesContainer"
import Head from 'next/head'
import VideoEmbed from '@/components/VideoEmbed'
import VideoPlayer from '@/components/VideoPlayer'
import TestimonialCarousel from "@/components/TestimonialCarousel"


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

interface MarketplaceProduct {
  id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  created_at: string;
  building_name?: string;
  is_active?: boolean;
}

interface ConnectPost {
  id: string;
  title: string;
  body: string;
  created_at: string;
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
  const [touchStartY, setTouchStartY] = useState(0)
  const [lastTouchTime, setLastTouchTime] = useState(0)
  const TOUCH_DELAY = 500 // Minimum time between touches in milliseconds
  const TOUCH_THRESHOLD = 10 // Pixel threshold to determine if it's a tap or scroll
  const [activeServiceCard, setActiveServiceCard] = useState('credit') // Add this new state
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
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
  const [currentPopularServicesIndex, setCurrentPopularServicesIndex] = useState(0);
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
  const [connectPosts, setConnectPosts] = useState<ConnectPost[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
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
      description: 'Get essentials delivered',
      icon: FiTruck,
      href: '#',
      onClick: (e: React.MouseEvent) => { e.preventDefault(); document.getElementById('delivery-categories')?.scrollIntoView({ behavior: 'smooth' }); },
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Buy & sell pre-loved items',
      icon: FiDollarSign,
      href: '/mumbai/community/marketplace',
      gradient: 'from-pink-500 to-yellow-500'
    },
    {
      id: 'connect',
      title: 'Social',
      description: 'Community Q&A & discussions',
      icon: FiUsers,
      href: '/mumbai/community/connect',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const nextSlide = () => {
    if (isMounted && isMobile) {
      setCurrentCarouselIndex((prev) => (prev + 1) % mainActionCards.length);
    } else {
      setCurrentCarouselIndex((prev) => (prev + 2) % mainActionCards.length);
    }
  };

  const prevSlide = () => {
    if (isMounted && isMobile) {
      setCurrentCarouselIndex((prev) => (prev - 1 + mainActionCards.length) % mainActionCards.length);
    } else {
      setCurrentCarouselIndex((prev) => (prev - 2 + mainActionCards.length) % mainActionCards.length);
    }
  };

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection for header color change
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change header color after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setCurrentAdCarouselIndex((prev) => (prev + 1) % 2);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  const popularServicesCards: Array<{
    id: string;
    title: string;
    icon: string | React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    buttonBg: string;
    buttonHover: string;
    href: string;
    buttonText: string;
    buttonTextMobile: string;
  }> = [
    {
      id: 'domestic-help',
      title: 'Domestic Help & Drivers',
      icon: FiUsers,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
      href: '/mumbai/community/services/domestic-help',
      buttonText: 'Find Help',
      buttonTextMobile: 'Find Help'
    },
    {
      id: 'physical-training',
      title: 'Physical Training',
      icon: FiTrendingUp,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700',
      href: '/mumbai/community/services/physical-training',
      buttonText: 'Trainers',
      buttonTextMobile: 'Trainers'
    },
    {
      id: 'neighbor-services',
      title: 'Neighbor Service Providers',
      icon: FiUsers,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
      href: '/mumbai/community/home-service-provider',
      buttonText: 'View',
      buttonTextMobile: 'View'
    },
    {
      id: 'sell-item-tickets',
      title: 'Sell Items & Tickets',
      icon: FiUsers,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      buttonBg: 'bg-indigo-600',
      buttonHover: 'hover:bg-indigo-700',
      href: '/mumbai/community/marketplace/sell',
      buttonText: 'View',
      buttonTextMobile: 'View'
    },
    {
      id: 'egg-delivery',
      title: 'Farm Fresh Eggs',
      icon: FiUsers,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700',
      href: '/mumbai/community/delivery/eggs',
      buttonText: 'Order Now',
      buttonTextMobile: 'Order Now'
    }
  ];

  const nextPopularService = () => {
    setCurrentPopularServicesIndex((prev) => (prev + 1) % popularServicesCards.length);
  };

  const prevPopularService = () => {
    setCurrentPopularServicesIndex((prev) => (prev - 1 + popularServicesCards.length) % popularServicesCards.length);
  };

  const handlePopularServiceTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setTouchMoved(false);
  };

  const handlePopularServiceTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
    setTouchMoved(true);
  };

  const handlePopularServiceTouchEnd = () => {
    if (!touchMoved) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPopularService();
    } else if (isRightSwipe) {
      prevPopularService();
    }
  };

  useEffect(() => {
    // Fetch latest 4 marketplace products for Parel
    const fetchMarketplaceProducts = async () => {
      const { getSupabaseClient } = await import("@/lib/supabase");
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("marketplace_products")
        .select("id,title,price,condition,images,created_at,building_name,is_active")
        .eq("area", "parel")
        .order("created_at", { ascending: false })
        .limit(4);
      if (!error && data) setMarketplaceProducts(data);
    };
    fetchMarketplaceProducts();
  }, []);

  useEffect(() => {
    // Fetch latest 3 connect posts for Parel
    const fetchConnectPosts = async () => {
      const { getSupabaseClient } = await import("@/lib/supabase");
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id,title,body,created_at")
        .eq("area", "Parel")
        .order("created_at", { ascending: false })
        .limit(3);
      if (!error && data) setConnectPosts(data);
    };
    fetchConnectPosts();
  }, []);

  // Carousel navigation handlers
  const numSlides = 2;
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + numSlides) % numSlides);
  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % numSlides);

  // Touch handlers for mobile swipe
  const [touchEndX, setTouchEndX] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEndX > 50) handleNext();
    if (touchEndX - touchStart > 50) handlePrev();
  };

  return (
    <>
      <Head>
        <title>Rent, Services & Delivery in Parel | GharConnect</title>
        <meta name="description" content="Find rental properties, local services, and delivery options in Parel. Connect with residents, businesses, and property owners on GharConnect." />
      </Head>
      <main className="min-h-screen bg-white pt-12 md:pt-16">
        <Header isScrolled={isScrolled} />
        <div className="flex flex-col items-center mb-4 md:mb-8 mt-0 md:mt-2">
          <div className="text-sm md:text-3xl font-bold md:font-medium text-center text-indigo-700 italic bg-indigo-50 px-8 md:px-16 py-2 rounded-lg w-full max-w-1xl">
            Welcome to GharConnect @Mumbai where Property Owners, Residents and Businesses Connect
          </div>
        </div>
        
        {/* Back to All Cities Button */}
        <div className="absolute top-4 md:top-32 left-4 z-10">
          <Link 
            href="/" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Cities
          </Link>
        </div>

        {/* Popular Service Banner - Commented out for now, can be re-enabled later */}
        {/* <div className="w-full bg-gray-50 py-4 md:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 md:mb-4">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1">Most Popular Services</h2>
            </div>
            
            <div className="md:hidden">
              <div 
                className="relative overflow-hidden rounded-lg"
                onTouchStart={handlePopularServiceTouchStart}
                onTouchMove={handlePopularServiceTouchMove}
                onTouchEnd={handlePopularServiceTouchEnd}
              >
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentPopularServicesIndex * 50}%)` }}>
                  {popularServicesCards.map((card, index) => {
                    const IconComponent = typeof card.icon === 'string' ? null : card.icon;
                    return (
                      <div key={card.id} className="w-1/2 flex-shrink-0 px-2">
                        <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 h-full flex flex-col justify-between">
                          <div className="text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className={`w-6 h-6 ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                {IconComponent ? (
                                  <IconComponent className={`w-3 h-3 ${card.iconColor}`} />
                                ) : (
                                  <span className="text-xl">{card.icon as string}</span>
                                )}
                              </div>
                              <h3 className="text-xs font-bold text-gray-900 mb-1">{card.title}</h3>
                            </div>
                            <a 
                              href={card.href}
                              className={`inline-flex items-center justify-center px-2 py-1 ${card.buttonBg} ${card.buttonHover} text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm text-xs mt-auto w-full`}
                              style={{ marginTop: 'auto' }}
                            >
                              {card.buttonTextMobile}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="hidden md:flex md:overflow-x-auto md:gap-4 max-w-5xl mx-auto pb-4">
              {popularServicesCards.map((card) => {
                const IconComponent = typeof card.icon === 'string' ? null : card.icon;
                return (
                  <div key={card.id} className="bg-white rounded-xl shadow-md p-3 border border-gray-200 flex-shrink-0 w-52 h-36 flex flex-col justify-between">
                    <div>
                      <div className={`w-8 h-8 ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-1`}>
                        {IconComponent ? (
                          <IconComponent className={`w-4 h-4 ${card.iconColor}`} />
                        ) : (
                          <span className="text-2xl">{card.icon as string}</span>
                        )}
                      </div>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight text-center">{card.title}</h3>
                    </div>
                    <a 
                      href={card.href}
                      className={`inline-flex items-center justify-center px-3 py-1.5 ${card.buttonBg} ${card.buttonHover} text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm text-sm w-full`}
                    >
                      {card.buttonText}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}

        
        {/* Rental Accommodation Section - hero Section*/}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 pt-6 md:pt-12 pb-12 md:pb-20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
                Find a Home in Mumbai with No Brokerage
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Choose the type of rental accommodation you are looking for in Mumbai with no brokerage.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
              {/* Premium Apartments Card */}
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {/* Mobile: Only heading and button */}
                  <div className="md:hidden flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Premium Apartments
                    </h3>
                    <Link 
                      href="/mumbai/rent/apartment"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                    >
                      Explore
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Desktop: Full card content */}
                  <div className="hidden md:block">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <FiHome className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Premium Apartments
                      </h3>
                    </div>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      Browse and rent premium apartments in Mumbai. No brokerage, direct from owners.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Verified listings
                      </div>
                      <Link 
                        href="/mumbai/rent/apartment"
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Explore
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Premium PG Accommodation Card */}
              <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {/* Soon Label */}
                  <div className="absolute top-0 right-0 z-20">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-bl-lg text-xs font-semibold shadow-md">Soon</span>
                  </div>
                  
                  {/* Mobile: Only heading and button */}
                  <div className="md:hidden flex flex-col items-center text-center pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Premium PG Accommodation
                    </h3>
                    <button 
                      className="inline-flex items-center bg-gray-400 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg text-sm cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Desktop: Full card content */}
                  <div className="hidden md:block pt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <FiBriefcase className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Premium PG Accommodation
                      </h3>
                    </div>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">
                      Find Paying Guest (PG) accommodation options for students and working professionals.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        Coming Soon
                      </div>
                      <button 
                        className="inline-flex items-center bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg cursor-not-allowed"
                        disabled
                      >
                        Coming Soon
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}

        {/* Delivery Categories Section */}
        <div id="delivery-categories" className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-3">Delivery Vendors Rated by Community</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Order fresh essentials delivered to your door</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-6">
              <Link href="/mumbai/community/delivery/dairy" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥛</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Dairy</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/meat" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🍗</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Meat</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/eggs" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥚</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Eggs</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/flowers" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">💐</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Flowers</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/vegetables" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥦</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Vegetables</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/fruits" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🍎</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Fruits</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/dry-fruits" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">🥜</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Dry Fruits</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/delivery/pharmacy" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl lg:text-4xl">💊</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Pharmacy</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Services Categories Section */}
        <div id="services-categories" className="bg-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-3">Services Rated by Community</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Book trusted home and personal services</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-6">
              <Link href="/mumbai/community/services/laundry" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiDroplet className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Laundry</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/carpenter" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiTool className="w-7 h-7 mb-2 text-yellow-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Carpenter</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/tailor" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiEdit className="w-7 h-7 mb-2 text-pink-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Tailor</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/plumber" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiTool className="w-7 h-7 mb-2 text-blue-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Plumber</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/electrician" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiZap className="w-7 h-7 mb-2 text-yellow-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Electrician</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/domestic-help" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiUsers className="w-7 h-7 mb-2 text-green-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Domestic Help & Drivers</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/car-clean" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl text-blue-500 lg:mb-3 lg:text-4xl">🚗</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Car Clean</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/painter" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiEdit className="w-7 h-7 mb-2 text-pink-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Painter</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/gardener" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiHome className="w-7 h-7 mb-2 text-green-600 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Gardener</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/ac-service" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiZap className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">AC Service</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/pest-control" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiShield className="w-7 h-7 mb-2 text-red-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Pest Control</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/laptop-repair" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiTool className="w-7 h-7 mb-2 text-red-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Laptop Repair</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/electronics-repair" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiTool className="w-7 h-7 mb-2 text-red-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Electronics Repair</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/scrap-dealer" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <span className="mb-2 text-2xl text-orange-500 lg:mb-3 lg:text-4xl">♻️</span>
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Scrap Dealer</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/notary" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiFileText className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Notary</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/piegon-net" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiGrid className="w-7 h-7 mb-2 text-green-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Pigeon Net</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/movers-packers" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiTruck className="w-7 h-7 mb-2 text-blue-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Movers & Packers</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/physical-training" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiTrendingUp className="w-7 h-7 mb-2 text-indigo-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Physical Training</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/yoga" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiAward className="w-7 h-7 mb-2 text-green-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Yoga</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/massage" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiHeart className="w-7 h-7 mb-2 text-pink-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Massage</h3>
                </div>
              </Link>
              <Link href="/mumbai/community/services/kids-classes" className="block group">
                <div className="bg-white rounded-2xl shadow-lg p-2 lg:p-4 flex flex-col items-center transition hover:shadow-xl">
                  <FiBookOpen className="w-7 h-7 mb-2 text-orange-500 lg:w-12 lg:h-12 lg:mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0 lg:text-base">Kids Classes</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Advertisement Section */}
        <div className="bg-white py-3 md:py-4 mb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-xl border border-green-100">
              {/* E-Waste Drive Banner */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  currentAdCarouselIndex === 0 ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 md:p-4">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    {/* Left Side - E-Waste Drive Details */}
                    <div className="flex-1 flex items-center space-x-4 mt-8 md:mt-0">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">♻️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">E-Waste Collection Drive by GharConnect</h3>
                        <p className="text-gray-600 text-sm md:text-base">In Partnership with The Recycling Company</p>
                        <p className="text-gray-600 text-sm md:text-base mt-1">
                          <span className="font-semibold text-green-700">Reach out to us and we can set up collection boxes in your society!</span>
                        </p>
                        <div className="mt-3">
                          <a 
                            href="https://wa.me/919321314553?text=Hi! I'm interested in setting up e-waste collection boxes in our society. Can you help us with the details?"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm shadow-md"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            WhatsApp Us
                          </a>
                        </div>
                        <div className="sr-only">
                          <p>
                            <a href="/mumbai/community" className="underline hover:text-blue-700">E-waste collection in Parel</a> |
                            <a href="/mumbai/community" className="underline hover:text-blue-700">Electronic waste disposal Mumbai</a> |
                            <a href="/mumbai/community" className="underline hover:text-blue-700">The Recycling Company</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Logos and Photo Carousel */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Logos */}
                      <div className="flex items-center gap-4">
                        <img src="/GC_Logo.png" alt="GharConnect Logo" className="h-8 md:h-10 object-contain" />
                        <img src="Ads/therecyclingcompany.png" alt="The Recycling Company Logo" className="h-8 md:h-10 object-contain" />
                      </div>
                      
                      {/* Photo Carousel */}
                      <div className="relative w-60 h-36 md:w-96 md:h-56 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src="/Ads/eWaste_Collection.png" 
                          alt="E-Waste Collection Drive" 
                          className="w-full h-full object-contain"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Used Cooking Oil Drive Banner */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  currentAdCarouselIndex === 1 ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 md:p-4">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    {/* Left Side - Used Cooking Oil Drive Details */}
                    <div className="flex-1 flex items-center space-x-4 mt-8 md:mt-0">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">🛢️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">Used Cooking Oil Collection Drive by GharConnect</h3>
                        <p className="text-gray-600 text-sm md:text-base">In Partnership with ECOIL</p>
                        <p className="text-gray-600 text-sm md:text-base mt-1">
                          <span className="font-semibold text-orange-700">Don't pour used cooking oil down the drain! We collect it for recycling.</span>
                        </p>
                        <div className="mt-3">
                          <a 
                            href="https://wa.me/919321314553?text=Hi! I'm interested in the used cooking oil collection drive. Can you help us set up collection points in our society?"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm shadow-md"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            WhatsApp Us
                          </a>
                        </div>
                        <div className="sr-only">
                          <p>
                            <a href="/mumbai/community" className="underline hover:text-blue-700">Used cooking oil collection in Parel</a> |
                            <a href="/mumbai/community" className="underline hover:text-blue-700">Cooking oil disposal Mumbai</a> |
                            <a href="/mumbai/community" className="underline hover:text-blue-700">ECOIL</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Logos and Photo */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Logos */}
                      <div className="flex items-center gap-4">
                        <img src="/GC_Logo.png" alt="GharConnect Logo" className="h-8 md:h-10 object-contain" />
                        <img src="Ads/ECOIL_Logo.png" alt="ECOIL Logo" className="h-8 md:h-10 object-contain" />
                      </div>
                      
                      {/* Photo */}
                      <div className="relative w-60 h-36 md:w-96 md:h-56 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src="/Ads/UCO_Warning.png" 
                          alt="Used Cooking Oil Collection Drive" 
                          className="w-full h-full object-contain"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdCarouselIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 shadow-md ${
                      currentAdCarouselIndex === index 
                        ? 'bg-white border-2 border-gray-700' 
                        : 'bg-white/80 border-2 border-gray-300 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

                {/* Property Management Services Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white overflow-hidden my-0 pt-1 md:pt-2">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-transparent to-indigo-600/50"></div>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="py-6 flex flex-col items-center justify-center gap-4 relative">
              {/* Content */}
              <div className="flex-1 text-center w-full">
                {carouselIndex === 0 ? (
                  <>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 break-words w-full max-w-full">
                      Marketplace
                    </h3>
                    <p className="text-base text-white/90 mb-3 max-w-full mx-auto px-2 sm:px-0 break-words">
                      Discover items for sale from your community. Buy or list your own items for neighbors to see.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 break-words w-full max-w-full">
                      Social
                    </h3>
                    <p className="text-base text-white/90 mb-3 max-w-full mx-auto px-2 sm:px-0 break-words">
                      Join the conversation! Ask questions, share updates, post about civic issues and more.
                    </p>
                  </>
                )}
                <div className="w-full max-w-xl md:max-w-4xl mx-auto my-4 overflow-x-hidden">
                  <div
                    className="relative overflow-hidden rounded-lg w-full max-w-full"
                    ref={carouselRef}
                    onTouchStart={e => { if (!isMobile) handleTouchStart(e); }}
                    onTouchMove={e => { if (!isMobile) handleTouchMove(e); }}
                    onTouchEnd={() => { if (!isMobile) handleTouchEnd(); }}
                  >
                    <div
                      className="flex transition-transform duration-500 w-full max-w-full"
                      style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                    >
                      {/* Marketplace Slide */}
                      <div className="min-w-full w-full max-w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-3 flex flex-col items-center text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-md">
                          <span className="text-lg">🛍️</span>
                        </div>
                        {/* <h4 className="text-sm font-bold text-gray-900 mb-1 leading-none">Marketplace</h4> */}
                        <div className="w-full overflow-x-auto">
                          <div className="flex flex-row gap-2 w-full justify-center flex-nowrap">
                            {marketplaceProducts.length === 0 ? (
                              <div className="flex-1 text-center text-gray-500 py-3">No products listed yet.</div>
                            ) : (
                              (isMobile ? marketplaceProducts.slice(0, 2) : marketplaceProducts).map((product) => (
                                <div key={product.id} className="bg-white rounded-md shadow p-1 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all min-w-[110px] md:min-w-[160px] max-w-[140px] md:max-w-[200px] w-full">
                                  <div className="w-full h-14 md:h-20 flex items-center justify-center mb-1 overflow-hidden rounded">
                                    {product.images && product.images.length > 0 ? (
                                      <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="object-cover w-full h-full"
                                        onError={e => (e.currentTarget.src = '/placeholder-image.svg')}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 text-xs">No Image</div>
                                    )}
                                  </div>
                                  <div className="font-semibold text-[11px] md:text-sm text-gray-900 line-clamp-2 mb-0.5">{product.title}</div>
                                  <div className="text-[9px] md:text-xs text-gray-500 mb-0.5">{product.condition}</div>
                                  <div className="text-xs md:text-sm font-bold text-green-600 mb-0.5">₹{product.price.toLocaleString('en-IN')}</div>
                                  {product.building_name && (
                                    <div className="text-[8px] md:text-xs text-gray-400 mb-0.5 truncate">{product.building_name}</div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-end gap-2 md:gap-3 mt-2 w-full grow">
                          <a 
                            href="/mumbai/community/marketplace" 
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                            style={{ minHeight: '24px' }}
                          >
                            <span>Browse</span>
                            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      {/* Connect Slide */}
                      <div className="min-w-full w-full max-w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-3 flex flex-col items-center text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-md">
                          <span className="text-lg">💬</span>
                        </div>
                        {/* <h4 className="text-sm font-bold text-gray-900 mb-1 leading-none">Connect</h4> */}
                        <div className="w-full overflow-x-auto">
                          <div className="flex flex-row gap-2 w-full justify-center flex-nowrap">
                            {connectPosts.length === 0 ? (
                              <div className="flex-1 text-center text-gray-500 py-3">No posts yet.</div>
                            ) : (
                              (isMobile ? connectPosts.slice(0, 2) : connectPosts).map((post) => (
                                <div key={post.id} className="p-1 bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-0 w-full min-w-[140px] md:min-w-[180px] max-w-[180px] md:max-w-[220px] flex-shrink-0 flex flex-col items-start">
                                  <div className="flex items-center justify-between mb-0.5 w-full">
                                    <span className="text-xs md:text-sm font-bold text-gray-800 bg-indigo-100 px-1 py-0.5 rounded-full truncate max-w-[70%]">{post.title}</span>
                                    <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full">{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  </div>
                                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-4 w-full">{post.body}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-end gap-2 md:gap-3 mt-1 w-full grow">
                          <a 
                            href="/mumbai/community/connect" 
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                            style={{ minHeight: '24px' }}
                          >
                            <span>Join</span>
                            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* Carousel Arrows (mobile only) */}
                    <button
                      className="block md:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow hover:bg-opacity-100 transition z-30 pointer-events-auto"
                      onClick={handlePrev}
                      aria-label="Previous"
                      style={{ left: 4 }}
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                      className="block md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-3 shadow hover:bg-opacity-100 transition z-30 pointer-events-auto"
                      onClick={handleNext}
                      aria-label="Next"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {/* Carousel Arrows (desktop only) */}
                    <button
                      className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition z-10"
                      onClick={handlePrev}
                      aria-label="Previous"
                      style={{ left: 4 }}
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                      className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition z-10"
                      onClick={handleNext}
                      aria-label="Next"
                      style={{ right: 4 }}
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Numbers Since Launch Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Numbers Since Launch in Mar 2025</h2>
            <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-8 md:gap-0 md:divide-x md:divide-gray-200">
              <div className="flex flex-col items-center px-8 md:px-12">
                <span className="text-blue-700 text-4xl font-bold mb-1">50+</span>
                <span className="text-gray-800 text-base text-center">
                  <span className="block md:hidden">Apartments<br/>Rented</span>
                  <span className="hidden md:block">Apartments Rented</span>
                </span>
              </div>
              <div className="flex flex-col items-center px-8 md:px-12">
                <span className="text-blue-700 text-4xl font-bold mb-1">500+</span>
                <span className="text-gray-800 text-base text-center">
                  <span className="block md:hidden">Service<br/>Providers</span>
                  <span className="hidden md:block">Service and Delivery<br/>Providers Listed</span>
                </span>
              </div>
              <div className="flex flex-col items-center px-8 md:px-12">
                <span className="text-blue-700 text-4xl font-bold mb-1">3</span>
                <span className="text-gray-800 text-base text-center">
                  <span className="block md:hidden">Mumbai Areas<br/>Covered</span>
                  <span className="hidden md:block">Mumbai Areas<br/>Covered</span>
                </span>
              </div>
              <div className="flex flex-col items-center px-8 md:px-12">
                <span className="text-blue-700 text-4xl font-bold mb-1">200+</span>
                <span className="text-gray-800 text-base text-center">
                  <span className="block md:hidden">Marketplace<br/>Items Sold</span>
                  <span className="hidden md:block">Marketplace<br/>Items Sold</span>
                </span>
              </div>
              <div className="flex flex-col items-center px-8 md:px-12">
                <span className="text-blue-700 text-4xl font-bold mb-1">50+</span>
                <span className="text-gray-800 text-base text-center">
                  <span className="block md:hidden">GharCare+<br/>Subscribers</span>
                  <span className="hidden md:block">GharCare+<br/>Subscribers</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Domestic Help Container */}
        <div className="bg-indigo-600 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Looking for Domestic Help & Drivers?</h2>
            <p className="text-indigo-100 mb-6">
              The domestic help and drivers put in their availability for the next 10 days 
              and you can book them for a few hours or for a few days to meet your emergency needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/mumbai/community/services/domestic-help"
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


        {/* Travel Diaries Container */}
        {/* <TravelDiariesContainer /> */}

        {/* Testimonial Carousel */}
        <TestimonialCarousel />
      </main>
    </>
  )
}

