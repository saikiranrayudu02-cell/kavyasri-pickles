'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function SocialFloatingWidget() {
  const pathname = usePathname();

  // Strictly render ONLY on Home page ('/')
  if (pathname !== '/') {
    return null;
  }

  const WHATSAPP_NUMBER = '9705222744';
  const WHATSAPP_URL = `https://wa.me/91${WHATSAPP_NUMBER}?text=Hello%20Kavyasri%20Pickles,%20I%20would%20like%20to%20place%20an%20order!`;
  const INSTAGRAM_URL = 'https://www.instagram.com/kavyasriintiruchulu?stkn=MTR3dWllNTFhM3l0NQ==';

  return (
    <aside
      aria-label="Social Quick Connect"
      className="fixed bottom-6 right-3.5 sm:right-6 z-30 flex flex-col items-center gap-2.5 sm:gap-3 select-none"
    >
      {/* 1. Official WhatsApp Squircle (Zero White Background) */}
      <div className="relative group/wa flex items-center">
        {/* Tooltip on Hover */}
        <div className="absolute right-full mr-3 hidden sm:group-hover/wa:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/95 text-white text-xs font-bold shadow-xl backdrop-blur-md border border-white/10 whitespace-nowrap pointer-events-none animate-fade-in">
          <span>Order on WhatsApp:</span>
          <span className="text-emerald-400 font-mono">9705222744</span>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-11 h-11 sm:w-13 sm:h-13 bg-transparent rounded-[22%] shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
          aria-label="Chat on WhatsApp (9705222744)"
        >
          {/* Live Online Pulse Dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full z-10 shadow-xs" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />

          <div className="relative w-full h-full overflow-hidden rounded-[22%]">
            <Image
              src="/images/whatsapp.svg"
              alt="WhatsApp"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>
      </div>

      {/* 2. Official Instagram Squircle (Zero White Background) */}
      <div className="relative group/ig flex items-center">
        {/* Tooltip on Hover */}
        <div className="absolute right-full mr-3 hidden sm:group-hover/ig:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/95 text-white text-xs font-bold shadow-xl backdrop-blur-md border border-white/10 whitespace-nowrap pointer-events-none animate-fade-in">
          <span>Follow on Instagram:</span>
          <span className="text-rose-400 font-mono">@kavyasriintiruchulu</span>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-11 h-11 sm:w-13 sm:h-13 bg-transparent rounded-[22%] shadow-xl shadow-rose-950/20 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
          aria-label="Follow Kavyasri Pickles on Instagram (@kavyasriintiruchulu)"
        >
          <div className="relative w-full h-full overflow-hidden rounded-[22%]">
            <Image
              src="/images/instagram.svg"
              alt="Instagram"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>
      </div>
    </aside>
  );
}
