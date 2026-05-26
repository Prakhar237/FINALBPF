import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

// We'll still use the User type from Supabase for compatibility with the rest of the app,
// but we'll create a mock user and store it in localStorage instead of calling Supabase.

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendEmailConfirmation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bpf_local_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is cached locally
    const cachedUserStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedUserStr) {
      try {
        const parsedUser = JSON.parse(cachedUserStr);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error parsing cached user', e);
      }
    }
    setLoading(false);
  }, []);

  const createMockUser = (email: string, username?: string): User => {
    return {
      id: `local-user-${Date.now()}`,
      aud: 'authenticated',
      role: 'authenticated',
      email: email,
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmation_sent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { display_name: username || email.split('@')[0] },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      factors: null
    };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const mockUser = createMockUser(email, username);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  };

  const signIn = async (email: string, password: string) => {
    // Check if there's a cached user first
    const cachedUserStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    let mockUser;
    
    if (cachedUserStr) {
      try {
        const parsedUser = JSON.parse(cachedUserStr);
        // If email matches or we just want to let them in
        if (parsedUser.email === email) {
          mockUser = parsedUser;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!mockUser) {
      mockUser = createMockUser(email);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
    }
    
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  };

  const handleSignOut = async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string) => {
    // Mock reset password
    console.log(`Mock reset password email sent to ${email}`);
  };

  const sendEmailConfirmation = async () => {
    // Mock email confirmation
    console.log('Mock confirmation email sent');
  };

  const value = {
    currentUser,
    isAuthenticated,
    signUp,
    signIn,
    signOut: handleSignOut,
    resetPassword,
    sendEmailConfirmation
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}