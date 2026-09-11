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
  Sparkles,
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
    { label: 'Shop All', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const categoryLinks = [
    { name: 'Traditional Veg Pickles', href: '/shop?category=cat-veg' },
    { name: 'Authentic Non-Veg Pickles', href: '/shop?category=cat-nonveg' },
    { name: 'Spicy Andhra Delights', href: '/shop?category=cat-andhra' },
    { name: 'Seasonal Specials', href: '/shop?category=cat-seasonal' },
    { name: 'Handcrafted Combo Packs', href: '/shop?category=cat-combos' },
  ];

  return (
    <>
      {/* Top Ticker Announcement Bar */}
      <div className="bg-[#eba715] text-stone-950 text-[11px] sm:text-xs font-semibold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-black text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
              Festive Offer
            </span>
            <span className="truncate font-bold text-stone-950">
              Free Express Shipping on all orders above ₹499 • Authentic Handcrafted Indian Pickles
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            {isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[11px] bg-black text-white font-bold px-2.5 py-1 rounded-md hover:bg-stone-800 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
              </Link>
            ) : user ? (
              <Link
                href="/account"
                className="inline-flex items-center gap-1 text-[11px] text-stone-950 hover:underline font-bold"
              >
                <span>My Account ({user.name})</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-[11px] text-stone-950 hover:underline font-bold"
              >
                <span>Customer Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#eba715]/95 backdrop-blur-xl shadow-lg shadow-amber-900/10 py-2 border-[#d97706]/40'
            : 'bg-[#eba715] py-3.5 border-[#d97706]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-950 hover:text-black rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60 h-10 sm:h-12">
                <Image
                  src="/images/logo.svg"
                  alt="Kavyasri Pickles Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
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
                      ? 'text-[#166534] bg-white shadow-xs font-extrabold'
                      : 'text-stone-950 hover:text-[#166534] hover:bg-black/10'
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
                className="px-3.5 py-2 rounded-xl text-sm font-bold text-stone-950 hover:text-[#166534] hover:bg-black/10 flex items-center gap-1 transition-colors"
              >
                <span>Pickle Categories</span>
                <ChevronDown className="w-4 h-4 text-stone-900" />
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
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
              className="p-2 sm:px-3 sm:py-2 text-stone-900 bg-white/90 hover:bg-white rounded-full sm:rounded-xl flex items-center gap-2 text-xs font-semibold border border-black/10 shadow-xs transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-stone-800" />
              <span className="hidden md:inline text-stone-700 font-medium">Search pickles...</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-stone-950 hover:text-black hover:bg-black/10 rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-[#eba715]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-transform active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-black text-white text-[11px] font-black px-1.5 py-0.2 rounded-full">
                {itemCount}
              </span>
              {subtotal > 0 && <span className="hidden md:inline">| ₹{subtotal}</span>}
            </button>

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="p-2 text-stone-950 hover:text-black hover:bg-black/10 rounded-full transition-colors"
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
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-[#faf7f2] rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100">
              <div className="text-xs font-bold uppercase text-stone-400 px-3 mb-2">Categories</div>
              <div className="space-y-1">
                {categoryLinks.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-3 py-1.5 text-xs text-stone-600 hover:text-[#166534]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-3 border-t border-stone-100">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Go to Admin Dashboard</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Dynamic Flash Updates Ticker Bar right underneath Navbar */}
      <FlashUpdateBar />

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </>
  );
}
