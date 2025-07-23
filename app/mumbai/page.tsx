'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MumbaiRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Mumbai community page after a short delay
    const timer = setTimeout(() => {
      router.push('/mumbai/community');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Redirecting...</h1>
        <p className="text-gray-500">Taking you to Mumbai Community</p>
      </div>
    </div>
  );
}
