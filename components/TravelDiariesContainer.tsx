import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TravelDiariesContainer() {
  const pathname = usePathname();
  // Extract area from pathname (e.g., /parel or /worli)
  const area = pathname.split('/')[1] || 'parel';
  const travelVlogsLink = `/${area}/travel-vlogs`;

  return (
    <div className="bg-indigo-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Travel Diaries</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Explore travel stories and tips from your community. Share your own experiences and let others book the same experience!
          </p>
          <Link 
            href={travelVlogsLink}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
          >
            Explore Travel Vlogs
          </Link>
        </div>
      </div>
    </div>
  );
} 