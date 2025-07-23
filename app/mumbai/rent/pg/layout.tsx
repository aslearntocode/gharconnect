import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'PG Accommodation in Mumbai | GharConnect',
  description: 'Find Paying Guest (PG) accommodation in Mumbai. Browse verified PG listings with no brokerage fees.',
  keywords: 'PG accommodation Mumbai, paying guest Mumbai, shared accommodation Mumbai, student accommodation Mumbai, working professional PG Mumbai',
  openGraph: {
    title: 'PG Accommodation in Mumbai | GharConnect',
    description: 'Find Paying Guest (PG) accommodation in Mumbai. Browse verified PG listings with no brokerage fees.',
    url: 'https://gharconnect.in/mumbai/rent/pg',
    siteName: 'GharConnect',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Accommodation in Mumbai',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Accommodation in Mumbai | GharConnect',
    description: 'Find Paying Guest (PG) accommodation in Mumbai. Browse verified PG listings with no brokerage fees.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/mumbai/rent/pg',
  },
};

export default function PGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
} 