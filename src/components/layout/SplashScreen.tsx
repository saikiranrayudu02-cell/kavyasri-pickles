'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Flame, ShieldCheck, Award, Heart, CheckCircle2, X } from 'lucide-react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    { text: 'Handpicking Farm-Fresh Mangoes & Gongura...', icon: '🌾' },
    { text: 'Extracting Pure Traditional Wood-Pressed Oils...', icon: '🪵' },
    { text: 'Blending Sun-Cured Guntur Heritage Spices...', icon: '🌶️' },
    { text: 'Welcome to Kavyasri Inti Ruchulu...', icon: '✨' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds duration as requested

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 28) {
        setStatusIndex(0);
      } else if (pct < 55) {
        setStatusIndex(1);
      } else if (pct < 82) {
        setStatusIndex(2);
      } else {
        setStatusIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 500); // smooth curtain dissolve
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 350);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome to Kavyasri Pickles"
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center select-none transition-all duration-500 ease-out overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #260508 0%, #150204 50%, #080002 100%)',
        isolation: 'isolate',
      }}
    >
      {/* 1. Animated Ambient Golden Rays & Volumetric Light Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-162.5 bg-linear-to-tr from-amber-500/25 via-red-600/20 to-orange-500/20 rounded-full blur-[130px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Traditional South Indian Sacred Mandala Motif (Subtle Rotating Aura) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg
          viewBox="0 0 400 400"
          className="w-130 h-130 sm:w-162.5 sm:h-162.5 animate-spin text-amber-400"
          style={{ animationDuration: '45s' }}
        >
          <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          {/* 16 Radial Petals */}
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5} 200 200)`}>
              <path
                d="M200 40 Q215 110 200 130 Q185 110 200 40 Z"
                fill="currentColor"
                opacity="0.15"
              />
              <circle cx="200" cy="35" r="3" fill="currentColor" opacity="0.7" />
            </g>
          ))}
        </svg>
      </div>

      {/* 3. Floating Golden Embers / Spice Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '15%', left: '20%', size: 'w-1.5 h-1.5', delay: '0s', dur: '3s' },
          { top: '25%', left: '80%', size: 'w-2 h-2', delay: '0.5s', dur: '4s' },
          { top: '75%', left: '15%', size: 'w-1.5 h-1.5', delay: '1s', dur: '3.5s' },
          { top: '80%', left: '85%', size: 'w-2.5 h-2.5', delay: '1.5s', dur: '4.5s' },
          { top: '35%', left: '10%', size: 'w-1 h-1', delay: '0.8s', dur: '3.2s' },
          { top: '65%', left: '90%', size: 'w-1.5 h-1.5', delay: '1.2s', dur: '3.8s' },
          { top: '18%', left: '60%', size: 'w-2 h-2', delay: '0.3s', dur: '4.1s' },
        ].map((ember, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse ${ember.size}`}
            style={{
              top: ember.top,
              left: ember.left,
              animationDelay: ember.delay,
              animationDuration: ember.dur,
            }}
          />
        ))}
      </div>

      {/* 4. Luxury Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-amber-200/90 hover:text-white text-xs font-bold backdrop-blur-md border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer z-30 shadow-lg flex items-center gap-1.5 active:scale-95"
      >
        <span>Skip</span>
        <X className="w-3.5 h-3.5 text-amber-400" />
      </button>

      {/* 5. Main Center Stage */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-5 text-center">
        {/* Heritage Crown / Hallmark Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] sm:text-xs font-black tracking-widest uppercase mb-6 sm:mb-7 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>70-Year Traditional Heritage</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Imperial Gold Medallion Plaque (No Cheap White Box!) */}
        <div className="relative group mb-6 sm:mb-7 w-full max-w-md sm:max-w-lg">
          {/* Multi-layered Pulsing Halo */}
          <div className="absolute -inset-2 bg-linear-to-r from-amber-500/40 via-red-600/30 to-amber-400/40 rounded-3xl blur-2xl opacity-80 animate-pulse" />

          {/* Ornate Plaque Frame */}
          <div className="relative p-1 rounded-3xl bg-linear-to-b from-[#fcd34d] via-[#b45309] to-[#78350f] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.3)]">
            {/* Inner Silk/Parchment Card */}
            <div className="relative bg-linear-to-b from-[#ffffff] via-[#fffdfa] to-[#fff6e7] px-6 py-6 sm:px-10 sm:py-8 rounded-[22px] overflow-hidden border border-amber-200/60 flex flex-col items-center">
              {/* Shimmer Light Reflection Running Across */}
              <div
                className="absolute inset-0 bg-linear-to-r from-transparent via-amber-200/25 to-transparent pointer-events-none transform -skew-x-20 animate-shimmer"
                style={{ animationDuration: '2.5s' }}
              />

              {/* Ornate Gold Filigree Corner Accents */}
              {/* Top-Left */}
              <svg
                viewBox="0 0 24 24"
                className="absolute top-2 left-2 w-5 h-5 text-amber-600/80 pointer-events-none"
              >
                <path d="M2 18V6C2 3.8 3.8 2 6 2H18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="5" cy="5" r="1.5" fill="currentColor" />
              </svg>
              {/* Top-Right */}
              <svg
                viewBox="0 0 24 24"
                className="absolute top-2 right-2 w-5 h-5 text-amber-600/80 pointer-events-none"
              >
                <path d="M22 18V6C22 3.8 20.2 2 18 2H6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="19" cy="5" r="1.5" fill="currentColor" />
              </svg>
              {/* Bottom-Left */}
              <svg
                viewBox="0 0 24 24"
                className="absolute bottom-2 left-2 w-5 h-5 text-amber-600/80 pointer-events-none"
              >
                <path d="M2 6V18C2 20.2 3.8 22 6 22H18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="5" cy="19" r="1.5" fill="currentColor" />
              </svg>
              {/* Bottom-Right */}
              <svg
                viewBox="0 0 24 24"
                className="absolute bottom-2 right-2 w-5 h-5 text-amber-600/80 pointer-events-none"
              >
                <path d="M22 6V18C22 20.2 20.2 22 18 22H6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="19" cy="19" r="1.5" fill="currentColor" />
              </svg>

              {/* Brand Logo with 100% Crisp Scaling */}
              <div className="relative w-72 sm:w-88 h-18 sm:h-22 transition-transform duration-700">
                <Image
                  src="/images/logo.svg"
                  alt="Kavyasri Pickles Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Plaque Bottom Ribbon Accent */}
              <div className="mt-3 sm:mt-4 pt-2.5 border-t border-amber-900/15 w-full flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#7f1d1d]">
                <span>Pure Wood-Pressed Oil</span>
                <span className="text-amber-500">•</span>
                <span>Sun-Cured Spices</span>
                <span className="text-amber-500">•</span>
                <span>Zero Chemicals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Telugu Hallmark & Brand Promise */}
        <div className="space-y-2 mb-7 sm:mb-8">
          <p className="font-serif text-base sm:text-lg font-bold text-amber-200 tracking-wide">
            స్వచ్ఛమైన ఘుమఘుమలు • అచ్చమైన ఇంటి రుచులు
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-semibold text-stone-300">
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Natural & FSSAI Certified</span>
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentic Grandma Recipes</span>
            </span>
          </div>
        </div>

        {/* Liquid Gold Progress Bar */}
        <div className="w-full max-w-sm space-y-2.5">
          <div className="relative h-2 w-full bg-stone-900/90 rounded-full overflow-hidden border border-amber-500/30 p-0.5 shadow-inner">
            {/* Glowing Liquid Gold Track */}
            <div
              className="relative h-full bg-linear-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-100 ease-out shadow-[0_0_14px_rgba(251,191,36,0.9)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Tip Sparkle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-300 font-mono">
            <span className="text-amber-300 font-sans text-xs font-semibold truncate flex items-center gap-1.5">
              <span>{statusMessages[statusIndex].icon}</span>
              <span>{statusMessages[statusIndex].text}</span>
            </span>
            <span className="font-extrabold text-amber-400 text-xs shrink-0 ml-2">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* 6. Bottom Royal Artisan Footer */}
      <div className="absolute bottom-4 sm:bottom-6 text-center text-[10px] sm:text-[11px] text-amber-200/50 uppercase tracking-[0.25em] font-bold">
        Crafted with Love in Andhra Pradesh • Delivering Across India
      </div>
    </div>
  );
}
