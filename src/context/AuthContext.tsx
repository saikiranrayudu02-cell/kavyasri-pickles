'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

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
    // Check localStorage for active session
    const saved = localStorage.getItem('kp_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.email) {
          const assignedRole =
            parsed.email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL ? 'admin' : 'customer';
          const userSession: UserProfile = { ...parsed, role: assignedRole };
          setUser(userSession);

          // Async refresh profile from live Supabase database
          if (isSupabaseConfigured && supabase && assignedRole !== 'admin') {
            supabase
              .from('profiles')
              .select('*')
              .eq('email', parsed.email.trim().toLowerCase())
              .limit(1)
              .then(({ data: dbProf, error }) => {
                if (!error && dbProf && dbProf.length > 0) {
                  const dbUser: UserProfile = {
                    id: dbProf[0].id || parsed.id,
                    name: dbProf[0].full_name || parsed.name,
                    email: dbProf[0].email || parsed.email,
                    phone: dbProf[0].phone || parsed.phone || '',
                    role: 'customer',
                  };
                  setUser(dbUser);
                  localStorage.setItem('kp_current_user', JSON.stringify(dbUser));
                }
              });
          }
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

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both email address and password.' };
    }

    const isSingleAdmin = cleanEmail === PRIMARY_ADMIN_EMAIL;

    // 1. Strict Primary Admin Verification
    if (isSingleAdmin) {
      if (cleanPassword !== PRIMARY_ADMIN_PASSWORD) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Invalid administrator password. Please check your credentials.',
        };
      }

      const adminUser: UserProfile = {
        id: 'admin-001',
        name: 'Kavyasri Admin',
        email: PRIMARY_ADMIN_EMAIL,
        phone: '9876543210',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('kp_current_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Customer Database & Registered User Authentication
    try {
      let dbUserFound = false;
      let matchedProfile: any = null;

      // Query live Supabase profiles table
      if (isSupabaseConfigured && supabase) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .limit(1);

        if (!error && profiles && profiles.length > 0) {
          dbUserFound = true;
          matchedProfile = profiles[0];
        }
      }

      // Check local registered accounts
      const localUsers = getRegisteredUsers();
      const matchedLocal = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      // Reject if account does not exist anywhere
      if (!dbUserFound && !matchedLocal) {
        setIsLoading(false);
        return {
          success: false,
          error: 'No account found with this email address. Please register first.',
        };
      }

      // Verify Password if stored locally
      if (matchedLocal?.password && matchedLocal.password !== cleanPassword) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Incorrect password. Please check your password and try again.',
        };
      }

      // Log in verified user
      const loggedUser: UserProfile = {
        id: matchedProfile?.id || matchedLocal?.id || `user-${Date.now()}`,
        name: matchedProfile?.full_name || matchedLocal?.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: matchedProfile?.phone || matchedLocal?.phone || '',
        role: 'customer',
      };

      // Ensure user record is cached locally for session password check
      saveRegisteredUser({
        id: loggedUser.id,
        name: loggedUser.name,
        email: loggedUser.email,
        phone: loggedUser.phone || '',
        password: cleanPassword,
        role: 'customer',
      });

      setUser(loggedUser);
      localStorage.setItem('kp_current_user', JSON.stringify(loggedUser));
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

    if (cleanEmail === PRIMARY_ADMIN_EMAIL) {
      setIsLoading(false);
      return { success: false, error: 'This email is reserved for system administration.' };
    }

    // Check if user already exists
    const localUsers = getRegisteredUsers();
    if (localUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setIsLoading(false);
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      };
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', cleanEmail)
          .limit(1);

        if (existingProfiles && existingProfiles.length > 0) {
          setIsLoading(false);
          return {
            success: false,
            error: 'An account with this email address already exists. Please sign in.',
          };
        }
      }

      const userUuid =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `90000000-0000-4000-8000-${Date.now().toString().slice(-12)}`;

      const newRecord: RegisteredUserRecord = {
        id: userUuid,
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        password: cleanPassword,
        role: 'customer',
      };

      // Store in persistent local registry
      saveRegisteredUser(newRecord);

      // Activate user session
      const loggedUser: UserProfile = {
        id: userUuid,
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        role: 'customer',
      };
      setUser(loggedUser);
      localStorage.setItem('kp_current_user', JSON.stringify(loggedUser));

      // Insert into Supabase database profiles table (valid columns only)
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('profiles').upsert({
            id: userUuid,
            email: cleanEmail,
            full_name: name.trim(),
            phone: phone.trim(),
            role: 'customer',
          });
        } catch (dbErr) {
          console.error('Supabase profile insertion error:', dbErr);
        }
      }

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
