import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Bangalore PG Accommodation - No Brokerage | GharConnect',
  description: 'Find PG accommodation in Bangalore with minimal brokerage fees. GharConnect offers the best PG deals in Bangalore with transparent pricing and no hidden charges. Browse verified PG listings for students and professionals.',
  keywords: 'Bangalore PG accommodation, Bangalore paying guest, low brokerage PG Bangalore, Bangalore student accommodation, Bangalore working professional PG, PG accommodation Bangalore, Bangalore society PG, minimal brokerage PG Bangalore, Bangalore PG deals, Bangalore PG search, Bangalore PG listings, Bangalore furnished PG, Bangalore semi-furnished PG, Bangalore unfurnished PG, Bangalore PG prices, Bangalore PG market, Bangalore PG agents, Bangalore PG brokers, Bangalore PG services, Bangalore PG assistance, Bangalore PG support, Bangalore PG guidance, Bangalore PG consultation, Bangalore PG advice, Bangalore PG tips, Bangalore PG guide, Bangalore PG information, Bangalore PG resources, Bangalore PG help, Bangalore PG solutions',
  openGraph: {
    title: 'Bangalore PG Accommodation - No Brokerage | GharConnect',
    description: 'Find PG accommodation in Bangalore with minimal brokerage fees. Transparent pricing, no hidden charges.',
    type: 'website',
    url: 'https://gharconnect.in/bangalore/rent/pg',
    siteName: 'GharConnect',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bangalore PG Accommodation - No Brokerage | GharConnect',
    description: 'Find PG accommodation in Bangalore with minimal brokerage fees.',
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
      <Header />
      {children}
    </>
  );
} 