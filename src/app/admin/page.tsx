'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Calendar,
  DollarSign,
  PackageCheck,
  ChevronRight,
  MessageCircle,
  Phone,
  Eye,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import RevenueLineChart from '@/components/admin/RevenueLineChart';
import HyperRealisticKPICards from '@/components/admin/HyperRealisticKPICards';
import { Order, Product, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

type TimeFilter = 'today' | 'yesterday' | 'weekly' | 'monthly' | 'quarter' | 'all' | 'custom';

interface ChartPoint {
  label: string;
  sales: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allProfilesCount, setAllProfilesCount] = useState<number>(0);

  const refreshData = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        const { data: dbProfiles } = await supabase.from('profiles').select('*');
        const { data: dbProducts } = await supabase.from('products').select('*');

        if (dbOrders && dbProducts) {
          const customerEmails = new Set([
            ...(dbProfiles || []).map((p) => (p.email ? p.email.toLowerCase() : '')),
            ...dbOrders.map((o) => (o.customer_email ? o.customer_email.toLowerCase() : '')),
          ].filter(Boolean));

          setAllOrders(dbOrders);
          setAllProducts(dbProducts);
          setAllProfilesCount(customerEmails.size || (dbProfiles ? dbProfiles.length : 0));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching admin dashboard KPIs from Supabase:', err);
      }
    }

    const localOrders = DataStore.getOrders();
    const localProducts = DataStore.getProducts();
    const localKpis = DataStore.getAdminKPIs();

    setAllOrders(localOrders);
    setAllProducts(localProducts);
    setAllProfilesCount(localKpis.totalCustomers);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter orders based on selected time filter & custom range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return allOrders.filter((order) => {
      const orderDate = new Date(order.created_at);

      if (timeFilter === 'today') {
        return orderDate >= startOfToday;
      }

      if (timeFilter === 'yesterday') {
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        return orderDate >= startOfYesterday && orderDate < startOfToday;
      }

      if (timeFilter === 'weekly') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }

      if (timeFilter === 'monthly') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      }

      if (timeFilter === 'quarter') {
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return orderDate >= ninetyDaysAgo;
      }

      if (timeFilter === 'custom') {
        if (customStartDate) {
          const s = new Date(customStartDate);
          s.setHours(0, 0, 0, 0);
          if (orderDate < s) return false;
        }
        if (customEndDate) {
          const e = new Date(customEndDate);
          e.setHours(23, 59, 59, 999);
          if (orderDate > e) return false;
        }
        return true;
      }

      return true; // 'all'
    });
  }, [allOrders, timeFilter, customStartDate, customEndDate]);

  // Derived Metrics
  const validFilteredOrders = useMemo(
    () => filteredOrders.filter((o) => o.order_status !== 'Cancelled'),
    [filteredOrders]
  );

  const totalSales = useMemo(
    () => validFilteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    [validFilteredOrders]
  );

  const pendingOrdersCount = useMemo(
    () =>
      allOrders.filter(
        (o) => o.order_status === 'Pending' || o.order_status === 'Processing' || o.order_status === 'Confirmed'
      ).length,
    [allOrders]
  );

  const lowStockList = useMemo(
    () => allProducts.filter((p) => Number(p.stock_quantity) <= 20),
    [allProducts]
  );

  const averageOrderValue = useMemo(
    () => (validFilteredOrders.length > 0 ? Math.round(totalSales / validFilteredOrders.length) : 0),
    [totalSales, validFilteredOrders]
  );

  // Generate high-density chart data based on time filter & custom range
  const chartData = useMemo<ChartPoint[]>(() => {
    const now = new Date();

    if (timeFilter === 'today' || timeFilter === 'yesterday') {
      const points: ChartPoint[] = [
        { label: '12 AM - 4 AM', sales: 0, orders: 0 },
        { label: '4 AM - 8 AM', sales: 0, orders: 0 },
        { label: '8 AM - 12 PM', sales: 0, orders: 0 },
        { label: '12 PM - 4 PM', sales: 0, orders: 0 },
        { label: '4 PM - 8 PM', sales: 0, orders: 0 },
        { label: '8 PM - 12 AM', sales: 0, orders: 0 },
      ];

      validFilteredOrders.forEach((o) => {
        const hour = new Date(o.created_at).getHours();
        const idx = Math.min(Math.floor(hour / 4), 5);
        points[idx].sales += Number(o.total_amount || 0);
        points[idx].orders += 1;
      });

      return points;
    }

    if (timeFilter === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const points: ChartPoint[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayLabel = `${days[d.getDay()]} ${d.getDate()}`;
        points.push({ label: dayLabel, sales: 0, orders: 0 });
      }

      validFilteredOrders.forEach((o) => {
        const d = new Date(o.created_at);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          const pointIdx = 6 - diffDays;
          if (points[pointIdx]) {
            points[pointIdx].sales += Number(o.total_amount || 0);
            points[pointIdx].orders += 1;
          }
        }
      });

      return points;
    }

    if (timeFilter === 'custom' && customStartDate && customEndDate) {
      const s = new Date(customStartDate);
      const e = new Date(customEndDate);
      s.setHours(0, 0, 0, 0);
      e.setHours(23, 59, 59, 999);

      const diffTime = Math.abs(e.getTime() - s.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 31) {
        // Daily points
        const points: ChartPoint[] = [];
        const currentIter = new Date(s);
        while (currentIter <= e) {
          const label = `${currentIter.toLocaleString('en-IN', { month: 'short' })} ${currentIter.getDate()}`;
          points.push({ label, sales: 0, orders: 0 });
          currentIter.setDate(currentIter.getDate() + 1);
        }

        validFilteredOrders.forEach((o) => {
          const oDate = new Date(o.created_at);
          const dayIdx = Math.floor((oDate.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
          if (dayIdx >= 0 && dayIdx < points.length) {
            points[dayIdx].sales += Number(o.total_amount || 0);
            points[dayIdx].orders += 1;
          }
        });

        return points.length > 0 ? points : [{ label: 'No Range Data', sales: 0, orders: 0 }];
      }
    }

    if (timeFilter === 'monthly') {
      // 10 3-day interval points for smooth monthly trend
      const points: ChartPoint[] = [];
      for (let i = 9; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 3);
        const label = `${d.toLocaleString('en-IN', { month: 'short' })} ${d.getDate()}`;
        points.push({ label, sales: 0, orders: 0 });
      }

      validFilteredOrders.forEach((o) => {
        const d = new Date(o.created_at);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));
        const idx = 9 - Math.min(Math.floor(diffDays / 3), 9);
        if (points[idx]) {
          points[idx].sales += Number(o.total_amount || 0);
          points[idx].orders += 1;
        }
      });

      return points;
    }

    // Default / 90 Days / All Time
    const points: ChartPoint[] = [
      { label: 'Wk 1', sales: 0, orders: 0 },
      { label: 'Wk 2', sales: 0, orders: 0 },
      { label: 'Wk 3', sales: 0, orders: 0 },
      { label: 'Wk 4', sales: 0, orders: 0 },
      { label: 'Wk 5', sales: 0, orders: 0 },
      { label: 'Wk 6', sales: 0, orders: 0 },
    ];

    validFilteredOrders.forEach((o) => {
      const d = new Date(o.created_at);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));
      const weekIdx = Math.min(Math.floor(diffDays / 7), 5);
      const reverseIdx = 5 - weekIdx;
      if (points[reverseIdx]) {
        points[reverseIdx].sales += Number(o.total_amount || 0);
        points[reverseIdx].orders += 1;
      }
    });

    return points;
  }, [validFilteredOrders, timeFilter, customStartDate, customEndDate]);

  const maxChartSales = useMemo(
    () => Math.max(...chartData.map((p) => p.sales), 100),
    [chartData]
  );

  const handleQuickStatusChange = async (orderId: string, status: OrderStatus) => {
    DataStore.updateOrderStatus(orderId, status, `Quick update by Admin to ${status}`);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    }
    await refreshData();
    showToast(`Order #${orderId} updated to ${status}!`, 'success');
  };

  const handleRestock = async (product: Product) => {
    const updated = {
      ...product,
      stock_quantity: product.stock_quantity + 25,
      variants: (product.variants || []).map((v) => ({ ...v, stock_quantity: v.stock_quantity + 25 })),
    };
    DataStore.saveProduct(updated);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').update({ stock_quantity: updated.stock_quantity }).eq('id', product.id);
    }
    await refreshData();
    showToast(`Restocked ${product.name} (+25 jars)`, 'success');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Welcome Header & Actions (Apple Glass Hero) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-7 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-extrabold text-2xl sm:text-3.5xl tracking-[-0.03em] text-stone-950">
              Kitchen & Store Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-[#166534] border border-emerald-500/20 text-[10px] font-extrabold uppercase backdrop-blur-md shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50" />
              Live DB
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Real-time analytics, order tracking, and inventory control for Kavyasri Pickles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-3 bg-stone-100/80 hover:bg-stone-200/80 border border-stone-200/60 rounded-2xl text-stone-600 hover:text-black active:scale-95 transition-all shadow-2xs backdrop-blur-md"
            title="Refresh Analytics Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/products/new"
            className="px-4.5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-emerald-900/20 hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pickle</span>
          </Link>
        </div>
      </div>

      {/* Hyper-Realistic Metric KPI Cards */}
      <HyperRealisticKPICards
        totalSales={allOrders.filter((o) => o.order_status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount || 0), 0)}
        totalOrders={allOrders.length}
        pendingOrdersCount={pendingOrdersCount}
        averageOrderValue={allOrders.length > 0 ? Math.round(allOrders.filter((o) => o.order_status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount || 0), 0) / allOrders.length) : 0}
        allProfilesCount={allProfilesCount}
        lowStockCount={lowStockList.length}
        totalProductsCount={allProducts.length}
      />

      {/* Executive Sales & Revenue Interactive Chart Section */}
      <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-5 sm:p-7 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-[#166534] border border-emerald-500/20 backdrop-blur-md shadow-2xs flex items-center justify-center font-bold">
              <BarChart3 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold tracking-tight text-lg text-stone-950">Revenue Analytics & Trend Visualization</h3>
              <p className="text-xs text-stone-500 font-medium">Filter period performance or select a custom date range</p>
            </div>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80 text-xs font-bold self-start lg:self-auto backdrop-blur-md">
            {(['today', 'yesterday', 'weekly', 'monthly', 'quarter', 'all', 'custom'] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all active:scale-95 ${
                  timeFilter === tf
                    ? 'bg-linear-to-r from-[#166534] to-[#15803d] text-white shadow-md shadow-emerald-900/20 font-extrabold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {tf === 'weekly' ? '7 Days' : tf === 'monthly' ? '30 Days' : tf === 'quarter' ? '90 Days' : tf === 'custom' ? '📅 Custom Range' : tf}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range Picker Bar (Shown when Custom Range filter is selected) */}
        {timeFilter === 'custom' && (
          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-extrabold text-[#166534] flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Select Custom Date Interval:
              </span>
              <div className="flex items-center gap-2">
                <label className="font-bold text-stone-600">From:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300/80 rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#166534] shadow-2xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold text-stone-600">To:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300/80 rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#166534] shadow-2xs"
                />
              </div>
            </div>

            {/* Quick date range presets */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const seven = new Date(now);
                  seven.setDate(seven.getDate() - 7);
                  setCustomStartDate(seven.toISOString().split('T')[0]);
                  setCustomEndDate(now.toISOString().split('T')[0]);
                }}
                className="px-3 py-1 bg-white hover:bg-emerald-100 text-[#166534] font-extrabold rounded-xl border border-emerald-200 text-[11px] shadow-2xs active:scale-95 transition-transform"
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const thirty = new Date(now);
                  thirty.setDate(thirty.getDate() - 30);
                  setCustomStartDate(thirty.toISOString().split('T')[0]);
                  setCustomEndDate(now.toISOString().split('T')[0]);
                }}
                className="px-3 py-1 bg-white hover:bg-emerald-100 text-[#166534] font-extrabold rounded-xl border border-emerald-200 text-[11px] shadow-2xs active:scale-95 transition-transform"
              >
                Last 30 Days
              </button>
            </div>
          </div>
        )}

        {/* Executive Luxury Chart */}
        <RevenueLineChart data={chartData} timeFilter={timeFilter} />
      </div>

      {/* Low Stock Watchlist & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Inventory Watchlist (5 cols) */}
        <div className="lg:col-span-5 bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-6 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-500/20 backdrop-blur-md flex items-center justify-center shadow-2xs">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold tracking-tight text-base text-stone-950">Low Stock Inventory</h3>
                <p className="text-[10px] text-stone-400 font-medium">Products requiring kitchen restock</p>
              </div>
            </div>
            <Link href="/admin/products" className="text-xs font-extrabold text-[#166534] hover:underline flex items-center gap-0.5 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 active:scale-95 transition-all">
              <span>Manage All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {lowStockList.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <p className="text-xs text-stone-500 font-bold">All pickle jar stocks are healthy!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {lowStockList.map((prod) => {
                const pct = Math.min(Math.round((prod.stock_quantity / 50) * 100), 100);
                return (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-stone-200/70 transition-all duration-200 flex items-center justify-between gap-3 text-xs group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={prod.images?.[0] || '/images/pickles/hero.jpg'}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="font-bold text-stone-900 truncate">{prod.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${prod.stock_quantity <= 5 ? 'bg-rose-500' : 'bg-amber-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-[10px] text-amber-900 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/20">
                            {prod.stock_quantity} left
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestock(prod)}
                      className="px-3.5 py-2 bg-linear-to-r from-[#166534] to-[#15803d] text-white rounded-xl font-extrabold text-[11px] transition-all shrink-0 shadow-md shadow-emerald-900/20 flex items-center gap-1 active:scale-95 hover:scale-105"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+25 Jars</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Customer Orders (7 cols) */}
        <div className="lg:col-span-7 bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-6 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-[#166534] border border-emerald-500/20 backdrop-blur-md flex items-center justify-center shadow-2xs">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold tracking-tight text-base text-stone-950">Recent Customer Orders</h3>
                <p className="text-[10px] text-stone-400 font-medium">Latest orders awaiting packaging & dispatch</p>
              </div>
            </div>
            <Link href="/admin/orders" className="text-xs font-extrabold text-[#166534] hover:underline flex items-center gap-0.5 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 active:scale-95 transition-all">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {allOrders.slice(0, 5).map((o) => {
              const cleanPhone = o.customer_phone ? o.customer_phone.replace(/\D/g, '') : '';
              return (
                <div
                  key={o.id}
                  className="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-stone-200/70 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#166534] font-extrabold text-base flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                      {o.customer_name ? o.customer_name[0].toUpperCase() : 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${o.id}`} className="font-mono font-extrabold text-stone-950 hover:text-[#166534] transition-colors">
                          #{o.id}
                        </Link>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border ${
                            o.order_status === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-900 border-emerald-500/20'
                              : o.order_status === 'Shipped'
                              ? 'bg-blue-500/15 text-blue-900 border-blue-500/20'
                              : 'bg-amber-500/15 text-amber-900 border-amber-500/20'
                          }`}
                        >
                          {o.order_status}
                        </span>
                      </div>
                      <p className="font-semibold text-stone-700 mt-0.5">{o.customer_name || 'Customer'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60">
                    <div className="text-right">
                      <p className="font-extrabold text-stone-950 text-sm">₹{o.total_amount}</p>
                      <p className="text-[10px] text-stone-400 font-semibold">
                        {new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Quick WhatsApp & Details Action */}
                    <div className="flex items-center gap-1.5">
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=Hello%20${encodeURIComponent(o.customer_name || '')},%20regarding%20your%20order%20%23${o.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-emerald-500/15 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-xl transition-colors border border-emerald-500/20 active:scale-90"
                          title="Chat with Customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="p-2 bg-stone-100 hover:bg-stone-950 hover:text-white border border-stone-200/80 rounded-xl text-stone-700 transition-colors shadow-2xs active:scale-90"
                        title="View Order Invoice & Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
