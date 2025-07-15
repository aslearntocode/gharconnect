import { Metadata } from 'next';
import RentalHeader from '@/components/RentalHeader';

export const metadata: Metadata = {
  title: 'Rental Apartments in Bangalore | GharConnect',
  description: 'Find rental apartments in Bangalore with no brokerage fees. Browse verified apartment listings with transparent pricing.',
  keywords: 'rental apartments Bangalore, Bangalore flats for rent, low brokerage rental Bangalore, Bangalore 1BHK rent, Bangalore 2BHK rent, Bangalore 3BHK rent, rental apartments Bangalore, Bangalore society rentals, minimal brokerage Bangalore, Bangalore rental deals, Bangalore apartment search, Bangalore rental listings, Bangalore furnished apartments, Bangalore semi-furnished apartments, Bangalore unfurnished apartments, Bangalore rental prices, Bangalore rental market, Bangalore rental agents, Bangalore rental brokers, Bangalore rental services, Bangalore rental assistance, Bangalore rental support, Bangalore rental guidance, Bangalore rental consultation, Bangalore rental advice, Bangalore rental tips, Bangalore rental guide, Bangalore rental information, Bangalore rental resources, Bangalore rental help, Bangalore rental solutions',
  openGraph: {
    title: 'Rental Apartments in Bangalore | GharConnect',
    description: 'Find rental apartments in Bangalore with no brokerage fees. Browse verified apartment listings with transparent pricing.',
    url: 'https://gharconnect.in/bangalore/rent/apartment',
    siteName: 'GharConnect',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rental Apartments in Bangalore',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rental Apartments in Bangalore | GharConnect',
    description: 'Find rental apartments in Bangalore with no brokerage fees. Browse verified apartment listings with transparent pricing.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/bangalore/rent/apartment',
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