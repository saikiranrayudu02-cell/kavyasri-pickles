'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  IndianRupee,
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
  averageOrderValue,
  allProfilesCount,
  lowStockCount,
  totalProductsCount = 0,
}: HyperRealisticKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* ================= CARD 1: REVENUE ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
        <div className="h-1.5 w-full bg-linear-to-r from-[#166534] via-emerald-500 to-teal-400" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest">
                Total Business Revenue
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#166534] border border-emerald-200/80 shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-900 tracking-tight flex items-baseline gap-1">
              <span className="text-base text-emerald-700 font-sans font-bold">₹</span>
              <span>{totalSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[11px] font-extrabold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +14.8%
              </span>
              <span className="text-[11px] text-stone-400 font-medium">vs past 30 days</span>
            </div>
          </div>

          {/* Embedded Mini SVG Sparkline */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
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
            <span className="text-[10px] font-extrabold text-stone-500 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200">
              Live DB Sync
            </span>
          </div>
        </div>
      </div>

      {/* ================= CARD 2: ORDERS ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
        <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-amber-400 to-amber-300" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest">
                Store Orders Volume
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-900 tracking-tight">
              {totalOrders} <span className="text-sm font-semibold text-stone-400">jars ordered</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 text-[11px] font-extrabold">
                <Clock className="w-3 h-3 text-amber-700" />
                {pendingOrdersCount} Pending
              </span>
              <span className="text-[11px] text-stone-400 font-medium">Fulfillment queue</span>
            </div>
          </div>

          {/* Embedded Mini Progress Sparkline */}
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <div className="flex justify-between text-[10px] font-extrabold text-stone-500">
              <span>Fulfillment Rate</span>
              <span>{totalOrders > 0 ? Math.round(((totalOrders - pendingOrdersCount) / totalOrders) * 100) : 100}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${totalOrders > 0 ? Math.round(((totalOrders - pendingOrdersCount) / totalOrders) * 100) : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARD 3: TOTAL PRODUCTS ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
        <div className="h-1.5 w-full bg-linear-to-r from-purple-600 via-indigo-500 to-indigo-400" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest">
                Total Products
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-900 tracking-tight">
              {totalProductsCount} <span className="text-sm font-semibold text-stone-400">items listed</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-100/90 text-purple-900 text-[11px] font-extrabold">
                <ShieldCheck className="w-3 h-3 text-purple-700" />
                Active Catalog
              </span>
              <span className="text-[11px] text-stone-400 font-medium">in store</span>
            </div>
          </div>

          {/* Embedded Metric Footer */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400">In-Stock Recipes</span>
            <span className="text-[10px] font-extrabold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
              {Math.max(0, totalProductsCount - lowStockCount)} Ready
            </span>
          </div>
        </div>
      </div>

      {/* ================= CARD 4: INVENTORY HEALTH ================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
        <div className={`h-1.5 w-full ${lowStockCount > 0 ? 'bg-linear-to-r from-rose-600 to-rose-400' : 'bg-linear-to-r from-emerald-500 to-emerald-300'}`} />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${lowStockCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest">
                Stock Health
              </span>
            </div>
            <div className={`w-11 h-11 rounded-2xl border shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform ${lowStockCount > 0 ? 'bg-rose-50 text-rose-700 border-rose-200/80' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'}`}>
              <AlertTriangle className="w-5.5 h-5.5" />
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-3.5xl font-extrabold text-stone-900 tracking-tight">
              {lowStockCount} <span className="text-sm font-semibold text-stone-400">pickle jars</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-extrabold ${lowStockCount > 0 ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'}`}>
                {lowStockCount > 0 ? 'Restock Needed' : 'Inventory Optimal'}
              </span>
            </div>
          </div>

          {/* Embedded Inventory Gauge Bar */}
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <div className="flex justify-between text-[10px] font-extrabold text-stone-500">
              <span>Kitchen Stock Level</span>
              <span className={lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                {lowStockCount > 0 ? 'Action Required' : '100% Healthy'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${lowStockCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${lowStockCount > 0 ? 35 : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
