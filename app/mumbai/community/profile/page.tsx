'use client';

import { useEffect, useState } from 'react';
import { ProfileEdit } from '@/components/ProfileEdit';
import { supabase } from '@/lib/supabase-auth';
import { User } from '@supabase/supabase-js'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

interface UserProfile {
  user_id: string;
  society_name: string;
  building_name: string;
  apartment_number: string;
  email: string;
  phone?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Load profile data from user_profiles table
        try {
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(profileData || null);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <p>Please sign in to view your profile</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Link href="/" passHref>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200 p-4">
              <h1 className="text-2xl font-bold">Profile Settings</h1>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || user.user_metadata?.name || 'User'}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              {/* Display profile information from database */}
              {profile && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-medium mb-3">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Society Name</label>
                      <p className="text-gray-900">{profile.society_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Building Name</label>
                      <p className="text-gray-900">{profile.building_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Apartment Number</label>
                      <p className="text-gray-900">{profile.apartment_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  {profile.updated_at && (
                    <div className="mt-3 text-xs text-gray-500">
                      Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <ProfileEdit initialProfile={profile} />
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <Link href="/" passHref>
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 