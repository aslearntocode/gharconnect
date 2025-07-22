import { Metadata } from 'next';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Mumbai Rental Apartments - No Brokerage | GharConnect',
  description: 'Find rental apartments in Mumbai with minimal brokerage fees. GharConnect offers the best rental deals in Mumbai with transparent pricing and no hidden charges. Browse 1BHK, 2BHK, 3BHK apartments for rent.',
  keywords: 'Mumbai rental apartments, Mumbai flats for rent, low brokerage rental Mumbai, Mumbai 1BHK rent, Mumbai 2BHK rent, Mumbai 3BHK rent, rental apartments Mumbai, Mumbai society rentals, minimal brokerage Mumbai, Mumbai rental deals, Mumbai apartment search, Mumbai rental listings, Mumbai furnished apartments, Mumbai semi-furnished apartments, Mumbai unfurnished apartments, Mumbai rental prices, Mumbai rental market, Mumbai rental agents, Mumbai rental brokers, Mumbai rental services, Mumbai rental assistance, Mumbai rental support, Mumbai rental guidance, Mumbai rental consultation, Mumbai rental advice, Mumbai rental tips, Mumbai rental guide, Mumbai rental information, Mumbai rental resources, Mumbai rental help, Mumbai rental solutions',
  openGraph: {
    title: 'Mumbai Rental Apartments - No Brokerage | GharConnect',
    description: 'Find rental apartments in Mumbai with minimal brokerage fees. Transparent pricing, no hidden charges.',
    type: 'website',
    url: 'https://gharconnect.in/mumbai/rent',
    siteName: 'GharConnect',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mumbai Rental Apartments - No Brokerage | GharConnect',
    description: 'Find rental apartments in Mumbai with minimal brokerage fees.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/mumbai/rent',
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