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
    <div className="min-h-screen flex bg-[#faf7f2] font-sans text-stone-900">
      {/* Desktop White Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col bg-white text-stone-700 border-r border-stone-200 shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-stone-100 flex items-center justify-between">
          {!isCollapsed ? (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="relative w-40 h-9">
                <Image src="/images/logo.svg" alt="Kavyasri Admin" fill className="object-contain object-left" />
              </div>
            </Link>
          ) : (
            <Link href="/admin" className="mx-auto" title="Kavyasri Admin">
              <div className="w-9 h-9 rounded-xl bg-[#9e1b1e] text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
                K
              </div>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors ${
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
                className={`flex items-center rounded-xl text-xs font-bold transition-all ${
                  isCollapsed ? 'justify-center py-3' : 'gap-3 px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#9e1b1e] text-white shadow-md shadow-red-900/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Quick Link to Live Store */}
        <div className="p-3 border-t border-stone-100">
          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? 'View Live Storefront' : undefined}
            className={`flex items-center rounded-xl text-xs font-bold text-[#9e1b1e] bg-red-50 border border-red-100 hover:bg-red-100/60 transition-colors ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2'
            }`}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Live Storefront</span>}
            </span>
            {!isCollapsed && (
              <span className="text-[10px] bg-white text-[#9e1b1e] px-1.5 py-0.5 rounded font-extrabold border border-red-200">
                View
              </span>
            )}
          </Link>
        </div>

        {/* Bottom Profile / Logout */}
        <div
          className={`p-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/80 ${
            isCollapsed ? 'flex-col gap-2' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#9e1b1e] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              K
            </div>
            {!isCollapsed && (
              <div className="min-w-0 text-xs">
                <p className="font-bold text-stone-900 truncate">Kavyasri Admin</p>
                <p className="text-[10px] text-stone-400 truncate">Store Manager</p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            title="Sign Out Admin"
            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Desktop Expand Button when collapsed */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Mobile Drawer Toggle Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:text-black rounded-lg hover:bg-stone-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <span className="text-xs font-extrabold uppercase tracking-wider text-[#9e1b1e] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
              Management Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#9e1b1e] bg-stone-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-white text-stone-700 flex flex-col h-full z-10 border-r border-stone-200 shadow-2xl">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="relative w-40 h-8">
                <Image src="/images/logo.svg" alt="Kavyasri Admin" fill className="object-contain object-left" />
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg"
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#9e1b1e] text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-stone-100 bg-stone-50">
              <button
                onClick={() => {
                  logout();
                  setIsMobileDrawerOpen(false);
                  router.push('/');
                }}
                className="w-full py-2 bg-[#9e1b1e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
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
