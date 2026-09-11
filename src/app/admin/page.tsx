'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Order, Product, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [kpis, setKpis] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockList, setLowStockList] = useState<Product[]>([]);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'daily'>('weekly');

  const refreshData = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        const { data: dbProfiles } = await supabase.from('profiles').select('*');
        const { data: dbProducts } = await supabase.from('products').select('*');

        if (dbOrders && dbProducts) {
          const validOrders = dbOrders.filter((o) => o.order_status !== 'Cancelled');
          const totalSales = validOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

          const pendingOrders = dbOrders.filter(
            (o) => o.order_status === 'Pending' || o.order_status === 'Processing' || o.order_status === 'Confirmed'
          ).length;

          const lowStock = dbProducts.filter((p) => Number(p.stock_quantity) <= 20);

          const customerEmails = new Set([
            ...(dbProfiles || []).map((p) => (p.email ? p.email.toLowerCase() : '')),
            ...dbOrders.map((o) => (o.customer_email ? o.customer_email.toLowerCase() : '')),
          ].filter(Boolean));

          setKpis({
            totalSales,
            totalOrders: dbOrders.length,
            pendingOrders,
            totalCustomers: customerEmails.size || (dbProfiles ? dbProfiles.length : 0),
            totalProducts: dbProducts.length,
            lowStockProducts: lowStock.length,
          });

          setRecentOrders(dbOrders.slice(0, 5));
          setLowStockList(lowStock);
          return;
        }
      } catch (err) {
        console.error('Error fetching admin dashboard KPIs from Supabase:', err);
      }
    }

    const localKpis = DataStore.getAdminKPIs();
    setKpis(localKpis);
    setRecentOrders(DataStore.getOrders().slice(0, 5));
    setLowStockList(DataStore.getProducts().filter((p) => p.stock_quantity <= 20));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleQuickStatusChange = async (orderId: string, status: OrderStatus) => {
    DataStore.updateOrderStatus(orderId, status, `Quick update by Admin to ${status}`);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    }
    await refreshData();
    showToast(`Order ${orderId} updated to ${status}!`, 'success');
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
    showToast(`Restocked ${product.name} (+25 units)`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Business Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time analytics for Kavyasri Pickles kitchen & store operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-black transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pickle</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
            ₹{kpis.totalSales.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Live Database Metrics</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#166534] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
            {kpis.totalOrders}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            <strong className="text-amber-700">{kpis.pendingOrders} orders</strong> awaiting fulfillment
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Customers</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
            {kpis.totalCustomers}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Registered customer profiles
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
            {kpis.lowStockProducts}
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-2">
            {kpis.lowStockProducts > 0 ? 'Requires kitchen restock' : 'All stocks healthy'}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Watchlist (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-base text-stone-900">Low Stock Watchlist</h3>
            </div>
            <Link href="/admin/products" className="text-xs font-bold text-[#166534] hover:underline">
              Manage All
            </Link>
          </div>

          {lowStockList.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4 text-center">All products have healthy inventory!</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {lowStockList.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image src={prod.images?.[0] || '/images/pickles/hero.jpg'} alt={prod.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 truncate max-w-35">{prod.name}</p>
                      <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded text-[10px]">
                        {prod.stock_quantity} left
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestock(prod)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    +25 Jars
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-base text-stone-900">Recent Customer Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-[#166534] hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="p-2.5">Order</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70">
                    <td className="p-2.5 font-mono font-bold text-stone-900">{o.id}</td>
                    <td className="p-2.5">
                      <p className="font-bold text-stone-900">{o.customer_name}</p>
                      <p className="text-[10px] text-stone-400">{o.shipping_address?.city || ''}</p>
                    </td>
                    <td className="p-2.5 font-bold text-stone-900">₹{o.total_amount}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          o.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.order_status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {o.order_status !== 'Delivered' ? (
                        <button
                          onClick={() =>
                            handleQuickStatusChange(
                              o.id,
                              o.order_status === 'Pending'
                                ? 'Confirmed'
                                : o.order_status === 'Confirmed'
                                ? 'Processing'
                                : o.order_status === 'Processing'
                                ? 'Shipped'
                                : 'Delivered'
                            )
                          }
                          className="text-[10px] font-bold text-[#166534] hover:underline"
                        >
                          Advance Status →
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
