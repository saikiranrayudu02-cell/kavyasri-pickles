'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    try {
      if (sessionStorage.getItem('kp_splash_seen')) {
        return;
      }
    } catch {
      // ignore
    }

    setIsVisible(true);

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 900);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem('kp_splash_seen', '1');
      } catch {
        // ignore
      }
    }, 1250);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    try {
      sessionStorage.setItem('kp_splash_seen', '1');
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome to Kavyasri Pickles"
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center select-none transition-opacity duration-350 ease-out overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#1a0406',
        backgroundImage: 'radial-gradient(circle at 50% 45%, #2f070b 0%, #150204 70%, #080002 100%)',
      }}
    >
      {/* Subtle Warm Amber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-110 sm:h-110 bg-[#eba715]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white text-[11px] font-semibold backdrop-blur-md border border-white/10 transition-all cursor-pointer z-20"
      >
        Skip
      </button>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-sm sm:max-w-md w-full text-center">
        {/* Heritage Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eba715]/15 border border-[#eba715]/30 text-[#eba715] text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3 h-3 text-[#eba715]" />
          <span>Authentic Andhra Inti Ruchulu</span>
        </div>

        {/* Logo Card */}
        <div className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/80 border border-amber-200/50 flex flex-col items-center">
          <div className="relative w-48 sm:w-60 h-14 sm:h-16">
            <Image
              src="/images/logo.svg"
              alt="Kavyasri Pickles"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="mt-2 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#9e1b1e] uppercase">
            100% Homemade • Sun-Cured • Wood-Pressed Oil
          </p>
        </div>

        {/* Telugu Tagline */}
        <p className="mt-4 sm:mt-5 font-serif text-sm sm:text-base font-bold text-amber-100/90 tracking-wide">
          స్వచ్ఛమైన ఘుమఘుమలు • అచ్చమైన ఇంటి రుచులు
        </p>

        {/* Fast Loading Pulse Line */}
        <div className="mt-6 w-36 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-[#eba715] to-amber-300 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
