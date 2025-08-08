'use client'

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase-auth'
import { ProfileDropdown } from "./ProfileDropdown"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import Link from 'next/link'

export default function VendorHeader() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      setUser(user)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Add style to hide mobile navigation
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .md\\:hidden.py-2.w-full.bg-white.fixed.bottom-0 {
        display: none !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <header className="bg-white shadow-md relative" style={{ zIndex: 1000 }}>
      <nav className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex items-center">
            <Image 
              src="/GC_Logo.png" 
              alt="Brand Logo" 
              height={56} 
              width={56} 
              className="h-6 w-auto" 
              priority
            />
          </div>
          
          <div className="flex items-center">
            {user && <ProfileDropdown user={user} />}
          </div>
        </div>
      </nav>
    </header>
  )
} 