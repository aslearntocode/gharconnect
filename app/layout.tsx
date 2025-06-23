import './parel/globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
<link rel="icon" href="/GC_Logo.png" />

export const metadata: Metadata = {
  title: 'GharConnect - Connect with Your Neighbors | Find Apartments & Local Services',
  description: 'Connect with your neighbors, find apartments for rent or sale, and discover local services in your community. Join GharConnect to make your society living better and more convenient.',
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