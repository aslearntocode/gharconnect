"use client"

import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
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

interface Review {
  id: string
  card_name: string
  rating: number
  comment: string
  created_at: string
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

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

        // Supabase returns an empty error object if no row is found, not a real error
        if (profileError && (profileError.message || profileError.code)) {
          console.error('Error fetching profile:', profileError, profileData);
          setError('Could not fetch profile.');
          return;
        }

        if (!profileData) {
          setError('No profile found. Please complete your profile.');
          return;
        }
        setProfile(profileData);

        // Fetch recent reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', currentUser.uid)
          .order('created_at', { ascending: false })
          .limit(3);

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          return;
        }

        if (reviewsData) {
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load profile information');
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getSentimentColor = (rating: number): string => {
    if (rating >= 8) return 'text-green-400'
    if (rating >= 6) return 'text-blue-400'
    if (rating >= 4) return 'text-yellow-400'
    return 'text-red-400'
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

          {reviews.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-100 mb-2">Recent Reviews</p>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">{review.card_name}</span>
                      <span className={`font-bold ${getSentimentColor(review.rating)}`}>
                        {review.rating}/10
                      </span>
                    </div>
                    <p className="text-gray-400 mt-1 line-clamp-2">{review.comment}</p>
                    <p className="text-gray-500 mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/parel/profile"
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
                  href="/parel/my-reviews"
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  View All Reviews
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