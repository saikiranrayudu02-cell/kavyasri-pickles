'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  MapPin,
  User,
  ChevronRight,
  Truck,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Flame,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import AccountHeader from '@/components/account/AccountHeader';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Order } from '@/lib/types';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addressCount, setAddressCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setAddressCount(0);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadAccountData() {
      // 1. Fetch Orders
      if (isSupabaseConfigured && supabase && user?.id) {
        try {
          const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
            .order('created_at', { ascending: false });

          if (!error && dbOrders && isMounted) {
            const mappedOrders: Order[] = dbOrders.map((o) => ({
              ...o,
              items: [],
            }));
            setOrders(mappedOrders);
          }
        } catch (err) {
          console.error('Error fetching recent orders:', err);
        }

        // 2. Fetch Addresses count
        try {
          const { count, error } = await supabase
            .from('addresses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          if (!error && count !== null && isMounted) {
            setAddressCount(count);
          }
        } catch (err) {
          console.error('Error fetching addresses count:', err);
        }
      } else {
        const userOrders = DataStore.getUserOrders(user?.id, user?.email);
        if (isMounted) {
          setOrders(userOrders);
          try {
            const saved = localStorage.getItem(`kp_addresses_${user?.id}`);
            if (saved) {
              const parsed = JSON.parse(saved);
              setAddressCount(Array.isArray(parsed) ? parsed.length : 0);
            }
          } catch {
            setAddressCount(0);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadAccountData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const activeDeliveries = orders.filter(
    (o) => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled'
  ).length;

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AccountHeader
          activeTab="overview"
          orderCount={orders.length}
          addressCount={addressCount}
        />

        {/* 4 Stat Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              {loading ? '...' : orders.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" /> Lifetime jar purchases
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                In Transit
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              {loading ? '...' : activeDeliveries}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-blue-500" /> Active shipments
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Delivery Places
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              {loading ? '...' : addressCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
              Saved for 1-click checkout
            </p>
          </div>

          <div className="bg-linear-to-br from-amber-500/10 via-emerald-600/10 to-transparent rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-amber-300/60 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Member Tier
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-xl sm:text-2xl font-extrabold text-stone-900">
              Pickle Connoisseur
            </div>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              Zero Preservatives Fan
            </p>
          </div>
        </div>

        {/* Main Grid: Shortcuts & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Quick Navigation Shortcuts (1 Col) */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Quick Shortcuts
            </h2>

            <Link
              href="/account/orders"
              className="flex items-center justify-between p-5 rounded-3xl bg-white border border-stone-200/80 hover:border-[#166534] shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#166534] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#166534] transition-colors">
                    My Orders & Tracking
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    View tracking, delivery stages & invoices
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#166534] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/account/addresses"
              className="flex items-center justify-between p-5 rounded-3xl bg-white border border-stone-200/80 hover:border-[#d97706] shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#d97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#d97706] transition-colors">
                    Saved Addresses
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Manage home & office delivery points
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#d97706] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/account/profile"
              className="flex items-center justify-between p-5 rounded-3xl bg-white border border-stone-200/80 hover:border-stone-400 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-stone-700 transition-colors">
                    Profile & Security
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update phone, email, and preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Assistance Card */}
            <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-900 to-stone-900 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
              <h4 className="font-serif font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" /> Need Personal Help?
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Have questions about bulk orders, custom spice levels, or shipping status?
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <a
                  href="https://wa.me/919705222744?text=Hello%20Kavyasri%20Pickles,%20I%20need%20assistance!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-amber-300 hover:underline"
                >
                  +91 97052 22744
                </a>
                <Link
                  href="/contact"
                  className="text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Orders (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Recent Pickle Orders
              </h2>
              {orders.length > 0 && (
                <Link
                  href="/account/orders"
                  className="text-xs font-bold text-[#166534] hover:text-[#14532d] flex items-center gap-1 group"
                >
                  <span>View All ({orders.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs">
                <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium text-stone-500">Loading your recent orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200/80 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                  No orders placed yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
                  Bring authentic Andhra homemade pickles to your dining table. Made with 100% cold-pressed groundnut oil and no chemical preservatives.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Explore Fresh Batches</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const isDelivered = order.order_status === 'Delivered';
                  const isShipped = order.order_status === 'Shipped';
                  const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-md transition-all space-y-4"
                    >
                      {/* Order Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-black bg-stone-100 text-stone-900 px-2.5 py-1 rounded-lg border border-stone-200">
                            {order.id}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-xs text-stone-500 font-medium">
                            {dateStr}
                          </span>
                        </div>

                        {/* Status Badge with Live Dot */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isDelivered
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isShipped
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDelivered
                                  ? 'bg-emerald-500'
                                  : isShipped
                                  ? 'bg-blue-500 animate-pulse'
                                  : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {order.order_status}
                          </span>
                        </div>
                      </div>

                      {/* Order Details Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-stone-500">
                            Delivery to: <strong className="text-stone-800">{order.customer_name}</strong>
                          </p>
                          <p className="text-xs text-stone-400">
                            Payment: {order.payment_method} ({order.payment_status})
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                              Total Amount
                            </span>
                            <span className="font-serif text-lg font-black text-[#166534]">
                              ₹{order.total_amount}
                            </span>
                          </div>

                          <Link
                            href={`/orders/${order.id}`}
                            className="px-4 py-2 bg-stone-900 hover:bg-[#166534] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                          >
                            <span>Track Order</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 text-center">
                  <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#166534] transition-colors py-2 px-4 rounded-xl hover:bg-white"
                  >
                    <span>View all orders and download tax invoices</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quality Commitment Ribbon */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Wood-Pressed Groundnut Oil
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Extracted traditionally for rich aroma & natural preservation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Zero Preservatives & Colors
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  100% clean, pure ingredients just like mom makes at home.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-800 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  All-India Safe Shipping
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Triple-layer leak-proof seal for fresh doorstep delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
