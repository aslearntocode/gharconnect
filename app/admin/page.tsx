'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Vendor {
  vendor_id: string;
  name: string;
  mobile_no: string;
  services: string;
  area: string;
  societies: string[];
  is_verified: boolean;
  table_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeTab, setActiveTab] = useState<'permanent' | 'temporary'>('permanent');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log('User logged in:', user.uid, user.email);
        
        // Test database connection first
        await testDatabaseConnection();
        
        await checkAdminStatus(user.uid);
        await fetchVendors();
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      
      // First, test a simple query to any table
      const { data: testData, error: testError } = await supabase
        .from('vendor_weekly_availability')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Basic database connection test failed:', testError);
        console.error('Error details:', {
          code: testError.code,
          message: testError.message,
          details: testError.details,
          hint: testError.hint
        });
      } else {
        console.log('Basic database connection test successful');
      }
      
      // Now test admin_users table specifically
      const { data, error } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Admin users table test failed:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('Admin users table test successful');
      }
    } catch (error) {
      console.error('Database connection test exception:', error);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setIsAdmin(false);
        return;
      }

      console.log('Admin check result:', data);
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Exception checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchVendors = async () => {
    try {
      // Fetch permanent vendors
      const { data: permanentData, error: permanentError } = await supabase
        .from('vendor_permanent_availability')
        .select('vendor_id, name, mobile_no, services, area, societies, is_verified, created_at')
        .order('created_at', { ascending: false });

      if (permanentError) {
        console.error('Error fetching permanent vendors:', permanentError);
      }

      // Fetch temporary vendors
      const { data: temporaryData, error: temporaryError } = await supabase
        .from('vendor_weekly_availability')
        .select('vendor_id, name, mobile_no, services, area, societies, is_verified, created_at')
        .order('created_at', { ascending: false });

      if (temporaryError) {
        console.error('Error fetching temporary vendors:', temporaryError);
      }

      const permanentVendors = (permanentData || []).map(v => ({ ...v, table_name: 'vendor_permanent_availability' }));
      const temporaryVendors = (temporaryData || []).map(v => ({ ...v, table_name: 'vendor_weekly_availability' }));

      setVendors([...permanentVendors, ...temporaryVendors]);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch vendors',
        variant: 'destructive',
      });
    }
  };

  const handleVerificationToggle = async (vendor: Vendor) => {
    if (!auth.currentUser) return;

    try {
      const newVerificationStatus = !vendor.is_verified;
      
      // Call the database function to update verification status
      const { error } = await supabase.rpc('update_vendor_verification', {
        p_vendor_id: vendor.vendor_id,
        p_table_name: vendor.table_name,
        p_is_verified: newVerificationStatus,
        p_admin_id: auth.currentUser.uid,
        p_admin_email: auth.currentUser.email || '',
        p_vendor_name: vendor.name
      });

      if (error) {
        throw error;
      }

      // Update local state
      setVendors(prev => prev.map(v => 
        v.vendor_id === vendor.vendor_id && v.table_name === vendor.table_name
          ? { ...v, is_verified: newVerificationStatus }
          : v
      ));

      toast({
        title: 'Success',
        description: `Vendor ${newVerificationStatus ? 'verified' : 'unverified'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating verification status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setIsAdmin(false);
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      router.push('/admin');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    if (activeTab === 'permanent') {
      return vendor.table_name === 'vendor_permanent_availability';
    } else {
      return vendor.table_name === 'vendor_weekly_availability';
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-lg mx-auto mt-10 p-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
            <p className="text-center text-gray-600 mb-6">
              Please login to access admin features
            </p>
            <Button 
              onClick={() => router.push('/admin/login')} 
              className="w-full"
            >
              Login
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-lg mx-auto mt-10 p-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Access Denied</h2>
            <p className="text-center text-gray-600 mb-6">
              You don't have admin privileges to access this page.
            </p>
            <Button 
              onClick={handleLogout} 
              className="w-full"
            >
              Logout
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Vendor Verification Management</h2>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('permanent')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'permanent'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Permanent Vendors
            </button>
            <button
              onClick={() => setActiveTab('temporary')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'temporary'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Temporary Vendors
            </button>
          </div>

          {/* Vendors Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-center table-auto">
              <thead>
                <tr>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Name</th>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Mobile</th>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Service</th>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Area</th>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Societies</th>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Status</th>
                  <th className="border px-3 py-2 bg-gray-100 text-base font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor, index) => (
                  <tr key={`${vendor.vendor_id}-${vendor.table_name}-${index}`}>
                    <td className="border px-3 py-2 bg-white font-medium">{vendor.name}</td>
                    <td className="border px-3 py-2 bg-white">{vendor.mobile_no}</td>
                    <td className="border px-3 py-2 bg-white">{vendor.services}</td>
                    <td className="border px-3 py-2 bg-white">{vendor.area}</td>
                    <td className="border px-3 py-2 bg-white">
                      {Array.isArray(vendor.societies) ? vendor.societies.join(', ') : vendor.societies}
                    </td>
                    <td className="border px-3 py-2 bg-white">
                      {vendor.is_verified ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircleIcon className="w-5 h-5 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600">
                          <XCircleIcon className="w-5 h-5 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="border px-3 py-2 bg-white">
                      <Button
                        onClick={() => handleVerificationToggle(vendor)}
                        variant={vendor.is_verified ? "destructive" : "default"}
                        size="sm"
                      >
                        {vendor.is_verified ? 'Unverify' : 'Verify'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} vendors found.
            </div>
          )}
        </Card>
      </main>
    </div>
  );
} 