'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FiUser, FiLogOut, FiSettings, FiHeart, FiFileText, FiHome, FiTruck, FiTool, FiUsers, FiShoppingCart, FiBookOpen, FiAward, FiZap, FiEdit, FiShield, FiGrid, FiSearch, FiPlus, FiCircle } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

export default function DashboardDropdown() {
  // All hooks must be called at the top level, in the same order every time
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  
  // Always call useAuth, but handle the error gracefully
  let authContext = null
  try {
    authContext = useAuth()
  } catch (error) {
    // Auth context not available during SSR or if provider isn't ready
    console.warn('Auth context not available in DashboardDropdown:', error)
  }

  // Extract supabase from auth context with fallback
  const supabase = authContext?.supabase || null
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    if (!supabase) return
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        // Get current pathname and pass it to logout page
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        router.push(`/logout?from=${encodeURIComponent(currentPath)}`);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <FiUser className="h-4 w-4 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Dashboard</p>
            <p className="text-xs leading-none text-muted-foreground">
              Admin Panel
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Admin Actions */}
        <DropdownMenuItem onClick={() => router.push('/admin')}>
          <FiShield className="mr-2 h-4 w-4" />
          <span>Admin Panel</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push('/vendor')}>
          <FiTool className="mr-2 h-4 w-4" />
          <span>Vendor Management</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Settings & Logout */}
        <DropdownMenuItem onClick={() => router.push('/admin')}>
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