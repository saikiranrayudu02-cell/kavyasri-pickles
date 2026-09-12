'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Flame,
  Radio,
  Clock,
  Pause,
  Play,
  Zap,
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { FlashUpdate, FlashUpdateTheme, FlashDisplayMode, MarqueeDirection } from '@/lib/types';

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
    controlBtn: string;
  }
> = {
  crimson: {
    wrapper: 'bg-linear-to-r from-[#630a0d] via-[#9e1b1e] to-[#6b0c10] text-white',
    badgeBg: 'bg-amber-400 text-stone-950 shadow-md shadow-amber-950/30',
    badgeText: 'text-stone-950 font-black',
    pulseDot: 'bg-[#9e1b1e]',
    textColor: 'text-amber-50',
    stockPill: 'bg-black/30 border border-amber-300/30 text-amber-200',
    actionBtn:
      'bg-white text-[#9e1b1e] hover:bg-amber-100 hover:text-[#7f1316] shadow-md shadow-red-950/20 active:scale-95 border border-white/30',
    border: 'border-b border-amber-400/20',
    glowLine: 'from-transparent via-amber-400/60 to-transparent',
    controlBtn: 'text-amber-200/80 hover:text-white hover:bg-white/10',
  },
  amber: {
    wrapper: 'bg-linear-to-r from-[#853b0a] via-[#b45309] to-[#78350f] text-white',
    badgeBg: 'bg-stone-950 text-amber-300 shadow-md',
    badgeText: 'text-amber-300 font-black',
    pulseDot: 'bg-amber-400',
    textColor: 'text-amber-50',
    stockPill: 'bg-black/35 border border-amber-400/30 text-amber-200',
    actionBtn:
      'bg-amber-300 text-stone-950 hover:bg-white hover:text-amber-900 shadow-md active:scale-95 border border-amber-200/50',
    border: 'border-b border-amber-300/20',
    glowLine: 'from-transparent via-amber-300/60 to-transparent',
    controlBtn: 'text-amber-100/80 hover:text-white hover:bg-white/10',
  },
  emerald: {
    wrapper: 'bg-linear-to-r from-[#0b381e] via-[#166534] to-[#0d3f23] text-white',
    badgeBg: 'bg-emerald-300 text-emerald-950 shadow-md',
    badgeText: 'text-emerald-950 font-black',
    pulseDot: 'bg-emerald-800',
    textColor: 'text-emerald-50',
    stockPill: 'bg-black/30 border border-emerald-300/30 text-emerald-200',
    actionBtn:
      'bg-white text-emerald-900 hover:bg-emerald-100 shadow-md active:scale-95 border border-white/30',
    border: 'border-b border-emerald-400/20',
    glowLine: 'from-transparent via-emerald-400/60 to-transparent',
    controlBtn: 'text-emerald-200/80 hover:text-white hover:bg-white/10',
  },
  gold: {
    wrapper: 'bg-linear-to-r from-[#78440c] via-[#a16207] to-[#663908] text-amber-50',
    badgeBg: 'bg-stone-950 text-amber-400 shadow-md',
    badgeText: 'text-amber-400 font-black',
    pulseDot: 'bg-amber-400',
    textColor: 'text-white',
    stockPill: 'bg-black/30 border border-amber-300/30 text-amber-200',
    actionBtn:
      'bg-white text-[#78440c] hover:bg-amber-100 shadow-md active:scale-95 border border-white/30',
    border: 'border-b border-amber-300/30',
    glowLine: 'from-transparent via-amber-300/70 to-transparent',
    controlBtn: 'text-amber-200/80 hover:text-white hover:bg-white/10',
  },
  dark: {
    wrapper: 'bg-linear-to-r from-[#070709] via-[#161619] to-[#09090c] text-stone-100',
    badgeBg: 'bg-linear-to-r from-amber-500 to-amber-400 text-stone-950 shadow-md shadow-amber-500/30',
    badgeText: 'text-stone-950 font-black',
    pulseDot: 'bg-stone-950',
    textColor: 'text-stone-100',
    stockPill: 'bg-white/10 border border-amber-500/30 text-amber-300',
    actionBtn:
      'bg-linear-to-r from-amber-400 to-amber-500 text-stone-950 hover:brightness-110 shadow-md shadow-amber-500/25 active:scale-95',
    border: 'border-b border-stone-800/90',
    glowLine: 'from-transparent via-amber-500/70 to-transparent',
    controlBtn: 'text-stone-400 hover:text-stone-100 hover:bg-stone-800',
  },
};

