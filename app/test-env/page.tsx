"use client";

import { useEffect, useState } from 'react';

export default function TestEnvPage() {
  const [envInfo, setEnvInfo] = useState<any>({});

  useEffect(() => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'undefined',
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    };
    setEnvInfo(env);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
          <div className="space-y-3">
            {Object.entries(envInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <strong>{key}:</strong>
                <span className={`${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? String(value) : 'undefined'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check if <code>.env.local</code> file exists in the project root</li>
            <li>Verify that environment variables are properly set in <code>.env.local</code></li>
            <li>Restart the development server after making changes to environment variables</li>
            <li>Check browser console for any error messages</li>
            <li>Verify Supabase project is active and accessible</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 