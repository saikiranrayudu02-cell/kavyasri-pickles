'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/layout/CartDrawer';

export default function SubpageHeader({ title }: { title?: string }) {
  const { itemCount, setIsCartDrawerOpen } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fdf8ed]/95 backdrop-blur-xl border-b border-[#ebdcc1] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Back to Home button */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs transition-all border border-[#ebdcc1] shadow-2xs active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#9e1b1e]" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          {/* Center: Brand Logo */}
          <Link href="/" className="relative w-32 xs:w-40 sm:w-52 h-8 sm:h-10 transition-transform hover:scale-105 shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Kavyasri Pickles"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Right: Cart Button */}
          <div className="flex items-center gap-3">
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
