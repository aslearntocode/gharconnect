import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import SEOScript from '@/components/SEOScript';
import PWAInstaller from '@/components/PWAInstaller';

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
        <meta property="og:image" content="https://gharconnect.in/GC_Logo.png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="GharConnect - Community Platform" />
        <meta name="twitter:image" content="https://gharconnect.in/GC_Logo.png" />
        <meta name="twitter:image:alt" content="GharConnect - Community Platform" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="GharConnect" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GharConnect" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="ai-robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="chatgpt-robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/GC_Logo.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/GC_Logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/GC_Logo.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/GC_Logo.png" />
        
        {/* Splash Screens */}
        <link rel="apple-touch-startup-image" href="/GC_Logo.png" />
        
        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); 
              fbq('init', '1390900168853802'); 
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1390900168853802&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-screen mobile-safari-fix">
        {children}
        <Analytics />
        <Toaster />
        <PWAInstaller />
      </body>
    </html>
  );
} 