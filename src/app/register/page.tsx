'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      showToast('Please fill all required registration fields.', 'error');
      return;
    }

    setIsLoading(true);
    const success = await signup(name, email, phone);
    setIsLoading(false);

    if (success) {
      showToast(`Welcome to Kavyasri Pickles, ${name}! 🌶️`, 'success');
      if (redirectParam && redirectParam.startsWith('/')) {
        router.push(redirectParam);
      } else {
        router.push('/shop');
      }
    } else {
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#eba715]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#166534]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 animate-fade-in-up">
        <Link href="/" className="inline-block mb-4 group transition-transform duration-300 hover:scale-105">
          <div className="relative w-64 h-12 mx-auto">
            <Image src="/images/logo.svg" alt="Kavyasri Pickles" fill className="object-contain" priority />
          </div>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Create Customer Account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          {redirectParam
            ? 'Create an account to access, purchase, and enjoy authentic homemade pickles.'
            : 'Join 10,000+ happy pickle lovers across India and enjoy authentic homemade flavors.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10 animate-fade-in-up stagger-2">
        <div className="bg-white py-8 px-6 shadow-xl shadow-stone-200/50 rounded-3xl border border-stone-200/80 sm:px-10">
          {redirectParam && (
            <div className="mb-5 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-900 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Create an account to access products, add items to cart, and place your order.</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Varma"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none p-0.5 rounded-lg hover:bg-stone-100"
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
              className="w-full py-3.5 bg-[#166534] hover:bg-[#14532d] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register & Start Shopping</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-500">
            Already have an account?{' '}
            <Link
              href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
              className="font-bold text-[#166534] hover:text-[#14532d] hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
