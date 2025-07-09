import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
<link rel="icon" href="/GC_Logo.png" />

export const metadata: Metadata = {
  title: 'GharConnect - Find Apartments & Local Services | Connect with Your Neighbors',
  description: 'Find apartments for rent, connect with your neighbors and discover local services and marketplace in your community.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
  icons: {
    apple: '/GC_Logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
} 