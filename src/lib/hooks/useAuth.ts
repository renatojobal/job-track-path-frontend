'use client';

import { useState, useEffect } from 'react';
import { authService, AuthUser } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            name: currentUser.user_metadata?.name,
          });
        }
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signIn(email, password);
      
      // Handle mock mode
      if (result?.user && typeof window !== 'undefined') {
        const authUser = {
          id: result.user.id,
          email: result.user.email || '',
          name: result.user.user_metadata?.name,
        };
        setUser(authUser);
        sessionStorage.setItem('mock-user', JSON.stringify(result.user));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signUp(email, password);
      
      // Handle mock mode
      if (result?.user && typeof window !== 'undefined') {
        const authUser = {
          id: result.user.id,
          email: result.user.email || '',
          name: result.user.user_metadata?.name,
        };
        setUser(authUser);
        sessionStorage.setItem('mock-user', JSON.stringify(result.user));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      
      // Handle mock mode
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mock-user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
};