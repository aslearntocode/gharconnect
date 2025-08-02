import { Metadata } from 'next';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Mumbai - Rentals, Services & Community | GharConnect',
  description: 'Find rental apartments, local services, delivery options, and connect with neighbors in Mumbai. GharConnect offers no brokerage rentals and trusted local services.',
  keywords: 'Mumbai, Mumbai rental apartments, Mumbai services, Mumbai community, Mumbai delivery, Mumbai marketplace, Mumbai neighbors, Mumbai local services, Mumbai society, Mumbai residential, Mumbai community platform',
  openGraph: {
    title: 'Mumbai - Services, Rental & Community | GharConnect',
    description: 'Find rental apartments, local services, delivery options, and connect with neighbors in Mumbai.',
    type: 'website',
    url: 'https://gharconnect.in/mumbai',
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
    title: 'Mumbai - Rentals, Services, Delivery & Community',
    description: 'Find rental apartments, local services, delivery options, and connect with neighbors in Mumbai.',
    images: ['https://gharconnect.in/GC_Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/mumbai',
  },
};

export default function RentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Footer is handled by individual page layouts to avoid duplicates */}
    </>
  );
} 