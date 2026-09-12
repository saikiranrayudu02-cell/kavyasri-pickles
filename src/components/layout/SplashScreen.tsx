'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only display once per browsing session
    try {
      if (sessionStorage.getItem('kp_splash_seen_v2')) {
        return;
      }
    } catch {
      // ignore
    }

    setIsVisible(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Initiate hairline progress bar fill immediately
    const startTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);

    // Snappy, graceful reveal: start fade at 1.2s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }, 1200);

    // Remove from DOM after dissolve and mark session
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
      try {
        sessionStorage.setItem('kp_splash_seen_v2', '1');
      } catch {
        // ignore
      }
    }, 1550);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    try {
      sessionStorage.setItem('kp_splash_seen_v2', '1');
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
      aria-label="Kavyasri Pickles Welcome Screen"
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center bg-[#faf7f2] select-none transition-opacity duration-350 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors px-3 py-1.5 rounded-full hover:bg-stone-200/50 cursor-pointer active:scale-95"
      >
        Skip
      </button>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center px-6 text-center max-w-sm sm:max-w-md w-full animate-fade-in">
        {/* Official Brand Logo */}
        <div className="relative w-56 xs:w-68 sm:w-80 h-13 xs:h-16 sm:h-18 mb-3.5">
          <Image
            src="/images/logo.svg"
            alt="Kavyasri Pickles"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Minimal Clean Tagline */}
        <p className="font-serif text-xs xs:text-sm text-stone-600 tracking-wide mb-5">
          Traditional Taste <span className="text-amber-600 font-bold mx-1.5">•</span> Homemade Love
        </p>

        {/* Sleek Hairline Progress Bar */}
        <div className="w-28 xs:w-36 h-0.5 bg-stone-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full bg-linear-to-r from-[#9e1b1e] via-[#b91c1c] to-[#c2410c] rounded-full transition-all ease-out ${
              isLoaded ? 'w-full duration-1100' : 'w-0 duration-0'
            }`}
          />
        </div>
      </div>

      {/* Subtle Minimal Bottom Hallmark */}
      <div className="absolute bottom-6 text-[10px] sm:text-[11px] font-medium text-stone-400 tracking-widest uppercase">
        Pure Homemade Pickles
      </div>
    </div>
  );
}
