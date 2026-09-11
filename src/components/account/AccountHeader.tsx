'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  MapPin,
  User,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useAuth, PRIMARY_ADMIN_EMAIL } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface AccountHeaderProps {
  activeTab: 'overview' | 'orders' | 'addresses' | 'profile';
  orderCount?: number;
  addressCount?: number;
}

export default function AccountHeader({
  activeTab,
  orderCount,
  addressCount,
}: AccountHeaderProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    showToast('You have been signed out successfully.', 'info');
    router.push('/login');
  };

  const isAdmin = user?.email?.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'KP';

  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      href: '/account',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'orders',
      label: 'My Orders',
      href: '/account/orders',
      icon: Package,
      badge: typeof orderCount === 'number' && orderCount > 0 ? orderCount : null,
    },
    {
      id: 'addresses',
      label: 'Saved Addresses',
      href: '/account/addresses',
      icon: MapPin,
      badge: typeof addressCount === 'number' && addressCount > 0 ? addressCount : null,
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      href: '/account/profile',
      icon: User,
      badge: null,
    },
  ];

  return (
    <div className="w-full mb-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#166534] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link
          href="/account"
          className={activeTab === 'overview' ? 'text-stone-900 font-bold' : 'hover:text-[#166534] transition-colors'}
        >
          My Account
        </Link>
        {activeTab !== 'overview' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold capitalize">
              {activeTab === 'orders'
                ? 'Orders & Tracking'
                : activeTab === 'addresses'
                ? 'Delivery Addresses'
                : 'Profile Settings'}
            </span>
          </>
        )}
      </nav>

      {/* Profile Hero Card */}
      {user ? (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 shadow-xl shadow-stone-900/10 border border-stone-800">
          {/* Subtle Decorative Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-amber-500/15 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-linear-to-tr from-emerald-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar & Identity */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-[#166534] via-[#d97706] to-[#9e1b1e] p-0.5 shadow-lg shadow-amber-900/20">
                  <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center font-serif text-xl sm:text-2xl font-black text-amber-300">
                    {initials}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-stone-900" title="Verified Customer">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Namaste, {user.name || 'Food Lover'}! 🙏
                  </h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 flex items-center gap-2">
                  <span>{user.email}</span>
                  {user.phone && (
                    <>
                      <span className="text-stone-600">•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                    🌿 Authentic Heritage Member
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-stone-800/80 text-stone-300 border border-stone-700/50 hidden sm:inline-block">
                    Wood-Pressed Oils Only
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <span>Admin Panel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
              <Link
                href="/shop"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Shop Pickles</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-semibold transition-all border border-red-800/40 flex items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Not Logged In Banner */
        <div className="rounded-3xl bg-linear-to-br from-amber-50 via-emerald-50/50 to-orange-50 border border-amber-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#166534] bg-emerald-100/60 px-2.5 py-1 rounded-md">
              Kavyasri Pickles Club
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Welcome to Your Pickle Hub
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Sign in to track real-time delivery status, view past artisan batches, manage saved delivery addresses, and enjoy 1-click checkout.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-[#166534]/20 flex items-center gap-2 whitespace-nowrap"
            >
              <span>Sign In / Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Modern Navigation Tabs */}
      <div className="mt-8 border-b border-stone-200/80 pb-px">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 select-none ${
                  isActive
                    ? 'bg-[#166534] text-white shadow-md shadow-[#166534]/25 scale-[1.02]'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 border border-stone-200/70 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isActive
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
