'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"
import Header from "@/components/Header"
import { getSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { FiDroplet, FiTrendingUp, FiHome, FiTruck, FiBookOpen, FiAward, FiTool, FiZap, FiEdit, FiShield, FiFileText, FiGrid, FiUsers, FiScissors, FiDollarSign } from 'react-icons/fi'
import DoctorsContainer from "@/components/DoctorsContainer"
import TravelDiariesContainer from "@/components/TravelDiariesContainer"
import Head from 'next/head'
import VideoEmbed from '@/components/VideoEmbed'
import Poll from '@/components/Poll'

interface MarketplaceProduct {
  id: string;
  title: string;
  price: number;
  condition: string;
  images: string[];
  created_at: string;
  building_name?: string;
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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [currentAdCarouselIndex, setCurrentAdCarouselIndex] = useState(0);
  const [currentPopularServicesIndex, setCurrentPopularServicesIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
  const [connectPosts, setConnectPosts] = useState<ConnectPost[]>([]);

  const testimonials = [
    {
      initial: 'R',
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      color: 'bg-blue-600',
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
      description: 'Find your rental apartment',
      icon: FiHome,
      href: '/worli/rent/',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'list-property',
      title: 'Landlord',
      description: 'List Your Property for Rent',
      icon: FiHome,
      href: '/worli/rent-apartment',
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
      href: '/worli/marketplace',
      gradient: 'from-pink-500 to-yellow-500'
    },
    {
      id: 'connect',
      title: 'Connect',
      description: 'Community Q&A & discussions',
      icon: FiUsers,
      href: '/worli/connect',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

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
      href: '/worli/services/domestic-help',
      buttonText: 'Find Domestic Help or Driver',
      buttonTextMobile: 'Find Help'
    },
    {
      id: 'rental',
      title: 'Find Rental Property',
      icon: FiHome,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      href: '/worli/rent/',
      buttonText: 'Browse Properties',
      buttonTextMobile: 'Browse'
    },
    {
      id: 'physical-training',
      title: 'Physical Training',
      icon: FiTrendingUp,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700',
      href: '/worli/services/physical-training',
      buttonText: 'Find Trainers',
      buttonTextMobile: 'Trainers'
    },
    {
      id: 'neighbor-services',
      title: 'Neighbor Service Providers',
      icon: FiUsers,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      buttonBg: 'bg-indigo-600',
      buttonHover: 'hover:bg-indigo-700',
      href: '/worli/home-service-provider',
      buttonText: 'View Neighbors',
      buttonTextMobile: 'View'
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

  useEffect(() => {
    // Fetch latest 4 marketplace products (all areas)
    const fetchMarketplaceProducts = async () => {
      const { getSupabaseClient } = await import("@/lib/supabase");
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("marketplace_products")
        .select("id,title,price,condition,images,created_at,building_name")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (!error && data) setMarketplaceProducts(data);
    };
    fetchMarketplaceProducts();
  }, []);

  useEffect(() => {
    // Fetch latest 3 connect posts for Worli
    const fetchConnectPosts = async () => {
      const { getSupabaseClient } = await import("@/lib/supabase");
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id,title,body,created_at")
        .eq("area", "Worli")
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
  const handleCarouselTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleCarouselTouchMove = (e: React.TouchEvent) => setTouchEndX(e.touches[0].clientX);
  const handleCarouselTouchEnd = () => {
    if (touchStart - touchEndX > 50) handleNext();
    if (touchEndX - touchStart > 50) handlePrev();
  };

  return (
    <>
      <Head>
        <title>Rent, Services & Delivery in Worli | GharConnect</title>
        <meta name="description" content="Find rental properties, local services, and delivery options in Worli. Connect with residents, businesses, and property owners on GharConnect." />
      </Head>
      <main className="min-h-screen bg-white">
        <Header />
        
        {/* Popular Service Banner */}
        <div className="w-full bg-gray-50 py-4 md:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 md:mb-4">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1">Most Popular Services</h2>
            </div>
            
            {/* Mobile Carousel */}
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
                        <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 h-full flex flex-col">
                          <div className="text-center flex-1 flex flex-col justify-between">
                            <div>
                              <div className={`w-8 h-8 ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                {IconComponent ? (
                                  <IconComponent className={`w-4 h-4 ${card.iconColor}`} />
                                ) : (
                                  <span className="text-2xl">{card.icon as string}</span>
                                )}
                              </div>
                              <h3 className="text-xs font-bold text-gray-900 mb-1">{card.title}</h3>
                            </div>
                            <a 
                              href={card.href}
                              className={`inline-flex items-center justify-center px-2 py-1 ${card.buttonBg} ${card.buttonHover} text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm text-xs mt-auto w-full`}
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

            {/* Desktop Grid */}
            <div className="hidden md:flex md:overflow-x-auto md:gap-4 max-w-5xl mx-auto pb-4">
              {popularServicesCards.map((card) => {
                const IconComponent = typeof card.icon === 'string' ? null : card.icon;
                return (
                  <div key={card.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200 flex-shrink-0 w-64">
                    <div className="text-center">
                      <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        {IconComponent ? (
                          <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                        ) : (
                          <span className="text-3xl">{card.icon as string}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{card.title}</h3>
                      <a 
                        href={card.href}
                        className={`inline-flex items-center px-3 py-1.5 ${card.buttonBg} ${card.buttonHover} text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm text-sm`}
                      >
                        {card.buttonText}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Info Cards */}
        <div className="fixed right-4 top-52 md:top-44 z-50 flex flex-col gap-4">
        </div>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-4">
            <div className="flex flex-col items-center mb-8">
              <div className="text-sm md:text-3xl font-bold md:font-medium text-center text-indigo-700 italic bg-indigo-50 px-8 md:px-16 py-2 rounded-lg w-full max-w-1xl">
              Connecting Residents, Businesses, and Property Owners Within a Location            </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <h1 className="text-[24px] md:text-[48px] leading-tight font-bold mb-6 text-center md:text-left flex flex-wrap items-center gap-2 justify-center md:justify-start">
                  <span className="text-black">Welcome to GharConnect </span>
                  <span className="text-indigo-600">@Worli</span>
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
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 p-3 md:p-4 flex items-center gap-x-2 md:gap-x-3 group hover:bg-gray-50 cursor-pointer h-full">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
              <div className="sr-only">
                <p>
                  <a href="/worli" className="underline hover:text-blue-700">Montessori schools in South Bombay</a> |
                  <a href="/worli" className="underline hover:text-blue-700">Montessori school in Sion</a> |
                  <a href="/worli" className="underline hover:text-blue-700">Best Montessori schools</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Video Section */}
        <div className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Spotlight</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch this video to learn how to register as a domestic help or driver
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Featured Video */}
              <div className="max-w-4xl mx-auto">
                <VideoEmbed
                  videoId="Yj-uofiMN7Q" // Your specific YouTube video
                  title="Domestic Help & Drivers"
                  className="w-full h-64 md:h-80"
                />
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
                      Discover items for sale from your community. Browse, buy, or list your own items for neighbors to see.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 break-words w-full max-w-full">
                      Connect
                    </h3>
                    <p className="text-base text-white/90 mb-3 max-w-full mx-auto px-2 sm:px-0 break-words">
                      Join the conversation! Ask questions, share updates, and connect with your neighbors in Worli.
                    </p>
                  </>
                )}
                <div className="w-full max-w-xl mx-auto my-4 overflow-x-hidden">
                  <div
                    className="relative overflow-hidden rounded-lg w-full max-w-full"
                    ref={carouselRef}
                    onTouchStart={e => { if (!isMobile) handleCarouselTouchStart(e); }}
                    onTouchMove={e => { if (!isMobile) handleCarouselTouchMove(e); }}
                    onTouchEnd={() => { if (!isMobile) handleCarouselTouchEnd(); }}
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
                        <h4 className="text-sm font-bold text-gray-900 mb-1 leading-none">Marketplace</h4>
                        <div className="w-full overflow-x-auto">
                          <div className="flex flex-row gap-2 w-full justify-center md:justify-start flex-nowrap">
                            {marketplaceProducts.length === 0 ? (
                              <div className="flex-1 text-center text-gray-500 py-3">No products listed yet.</div>
                            ) : (
                              (isMobile ? marketplaceProducts.slice(0, 2) : marketplaceProducts).map((product) => (
                                <div key={product.id} className="bg-white rounded-md shadow p-1 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all min-w-[110px] max-w-[140px] w-full">
                                  <div className="w-full h-14 flex items-center justify-center mb-1 overflow-hidden rounded">
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
                                  <div className="font-semibold text-[11px] text-gray-900 line-clamp-2 mb-0.5">{product.title}</div>
                                  <div className="text-[9px] text-gray-500 mb-0.5">{product.condition}</div>
                                  <div className="text-xs font-bold text-green-600 mb-0.5">₹{product.price.toLocaleString('en-IN')}</div>
                                  {product.building_name && (
                                    <div className="text-[8px] text-gray-400 mb-0.5 truncate">{product.building_name}</div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-end gap-2 md:gap-3 mt-2 w-full grow">
                          <a 
                            href="/worli/marketplace" 
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
                        <h4 className="text-sm font-bold text-gray-900 mb-1 leading-none">Connect</h4>
                        <div className="w-full overflow-x-auto">
                          <div className="flex flex-row gap-2 w-full justify-center md:justify-start flex-nowrap">
                            {connectPosts.length === 0 ? (
                              <div className="flex-1 text-center text-gray-500 py-3">No posts yet.</div>
                            ) : (
                              (isMobile ? connectPosts.slice(0, 2) : connectPosts).map((post) => (
                                <div key={post.id} className="p-1 bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-0 w-full min-w-[140px] max-w-[180px] flex-shrink-0 flex flex-col items-start">
                                  <div className="flex items-center justify-between mb-0.5 w-full">
                                    <span className="text-xs font-bold text-gray-800 bg-blue-100 px-1 py-0.5 rounded-full truncate max-w-[70%]">{post.title}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full">{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 w-full">{post.body}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-end gap-2 md:gap-3 mt-1 w-full grow">
                          <a 
                            href="/worli/connect" 
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

         {/* Delivery Categories Section */}
         <div id="delivery-categories" className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2 md:mb-3">Delivery Categories</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Order fresh essentials delivered to your door</p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Link href="/worli/delivery/dairy" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🥛</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Dairy</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Fresh milk, cheese, paneer, butter, and more</p>
                </div>
              </Link>
              <Link href="/worli/delivery/meat" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🍗</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Meat</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Quality meat and poultry, hygienically packed</p>
                </div>
              </Link>
              <Link href="/worli/delivery/vegetables" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🥦</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Vegetables</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Farm-fresh vegetables delivered daily/weekly</p>
                </div>
              </Link>
              <Link href="/worli/delivery/fruits" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🍎</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Fruits</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Seasonal and exotic fruits, handpicked for you</p>
                </div>
              </Link>
              <Link href="/worli/delivery/dry-fruits" className="block group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-2 md:mb-3">🥜</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Dry Fruits</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Premium quality dry fruits and nuts</p>
                </div>
              </Link>
              <Link href="/worli/delivery/pharmacy" className="block group">
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
                The domestic help puts in their availability for the next 10 days 
                and you can book them for a few hours or for a few days to meet your emergency needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/worli/services/domestic-help"
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
              <Link href="/worli/services/laundry" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiDroplet className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Laundry</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Professional laundry and dry cleaning</p>
                </div>
              </Link>
              <Link href="/worli/services/carpenter" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-yellow-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Carpenter</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Woodwork, repairs, and furniture</p>
                </div>
              </Link>
              <Link href="/worli/services/tailor" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiScissors className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-purple-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Tailor</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Clothing alterations & stitching</p>
                </div>
              </Link>
              <Link href="/worli/services/plumber" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Plumber</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Leak repairs, fittings, and more</p>
                </div>
              </Link>
              <Link href="/worli/services/electrician" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiZap className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-yellow-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Electrician</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Wiring, repairs, and installations</p>
                </div>
              </Link>
              <Link href="/worli/services/domestic-help" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center md:items-center md:justify-start">
                  <FiUsers className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Domestic Help & Drivers</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Helpers for urgent needs</p>
                </div>
              </Link>
              <Link href="/worli/services/car-clean" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiEdit className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-pink-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Car Clean</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Daily Car Cleaning</p>
                </div>
              </Link>
              <Link href="/worli/services/painter" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiEdit className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-pink-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Painter</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Wall painting and touch-ups</p>
                </div>
              </Link>
              <Link href="/worli/services/gardener" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiHome className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Gardener</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Garden care and landscaping</p>
                </div>
              </Link>
              <Link href="/worli/services/ac-service" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiZap className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">AC Service</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">AC repair and maintenance</p>
                </div>
              </Link>
              <Link href="/worli/services/pest-control" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiShield className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-red-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Pest Control</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Termite and pest removal</p>
                </div>
              </Link>
              <Link href="/worli/services/laptop-repair" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-red-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Laptop Repair</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Laptop repair & maintenance</p>
                </div>
              </Link>
              <Link href="/worli/services/electronics-repair" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTool className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-red-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Electronics Repair</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Electronics repair & maintenance</p>
                </div>
              </Link>
              <Link href="/worli/services/scrap-dealer" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <span className="text-3xl md:text-4xl mb-2 md:mb-3 text-orange-500">♻️</span>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Scrap Dealer</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Recycling and scrap collection</p>
                </div>
              </Link>
              <Link href="/worli/services/notary" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiFileText className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Notary</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Legal document notarization</p>
                </div>
              </Link>
              <Link href="/worli/services/piegon-net" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiGrid className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Pigeon Net</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Pigeon net installation</p>
                </div>
              </Link>
              <Link href="/worli/services/movers-packers" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTruck className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-blue-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Movers & Packers</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Movers & Packers</p>
                </div>
              </Link>
              <Link href="/worli/services/physical-training" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiTrendingUp className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-indigo-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Physical Training</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Personal and group training</p>
                </div>
              </Link>
              <Link href="/worli/services/yoga" className="block group">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center">
                  <FiAward className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 text-green-500" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Yoga</h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">Yoga classes and workshops</p>
                </div>
              </Link>
              <Link href="/worli/services/kids-classes" className="block group">
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
              <a href="/worli/rent-apartment" className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-base shadow-lg">
                List Your Property
              </a>
            </div>
          </div>
        </div>
        {/* Home Service Providers Indigo Container */}
        <div className="bg-indigo-600 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Neighbors Providing Services</h2>
            <p className="text-indigo-100 mb-6">Discover trusted, community-rated home service professionals for all your needs - artists, musicians, lawyers, consultants and more. Let Your Neighbors Know You!</p>
            <a href="/worli/home-service-provider" className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-indigo-50 transition-colors text-lg">
              View All Home Service Providers
            </a>
          </div>
        </div>
        {/* Travel Diaries Container */}
        {/* <TravelDiariesContainer /> */}
        
        {/* Metrics Section - Numbers Since Launch */}
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
        {/* GharCare+ Subscription Section */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 py-10 px-4 md:px-0">
          <div className="max-w-4xl mx-auto rounded-2xl shadow-lg bg-white/80 p-8 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2 text-center">GharCare+ Subscription</h2>
            <p className="text-gray-700 text-center mb-6 max-w-2xl">Subscribe to <span className="font-semibold text-indigo-700">GharCare+</span> and get annual coverage for <span className="font-semibold">Pest Control</span>, <span className="font-semibold">AC Servicing</span>, and <span className="font-semibold">Water Purifier Servicing</span> at a special price. Hassle-free, reliable, and trusted by your community.</p>
            <div className="flex flex-row gap-6 mb-6 w-full justify-center">
              <div className="flex flex-col items-center flex-1">
                <span className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-2"><FiShield className="w-7 h-7" /></span>
                <span className="font-semibold text-gray-900 text-center">Pest<br/>Control</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="bg-blue-100 text-blue-600 rounded-full p-4 mb-2"><FiZap className="w-7 h-7" /></span>
                <span className="font-semibold text-gray-900 text-center">AC<br/>Servicing</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="bg-green-100 text-green-600 rounded-full p-4 mb-2"><FiDroplet className="w-7 h-7" /></span>
                <span className="font-semibold text-gray-900 text-center">Water Purifier<br/>Servicing</span>
              </div>
            </div>
            <a href="https://wa.me/919321314553?text=I%20want%20to%20subscribe%20to%20GharCare%2B" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-lg mt-2">Subscribe Now</a>
          </div>
        </div>
      </main>
    </>
  )
}