export default function FlashUpdateBar({ className = '' }: FlashUpdateBarProps) {
  const [updates, setUpdates] = useState<FlashUpdate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
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
    while (base.length < 5) {
      base = [...base, ...updates];
    }
    // Duplicate exactly once for seamless infinite loop (0% to -50% or -50% to 0%)
    return [...base, ...base];
  }, [updates]);

  // Auto rotate updates if in carousel slide mode
  useEffect(() => {
    if (updates.length <= 1 || isPaused || isDismissed) return;
    if (isMarquee) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [updates.length, isPaused, isDismissed, isMarquee]);

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

  if (!mounted || isDismissed || updates.length === 0) {
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className={`relative w-full overflow-hidden transition-all duration-300 shadow-md z-30 ${themeStyle.wrapper} ${themeStyle.border} ${className}`}
    >
      {/* Background ambient light textures */}
      <div className="absolute inset-0 bg-white/4 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-full bg-linear-to-r from-transparent via-white/8 to-transparent pointer-events-none transform -skew-x-12" />

      {/* Animated Glowing Accent Bottom Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r ${themeStyle.glowLine} opacity-80 pointer-events-none animate-pulse`} />

      {/* Mode A: Continuous Infinite Marquee Loop (Moving from Left to Right) */}
      {isMarquee ? (
        <div className="relative py-2 sm:py-2.5 flex items-center min-h-10.5 sm:min-h-11.5 overflow-hidden">
          {/* Left fixed broadcast pill with Live Pulse */}
          <div className="z-10 pl-3 sm:pl-5 pr-3 bg-linear-to-r from-black/60 via-black/40 to-transparent flex items-center shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs tracking-wider uppercase shrink-0 ${themeStyle.badgeBg}`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${themeStyle.pulseDot}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${themeStyle.pulseDot}`} />
              </span>
              <span className={themeStyle.badgeText}>⚡ FLASH UPDATE</span>
            </div>
          </div>

          {/* Endless Marquee Ticker Track Moving Left to Right in Infinite Loop */}
          <div className="flex-1 overflow-hidden">
            <div
              className={`flex items-center gap-8 whitespace-nowrap ${
                marqueeDirection === 'rtl' ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
              }`}
            >
              {marqueeItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {/* Individual Item Badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/40 text-amber-300 border border-amber-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {item.badge}
                  </span>

                  {/* Headline Message */}
                  <span className={`text-xs sm:text-sm font-bold tracking-wide ${themeStyle.textColor}`}>
                    {item.message}
                  </span>

                  {/* Stock Urgency Tag */}
                  {item.stock_alert_text && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${themeStyle.stockPill}`}>
                      <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{item.stock_alert_text}</span>
                    </span>
                  )}

                  {/* Action Link Button */}
                  {item.link_url && (
                    <Link
                      href={item.link_url}
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-3 py-0.8 sm:py-1 rounded-full transition-all shrink-0 hover:scale-105 active:scale-95 ${themeStyle.actionBtn}`}
                    >
                      <span>{item.link_text || 'Order Now'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {/* Decorative Sparkle Divider */}
                  <span className="text-amber-400/70 text-xs px-2">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right dismiss button */}
          <div className="z-10 pr-3 sm:pr-5 pl-2 bg-linear-to-l from-black/50 to-transparent flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className={`p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity ${themeStyle.controlBtn}`}
              aria-label="Dismiss flash update"
              title="Dismiss update"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Mode B: Cinema Slide Ticker */
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 min-h-10.5 sm:min-h-11.5">
          {/* Left / Main Content Container */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-1 min-w-0">
            {/* Live Pill Badge with Dual Radar Pulse */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.8 sm:py-1 rounded-full text-[10px] sm:text-xs tracking-wider uppercase shrink-0 transition-transform ${themeStyle.badgeBg}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${themeStyle.pulseDot}`}
                />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${themeStyle.pulseDot}`} />
              </span>
              <span className={themeStyle.badgeText}>{current.badge || '⚡ FLASH UPDATE'}</span>
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

          {/* Right Controls & Action Button */}
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
                  className={`p-1 rounded-full transition-colors ${themeStyle.controlBtn}`}
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
                  className={`p-1 rounded-full transition-colors ${themeStyle.controlBtn}`}
                  aria-label="Next flash update"
                  title="Next update"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Pause/Play Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`p-1 rounded-full transition-colors ml-0.5 ${themeStyle.controlBtn}`}
                  title={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
              </div>
            )}

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className={`p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity ml-1 ${themeStyle.controlBtn}`}
              aria-label="Dismiss flash update"
              title="Dismiss update"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
