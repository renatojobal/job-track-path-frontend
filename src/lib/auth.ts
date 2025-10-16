import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

class AuthService {
  private isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co' ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co';

  async signUp(email: string, password: string) {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (this.isDemoMode) {
      // Mock successful signup with delay to simulate real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: `demo-${Date.now()}`,
        email,
        user_metadata: { name: email.split('@')[0] }
      };
      
      // Store in sessionStorage for demo mode persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mock-user', JSON.stringify(mockUser));
      }
      
      return { user: mockUser, session: { user: mockUser } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (this.isDemoMode) {
      // Mock successful signin with delay to simulate real API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = {
        id: `demo-${Date.now()}`,
        email,
        user_metadata: { name: email.split('@')[0] }
      };
      
      // Store in sessionStorage for demo mode persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mock-user', JSON.stringify(mockUser));
      }
      
      return { user: mockUser, session: { user: mockUser } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    if (this.isDemoMode) {
      // Mock successful signout with slight delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear demo user from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mock-user');
      }
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    if (this.isDemoMode) {
      // Check if we have a mock user in sessionStorage
      if (typeof window !== 'undefined') {
        const mockUser = sessionStorage.getItem('mock-user');
        return mockUser ? JSON.parse(mockUser) : null;
      }
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  onAuthStateChange(callback: (user: any) => void) {
    if (this.isDemoMode) {
      // Mock auth state change listener
      if (typeof window !== 'undefined') {
        const mockUser = sessionStorage.getItem('mock-user');
        setTimeout(() => callback(mockUser ? JSON.parse(mockUser) : null), 100);
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

export const authService = new AuthService();