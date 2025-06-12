import Link from 'next/link';
import SocietyImage from '@/components/SocietyImage';
import { Metadata } from 'next';
import SocietiesClient from './SocietiesClient';

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
    <>
      {/* Simple, distinct header for societies selection */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">GharConnect</h1>
          <span className="ml-2 text-sm text-gray-400 font-medium hidden sm:inline">Society Platform</span>
        </div>
      </header>
      <SocietiesClient />
    </>
  );
} 