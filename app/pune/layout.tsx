import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pune - Rentals, Services, Delivery & Community',
  description: 'Find rental apartments in Pune with no brokerage. GharConnect offers the best rental deals in Pune with transparent pricing and no hidden charges. Browse 1BHK, 2BHK, 3BHK apartments for rent.',
  keywords: 'Pune rental apartments, Pune flats for rent, low brokerage rental Pune, Pune 1BHK rent, Pune 2BHK rent, Pune 3BHK rent, rental apartments Pune, Pune society rentals, minimal brokerage Pune, Pune rental deals, Pune apartment search, Pune rental listings, Pune furnished apartments, Pune semi-furnished apartments, Pune unfurnished apartments, Pune rental prices, Pune rental market, Pune rental agents, Pune rental brokers, Pune rental services, Pune rental assistance, Pune rental support, Pune rental guidance, Pune rental consultation, Pune rental advice, Pune rental tips, Pune rental guide, Pune rental information, Pune rental resources, Pune rental help, Pune rental solutions',
  openGraph: {
    title: 'Pune Rental Apartments - No Brokerage | GharConnect',
    description: 'Find rental apartments in Pune with no brokerage. Transparent pricing, no hidden charges.',
    type: 'website',
    url: 'https://gharconnect.in/pune',
    siteName: 'GharConnect',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pune - Rentals, Services, Delivery & Community',
    description: 'Find rental apartments in Pune with no brokerage.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/pune',
  },
};

export default function PuneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
} 