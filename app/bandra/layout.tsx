import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bandra Communities - Coming Soon | GharConnect',
  description: 'Bandra communities are being onboarded to GharConnect. Join us to stay connected with your neighborhood.',
};

export default function BandraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
