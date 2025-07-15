import { Metadata } from 'next';
import RentalHeader from '@/components/RentalHeader';

export const metadata: Metadata = {
  title: 'Rental Apartments in Mumbai | GharConnect',
  description: 'Find rental apartments in Mumbai with no brokerage fees. Browse verified apartment listings with transparent pricing.',
  keywords: 'rental apartments Mumbai, Mumbai flats for rent, low brokerage rental Mumbai, Mumbai 1BHK rent, Mumbai 2BHK rent, Mumbai 3BHK rent, rental apartments Mumbai, Mumbai society rentals, minimal brokerage Mumbai, Mumbai rental deals, Mumbai apartment search, Mumbai rental listings, Mumbai furnished apartments, Mumbai semi-furnished apartments, Mumbai unfurnished apartments, Mumbai rental prices, Mumbai rental market, Mumbai rental agents, Mumbai rental brokers, Mumbai rental services, Mumbai rental assistance, Mumbai rental support, Mumbai rental guidance, Mumbai rental consultation, Mumbai rental advice, Mumbai rental tips, Mumbai rental guide, Mumbai rental information, Mumbai rental resources, Mumbai rental help, Mumbai rental solutions',
  openGraph: {
    title: 'Rental Apartments in Mumbai | GharConnect',
    description: 'Find rental apartments in Mumbai with no brokerage fees. Browse verified apartment listings with transparent pricing.',
    url: 'https://gharconnect.in/mumbai/rent/apartment',
    siteName: 'GharConnect',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rental Apartments in Mumbai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rental Apartments in Mumbai | GharConnect',
    description: 'Find rental apartments in Mumbai with no brokerage fees. Browse verified apartment listings with transparent pricing.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/mumbai/rent/apartment',
  },
};

export default function ApartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RentalHeader />
      {children}
    </>
  );
} 