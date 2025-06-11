import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

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

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="GharConnect - Your Community Living Platform" />
        <meta property="og:description" content="Connect with neighbors, find apartments, and discover local services. Make your society living better with GharConnect." />
        <meta property="og:image" content="/preview-image.png" />
        <meta property="og:url" content="https://gharconnect.in/" />
        <link rel="icon" href="/GC.png" type="image/png" />
      </head>
      <body className="min-h-screen">
        <main>
          {children}
        </main>
        <Footer />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
