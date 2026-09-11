'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Save,
  Bell,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import AccountHeader from '@/components/account/AccountHeader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await updateProfile({ name, email, phone });
    setIsSubmitting(false);

    if (success) {
      setIsSaved(true);
      showToast('Profile information updated successfully! 🎉', 'success');
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'KP';

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AccountHeader activeTab="profile" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Main Profile Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
              <div className="flex items-center gap-4 border-b border-stone-100 pb-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#166534] via-[#d97706] to-[#9e1b1e] p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center font-serif text-xl font-bold text-amber-300">
                    {initials}
                  </div>
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                    Personal Identity & Contact
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Keep your contact details up to date for dispatch alerts and doorstep delivery.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kavyasri Devi"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Email Address
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Used for invoices
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210 (For courier SMS & WhatsApp tracking)"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/40 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Delivery partners call this number to coordinate doorstep pickle handover.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  {isSaved && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4" /> Saved successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right 1 Col: Security & Privacy Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Account Security
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Your personal information is secure.
                  </p>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                  <span>Your email and addresses are encrypted and never shared with third-party marketers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Bell className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                  <span>Receive WhatsApp tracking alerts only when your artisan jar is packed and dispatched.</span>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-orange-50/60 rounded-3xl p-6 border border-amber-200/80 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">
                Food Safety Assured
              </span>
              <h4 className="font-serif font-bold text-base text-stone-900 mt-2 mb-1">
                FSSAI Certified Kitchen
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every batch is prepared in hygienic small-batch vessels using solar-dried red chillies and pure groundnut oil.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
