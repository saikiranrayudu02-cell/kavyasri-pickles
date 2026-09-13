'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth, PRIMARY_ADMIN_EMAIL } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      const cleanEmail = email.trim().toLowerCase();
      const isAdminUser = cleanEmail === PRIMARY_ADMIN_EMAIL;

      showToast(
        isAdminUser
          ? 'Signed in as Administrator! 🔑'
          : `Welcome back to Kavyasri Pickles! 🌶️`,
        'success'
      );

      if (isAdminUser) {
        router.push('/admin');
      } else if (redirectParam && redirectParam.startsWith('/')) {
        router.push(redirectParam);
      } else {
        router.push('/account');
      }
    } else {
      showToast(result.error || 'Sign in failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#166534_1px,transparent_1px)] bg-size-[20px_20px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-amber-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 animate-fade-in-up">
        <Link href="/" className="inline-flex flex-col items-center mb-4 group">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-amber-200/80 bg-amber-50">
            <Image src="/images/logo.png" alt="Kavyasri Pickles" fill className="object-cover transition-transform duration-300 group-hover:scale-105" priority />
          </div>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          {redirectParam
            ? 'Sign in to access products, add items to cart, and place orders.'
            : 'Access your order history, profile, and saved delivery addresses.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10 animate-fade-in-up stagger-2">
        <div className="bg-white py-8 px-6 shadow-xl shadow-stone-200/50 rounded-3xl border border-stone-200/80 sm:px-10">
          {redirectParam && (
            <div className="mb-5 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-900 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Please sign in or create an account to access, buy, and add products to your cart.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-stone-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-[#166534] hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 text-sm rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none p-0.5 rounded-lg hover:bg-stone-100"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#166534]" />
                  ) : (
                    <Eye className="w-4 h-4 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all btn-press disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-500">
              Don&apos;t have an account yet?{' '}
              <Link
                href={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : '/register'}
                className="font-bold text-[#166534] hover:underline"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
