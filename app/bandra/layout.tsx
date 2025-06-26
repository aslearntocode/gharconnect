import { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Bandra Communities - Coming Soon | GharConnect',
  description: 'Bandra communities are being onboarded to GharConnect. Join us to stay connected with your neighborhood.',
};

export default function BandraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
      <Footer />
      <Analytics />
      <Toaster />
    </>
  );
}
