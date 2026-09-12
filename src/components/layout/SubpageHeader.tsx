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
      <header className="sticky top-0 z-40 bg-[#eba715]/95 backdrop-blur-xl border-b border-[#d4940f] shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Back to Home button */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-900 font-bold text-xs transition-all border border-stone-900/10 active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#9e1b1e]" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          {/* Center: Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 drop-shadow-sm">
              <Image
                src="/images/kavya_sri_logo_transparent.png"
                alt="Kavya Sri Pickles & Ghee"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="font-serif font-black text-sm sm:text-base tracking-tight text-stone-950 whitespace-nowrap">
                Kavya Sri
              </span>
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#9e1b1e] whitespace-nowrap">
                Pickles &amp; Ghee
              </span>
            </div>
          </Link>

          {/* Right: Cart Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-stone-900 hover:text-[#9e1b1e] rounded-xl hover:bg-white/10 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9e1b1e] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#eba715] shadow-xs animate-pulse">
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
