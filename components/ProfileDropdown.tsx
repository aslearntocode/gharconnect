'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FiUser, FiLogOut, FiSettings, FiHeart, FiFileText, FiHome, FiTruck, FiTool, FiUsers, FiShoppingCart, FiBookOpen, FiAward, FiZap, FiEdit, FiShield, FiGrid, FiSearch, FiPlus, FiCircle } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

interface UserProfile {
  id: string
  full_name: string
  avatar_url: string
  email: string
}

interface ProfileDropdownProps {
  user: User
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  // All hooks must be called at the top level, in the same order every time
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  // Always call useAuth at the top level
  const authContext = useAuth()

  // Extract supabase from auth context with fallback
  const supabase = authContext?.supabase || null
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Extract society from pathname
  const getSocietyFromPath = () => {
    const pathParts = pathname.split('/')
    if (pathParts[1] === 'mumbai' && pathParts[2] === 'community') {
      return 'mumbai/community'
    }
    if (pathParts[1] === 'bangalore') {
      return 'bangalore'
    }
    if (pathParts[1] === 'pune') {
      return 'pune'
    }
    return 'mumbai/community'
  }

  const currentSociety = getSocietyFromPath()

  useEffect(() => {
    if (!isClient || !supabase || !user) return

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          return
        }

        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [user, supabase, isClient])

  const handleLogout = async () => {
    // Get current pathname and navigate to logout page (which will handle the actual signout)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
    router.push(`/logout?from=${encodeURIComponent(currentPath)}`)
  }

  // Don't render anything during SSR or if not on client
  if (!isClient) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    )
  }

  // If no supabase client available, show a simple loading state
  if (!supabase) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    )
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Quick Actions */}
        <DropdownMenuItem onClick={() => router.push(`/${currentSociety}/profile`)}>
          <FiUser className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push(`/${currentSociety}/my-reviews`)}>
          <FiFileText className="mr-2 h-4 w-4" />
          <span>My Reviews</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Services */}
        <DropdownMenuItem onClick={() => router.push(`/${currentSociety}/services`)}>
          <FiTool className="mr-2 h-4 w-4" />
          <span>Services</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push(`/${currentSociety}/delivery`)}>
          <FiTruck className="mr-2 h-4 w-4" />
          <span>Delivery</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push(`/${currentSociety}/marketplace`)}>
          <FiShoppingCart className="mr-2 h-4 w-4" />
          <span>Marketplace</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Settings & Logout */}
        <DropdownMenuItem onClick={() => router.push(`/${currentSociety}/profile`)}>
          <FiSettings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          <FiLogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 