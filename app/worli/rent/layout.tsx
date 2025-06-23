import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worli Rental Apartments - Low Brokerage | GharConnect',
  description: 'Find rental apartments in Worli, Mumbai with minimal brokerage fees. GharConnect offers the best rental deals in Worli with transparent pricing and no hidden charges. Browse 1BHK, 2BHK, 3BHK apartments for rent.',
  keywords: 'Worli rental apartments, Worli flats for rent, low brokerage rental Worli, Worli 1BHK rent, Worli 2BHK rent, Worli 3BHK rent, rental apartments Worli Mumbai, Worli society rentals, minimal brokerage Worli, Worli rental deals, Worli apartment search, Worli rental listings, Worli furnished apartments, Worli semi-furnished apartments, Worli unfurnished apartments, Worli rental prices, Worli rental market, Worli rental agents, Worli rental brokers, Worli rental services, Worli rental assistance, Worli rental support, Worli rental guidance, Worli rental consultation, Worli rental advice, Worli rental tips, Worli rental guide, Worli rental information, Worli rental resources, Worli rental help, Worli rental solutions',
  openGraph: {
    title: 'Worli Rental Apartments - Low Brokerage | GharConnect',
    description: 'Find rental apartments in Worli, Mumbai with minimal brokerage fees. Transparent pricing, no hidden charges.',
    type: 'website',
    url: 'https://gharconnect.in/worli/rent',
    siteName: 'GharConnect',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Worli Rental Apartments - Low Brokerage | GharConnect',
    description: 'Find rental apartments in Worli, Mumbai with minimal brokerage fees.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://gharconnect.in/worli/rent',
  },
};

export default function RentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 