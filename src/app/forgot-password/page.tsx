'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Password reset link sent to your email!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <div className="relative w-64 h-12 mx-auto">
            <Image src="/images/logo.svg" alt="Kavyasri Pickles" fill className="object-contain" priority />
          </div>
        </Link>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Reset Password</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-stone-200 sm:px-10">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <p className="text-xs text-stone-600">
                A password reset link has been dispatched to <strong>{email}</strong>.
              </p>
              <Link
                href="/login"
                className="inline-block text-xs font-bold text-[#166534] hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Enter Your Registered Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-stone-500 hover:text-stone-900">
                  Cancel and return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
