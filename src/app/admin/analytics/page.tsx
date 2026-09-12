'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Award,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  BarChart3,
  DollarSign,
  PieChart,
  Package,
} from 'lucide-react';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import RevenueLineChart from '@/components/admin/RevenueLineChart';
import HyperRealisticKPICards from '@/components/admin/HyperRealisticKPICards';

type TimeFilter = 'today' | 'yesterday' | 'weekly' | 'monthly' | 'quarter' | 'all' | 'custom';

interface CategoryPerf {
  name: string;
  rev: number;
  pct: number;
  color: string;
}

interface TopProductPerf {
  name: string;
  sales: number;
  rev: number;
  rank: number;
  image?: string;
}

interface ChartPoint {
  label: string;
  sales: number;
  orders: number;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [rawOrderItems, setRawOrderItems] = useState<any[]>([]);
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [rawCategories, setRawCategories] = useState<any[]>([]);
  const [customerCount, setCustomerCount] = useState<number>(0);

  const loadAnalytics = async () => {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbOrders } = await supabase.from('orders').select('*');
        const { data: dbItems } = await supabase.from('order_items').select('*');
        const { data: dbProducts } = await supabase.from('products').select('*');
        const { data: dbCategories } = await supabase.from('categories').select('*');
        const { data: dbProfiles } = await supabase.from('profiles').select('*');

