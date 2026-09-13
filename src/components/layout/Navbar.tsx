'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchModal from './SearchModal';
import CartDrawer from './CartDrawer';
import FlashUpdateBar from './FlashUpdateBar';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, subtotal, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      if (document.body.style.position === 'fixed') {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
      }
    }
    return () => {
      const scrollY = document.body.style.top;
      if (document.body.style.position === 'fixed') {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
      }
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    setIsCategoriesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Veg Pickles', href: '/veg-pickles' },
    { label: 'Shop All', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const categoryLinks = [
    { name: 'Traditional Veg Pickles (20)', href: '/veg-pickles' },
    { name: 'Authentic Non-Veg Pickles (6)', href: '/shop?category=cat-nonveg' },
    { name: 'Spices & Karam Powders (13)', href: '/shop?category=cat-spices' },
    { name: 'Spicy Andhra Delights', href: '/shop?category=cat-andhra' },
    { name: 'Seasonal Specials', href: '/shop?category=cat-seasonal' },
    { name: 'Handcrafted Combo Packs', href: '/shop?category=cat-combos' },
  ];

  return (
    <>
      {/* Sticky Top Navigation Wrapper */}
      <div className="sticky top-0 z-40 w-full">
        {/* Main Header */}
        <header
          className={`border-b py-2 sm:py-3 transition-[background-color,box-shadow,border-color] duration-200 ${
            isScrolled
              ? 'bg-[#fdf8ed]/98 backdrop-blur-2xl shadow-md shadow-amber-950/5 border-[#ebdcc1]'
              : 'bg-[#fdf8ed]/95 backdrop-blur-xl border-[#ebdcc1]'
          }`}
        >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1 sm:gap-4">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-stone-800 hover:text-stone-950 rounded-xl hover:bg-stone-200/50 transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-13 sm:h-13 shrink-0 rounded-full overflow-hidden shadow-xs border border-amber-200/60 bg-amber-50">
                <Image
                  src="/images/logo.png"
                  alt="Kavyasri Pickles Logo"
                  fill
                  sizes="(max-width: 640px) 40px, 52px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-stone-900 text-sm sm:text-lg tracking-tight leading-tight group-hover:text-[#9e1b1e] transition-colors">
                  Kavyasri <span className="text-[#9e1b1e]">Pickles</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-amber-900/80 tracking-wider uppercase">
                  Traditional • Homemade
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-[#9e1b1e] bg-white shadow-xs font-extrabold border border-[#ebdcc1]/80'
                      : 'text-stone-800 hover:text-[#9e1b1e] hover:bg-stone-200/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                className="px-3.5 py-2 rounded-xl text-sm font-bold text-stone-800 hover:text-[#9e1b1e] hover:bg-stone-200/40 flex items-center gap-1 transition-colors"
              >
                <span>Pickle Categories</span>
                <ChevronDown className="w-4 h-4 text-stone-600" />
              </button>

              {isCategoriesDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200/80 py-2 z-50 animate-scale-in origin-top-left"
                >
                  {categoryLinks.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#faf7f2] hover:text-[#166534] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <Link
                      href="/shop"
                      className="px-4 py-2 text-xs font-bold text-[#166534] hover:bg-emerald-50 flex items-center justify-between"
                    >
                      <span>View Full Catalogue</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#166534]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-stone-800 bg-white hover:bg-stone-50 rounded-full sm:rounded-xl flex items-center gap-2 text-xs font-semibold border border-[#ebdcc1] shadow-xs transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-stone-600" />
              <span className="hidden md:inline text-stone-600 font-medium">Search pickles...</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-stone-800 hover:text-[#9e1b1e] hover:bg-stone-200/50 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#9e1b1e] text-white text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-[#fdf8ed]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-950/15 transition-transform active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-amber-400 text-stone-950 text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {itemCount}
                </span>
              )}
              {subtotal > 0 && <span className="hidden md:inline">| ₹{subtotal}</span>}
            </button>

            {/* Admin Panel Direct Link (when logged in as admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white rounded-xl text-xs font-bold shadow-md shadow-red-950/15 transition-transform active:scale-95 shrink-0"
                title="Go to Admin Panel"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="p-2 text-stone-800 hover:text-[#9e1b1e] hover:bg-stone-200/50 rounded-full transition-colors"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
              </button>

              {isAccountDropdownOpen && (
                <div
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-stone-100 bg-[#faf7f2]/70">
                        <p className="text-xs text-stone-500 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${user.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800'
                              }`}
                          >
                            {user.role}
                          </span>
                          <span className="text-[11px] text-stone-400 truncate">{user.email}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        >
                          <User className="w-4 h-4 text-stone-400" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        >
                          <Package className="w-4 h-4 text-stone-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/account/addresses"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        >
                          <Package className="w-4 h-4 text-stone-400" />
                          <span>Saved Addresses</span>
                        </Link>
                      </div>

                      {isAdmin && (
                        <div className="border-t border-stone-100 py-1 bg-amber-50/50">
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#166534] hover:bg-amber-100/60"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-stone-100 pt-1">
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-emerald-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <Link
                        href="/login"
                        className="block w-full text-center py-2 bg-[#166534] text-white text-xs font-bold rounded-xl hover:bg-[#14532d]"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full text-center py-2 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl hover:bg-stone-200"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Mobile Menu Backdrop */}
            <div
              className="fixed inset-0 top-14 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
              style={{ touchAction: 'none' }}
            />

            {/* Mobile Menu Drawer */}
            <div className="relative z-40 lg:hidden border-t border-stone-200/80 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-8 space-y-4 animate-fade-in shadow-2xl max-h-[85vh] overflow-y-auto overscroll-y-contain">
              {/* Mobile User Quick Info / Login Banner */}
              <div className="p-3.5 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50/70 border border-amber-200/80 flex items-center justify-between">
                {user ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#166534] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full gap-2">
                    <div>
                      <p className="text-xs font-bold text-stone-900">Welcome to Kavyasri!</p>
                      <p className="text-[10px] text-stone-500">Sign in to track your orders</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3.5 py-1.5 bg-[#166534] text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Primary Nav Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#166534] text-white shadow-xs'
                          : 'text-stone-800 hover:bg-[#faf7f2] active:bg-stone-100'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Category Quick Chips */}
              <div className="pt-3 border-t border-stone-100">
                <div className="text-[10px] font-black uppercase text-stone-400 px-1 mb-2 tracking-wider">
                  Explore Categories
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {categoryLinks.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 hover:text-[#166534] hover:bg-emerald-50/50 rounded-xl transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-stone-300">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Admin Dashboard shortcut if admin */}
              {isAdmin && (
                <div className="pt-3 border-t border-stone-100">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 bg-amber-100/90 text-amber-950 rounded-xl text-xs font-bold border border-amber-300/80 shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Admin Management Portal</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </header>
      </div>

      {/* Dynamic Flash Updates Ticker Bar — strictly on home screen only */}
      {pathname === '/' && <FlashUpdateBar />}

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </>
  );
}
