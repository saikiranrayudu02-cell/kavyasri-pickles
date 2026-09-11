'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const PRIMARY_ADMIN_EMAIL = 'admin@kavyasripickles.com';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const saved = localStorage.getItem('kp_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          // Enforce strict single admin rule on stored user
          const assignedRole = parsed.email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL ? 'admin' : 'customer';
          setUser({ ...parsed, role: assignedRole });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const isSingleAdmin = cleanEmail === PRIMARY_ADMIN_EMAIL;
    const assignedRole: 'customer' | 'admin' = isSingleAdmin ? 'admin' : 'customer';

    try {
      if (isSupabaseConfigured && supabase) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .limit(1);

        if (!error && profiles && profiles.length > 0) {
          const prof = profiles[0];
          const loggedUser: UserProfile = {
            id: prof.id,
            name: prof.full_name || cleanEmail.split('@')[0],
            email: prof.email,
            phone: prof.phone || '',
            role: assignedRole,
          };
          setUser(loggedUser);
          localStorage.setItem('kp_current_user', JSON.stringify(loggedUser));
          return true;
        }
      }

      // If user profile not found in Supabase yet, create new profile
      const newUuid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `90000000-0000-4000-8000-${Date.now().toString().slice(-12)}`;

      const newUser: UserProfile = {
        id: newUuid,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '',
        role: assignedRole,
      };

      setUser(newUser);
      localStorage.setItem('kp_current_user', JSON.stringify(newUser));

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').insert({
          id: newUuid,
          email: cleanEmail,
          full_name: newUser.name,
          role: assignedRole,
        });
      }

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    // Registration is ALWAYS customer role - no secondary admin can ever be created
    const assignedRole: 'customer' | 'admin' = cleanEmail === PRIMARY_ADMIN_EMAIL ? 'admin' : 'customer';

    try {
      const userUuid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `90000000-0000-4000-8000-${Date.now().toString().slice(-12)}`;

      const newUser: UserProfile = {
        id: userUuid,
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        role: assignedRole,
      };

      setUser(newUser);
      localStorage.setItem('kp_current_user', JSON.stringify(newUser));

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('profiles').insert({
          id: userUuid,
          email: cleanEmail,
          full_name: name.trim(),
          phone: phone.trim(),
          role: assignedRole,
        });
        if (error) console.error('Supabase profile creation error:', error.message);
      }

      return true;
    } catch (err) {
      console.error('Signup error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    const updatedUser: UserProfile = {
      ...user,
      ...data,
    };

    setUser(updatedUser);
    localStorage.setItem('kp_current_user', JSON.stringify(updatedUser));

    if (isSupabaseConfigured && supabase && user.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
          })
          .eq('id', user.id);
      } catch (err) {
        console.error('Supabase profile update error:', err);
      }
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kp_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
