import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import SEOScript from '@/components/SEOScript';

export const metadata: Metadata = {
  title: 'GharConnect - Find Apartments & Local Services | Connect with Your Neighbors',
  description: 'Find brokerage free apartments for rent, connect with your neighbors and discover local services and marketplace in your community.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
  icons: {
    apple: '/GC_Logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* SEO Component for canonical URLs and meta tags */}
        <SEOScript canonicalUrl="https://gharconnect.in" />
        
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
      <body className="min-h-screen">
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
} 