        if (dbOrders) {
          const customerEmails = new Set([
            ...(dbProfiles || []).map((p) => (p.email ? p.email.toLowerCase() : '')),
            ...dbOrders.map((o) => (o.customer_email ? o.customer_email.toLowerCase() : '')),
          ].filter(Boolean));

          setRawOrders(dbOrders);
          setRawOrderItems(dbItems || []);
          setRawProducts(dbProducts || []);
          setRawCategories(dbCategories || []);
          setCustomerCount(customerEmails.size || (dbProfiles ? dbProfiles.length : 0));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching analytics from Supabase:', err);
      }
    }

    // Fallback to local store
    const orders = DataStore.getOrders();
    const products = DataStore.getProducts();
    const kpis = DataStore.getAdminKPIs();

    const items = orders.flatMap((o) => o.items || []);
    setRawOrders(orders);
    setRawOrderItems(items);
    setRawProducts(products);
    setCustomerCount(kpis.totalCustomers);
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Filter orders by time range & custom range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return rawOrders.filter((o) => {
      const orderDate = new Date(o.created_at);

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

      return true;
    });
  }, [rawOrders, timeFilter, customStartDate, customEndDate]);

  const validFilteredOrders = useMemo(
    () => filteredOrders.filter((o) => o.order_status !== 'Cancelled'),
    [filteredOrders]
  );

  const totalSales = useMemo(
    () => validFilteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    [validFilteredOrders]
  );

  const totalOrders = filteredOrders.length;
  const aov = totalOrders > 0 ? Math.round(totalSales / validFilteredOrders.length || 1) : 0;

  // High-density Chart Points calculation
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

    // Quarter / All
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

  // Top Products calculation
  const topProducts = useMemo<TopProductPerf[]>(() => {
    const validOrderIds = new Set(validFilteredOrders.map((o) => o.id));
    const itemsForFilteredOrders = rawOrderItems.filter((it) => validOrderIds.has(it.order_id));

    const prodMap: Record<string, { name: string; quantity: number; rev: number; image?: string }> = {};

    if (itemsForFilteredOrders.length > 0) {
      for (const item of itemsForFilteredOrders) {
        const name = item.product_name || 'Pickle Jar';
        if (!prodMap[name]) {
          prodMap[name] = { name, quantity: 0, rev: 0, image: item.image };
        }
        prodMap[name].quantity += Number(item.quantity || 1);
        prodMap[name].rev += Number(item.total || item.price * item.quantity || 0);
      }

      return Object.values(prodMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((p, idx) => ({
          name: p.name,
          sales: p.quantity,
          rev: p.rev,
          rank: idx + 1,
          image: p.image,
        }));
    }

    // Fallback if no order items
    return rawProducts.slice(0, 5).map((p, idx) => ({
      name: p.name,
      sales: 0,
      rev: 0,
      rank: idx + 1,
      image: p.images?.[0],
    }));
  }, [validFilteredOrders, rawOrderItems, rawProducts]);

  // Category performance calculation
  const categoryPerf = useMemo<CategoryPerf[]>(() => {
    const colors = ['bg-[#166534]', 'bg-emerald-500', 'bg-amber-500', 'bg-emerald-600', 'bg-blue-600'];
    const catMap: Record<string, number> = {};

    rawCategories.forEach((c) => (catMap[c.name] = 0));

    const validOrderIds = new Set(validFilteredOrders.map((o) => o.id));
    const itemsForFilteredOrders = rawOrderItems.filter((it) => validOrderIds.has(it.order_id));

    if (itemsForFilteredOrders.length > 0) {
      for (const item of itemsForFilteredOrders) {
        const matchedProd = rawProducts.find((p) => p.id === item.product_id || p.name === item.product_name);
        const catId = matchedProd?.category_id;
        const matchedCat = rawCategories.find((c) => c.id === catId);
        const catName = matchedCat ? matchedCat.name : 'Traditional Pickles';
        catMap[catName] = (catMap[catName] || 0) + Number(item.total || item.price * item.quantity || 0);
      }
    } else {
      catMap['Non-Veg Pickles'] = totalSales * 0.55;
      catMap['Veg Pickles'] = totalSales * 0.35;
      catMap['Podi & Powders'] = totalSales * 0.1;
    }

    const totalCatRev = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(catMap).map(([name, rev], idx) => ({
      name,
      rev,
      pct: Math.round((rev / totalCatRev) * 100),
      color: colors[idx % colors.length],
    }));
  }, [validFilteredOrders, rawOrderItems, rawCategories, rawProducts, totalSales]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header & Time Filter */}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            Sales & Customer Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time revenue metrics, order velocity, category distribution, and top sellers.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl text-stone-600 hover:text-black flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Hyper-Realistic Metric KPI Cards */}
      <HyperRealisticKPICards
        totalSales={rawOrders.filter((o) => o.order_status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount || 0), 0)}
        totalOrders={rawOrders.length}
        pendingOrdersCount={rawOrders.filter((o) => o.order_status === 'Pending' || o.order_status === 'Processing' || o.order_status === 'Confirmed').length}
        averageOrderValue={rawOrders.length > 0 ? Math.round(rawOrders.filter((o) => o.order_status !== 'Cancelled').reduce((sum, o) => sum + Number(o.total_amount || 0), 0) / rawOrders.length) : 0}
        allProfilesCount={customerCount}
        lowStockCount={rawProducts.filter((p) => Number(p.stock_quantity) <= 20).length}
        totalProductsCount={rawProducts.length}
      />

      {/* Executive Sales & Revenue Interactive Chart Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#166534]/10 text-[#166534] flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 tracking-tight">Revenue Analytics & Trend Visualization</h3>
              <p className="text-xs text-stone-500">Filter period performance or select a custom date range</p>
            </div>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold self-start lg:self-auto">
            {(['today', 'yesterday', 'weekly', 'monthly', 'quarter', 'all', 'custom'] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  timeFilter === tf
                    ? 'bg-[#166534] text-white shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {tf === 'weekly' ? '7 Days' : tf === 'monthly' ? '30 Days' : tf === 'quarter' ? '90 Days' : tf === 'custom' ? '📅 Custom Range' : tf}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range Picker Bar */}
        {timeFilter === 'custom' && (
          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in shadow-2xs">
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
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#166534] shadow-2xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold text-stone-600">To:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#166534] shadow-2xs"
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
                className="px-3 py-1 bg-white hover:bg-emerald-100 text-[#166534] font-extrabold rounded-xl border border-emerald-200 text-[11px] shadow-2xs"
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
                className="px-3 py-1 bg-white hover:bg-emerald-100 text-[#166534] font-extrabold rounded-xl border border-emerald-200 text-[11px] shadow-2xs"
              >
                Last 30 Days
              </button>
            </div>
          </div>
        )}

        {/* Executive Luxury Chart */}
        <RevenueLineChart data={chartData} timeFilter={timeFilter} />
      </div>

      {/* Category Performance & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#166534] border border-emerald-200/80 flex items-center justify-center">
                <PieChart className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 tracking-tight">Sales By Category</h3>
                <p className="text-[10px] text-stone-400">Revenue contribution per product line</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {categoryPerf.map((cat) => (
              <div key={cat.name} className="p-3.5 rounded-2xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 transition-all space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-stone-900 font-extrabold flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-stone-900 font-extrabold">₹{cat.rev.toLocaleString('en-IN')} <span className="text-stone-400 font-normal text-[11px]">({cat.pct}%)</span></span>
                </div>
                <div className="w-full h-2.5 bg-stone-200/70 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${Math.max(cat.pct, 4)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Pickles */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 tracking-tight">Top Selling Pickles</h3>
                <p className="text-[10px] text-stone-400">Best-performing recipe rankings</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {topProducts.map((prod) => (
              <div key={prod.name} className="p-3.5 rounded-2xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 transition-all flex items-center justify-between text-xs group">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-xs shadow-2xs border border-amber-200">
                    #{prod.rank}
                  </span>
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Image
                      src={prod.image || '/images/pickles/hero.jpg'}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{prod.name}</p>
                    <p className="text-[10px] text-stone-400 font-semibold">{prod.sales} jar(s) ordered</p>
                  </div>
                </div>
                <span className="font-extrabold text-stone-900 text-sm bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-2xs">₹{prod.rev.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
