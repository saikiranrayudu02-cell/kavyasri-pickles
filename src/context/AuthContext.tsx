'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { logUserActivity } from '@/lib/supabase/activity';

export const PRIMARY_ADMIN_EMAIL = 'kavya123@gmail.com';
export const PRIMARY_ADMIN_PASSWORD = 'kavya1234';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface RegisteredUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'customer' | 'admin';
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getRegisteredUsers(): RegisteredUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('kp_registered_users');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegisteredUser(newUser: RegisteredUserRecord) {
  if (typeof window === 'undefined') return;
  const existing = getRegisteredUsers();
  const filtered = existing.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
  filtered.push(newUser);
  localStorage.setItem('kp_registered_users', JSON.stringify(filtered));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('kp_current_user', JSON.stringify(data.user));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching auth session:', err);
      }

      // Local storage fallback if offline
      const saved = localStorage.getItem('kp_current_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.email) {
            const assignedRole =
              parsed.email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL ? 'admin' : 'customer';
            const userSession: UserProfile = { ...parsed, role: assignedRole };
            setUser(userSession);
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
    }

    initSession();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both email address and password.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Authentication failed.' };
      }

      const loggedUser: UserProfile = data.user;
      setUser(loggedUser);
      localStorage.setItem('kp_current_user', JSON.stringify(loggedUser));
      saveRegisteredUser({
        id: loggedUser.id,
        name: loggedUser.name,
        email: loggedUser.email,
        phone: loggedUser.phone || '',
        password: cleanPassword,
        role: loggedUser.role,
      });

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      return {
        success: false,
        error: 'Authentication failed due to a system error. Please try again.',
      };
    }
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!name.trim() || !cleanEmail || !phone.trim() || !cleanPassword) {
      setIsLoading(false);
      return { success: false, error: 'Please complete all required registration fields.' };
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          password: cleanPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Registration failed.' };
      }

      const registeredUser: UserProfile = data.user;
      setUser(registeredUser);
      localStorage.setItem('kp_current_user', JSON.stringify(registeredUser));
      saveRegisteredUser({
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        phone: registeredUser.phone || '',
        password: cleanPassword,
        role: registeredUser.role,
      });

      setIsLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      setIsLoading(false);
      return { success: false, error: 'Registration failed. Please try again.' };
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

        logUserActivity({
          action: 'PROFILE_UPDATE',
          user_id: user.id,
          user_email: user.email,
          details: data,
        });
      } catch (err) {
        console.error('Supabase profile update error:', err);
      }
    }

    return true;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
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
