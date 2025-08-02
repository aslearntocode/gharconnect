import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mumbai - Rentals, Services, Delivery & Community',
  description: 'Find rentals with no brokerage, local services, delivery providers, and connect with neighbors across Mumbai.',
  keywords: 'Mumbai community, Mumbai services, Mumbai delivery, Mumbai marketplace, Mumbai neighbors, Mumbai local services, Mumbai society, Mumbai residential, Mumbai community platform, Mumbai service providers, Mumbai delivery vendors, Mumbai marketplace items, Mumbai community discussions',
  openGraph: {
    title: 'Mumbai Community - Rentals, Services, Delivery & Community',
    description: 'Find rentals with no brokerage, local services, delivery providers, and connect with neighbors across Mumbai.',
    type: 'website',
    url: 'https://gharconnect.in/mumbai/community',
    siteName: 'GharConnect',
    locale: 'en_IN',
    images: [
      {
        url: 'https://gharconnect.in/GC_Logo.png',
        width: 1200,
        height: 630,
        alt: 'Mumbai Community Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gharconnect',
    creator: '@gharconnect',
    title: 'Mumbai - Rentals, Services, Delivery & Community',
    description: 'Find rentals with no brokerage, local services, delivery providers, and connect with neighbors across Mumbai.',
    images: ['https://gharconnect.in/GC_Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/mumbai/community',
  },
  authors: [{ name: 'GharConnect' }],
  other: {
    'geo.region': 'IN-MH',
    'geo.placename': 'Mumbai',
    'theme-color': '#4F46E5',
  },
}

export default function SocietyLayout({
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
