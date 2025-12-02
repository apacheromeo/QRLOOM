import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter();
  const { user, profile, loading, setUser, setProfile, setLoading, clearAuth } =
    useAuthStore();

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [setProfile]);

  // Initialize auth state
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setProfile(data.profile);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [setUser, setProfile, setLoading, clearAuth]);

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Sign in failed');
        }

        setUser(data.user);
        setProfile(data.profile);

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign in failed',
        };
      } finally {
        setLoading(false);
      }
    },
    [setUser, setProfile, setLoading]
  );

  // Sign up
  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Sign up failed');
        }

        setUser(data.user);
        setProfile(data.profile);

        return { success: true, message: data.message };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Sign up failed',
        };
      } finally {
        setLoading(false);
      }
    },
    [setUser, setProfile, setLoading]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/signout', { method: 'POST' });
      clearAuth();
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      };
    } finally {
      setLoading(false);
    }
  }, [clearAuth, router, setLoading]);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Password reset failed',
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
