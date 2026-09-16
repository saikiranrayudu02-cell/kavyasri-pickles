'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/layout/CartDrawer';

export default function SubpageHeader({ title }: { title?: string }) {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { isAdmin } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fdf8ed]/95 backdrop-blur-xl border-b border-[#ebdcc1] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Back button & Home Page Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs transition-all border border-[#ebdcc1] shadow-2xs active:scale-95 shrink-0"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 text-[#9e1b1e]" />
              <span className="hidden xs:inline">Back</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden shadow-xs border border-amber-200/60 bg-amber-50">
                <Image
                  src="/images/logo.png"
                  alt="Kavyasri Pickles Logo"
                  fill
                  sizes="(max-width: 640px) 32px, 40px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-stone-900 text-xs sm:text-base tracking-tight leading-tight group-hover:text-[#9e1b1e] transition-colors">
                  Kavyasri <span className="text-[#9e1b1e]">Pickles</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-amber-900/80 tracking-wider uppercase hidden xs:inline">
                  Traditional • Homemade
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white font-bold text-xs transition-all shadow-xs shrink-0"
                title="Go to Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-stone-800 hover:text-[#9e1b1e] rounded-xl hover:bg-stone-200/50 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9e1b1e] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#fdf8ed] shadow-xs animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
