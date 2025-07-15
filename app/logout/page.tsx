'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

function LogoutPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [hasPerformedLogout, setHasPerformedLogout] = useState(false);

  console.log('LogoutPage rendered, pathname:', pathname);

  // Extract society from a given path
  const getSocietyFromPath = (path: string) => {
    const pathParts = path.split('/');
    return pathParts[1] && pathParts[1] !== 'logout' ? pathParts[1] : null;
  };

  // Extract city from a given path for rental pages
  const getCityFromPath = (path: string) => {
    const pathParts = path.split('/');
    return pathParts[1] && pathParts[1] !== 'logout' ? pathParts[1] : null;
  };

  // Determine redirect path
  const getRedirectPath = () => {
    const from = searchParams.get('from');
    if (from) {
      // Check if the user was on a rental page
      if (from.includes('/rent/') || from.includes('/list-apartment')) {
        const city = getCityFromPath(from);
        if (city) return `/${city}/rent`;
      }
      
      // Check if the user was on a society-specific rental page
      if (from.includes('/rent')) {
        const society = getSocietyFromPath(from);
        if (society) {
          // Map society to city
          const societyToCity: { [key: string]: string } = {
            'parel': 'mumbai',
            'bandra': 'mumbai',
            'worli': 'mumbai',
            'mahalaxmi': 'mumbai',
            'powai': 'mumbai',
            'malad': 'mumbai',
            'andheri': 'mumbai',
            'thane': 'mumbai'
          };
          const city = societyToCity[society];
          if (city) return `/${city}/rent`;
        }
      }
      
      // If the user was on a society subpage, redirect to its homepage
      const society = getSocietyFromPath(from);
      if (society) return `/${society}`;
    }
    // Fallback to current logic
    const society = getSocietyFromPath(pathname);
    if (society) return `/${society}`;
    return '/parel';
  };

  useEffect(() => {
    if (hasPerformedLogout) return;
    const performLogout = async () => {
      try {
        console.log('Starting logout process...');
        setHasPerformedLogout(true);
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('No user found, redirecting directly');
          router.push(getRedirectPath());
          return;
        }
        console.log('User found, signing out...');
        // Sign out from Firebase
        await signOut(auth);
        console.log('Sign out completed');
        
        // Get the redirect path
        const redirectPath = getRedirectPath();
        console.log('Redirecting to:', redirectPath);
        
        // Show logging out message for a brief moment
        setTimeout(() => {
          setIsLoggingOut(false);
          // Redirect to the appropriate page
          router.push(redirectPath);
        }, 1500); // Show message for 1.5 seconds
        
      } catch (error) {
        console.error('Error during logout:', error);
        // Even if there's an error, redirect to the appropriate page
        router.push(getRedirectPath());
      }
    };
    performLogout();
  }, [router, pathname, hasPerformedLogout, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Image 
            src="/GC_Logo.png" 
            alt="GharConnect" 
            width={120} 
            height={120} 
            className="mx-auto"
          />
        </div>
        
        {isLoggingOut ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Logging out...</h2>
            <p className="text-gray-600">Please wait while we sign you out</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-green-500">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Successfully logged out</h2>
            <p className="text-gray-600">Redirecting you to the homepage...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <Image 
              src="/GC_Logo.png" 
              alt="GharConnect" 
              width={120} 
              height={120} 
              className="mx-auto"
            />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <LogoutPageContent />
    </Suspense>
  );
} 