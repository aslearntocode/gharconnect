import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import SEOScript from '@/components/SEOScript';
import PWAInstaller from '@/components/PWAInstaller';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'GharConnect - Find Apartments & Local Services | Connect with Your Neighbors',
  description: 'Find brokerage free apartments for rent, connect with your neighbors and discover local services and marketplace in your community.',
  keywords: 'rental apartments, no brokerage, community platform, local services, society management, Mumbai rentals, Bangalore rentals, Pune rentals, domestic help, driver services, marketplace, neighborhood connect',
  openGraph: {
    title: 'GharConnect - Find Apartments & Local Services | Connect with Your Neighbors',
    description: 'Find brokerage free apartments for rent, connect with your neighbors and discover local services and marketplace in your community.',
    type: 'website',
    url: 'https://gharconnect.in',
    siteName: 'GharConnect',
    locale: 'en_IN',
    images: [
      {
        url: 'https://gharconnect.in/GC_Logo.png',
        width: 1024,
        height: 1024,
        alt: 'GharConnect - Community Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GharConnect - Find Apartments & Local Services | Connect with Your Neighbors',
    description: 'Find brokerage free apartments for rent, connect with your neighbors and discover local services and marketplace in your community.',
    images: ['https://gharconnect.in/GC_Logo.png'],
    creator: '@gharconnect',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'GharConnect',
    startupImage: [
      {
        url: '/GC_Logo.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/GC_Logo.png',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/GC_Logo.png',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  icons: {
    apple: '/GC_Logo.png',
    icon: '/GC_Logo.png',
    shortcut: '/GC_Logo.png',
  },
  alternates: {
    canonical: 'https://gharconnect.in',
  },
  other: {
    'og:image:secure_url': 'https://gharconnect.in/GC_Logo.png',
    'og:image:type': 'image/png',
    'og:image:width': '1024',
    'og:image:height': '1024',
    'og:image:alt': 'GharConnect - Community Platform',
    'theme-color': '#4F46E5',
    'og:image:url': 'https://gharconnect.in/GC_Logo.png',
    'twitter:image:src': 'https://gharconnect.in/GC_Logo.png',
    'og:image:size': '632893',
    'og:image:updated_time': '2025-01-07T00:00:00.000Z',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Viewport meta tag for mobile Safari */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        
        {/* SEO Component for canonical URLs and meta tags */}
        <SEOScript canonicalUrl="https://gharconnect.in" />
        
        {/* WhatsApp and Social Media Meta Tags */}
        <meta property="og:site_name" content="GharConnect" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GharConnect - Find Apartments & Local Services | Connect with Your Neighbors" />
        <meta property="og:description" content="Find brokerage free apartments for rent, connect with your neighbors and discover local services and marketplace in your community." />
        <meta property="og:image" content="https://gharconnect.in/GC_Logo.png" />
        <meta property="og:url" content="https://gharconnect.in" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GharConnect - Find Apartments & Local Services | Connect with Your Neighbors" />
        <meta name="twitter:description" content="Find brokerage free apartments for rent, connect with your neighbors and discover local services and marketplace in your community." />
        <meta name="twitter:image" content="https://gharconnect.in/GC_Logo.png" />
        
        {/* WhatsApp Business API Meta Tags */}
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:alt" content="GharConnect - Community Platform" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="GharConnect" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "GharConnect",
              "description": "Community platform for no brokerage rentals and local services",
              "url": "https://gharconnect.in",
              "logo": "https://gharconnect.in/GC_Logo.png",
              "image": "https://gharconnect.in/GC_Logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "19.0760",
                "longitude": "72.8777"
              },
              "telephone": "+91-9321314553",
              "email": "contact@gharconnect.in",
              "sameAs": [
                "https://www.facebook.com/gharconnect",
                "https://www.instagram.com/gharconnect",
                "https://www.linkedin.com/company/gharconnect"
              ],
              "openingHours": "Mo-Su 09:00-18:00",
              "priceRange": "₹₹",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "19.0760",
                  "longitude": "72.8777"
                },
                "geoRadius": "50000"
              }
            })
          }}
        />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="GharConnect" />
        <link rel="apple-touch-icon" href="/GC_Logo.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/GC_Logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/GC_Logo.png" />
        <link rel="shortcut icon" href="/GC_Logo.png" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="preconnect" href="https://vercel.com" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//supabase.co" />
        <link rel="dns-prefetch" href="//vercel.com" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <Toaster />
        <PWAInstaller />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        
        {/* Hotjar */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:0000000,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
        
        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '000000000000000');
            fbq('track', 'PageView');
          `}
        </Script>

      </body>
    </html>
  )
} 