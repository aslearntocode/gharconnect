import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bangalore Rental Apartments - No Brokerage | GharConnect',
  description: 'Find rental apartments in Bangalore with no brokerage. GharConnect offers the best rental deals in Bangalore with transparent pricing and no hidden charges. Browse 1BHK, 2BHK, 3BHK apartments for rent.',
  keywords: 'Bangalore rental apartments, Bangalore flats for rent, low brokerage rental Bangalore, Bangalore 1BHK rent, Bangalore 2BHK rent, Bangalore 3BHK rent, rental apartments Bangalore, Bangalore society rentals, minimal brokerage Bangalore, Bangalore rental deals, Bangalore apartment search, Bangalore rental listings, Bangalore furnished apartments, Bangalore semi-furnished apartments, Bangalore unfurnished apartments, Bangalore rental prices, Bangalore rental market, Bangalore rental agents, Bangalore rental brokers, Bangalore rental services, Bangalore rental assistance, Bangalore rental support, Bangalore rental guidance, Bangalore rental consultation, Bangalore rental advice, Bangalore rental tips, Bangalore rental guide, Bangalore rental information, Bangalore rental resources, Bangalore rental help, Bangalore rental solutions',
  openGraph: {
    title: 'Bangalore Rental Apartments - No Brokerage | GharConnect',
    description: 'Find rental apartments in Bangalore with no brokerage. Transparent pricing, no hidden charges.',
    type: 'website',
    url: 'https://gharconnect.in/bangalore/rent',
    siteName: 'GharConnect',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bangalore Rental Apartments - No Brokerage | GharConnect',
    description: 'Find rental apartments in Bangalore with no brokerage. Transparent pricing, no hidden charges.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/bangalore/rent',
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
    </>
  );
} 