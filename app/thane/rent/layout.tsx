import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parel Rental Apartments - Low Brokerage | GharConnect',
  description: 'Find rental apartments in Parel, Mumbai with minimal brokerage fees. GharConnect offers the best rental deals in Parel with transparent pricing and no hidden charges. Browse 1BHK, 2BHK, 3BHK apartments for rent.',
  keywords: 'Parel rental apartments, Parel flats for rent, low brokerage rental Parel, Parel 1BHK rent, Parel 2BHK rent, Parel 3BHK rent, rental apartments Parel Mumbai, Parel society rentals, minimal brokerage Parel, Parel rental deals, Parel apartment search, Parel rental listings, Parel furnished apartments, Parel semi-furnished apartments, Parel unfurnished apartments, Parel rental prices, Parel rental market, Parel rental agents, Parel rental brokers, Parel rental services, Parel rental assistance, Parel rental support, Parel rental guidance, Parel rental consultation, Parel rental advice, Parel rental tips, Parel rental guide, Parel rental information, Parel rental resources, Parel rental help, Parel rental solutions',
  openGraph: {
    title: 'Parel Rental Apartments - Low Brokerage | GharConnect',
    description: 'Find rental apartments in Parel, Mumbai with minimal brokerage fees. Transparent pricing, no hidden charges.',
    type: 'website',
    url: 'https://gharconnect.in/parel/rent',
    siteName: 'GharConnect',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parel Rental Apartments - Low Brokerage | GharConnect',
    description: 'Find rental apartments in Parel, Mumbai with minimal brokerage fees.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/parel/rent',
  },
};

export default function RentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 