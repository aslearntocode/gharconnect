'use client'

import Link from "next/link"
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  
  // Function to determine the current city from pathname
  const getCurrentCity = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    
    // Handle different URL patterns
    if (pathname === '/') {
      return 'mumbai'; // Default for main page
    }
    
    // For society pages like /mumbai/community, /bangalore/community, /pune/community
    if (pathSegments.length >= 1) {
      return pathSegments[0]; // First segment is the city
    }
    
    return 'mumbai'; // Default fallback
  };

  const currentCity = getCurrentCity();

  // Function to determine the correct blog URL based on current pathname
  const getBlogUrl = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    
    // Handle different URL patterns
    if (pathname === '/') {
      return '/mumbai/community/blog'; // Default for main page
    }
    
    // For society pages like /mumbai/community, /worli
    if (pathSegments.length === 1) {
      return `/${pathSegments[0]}/blog`;
    }
    
    // For rental pages like /mumbai/rent, /bangalore/rent
    if (pathSegments.length === 2 && pathSegments[1] === 'rent') {
      return `/${pathSegments[0]}/rent/blog`;
    }
    
    // For specific rental pages like /mumbai/rent/apartment, /bangalore/rent/pg
    if (pathSegments.length === 3 && pathSegments[1] === 'rent') {
      return `/${pathSegments[0]}/rent/blog`;
    }
    
    // For service pages like /mumbai/services
    if (pathSegments.length === 2 && pathSegments[1] === 'services') {
      return `/${pathSegments[0]}/blog`;
    }
    
    // Default fallback - use first segment
    return `/${pathSegments[0]}/blog`;
  };

  const blogUrl = getBlogUrl();

  return (
    <footer className="bg-blue-50 text-gray-700 relative z-10 pb-16 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              {/* <li>
                <Link href="/about" className="hover:text-white/90">About Us</Link>
              </li> */}
              <li>
                <Link href={`/${currentCity}/community/careers`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">Careers</Link>
              </li>
              <li>
                <Link href={`/${currentCity}/community/faq`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href={isMainPage ? "/terms" : `/${currentCity}/community/terms`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href={isMainPage ? "/privacy" : `/${currentCity}/community/privacy`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">Privacy Policy</Link>
              </li>
              {!isMainPage && (
                <li>
                  <Link href={`/${currentCity}/community/blog`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">Blogs</Link>
                </li>
              )}
              {!isMainPage && (
                <li>
                  <Link href={`/${currentCity}/community/rental-procedure`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">Rental Procedure</Link>
                </li>
              )}
              {!isMainPage && (
                <li>
                  <Link href={`/vendor`} className="text-sm md:text-base hover:text-indigo-600 transition-colors">Domestic Help & Driver Login</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Offerings */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Cities Covered</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mumbai/community" className="text-sm md:text-base hover:text-indigo-600 transition-colors">Mumbai</Link>
              </li>
              <li>
                <Link href="/bangalore/community" className="text-sm md:text-base hover:text-indigo-600 transition-colors">Bangalore</Link>
              </li>
              <li>
                <Link href="/pune/community" className="text-sm md:text-base hover:text-indigo-600 transition-colors">Pune</Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Social Media</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.youtube.com/channel/UC9hCxKVxX0BZXxZZNiRf4TQ" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm md:text-base hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/people/GharConnect/61578303651911/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm md:text-base hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Facebook
                </a>
              </li> 
              <li>
                <a 
                  href="https://www.instagram.com/gharconnect2025/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm md:text-base hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://chat.whatsapp.com/HmE9hSwqwy2CpbTM1JtRJ9" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm md:text-base hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Join Zero Brokerage Rental WhatsApp Group
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:gharconnectindia@gmail.com" className="text-sm md:text-base hover:text-indigo-600 transition-colors break-words">
                  gharconnectindia@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919321314553" className="text-sm md:text-base hover:text-indigo-600 transition-colors">
                  +91 93213 14553
                </a>
              </li>
              <li>
                <address className="not-italic text-gray-600 text-sm md:text-base">
                  Jerbai Wadia Road, Mumbai 400012<br />
                  India
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-100 mt-12 pt-8 text-center">
          <p className="text-gray-600 text-sm md:text-base">&copy; {new Date().getFullYear()} FHAI Services Pvt Ltd | All rights reserved.</p>
          <p className="text-gray-500 mt-2 text-sm md:text-base flex items-center justify-center gap-1">
            Made in India With Love
            <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </p>
        </div>
      </div>
    </footer>
  )
} 