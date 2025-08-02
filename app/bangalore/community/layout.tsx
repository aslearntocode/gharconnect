import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bangalore Community - Services, Delivery & Local Marketplace | GharConnect',
  description: 'Join the Bangalore community platform. Find local services, delivery options, marketplace items, and connect with neighbors across Bangalore. Discover trusted service providers and community discussions.',
  keywords: 'Bangalore community, Bangalore services, Bangalore delivery, Bangalore marketplace, Bangalore neighbors, Bangalore local services, Bangalore society, Bangalore residential, Bangalore community platform, Bangalore service providers, Bangalore delivery vendors, Bangalore marketplace items, Bangalore community discussions',
  openGraph: {
    title: 'Bangalore Community - Services, Delivery & Local Marketplace | GharConnect',
    description: 'Join the Bangalore community platform. Find local services, delivery options, marketplace items, and connect with neighbors across Bangalore.',
    type: 'website',
    url: 'https://gharconnect.in/bangalore/community',
    siteName: 'GharConnect',
    locale: 'en_IN',
    images: [
      {
        url: 'https://gharconnect.in/GC_Logo.png',
        width: 1200,
        height: 630,
        alt: 'GharConnect - Community Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gharconnect',
    creator: '@gharconnect',
    title: 'Bangalore Community - Services, Delivery & Local Marketplace | GharConnect',
    description: 'Join the Bangalore community platform. Find local services, delivery options, and connect with neighbors.',
    images: ['https://gharconnect.in/GC_Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/bangalore/community',
  },
  authors: [{ name: 'GharConnect' }],
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Bangalore',
    'theme-color': '#4F46E5',
    'og:image:secure_url': 'https://gharconnect.in/GC_Logo.png',
    'og:image:type': 'image/png',
    'og:image:width': '1200',
    'og:image:height': '630',
  },
}

export default function BangaloreCommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>{children}</main>
      <Footer />
      <Analytics />
      <Toaster />
    </>
  )
} 