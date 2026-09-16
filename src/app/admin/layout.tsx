'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Flash Updates', href: '/admin/flash-updates', icon: Zap },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-portal h-screen max-h-screen flex overflow-hidden bg-linear-to-b from-[#fbf9f5] via-[#f7f3ec] to-[#f4efe6] font-sans text-stone-900 tracking-[-0.02em] selection:bg-emerald-500/20 selection:text-[#166534]">
      {/* Desktop Apple macOS Translucent Glass Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col bg-white/80 backdrop-blur-2xl backdrop-saturate-180 text-stone-700 border-r border-stone-200/60 shrink-0 h-screen transition-all duration-300 ease-out z-30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-stone-200/50 flex items-center justify-between">
          {!isCollapsed ? (
            <Link href="/admin" className="flex items-center gap-2.5 group active:scale-95 transition-transform duration-200">
              <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden shadow-xs border border-stone-200 bg-stone-50">
                <Image src="/images/logo.png" alt="Kavyasri Admin" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-stone-900 text-sm tracking-tight leading-tight">
                  Kavyasri <span className="text-[#166534]">Admin</span>
                </span>
                <span className="text-[9px] font-semibold text-stone-500 uppercase tracking-wider">Control Center</span>
              </div>
            </Link>
          ) : (
            <Link href="/admin" className="mx-auto group active:scale-95 transition-transform duration-200" title="Kavyasri Admin">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-emerald-300 shadow-sm">
                <Image src="/images/logo.png" alt="Kavyasri Admin" fill className="object-cover" />
              </div>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200/50 active:scale-90 transition-all ${
              isCollapsed ? 'hidden' : 'block'
            }`}
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                  isCollapsed ? 'justify-center py-3' : 'gap-3 px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-linear-to-r from-[#166534] to-[#15803d] text-white shadow-[0_4px_16px_rgba(22,101,52,0.25)] font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white scale-110' : 'text-stone-400 group-hover:text-stone-700'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Quick Link to Live Store */}
        <div className="p-3 border-t border-stone-200/50">
          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? 'View Live Storefront' : undefined}
            className={`flex items-center rounded-2xl text-xs font-bold text-[#166534] bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 transition-all ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2'
            }`}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Live Storefront</span>}
            </span>
            {!isCollapsed && (
              <span className="text-[10px] bg-white text-[#166534] px-2 py-0.5 rounded-lg font-bold border border-emerald-500/20 shadow-2xs">
                View
              </span>
            )}
          </Link>
        </div>

        {/* Bottom Profile / Logout */}
        <div
          className={`p-3 border-t border-stone-200/50 flex items-center justify-between bg-stone-100/50 backdrop-blur-md ${
            isCollapsed ? 'flex-col gap-2' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8.5 h-8.5 rounded-2xl bg-linear-to-br from-[#166534] to-[#15803d] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              K
            </div>
            {!isCollapsed && (
              <div className="min-w-0 text-xs">
                <p className="font-bold text-stone-900 truncate">Kavyasri Admin</p>
                <p className="text-[10px] text-stone-500 font-medium truncate">Store Manager</p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            title="Sign Out Admin"
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Floating Apple Chrome Navbar */}
        <header className="bg-white/80 backdrop-blur-2xl backdrop-saturate-180 border-b border-stone-200/60 h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Expand Button when collapsed */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl active:scale-90 transition-all"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Mobile Drawer Toggle Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:text-black rounded-xl hover:bg-stone-100 active:scale-90 transition-all"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-[10px] xs:text-xs font-bold uppercase tracking-wider text-[#166534] bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 shadow-2xs backdrop-blur-xs truncate">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/"
              title="View Public Store"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#166534] bg-stone-100/90 hover:bg-stone-200/70 p-2 sm:px-3.5 sm:py-2 rounded-2xl active:scale-95 transition-all shadow-2xs border border-stone-200/60"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              title="Sign Out Admin"
              className="text-xs font-semibold text-rose-700 bg-rose-50/90 border border-rose-200/80 hover:bg-rose-100 p-2 sm:px-3.5 sm:py-2 rounded-2xl active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Canvas Page Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[82vw] bg-white/95 backdrop-blur-2xl text-stone-700 flex flex-col h-full z-10 border-r border-stone-200/80 shadow-2xl">
            <div className="p-4 border-b border-stone-200/60 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                  <Image src="/images/logo.png" alt="Kavyasri Admin" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-900 text-xs tracking-tight leading-tight">
                    Kavyasri <span className="text-[#166534]">Admin</span>
                  </span>
                  <span className="text-[8px] font-semibold text-stone-500 uppercase tracking-wider">Control Center</span>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-xl active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-linear-to-r from-[#166534] to-[#15803d] text-white shadow-md shadow-emerald-900/20 font-extrabold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-stone-200/60 bg-stone-50/80">
              <button
                onClick={() => {
                  logout();
                  setIsMobileDrawerOpen(false);
                  router.push('/');
                }}
                className="w-full py-2.5 bg-rose-600 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
