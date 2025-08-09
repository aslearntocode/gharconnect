"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-auth';

export type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  supabase: typeof supabase;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    return {
      currentUser: null,
      loading: true,
      supabase,
    };
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user || null;
        setCurrentUser(user);
        setLoading(false);
      } catch (error) {
        console.error('AuthContext: Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set a timeout to prevent loading state from getting stuck
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [loading]);

  const value = {
    currentUser,
    loading,
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 