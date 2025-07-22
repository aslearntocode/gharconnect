"use client"

import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { signOut } from 'firebase/auth'

interface ProfileDropdownProps {
  user: User
}

interface UserProfile {
  society_name: string
  building_name: string
  apartment_number: string
  email: string
  phone: string | null
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Extract area from pathname (e.g., /mumbai/community/connect -> mumbai/community, /bangalore/connect -> bangalore)
  const getCurrentArea = () => {
    const pathSegments = pathname.split('/')
    if (pathSegments[1] === 'mumbai' && pathSegments[2] === 'community') {
      return 'mumbai/community'
    }
    if (pathSegments[1] === 'bangalore') {
      return 'bangalore'
    }
    return 'mumbai/community' // Default to mumbai/community if no area found
  }

  const currentArea = getCurrentArea()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', currentUser.uid)
          .single();

        // Only treat actual errors as errors, not missing profiles
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          setError('Could not fetch profile.');
          return;
        }

        // No profile found is not an error, just set profile to null
        setProfile(profileData || null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load profile information');
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      // Get current pathname and pass it to logout page
      const currentPath = window.location.pathname;
      router.push(`/logout?from=${encodeURIComponent(currentPath)}`)
    } catch (error) {
      console.error('Error redirecting to logout:', error)
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left z-[100]">
      <Menu.Button className="flex items-center text-black">
        {user?.photoURL ? (
          <Image
            src={user.photoURL}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-black">{user?.email?.[0].toUpperCase()}</span>
          </div>
        )}
        <ChevronDownIcon className="ml-1 h-4 w-4 text-black" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="fixed right-4 top-16 w-72 origin-top-right divide-y divide-gray-600/50 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
          <div className="px-4 py-3">
            <p className="text-sm text-gray-100 font-medium">{user.displayName || user.email}</p>
            {error ? (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            ) : profile ? (
              <div className="mt-2 text-xs text-gray-300">
                <p>{profile.society_name}</p>
                <p>{profile.building_name}, {profile.apartment_number}</p>
                {profile.phone && <p>{profile.phone}</p>}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">Profile not completed</p>
            )}
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/${currentArea}/profile`}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Edit Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/${currentArea}/my-reviews`}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  View All Vendor Reviews
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/${currentArea}/my-posts`}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  View All Posts
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/${currentArea}/my-comments`}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  View All Comments
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-red-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 