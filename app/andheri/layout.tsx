import { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Andheri Communities - Coming Soon | GharConnect',
  description: 'Andheri communities are being onboarded to GharConnect. Join us to stay connected with your neighborhood.',
};

export default function AndheriLayout({
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
