import './cb-parel/globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
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
    apple: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
} 