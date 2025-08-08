"use client";

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export default function DebugSupabasePage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check environment variables
        const env = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'undefined'
        };
        setEnvVars(env);

        // Test Supabase connection
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('apartments')
          .select('id, title')
          .limit(1);

        setConnectionTest({
          success: !error,
          data: data,
          error: error ? {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          } : null
        });
      } catch (err) {
        setConnectionTest({
          success: false,
          error: {
            message: err instanceof Error ? err.message : 'Unknown error',
            details: err
          }
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Testing Supabase Connection...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
              <span className={`ml-2 ${envVars.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}`}>
                {envVars.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}
              </span>
            </div>
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
              <span className={`ml-2 ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'undefined'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
          {connectionTest ? (
            <div>
              <div className={`mb-4 p-3 rounded ${connectionTest.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Status:</strong> {connectionTest.success ? 'SUCCESS' : 'FAILED'}
              </div>
              
              {connectionTest.success && connectionTest.data && (
                <div className="mb-4">
                  <strong>Sample Data:</strong>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionTest.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {connectionTest.error && (
                <div>
                  <strong>Error Details:</strong>
                  <pre className="mt-2 p-3 bg-red-50 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionTest.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">No connection test results available.</div>
          )}
        </div>
      </div>
    </div>
  );
} 