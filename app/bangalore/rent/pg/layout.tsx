import { Metadata } from 'next';
import RentalHeader from '@/components/RentalHeader';

export const metadata: Metadata = {
  title: 'PG Accommodation in Bangalore | GharConnect',
  description: 'Find Paying Guest (PG) accommodation in Bangalore. Browse verified PG listings with no brokerage fees.',
  keywords: 'PG accommodation Bangalore, paying guest Bangalore, shared accommodation Bangalore, student accommodation Bangalore, working professional PG Bangalore',
  openGraph: {
    title: 'PG Accommodation in Bangalore | GharConnect',
    description: 'Find Paying Guest (PG) accommodation in Bangalore. Browse verified PG listings with no brokerage fees.',
    url: 'https://gharconnect.in/bangalore/rent/pg',
    siteName: 'GharConnect',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Accommodation in Bangalore',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Accommodation in Bangalore | GharConnect',
    description: 'Find Paying Guest (PG) accommodation in Bangalore. Browse verified PG listings with no brokerage fees.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/bangalore/rent/pg',
  },
};

export default function PGLayout({
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