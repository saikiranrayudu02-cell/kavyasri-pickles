'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Award,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';

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
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    aov: 0,
  });

  const [categoryPerf, setCategoryPerf] = useState<CategoryPerf[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductPerf[]>([]);

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
          const validOrders = dbOrders.filter((o) => o.order_status !== 'Cancelled');
          const totalSales = validOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
          const totalOrders = dbOrders.length;
          const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

          const customerEmails = new Set([
            ...(dbProfiles || []).map((p) => (p.email ? p.email.toLowerCase() : '')),
            ...dbOrders.map((o) => (o.customer_email ? o.customer_email.toLowerCase() : '')),
          ].filter(Boolean));

          setData({
            totalSales,
            totalOrders,
            totalCustomers: customerEmails.size || (dbProfiles ? dbProfiles.length : 0),
            aov,
          });

          // Top products by items sold
          if (dbItems && dbItems.length > 0) {
            const prodMap: Record<string, { name: string; quantity: number; rev: number }> = {};
            for (const item of dbItems) {
              const name = item.product_name || 'Pickle Item';
              if (!prodMap[name]) {
                prodMap[name] = { name, quantity: 0, rev: 0 };
              }
              prodMap[name].quantity += Number(item.quantity || 1);
              prodMap[name].rev += Number(item.total || 0);
            }

            const sorted = Object.values(prodMap)
              .sort((a, b) => b.quantity - a.quantity)
              .slice(0, 5)
              .map((p, idx) => ({
                name: p.name,
                sales: p.quantity,
                rev: p.rev,
                rank: idx + 1,
              }));

            setTopProducts(sorted);
          } else if (dbProducts) {
            setTopProducts(
              dbProducts.slice(0, 4).map((p, idx) => ({
                name: p.name,
                sales: 0,
                rev: 0,
                rank: idx + 1,
              }))
            );
          }

          // Category performance
          if (dbCategories && dbProducts) {
            const colors = ['bg-[#166534]', 'bg-emerald-500', 'bg-amber-500', 'bg-emerald-600', 'bg-blue-600'];
            const catMap: Record<string, number> = {};
            dbCategories.forEach((c) => (catMap[c.name] = 0));

            if (dbItems && dbItems.length > 0) {
              for (const item of dbItems) {
                const matchedProd = dbProducts.find((p) => p.id === item.product_id || p.name === item.product_name);
                const catId = matchedProd?.category_id;
                const matchedCat = dbCategories.find((c) => c.id === catId);
                const catName = matchedCat ? matchedCat.name : 'Pickles';
                catMap[catName] = (catMap[catName] || 0) + Number(item.total || 0);
              }
            }

            const totalCatRev = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
            const perf: CategoryPerf[] = Object.entries(catMap).map(([name, rev], idx) => ({
              name,
              rev,
              pct: Math.round((rev / totalCatRev) * 100),
              color: colors[idx % colors.length],
            }));

            setCategoryPerf(perf);
          }

          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching analytics from Supabase:', err);
      }
    }

    // Fallback to local store
    const kpis = DataStore.getAdminKPIs();
    const aov = kpis.totalOrders > 0 ? Math.round(kpis.totalSales / kpis.totalOrders) : 0;
    setData({
      totalSales: kpis.totalSales,
      totalOrders: kpis.totalOrders,
      totalCustomers: kpis.totalCustomers,
      aov,
    });
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sales & Customer Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time business performance, gross sales, average order values, and product performance.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-black flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Gross Sales</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-2">
            ₹{data.totalSales.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">Live Database Metrics</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Orders</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-2">{data.totalOrders}</div>
          <p className="text-[11px] text-stone-400 mt-1">Total customer orders placed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Average Order Value</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-2">₹{data.aov}</div>
          <p className="text-[11px] text-stone-400 mt-1">Calculated per order</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Customers</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-2">{data.totalCustomers}</div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">Profiles & Buyer accounts</p>
        </div>
      </div>

      {/* Category Performance & Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900">Sales By Category</h3>
          {categoryPerf.length === 0 ? (
            <p className="text-xs text-stone-400 py-4">No order items recorded yet.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {categoryPerf.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-800">{cat.name}</span>
                    <span className="text-stone-500">₹{cat.rev.toLocaleString('en-IN')} ({cat.pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: `${Math.max(cat.pct, 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Pickles */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900">Top Selling Pickles</h3>
          {topProducts.length === 0 ? (
            <p className="text-xs text-stone-400 py-4">No order items recorded yet.</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {topProducts.map((prod) => (
                <div key={prod.name} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-100 font-bold text-stone-700 flex items-center justify-center text-[11px]">
                      #{prod.rank}
                    </span>
                    <div>
                      <p className="font-bold text-stone-900">{prod.name}</p>
                      <p className="text-[10px] text-stone-400">{prod.sales} jar(s) ordered</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-stone-900">₹{prod.rev.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
