'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { FlashUpdate, FlashUpdateTheme, MarqueeDirection } from '@/lib/types';

interface FlashUpdateBarProps {
  className?: string;
}

const THEME_STYLES: Record<
  FlashUpdateTheme,
  {
    wrapper: string;
    badgeBg: string;
    badgeText: string;
    pulseDot: string;
    textColor: string;
    stockPill: string;
    actionBtn: string;
    border: string;
    glowLine: string;
  }
> = {
  crimson: {
    wrapper: 'bg-linear-to-r from-[#4c0508] via-[#851216] to-[#4c0508] text-white',
    badgeBg: 'bg-amber-400 text-stone-950 shadow-md shadow-black/20 border border-amber-300',
    badgeText: 'text-stone-950 font-black tracking-wider',
    pulseDot: 'bg-stone-950',
    textColor: 'text-amber-50 font-semibold',
    stockPill: 'bg-black/40 border border-amber-400/40 text-amber-200 shadow-2xs',
    actionBtn:
      'bg-amber-400 text-stone-950 hover:bg-white hover:text-[#7f1316] shadow-md active:scale-95 border border-amber-300 font-black',
    border: 'border-b border-amber-400/30',
    glowLine: 'from-transparent via-amber-400/80 to-transparent',
  },
  amber: {
    wrapper: 'bg-linear-to-r from-[#6b2e07] via-[#a14907] to-[#5c2405] text-white',
    badgeBg: 'bg-amber-400 text-stone-950 shadow-md border border-amber-300',
    badgeText: 'text-stone-950 font-black tracking-wider',
    pulseDot: 'bg-stone-950',
    textColor: 'text-amber-50 font-semibold',
    stockPill: 'bg-black/40 border border-amber-400/40 text-amber-200 shadow-2xs',
    actionBtn:
      'bg-amber-300 text-stone-950 hover:bg-white hover:text-amber-900 shadow-md active:scale-95 border border-amber-200 font-black',
    border: 'border-b border-amber-300/30',
    glowLine: 'from-transparent via-amber-300/80 to-transparent',
  },
  emerald: {
    wrapper: 'bg-linear-to-r from-[#092c18] via-[#14532d] to-[#072513] text-white',
    badgeBg: 'bg-emerald-300 text-emerald-950 shadow-md border border-emerald-200',
    badgeText: 'text-emerald-950 font-black tracking-wider',
    pulseDot: 'bg-emerald-950',
    textColor: 'text-emerald-50 font-semibold',
    stockPill: 'bg-black/40 border border-emerald-300/40 text-emerald-200 shadow-2xs',
    actionBtn:
      'bg-emerald-300 text-emerald-950 hover:bg-white hover:text-emerald-900 shadow-md active:scale-95 border border-emerald-200 font-black',
    border: 'border-b border-emerald-400/30',
    glowLine: 'from-transparent via-emerald-400/80 to-transparent',
  },
  gold: {
    wrapper: 'bg-linear-to-r from-[#5c3408] via-[#854d0e] to-[#4e2c06] text-amber-50',
    badgeBg: 'bg-amber-400 text-stone-950 shadow-md border border-amber-300',
    badgeText: 'text-stone-950 font-black tracking-wider',
    pulseDot: 'bg-stone-950',
    textColor: 'text-white font-semibold',
    stockPill: 'bg-black/40 border border-amber-300/40 text-amber-200 shadow-2xs',
    actionBtn:
      'bg-amber-400 text-stone-950 hover:bg-white hover:text-[#78440c] shadow-md active:scale-95 border border-amber-300 font-black',
    border: 'border-b border-amber-300/40',
    glowLine: 'from-transparent via-amber-300/90 to-transparent',
  },
  dark: {
    wrapper: 'bg-linear-to-r from-[#050507] via-[#121215] to-[#07070a] text-stone-100',
    badgeBg: 'bg-linear-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md border border-amber-300',
    badgeText: 'text-stone-950 font-black tracking-wider',
    pulseDot: 'bg-stone-950',
    textColor: 'text-stone-100 font-semibold',
    stockPill: 'bg-white/10 border border-amber-500/40 text-amber-300 shadow-2xs',
    actionBtn:
      'bg-linear-to-r from-amber-400 to-amber-500 text-stone-950 hover:brightness-110 shadow-md active:scale-95 font-black',
    border: 'border-b border-stone-800/90',
    glowLine: 'from-transparent via-amber-500/80 to-transparent',
  },
};

