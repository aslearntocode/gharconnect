import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"

export default function SocietyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>{children}</main>
      <Footer />
      <Analytics />
      <Toaster />
    </>
  )
} 