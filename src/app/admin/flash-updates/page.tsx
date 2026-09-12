'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Tag,
  RefreshCw,
  ExternalLink,
  Flame,
  ArrowRight,
  Save,
  Check,
  Megaphone,
  Smartphone,
  Monitor,
  Clock,
  Layers,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataStore } from '@/lib/data/store';
import { FlashUpdate, FlashUpdateTheme, FlashDisplayMode, MarqueeDirection } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

const THEME_OPTIONS: { id: FlashUpdateTheme; name: string; bg: string; preview: string; desc: string }[] = [
  {
    id: 'crimson',
    name: 'Heritage Crimson Ruby',
    bg: 'bg-linear-to-r from-[#630a0d] via-[#9e1b1e] to-[#6b0c10]',
    preview: 'bg-[#9e1b1e] border-amber-400',
    desc: 'Signature royal red matching South Indian Avakaya pickles & spices.',
  },
  {
    id: 'amber',
    name: 'Turmeric Amber Spice',
    bg: 'bg-linear-to-r from-[#853b0a] via-[#b45309] to-[#78350f]',
    preview: 'bg-[#b45309] border-amber-300',
    desc: 'Warm sun-cured spices and wood-pressed oil aura.',
  },
  {
    id: 'emerald',
    name: 'Curry Leaf Emerald',
    bg: 'bg-linear-to-r from-[#0b381e] via-[#166534] to-[#0d3f23]',
    preview: 'bg-[#166534] border-emerald-400',
    desc: 'Pure, organic, farm-fresh herbs & eco-friendly goodness.',
  },
  {
    id: 'gold',
    name: 'Royal Festive Gold',
    bg: 'bg-linear-to-r from-[#78440c] via-[#a16207] to-[#663908]',
    preview: 'bg-[#a16207] border-amber-300',
    desc: 'Celebratory holiday deals, festival offers & VIP rewards.',
  },
  {
    id: 'dark',
    name: 'Obsidian Dark Luxury',
    bg: 'bg-linear-to-r from-[#070709] via-[#161619] to-[#09090c]',
    preview: 'bg-[#161619] border-amber-500',
    desc: 'Ultra-modern night mode with glowing neon gold badge.',
  },
];

const PRESET_BADGES = [
  '⚡ FLASH RESTOCK',
  '🔥 LIMITED BATCH',
  '🌶️ FRESH HARVEST',
  '🎁 FESTIVE DEAL',
  '📢 SPECIAL NOTICE',
  '🚚 EXPRESS DISPATCH',
  '⏳ FLASH SALE',
];

const PRESET_TEMPLATES = [
  {
    title: 'Fresh Avakaya & Gongura Restock',
    badge: '⚡ FLASH RESTOCK',
    message: 'Fresh Batches of Homemade Avakaya & Gongura Pachadi just packed! 100% Wood-Pressed Cold Sesame Oil.',
    link_url: '/shop?category=cat-veg',
    link_text: 'Shop Fresh Batches →',
    theme: 'crimson' as FlashUpdateTheme,
    display_mode: 'slide' as FlashDisplayMode,
    stock_alert_text: '🌿 Just Cured Today',
  },
  {
    title: 'Limited Country Chicken Stock Alert',
    badge: '🔥 LIMITED BATCH',
    message: 'Special Boneless Country Chicken & Mutton Pickles freshly cured — Only 25 jars available today!',
    link_url: '/shop?category=cat-nonveg',
    link_text: 'Order Now →',
    theme: 'amber' as FlashUpdateTheme,
    display_mode: 'slide' as FlashDisplayMode,
    stock_alert_text: '⏳ Only 18 Jars Left',
  },
  {
    title: '10% OFF + Free Express Shipping',
    badge: '🎁 FESTIVE DEAL',
    message: 'Use code TRADITION10 for 10% OFF + Free Express Home Delivery on all orders above ₹499!',
    link_url: '/shop',
    link_text: 'Claim 10% Off →',
    theme: 'gold' as FlashUpdateTheme,
    display_mode: 'slide' as FlashDisplayMode,
    stock_alert_text: '🚚 Free Express Shipping',
  },
  {
    title: 'WhatsApp VIP Direct Order',
    badge: '📢 ORDER ON WHATSAPP',
    message: 'Order directly on WhatsApp for customized spice levels and instant tracking support!',
    link_url: 'https://wa.me/919705222744?text=Hi%20Kavyasri%20Pickles,%20I%20want%20to%20order%20pickles',
    link_text: 'Chat & Order →',
    theme: 'emerald' as FlashUpdateTheme,
    display_mode: 'slide' as FlashDisplayMode,
    stock_alert_text: '💬 24/7 Support',
  },
  {
    title: 'Continuous Infinite Marquee',
    badge: '⚡ LIVE STORE TICKER',
    message: 'Authentic 70-Year Traditional Andhra Recipes • Sun-Cured Guntur Spices • Delivering Fresh Across India •',
    link_url: '/shop',
    link_text: 'Explore All Pickles →',
    theme: 'dark' as FlashUpdateTheme,
    display_mode: 'marquee' as FlashDisplayMode,
    stock_alert_text: '✨ 100% Homemade',
  },
  {
    title: 'Weekend Flash Sale with Countdown',
    badge: '⏳ 4-HOUR FLASH SALE',
    message: 'Get Free Mango Pickle Mini-Jar with any 1KG Pickle Order! Valid till midnight today.',
    link_url: '/shop?category=cat-combos',
    link_text: 'Grab Free Gift →',
    theme: 'crimson' as FlashUpdateTheme,
    display_mode: 'slide' as FlashDisplayMode,
    stock_alert_text: '⏰ Ends Tonight',
  },
];

