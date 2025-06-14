import Link from 'next/link';
import SocietyImage from '@/components/SocietyImage';
import { Metadata } from 'next';
import SocietiesClient from './SocietiesClient';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GharConnect - Society Connect Platform',
  description: 'Connect with your society members, manage amenities, and stay updated with your community. Join GharConnect for seamless society management.',
  keywords: 'society management, community platform, residential complex, society amenities, Mumbai societies',
  openGraph: {
    title: 'GharConnect - Society Connect Platform',
    description: 'Connect with your society members, manage amenities, and stay updated with your community.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GharConnect',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GharConnect - Society Connect Platform',
    description: 'Connect with your society members, manage amenities, and stay updated with your community.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function SocietiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple, distinct header for societies selection */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">GharConnect</h1>
          <span className="ml-2 text-sm text-gray-400 font-medium hidden sm:inline">Community Platform</span>
        </div>
      </header>
      {/* Website Description */}
      <div className="w-full flex justify-center mb-6 px-4">
        <p className="max-w-6xl text-center text-gray-600 text-sm md:text-lg leading-relaxed">
        Looking to rent or sell your property? Searching for your next rental or dream home?
        Need trusted service providers or local delivery options within your society?
        Or just curious about your neighbors' recent travel experiences to plan your next vacation?
        Whatever you're looking for — gharconnect.in helps you stay connected, informed, and empowered within your residential community.
        </p>
      </div>
      <div className="flex-grow">
        <SocietiesClient />
      </div>
      <Footer />
    </div>
  );
} 