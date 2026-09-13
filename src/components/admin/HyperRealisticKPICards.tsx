'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface HyperRealisticKPICardsProps {
  totalSales: number;
  totalOrders: number;
  pendingOrdersCount: number;
  averageOrderValue: number;
  allProfilesCount: number;
  lowStockCount: number;
  totalProductsCount?: number;
}

export default function HyperRealisticKPICards({
  totalSales,
  totalOrders,
  pendingOrdersCount,
  lowStockCount,
  totalProductsCount = 0,
}: HyperRealisticKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* ================= CARD 1: REVENUE (ULTRA GLASSMORPHISM) ================= */}
      <div className="relative group bg-linear-to-br from-white/90 via-white/75 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ring-1 ring-stone-900/5">
        {/* Subtle Top Ambient Gradient Line */}
        <div className="h-1.5 w-full bg-linear-to-r from-emerald-600 via-emerald-400 to-teal-400" />
        
        {/* Glass Reflection Highlight Sheen */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-linear-to-br from-emerald-300/20 via-white/50 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50" />
              <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                Total Business Revenue
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-[#166534] border border-emerald-500/20 backdrop-blur-md shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-950 tracking-tight flex items-baseline gap-1">
              <span className="text-base text-emerald-700 font-sans font-bold">₹</span>
              <span>{totalSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/20 text-[11px] font-extrabold backdrop-blur-xs shadow-2xs">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +14.8%
              </span>
              <span className="text-[11px] text-stone-400 font-medium">vs past 30 days</span>
            </div>
          </div>

          {/* Embedded Mini Sparkline Chart */}
          <div className="pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
            <div className="w-24 h-6">
              <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="card1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#166534" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#166534" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 25 Q 25 15, 50 18 T 100 5 L 100 30 L 0 30 Z" fill="url(#card1Grad)" />
                <path d="M 0 25 Q 25 15, 50 18 T 100 5" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold text-stone-600 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs">
              Live DB Sync
            </span>
          </div>
        </div>
      </div>

      {/* ================= CARD 2: ORDERS (ULTRA GLASSMORPHISM) ================= */}
      <div className="relative group bg-linear-to-br from-white/90 via-white/75 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ring-1 ring-stone-900/5">
        {/* Subtle Top Ambient Gradient Line */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-amber-400 to-amber-300" />
        
        {/* Glass Reflection Highlight Sheen */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-linear-to-br from-amber-300/20 via-white/50 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-xs shadow-amber-500/50" />
              <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                Store Orders Volume
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-500/20 backdrop-blur-md shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-950 tracking-tight">
              {totalOrders} <span className="text-sm font-semibold text-stone-400">jars ordered</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/20 text-[11px] font-extrabold backdrop-blur-xs shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                {pendingOrdersCount} Pending
              </span>
              <span className="text-[11px] text-stone-400 font-medium">Fulfillment queue</span>
            </div>
          </div>

          {/* Embedded Progress Bar */}
          <div className="pt-2.5 border-t border-stone-200/60 space-y-1">
            <div className="flex justify-between text-[10px] font-extrabold text-stone-500">
              <span>Fulfillment Rate</span>
              <span className="text-stone-800 font-extrabold">{totalOrders > 0 ? Math.round(((totalOrders - pendingOrdersCount) / totalOrders) * 100) : 100}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden backdrop-blur-xs">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${totalOrders > 0 ? Math.round(((totalOrders - pendingOrdersCount) / totalOrders) * 100) : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARD 3: TOTAL PRODUCTS (ULTRA GLASSMORPHISM) ================= */}
      <div className="relative group bg-linear-to-br from-white/90 via-white/75 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ring-1 ring-stone-900/5">
        {/* Subtle Top Ambient Gradient Line */}
        <div className="h-1.5 w-full bg-linear-to-r from-purple-600 via-indigo-500 to-indigo-400" />
        
        {/* Glass Reflection Highlight Sheen */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-linear-to-br from-purple-300/20 via-white/50 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-xs shadow-purple-500/50" />
              <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                Total Products
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-800 border border-purple-500/20 backdrop-blur-md shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Package className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-950 tracking-tight">
              {totalProductsCount} <span className="text-sm font-semibold text-stone-400">items listed</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-900 border border-purple-500/20 text-[11px] font-extrabold backdrop-blur-xs shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                Active Catalog
              </span>
              <span className="text-[11px] text-stone-400 font-medium">in store</span>
            </div>
          </div>

          {/* Embedded Footer */}
          <div className="pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500">In-Stock Recipes</span>
            <span className="text-[10px] font-extrabold text-purple-900 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/20 backdrop-blur-xs shadow-2xs">
              {Math.max(0, totalProductsCount - lowStockCount)} Ready
            </span>
          </div>
        </div>
      </div>

      {/* ================= CARD 4: INVENTORY HEALTH (ULTRA GLASSMORPHISM) ================= */}
      <div className="relative group bg-linear-to-br from-white/90 via-white/75 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-rose-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ring-1 ring-stone-900/5">
        {/* Subtle Top Ambient Gradient Line */}
        <div className={`h-1.5 w-full ${lowStockCount > 0 ? 'bg-linear-to-r from-rose-600 via-rose-500 to-amber-500' : 'bg-linear-to-r from-emerald-500 to-emerald-300'}`} />
        
        {/* Glass Reflection Highlight Sheen */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-linear-to-br from-rose-300/20 via-white/50 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${lowStockCount > 0 ? 'bg-rose-500 animate-ping shadow-xs shadow-rose-500/50' : 'bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50'}`} />
              <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                Stock Health
              </span>
            </div>
            <div className={`w-11 h-11 rounded-2xl border backdrop-blur-md shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${lowStockCount > 0 ? 'bg-rose-500/10 text-rose-800 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20'}`}>
              <AlertTriangle className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-950 tracking-tight">
              {lowStockCount} <span className="text-sm font-semibold text-stone-400">pickle jars</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold backdrop-blur-xs shadow-2xs ${lowStockCount > 0 ? 'bg-rose-500/15 text-rose-900 border border-rose-500/20' : 'bg-emerald-500/15 text-emerald-900 border border-emerald-500/20'}`}>
                {lowStockCount > 0 ? 'Restock Needed' : 'Inventory Optimal'}
              </span>
            </div>
          </div>

          {/* Embedded Inventory Gauge Bar */}
          <div className="pt-2.5 border-t border-stone-200/60 space-y-1">
            <div className="flex justify-between text-[10px] font-extrabold text-stone-500">
              <span>Kitchen Stock Level</span>
              <span className={lowStockCount > 0 ? 'text-rose-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                {lowStockCount > 0 ? 'Action Required' : '100% Healthy'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200/60 rounded-full overflow-hidden backdrop-blur-xs">
              <div
                className={`h-full rounded-full transition-all duration-500 ${lowStockCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${lowStockCount > 0 ? 35 : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