export default function AdminFlashUpdatesPage() {
  const { showToast } = useToast();
  const [updates, setUpdates] = useState<FlashUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Preview Mode: desktop vs mobile
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Form State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [badge, setBadge] = useState('⚡ FLASH RESTOCK');
  const [message, setMessage] = useState('');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [linkText, setLinkText] = useState('Shop Now →');
  const [theme, setTheme] = useState<FlashUpdateTheme>('crimson');
  const [displayMode, setDisplayMode] = useState<FlashDisplayMode>('marquee');
  const [marqueeDirection, setMarqueeDirection] = useState<MarqueeDirection>('ltr');
  const [stockAlertText, setStockAlertText] = useState('');
  const [enableCountdown, setEnableCountdown] = useState(false);
  const [countdownEnd, setCountdownEnd] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Load from store
  const loadData = () => {
    setLoading(true);
    const items = DataStore.getFlashUpdates();
    setUpdates(items);
    if (items.length > 0) {
      const activeOne = items[0];
      setSelectedId(activeOne.id);
      setBadge(activeOne.badge);
      setMessage(activeOne.message);
      setLinkUrl(activeOne.link_url || '/shop');
      setLinkText(activeOne.link_text || 'Shop Now →');
      setTheme(activeOne.theme || 'crimson');
      setDisplayMode(activeOne.display_mode || 'marquee');
      setMarqueeDirection(activeOne.marquee_direction || 'ltr');
      setStockAlertText(activeOne.stock_alert_text || '');
      setEnableCountdown(Boolean(activeOne.countdown_end));
      setCountdownEnd(activeOne.countdown_end || '');
      setIsActive(activeOne.is_active);
    } else {
      setSelectedId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectUpdate = (u: FlashUpdate) => {
    setSelectedId(u.id);
    setBadge(u.badge);
    setMessage(u.message);
    setLinkUrl(u.link_url || '');
    setLinkText(u.link_text || 'Shop Now →');
    setTheme(u.theme);
    setDisplayMode(u.display_mode || 'marquee');
    setMarqueeDirection(u.marquee_direction || 'ltr');
    setStockAlertText(u.stock_alert_text || '');
    setEnableCountdown(Boolean(u.countdown_end));
    setCountdownEnd(u.countdown_end || '');
    setIsActive(u.is_active);
  };

  const handleNewUpdate = () => {
    setSelectedId(null);
    setBadge('⚡ FLASH UPDATE');
    setMessage('');
    setLinkUrl('/shop');
    setLinkText('Shop Now →');
    setTheme('crimson');
    setDisplayMode('marquee');
    setMarqueeDirection('ltr');
    setStockAlertText('');
    setEnableCountdown(false);
    setCountdownEnd('');
    setIsActive(true);
  };

  const handleApplyTemplate = (tmpl: (typeof PRESET_TEMPLATES)[0]) => {
    setBadge(tmpl.badge);
    setMessage(tmpl.message);
    setLinkUrl(tmpl.link_url);
    setLinkText(tmpl.link_text);
    setTheme(tmpl.theme);
    setDisplayMode(tmpl.display_mode);
    setMarqueeDirection('ltr');
    setStockAlertText(tmpl.stock_alert_text);
    showToast(`Loaded: "${tmpl.title}"`, 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast('Please enter a flash update message', 'error');
      return;
    }

    const payload = {
      badge: badge.trim(),
      message: message.trim(),
      link_url: linkUrl.trim() || undefined,
      link_text: linkText.trim() || undefined,
      theme,
      display_mode: displayMode,
      marquee_direction: marqueeDirection,
      stock_alert_text: stockAlertText.trim() || undefined,
      countdown_end: enableCountdown && countdownEnd ? countdownEnd : undefined,
      is_active: isActive,
    };

    if (selectedId) {
      DataStore.updateFlashUpdate(selectedId, payload);
      showToast('Flash Update published to website successfully!', 'success');
    } else {
      const created = DataStore.addFlashUpdate({
        ...payload,
        priority: updates.length + 1,
      });
      setSelectedId(created.id);
      showToast('New Flash Update added & published live!', 'success');
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    loadData();
  };

  const handleToggleStatus = (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    DataStore.updateFlashUpdate(id, { is_active: !currentStatus });
    loadData();
    showToast(
      !currentStatus
        ? 'Flash update is now LIVE on public site!'
        : 'Flash update paused on public site',
      !currentStatus ? 'success' : 'info'
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this flash update?')) {
      DataStore.deleteFlashUpdate(id);
      showToast('Flash update deleted', 'info');
      loadData();
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all flash updates back to the original handcrafted presets?')) {
      DataStore.saveFlashUpdates([
        {
          id: 'flash-1',
          badge: '⚡ FLASH RESTOCK',
          message: 'Fresh Batches of Homemade Avakaya & Gongura Pachadi just packed! 100% Wood-Pressed Cold Sesame Oil.',
          link_url: '/shop?category=cat-veg',
          link_text: 'Shop Fresh Batches →',
          theme: 'crimson',
          is_active: true,
          priority: 1,
          display_mode: 'slide',
          stock_alert_text: '🌿 Just Cured Today',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'flash-2',
          badge: '🔥 LIMITED BATCH',
          message: 'Special Boneless Country Chicken & Mutton Pickles freshly cured — Only 25 jars available today!',
          link_url: '/shop?category=cat-nonveg',
          link_text: 'Order Now →',
          theme: 'amber',
          is_active: true,
          priority: 2,
          display_mode: 'slide',
          stock_alert_text: '⏳ Only 18 Jars Left',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'flash-3',
          badge: '🎁 FESTIVE DEAL',
          message: 'Use code TRADITION10 for 10% OFF + Free Express Home Delivery on all orders above ₹499!',
          link_url: '/shop',
          link_text: 'Claim 10% Off →',
          theme: 'gold',
          is_active: true,
          priority: 3,
          display_mode: 'slide',
          stock_alert_text: '🚚 Free Express Shipping',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      loadData();
      showToast('Restored default flash updates!', 'success');
    }
  };

  const activeCount = updates.filter((u) => u.is_active).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Command Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-linear-to-br from-amber-500 to-red-600 text-white shadow-md shadow-red-900/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Flash Update Command Center
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Broadcast Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Instantly broadcast announcements, restock alerts, and limited-batch deals under the Navbar.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            title="Restore original preset updates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </Link>

          <button
            type="button"
            onClick={handleNewUpdate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#9e1b1e] hover:bg-[#851619] transition-all shadow-md shadow-red-900/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Flash</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Real-Time Live Preview Studio with Device Switcher */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-700">
              Real-Time Public Site Mockup (Directly Under Navbar)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                  previewDevice === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop View</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all ${
                  previewDevice === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile View</span>
              </button>
            </div>

            <span
              className={`text-[11px] font-black px-3 py-1 rounded-full ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}
            >
              {isActive ? '● LIVE ON SITE' : '○ PAUSED'}
            </span>
          </div>
        </div>

        {/* Dynamic Mockup Render Container */}
        <div className="flex justify-center p-2 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div
            className={`transition-all duration-300 w-full overflow-hidden ${
              previewDevice === 'mobile'
                ? 'max-w-97.5 rounded-3xl shadow-xl border-4 border-stone-800 my-2'
                : 'rounded-2xl shadow-sm'
            }`}
          >
            {/* Fake Navbar Header representation */}
            <div className="bg-[#eba715] px-4 py-2.5 flex items-center justify-between border-b border-[#d97706]/30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#9e1b1e] flex items-center justify-center text-white font-serif font-black text-xs">
                  K
                </div>
                <span className="font-serif font-bold text-xs text-stone-950 tracking-wider">
                  KAVYASRI PICKLES
                </span>
              </div>
              <span className="text-[10px] font-bold text-stone-900 bg-white/30 px-2 py-0.5 rounded-md">
                Public Header
              </span>
            </div>

            {/* Simulated FlashUpdateBar */}
            <div
              className={`relative py-2.5 px-4 flex items-center min-h-10 text-white overflow-hidden transition-all ${
                THEME_OPTIONS.find((t) => t.id === theme)?.bg || THEME_OPTIONS[0].bg
              }`}
            >
              {displayMode === 'marquee' ? (
                <div className="overflow-hidden w-full">
                  <div
                    className={`flex items-center gap-8 whitespace-nowrap ${
                      marqueeDirection === 'rtl' ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
                    }`}
                  >
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-stone-950 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b1e] animate-ping" />
                          {badge || '⚡ FLASH UPDATE'}
                        </span>
                        {stockAlertText && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/30 border border-amber-300/30 text-amber-200">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>{stockAlertText}</span>
                          </span>
                        )}
                        <p className="text-xs font-semibold text-amber-50">
                          {message || 'Type your message to see it moving from left to right in the infinite loop...'}
                        </p>
                        {linkUrl && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full bg-white text-[#9e1b1e] shadow-xs">
                            <span>{linkText || 'Shop Now'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                        <span className="text-amber-400/70 text-xs">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-400 text-stone-950 shadow-xs shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b1e] animate-ping" />
                      {badge || '⚡ FLASH UPDATE'}
                    </span>

                    {stockAlertText && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/30 border border-amber-300/30 text-amber-200 shrink-0">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>{stockAlertText}</span>
                      </span>
                    )}

                    <p className="text-xs font-semibold truncate text-amber-50">
                      {message || 'Type your flash update message below to preview live...'}
                    </p>
                  </div>

                  {linkUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white text-[#9e1b1e] shadow-xs shrink-0">
                      <span>{linkText || 'Shop Now'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Studio: Editor on Left, List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-black text-stone-900">
                {selectedId ? 'Customize Active Flash Announcement' : 'Compose New Flash Announcement'}
              </h2>
              <p className="text-xs text-stone-500">
                Changes take effect across the public website immediately on save.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 select-none">
                Broadcast {isActive ? 'ON' : 'OFF'}
              </span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isActive ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Preset Templates Quick Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-stone-700 uppercase tracking-wider">
                1-Click High-Converting Presets
              </label>
              <span className="text-[11px] text-stone-400">Click to apply template</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="text-left p-3 rounded-2xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between text-stone-900 font-bold group-hover:text-amber-900">
                    <span className="truncate">{tmpl.title}</span>
                    <Tag className="w-3.5 h-3.5 text-amber-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">{tmpl.badge}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Display Mode Selection: Slide vs Marquee */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                Announcement Display Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDisplayMode('slide')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    displayMode === 'slide'
                      ? 'border-[#9e1b1e] bg-red-50/40 ring-2 ring-red-600/20'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <Layers className="w-4 h-4 text-[#9e1b1e]" />
                    <span>Carousel Slide Ticker</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Rotates smoothly every 5.5s with controls & pause-on-hover.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayMode('marquee')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    displayMode === 'marquee'
                      ? 'border-[#9e1b1e] bg-red-50/40 ring-2 ring-red-600/20'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <Sliders className="w-4 h-4 text-[#9e1b1e]" />
                    <span>Infinite Marquee Ticker</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Continuous smooth horizontal tape scroll across the top.
                  </p>
                </button>
              </div>

              {/* Scroll Direction selector when Marquee is active */}
              {displayMode === 'marquee' && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Loop Scroll Direction</span>
                    <span className="text-[11px] text-stone-500">Smooth infinite tape movement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMarqueeDirection('ltr')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        marqueeDirection === 'ltr'
                          ? 'bg-[#9e1b1e] text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      ➔ Left to Right (Infinite)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarqueeDirection('rtl')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        marqueeDirection === 'rtl'
                          ? 'bg-[#9e1b1e] text-white shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      ⬅ Right to Left
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Badge Label */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">Badge Tag</label>
                <span className="text-[11px] text-stone-400">Pill tag in high contrast</span>
              </div>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. ⚡ FLASH RESTOCK"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-600/30"
                required
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {PRESET_BADGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700">Headline Announcement *</label>
                <span className={`text-[11px] ${message.length > 120 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                  {message.length}/140 characters
                </span>
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Fresh batches of Avakaya & Gongura Pachadi just packed! Wood-pressed sesame oil. Order today."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600/30"
                required
              />
            </div>

            {/* Stock Urgency Tag (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Urgency Tag (Optional)
                </label>
                <input
                  type="text"
                  value={stockAlertText}
                  onChange={(e) => setStockAlertText(e.target.value)}
                  placeholder="e.g. ⏳ Only 18 Jars Left"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600/30"
                />
              </div>

              {/* Countdown Timer Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Countdown Target</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-stone-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableCountdown}
                      onChange={(e) => setEnableCountdown(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    <span>Active Timer</span>
                  </label>
                </div>
                <input
                  type="datetime-local"
                  disabled={!enableCountdown}
                  value={countdownEnd}
                  onChange={(e) => setCountdownEnd(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600/30 disabled:bg-stone-50 disabled:text-stone-400"
                />
              </div>
            </div>

            {/* Action CTA Button & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Action Button Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Shop Now →"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Destination URL / Page</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. /shop or https://wa.me/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600/30"
                />
              </div>
            </div>

            {/* Quick URL Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
              <span className="font-semibold">Quick Links:</span>
              {[
                { label: 'Shop All', url: '/shop' },
                { label: 'Veg Pickles', url: '/shop?category=cat-veg' },
                { label: 'Non-Veg Pickles', url: '/shop?category=cat-nonveg' },
                { label: 'Cart / Checkout', url: '/checkout' },
                { label: 'WhatsApp Order', url: 'https://wa.me/919705222744' },
              ].map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    setLinkUrl(link.url);
                    setLinkText(link.label.includes('WhatsApp') ? 'Order on WhatsApp →' : `${link.label} →`);
                  }}
                  className="px-2.5 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Theme Selector with Rich Description */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                Artisan Color Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                      theme === opt.id
                        ? 'border-[#9e1b1e] bg-red-50/40 ring-2 ring-red-600/20'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl ${opt.preview} border shadow-xs shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{opt.name}</span>
                        {theme === opt.id && <Check className="w-4 h-4 text-[#9e1b1e] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Publish Action Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
              {selectedId && (
                <button
                  type="button"
                  onClick={handleNewUpdate}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Clear Selection
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-xs font-black text-white bg-linear-to-r from-[#9e1b1e] to-[#b91c1c] hover:brightness-110 transition-all shadow-lg shadow-red-900/30 active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Broadcast Live 🚀</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Manage Announcements & Live Status (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-stone-900">
                  Broadcast Queue ({updates.length})
                </h3>
                <p className="text-xs text-stone-500">
                  {activeCount} currently live in customer rotation.
                </p>
              </div>
              <button
                onClick={loadData}
                title="Refresh updates"
                className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
              {updates.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No flash updates created yet. Click "Create New Flash" above.
                </div>
              ) : (
                updates.map((u) => {
                  const isCurrent = u.id === selectedId;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUpdate(u)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#9e1b1e] bg-amber-50/25 ring-2 ring-[#9e1b1e]/20'
                          : 'border-stone-200 hover:border-stone-300 bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-900 text-amber-400">
                            {u.badge}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              u.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {u.is_active ? '● Live' : '○ Paused'}
                          </span>
                          {u.display_mode === 'marquee' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                              Marquee
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleStatus(u.id, u.is_active, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.is_active
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-stone-400 hover:bg-stone-100'
                            }`}
                            title={u.is_active ? 'Pause from website' : 'Make live'}
                          >
                            {u.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(u.id, e)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-stone-800 font-medium line-clamp-2 leading-relaxed">
                        {u.message}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        {u.stock_alert_text ? (
                          <span className="text-amber-700 font-bold">{u.stock_alert_text}</span>
                        ) : (
                          <span className="text-stone-400">Theme: {u.theme}</span>
                        )}
                        {u.link_url && (
                          <span className="font-mono text-[10px] text-stone-400 truncate max-w-35">
                            {u.link_url}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Guide & Tips */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/80 p-5 text-xs text-amber-950 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
              <Megaphone className="w-4 h-4 text-amber-700" />
              <span>Pro Conversion Tips</span>
            </div>
            <ul className="space-y-1.5 text-amber-900 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Urgency Drives Orders:</strong> Adding tags like <em>"Only 18 Jars Left Today"</em> increases conversions by up to 34%.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Infinite Marquee vs Slide:</strong> Use Marquee mode for continuous branding, or Slide mode when you have specific clickable discount codes.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Instant Sync:</strong> No reload required! Customers browsing your store will see the updated banner immediately.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