export default function FlashUpdateBar({ className = '' }: FlashUpdateBarProps) {
  const [updates, setUpdates] = useState<FlashUpdate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Sync updates from DataStore
  const refreshUpdates = useCallback(() => {
    try {
      const active = DataStore.getActiveFlashUpdates();
      setUpdates(active);
      if (currentIndex >= active.length) {
        setCurrentIndex(0);
      }
    } catch {
      // fallback
    }
  }, [currentIndex]);

  useEffect(() => {
    setMounted(true);
    refreshUpdates();

    const handleCustomChange = () => {
      refreshUpdates();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kp_flash_updates_v1') {
        refreshUpdates();
      }
    };

    window.addEventListener('kp_flash_updates_changed', handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('kp_flash_updates_changed', handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshUpdates]);

  const current = updates[currentIndex] || updates[0];

  // Check if marquee mode is enabled (default is true unless explicitly set to slide)
  const isMarquee = useMemo(() => {
    if (!current) return true;
    return current.display_mode !== 'slide';
  }, [current]);

  const marqueeDirection: MarqueeDirection = useMemo(() => {
    return current?.marquee_direction || 'ltr';
  }, [current]);

  // Build duplicated array for seamless 50% loop
  const marqueeItems = useMemo(() => {
    if (updates.length === 0) return [];
    let base: FlashUpdate[] = [];
    while (base.length < 6) {
      base = [...base, ...updates];
    }
    return [...base, ...base];
  }, [updates]);

  // Auto rotate updates if in carousel slide mode
  useEffect(() => {
    if (updates.length <= 1) return;
    if (isMarquee) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [updates.length, isMarquee]);

  // Live Countdown timer if current has countdown_end
  useEffect(() => {
    if (!current?.countdown_end) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const target = new Date(current.countdown_end!).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      if (diff === 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [current?.countdown_end]);

  if (!mounted || updates.length === 0) {
    return null;
  }

  if (!current) return null;

  const themeStyle = THEME_STYLES[current.theme] || THEME_STYLES.crimson;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + updates.length) % updates.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % updates.length);
  };

  return (
    <div
      role="region"
      aria-label="Flash Updates"
      className={`relative w-full overflow-hidden transition-all duration-300 shadow-md z-30 ${themeStyle.wrapper} ${themeStyle.border} ${className}`}
    >
      {/* Subtle Background Shine */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-full bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none transform -skew-x-12" />

      {/* Animated Glowing Accent Bottom Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${themeStyle.glowLine} opacity-90 pointer-events-none animate-pulse`} />

      {/* Mode A: Continuous Infinite Marquee Loop */}
      {isMarquee ? (
        <div className="relative py-2 sm:py-2.5 flex items-center min-h-11 sm:min-h-12 overflow-hidden">
          {/* Left fixed broadcast badge - Clean & crisp, no dark overlays */}
          <div className="z-10 pl-3 sm:pl-5 pr-4 flex items-center shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs tracking-wider uppercase shrink-0 shadow-md ${themeStyle.badgeBg}`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themeStyle.pulseDot}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${themeStyle.pulseDot}`} />
              </span>
              <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
              <span className={themeStyle.badgeText}>FLASH UPDATE</span>
            </div>
          </div>

          {/* Endless Marquee Ticker Track Moving Smoothly */}
          <div className="flex-1 overflow-hidden">
            <div
              className={`flex items-center gap-10 sm:gap-14 whitespace-nowrap ${
                marqueeDirection === 'rtl' ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
              }`}
            >
              {marqueeItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center gap-4 sm:gap-6 shrink-0 group/item">
                  {/* Individual Item Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-black/40 text-amber-300 border border-amber-400/30 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {item.badge}
                  </span>

                  {/* Headline Message */}
                  <span className={`text-xs sm:text-sm font-bold tracking-wide ${themeStyle.textColor}`}>
                    {item.message}
                  </span>

                  {/* Stock Urgency Tag */}
                  {item.stock_alert_text && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${themeStyle.stockPill}`}>
                      <Flame className="w-3 h-3 text-amber-400 shrink-0 animate-bounce" />
                      <span>{item.stock_alert_text}</span>
                    </span>
                  )}

                  {/* Action Link Button */}
                  {item.link_url && (
                    <Link
                      href={item.link_url}
                      className={`group inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black px-3.5 py-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${themeStyle.actionBtn}`}
                    >
                      <span>{item.link_text || 'Order Now'}</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}

                  {/* Decorative Sparkle Divider */}
                  <span className="text-amber-400/80 text-xs px-2 select-none">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mode B: Cinema Slide Ticker */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 min-h-10.5 sm:min-h-11.5">
          {/* Left / Main Content Container */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-1 min-w-0">
            {/* Live Pill Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs tracking-wider uppercase shrink-0 shadow-md ${themeStyle.badgeBg}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themeStyle.pulseDot}`}
                />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${themeStyle.pulseDot}`} />
              </span>
              <Zap className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
              <span className={themeStyle.badgeText}>{current.badge || 'FLASH UPDATE'}</span>
            </div>

            {/* Optional Stock Urgency Tag */}
            {current.stock_alert_text && (
              <div
                className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold shrink-0 shadow-xs ${themeStyle.stockPill}`}
              >
                <Flame className="w-3 h-3 text-amber-400 shrink-0 animate-bounce" />
                <span>{current.stock_alert_text}</span>
              </div>
            )}

            {/* Optional Real-Time Countdown Clock */}
            {timeLeft && (
              <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold shrink-0">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            )}

            {/* Flash Message Text */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <p
                key={current.id}
                className={`text-xs sm:text-sm font-semibold truncate transition-all duration-300 ${themeStyle.textColor}`}
                title={current.message}
              >
                {current.message}
              </p>
            </div>
          </div>

          {/* Right Action Button & Pagination */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Action CTA Button */}
            {current.link_url && (
              <Link
                href={current.link_url}
                className={`group inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-200 shrink-0 ${themeStyle.actionBtn}`}
              >
                <span>{current.link_text || 'View Offer'}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            {/* Multi-update pagination controls if > 1 */}
            {updates.length > 1 && (
              <div className="hidden sm:flex items-center gap-0.5 border-l border-white/20 pl-2 ml-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 text-white/80 hover:text-white transition-colors"
                  aria-label="Previous flash update"
                  title="Previous update"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Dots with active bar */}
                <div className="flex items-center gap-1 px-1">
                  {updates.map((u, i) => (
                    <button
                      key={u.id}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Jump to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 text-white/80 hover:text-white transition-colors"
                  aria-label="Next flash update"
                  title="Next update"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
