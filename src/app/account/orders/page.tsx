'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  FileText,
  MapPin,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import AccountHeader from '@/components/account/AccountHeader';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Order } from '@/lib/types';

export default function MyOrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadUserOrders() {
      if (isSupabaseConfigured && supabase && user?.id) {
        try {
          const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .or(`user_id.eq.${user.id},customer_email.ilike.${user.email}`)
            .order('created_at', { ascending: false });

          if (!error && dbOrders && dbOrders.length > 0 && isMounted) {
            const orderIds = dbOrders.map((o) => o.id);
            const { data: dbItems } = await supabase
              .from('order_items')
              .select('*')
              .in('order_id', orderIds);

            const mappedOrders: Order[] = dbOrders.map((o) => ({
              ...o,
              items: (dbItems || [])
                .filter((item) => item.order_id === o.id)
                .map((it) => ({
                  id: it.id,
                  product_id: it.product_id || '',
                  product_name: it.product_name,
                  image: it.image || '/images/pickles/hero.jpg',
                  variant_weight: it.variant_weight,
                  price: Number(it.price),
                  quantity: it.quantity,
                  total: Number(it.total),
                })),
            }));

            setOrders(mappedOrders);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching Supabase user orders:', err);
        }
      }

      // Local fallback filtered strictly by authenticated user
      const userOrders = DataStore.getUserOrders(user?.id, user?.email);
      if (isMounted) {
        setOrders(userOrders);
        setLoading(false);
      }
    }

    loadUserOrders();
    return () => {
      isMounted = false;
    };
  }, [user, isAuthLoading]);

  // Filter orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (statusFilter === 'active') {
        if (order.order_status === 'Delivered' || order.order_status === 'Cancelled') {
          return false;
        }
      } else if (statusFilter === 'delivered') {
        if (order.order_status !== 'Delivered') {
          return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesItem = order.items.some((it) =>
          it.product_name.toLowerCase().includes(q)
        );
        return matchesId || matchesItem;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AccountHeader activeTab="orders" orderCount={orders.length} />

        {/* Section Header with Actions & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
              Orders & Shipments ({orders.length})
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Live tracking, complete purchase history, and tax invoices.
            </p>
          </div>

          <Link
            href="/shop"
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-2xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>Order Fresh Pickles</span>
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'active'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              In Transit / Active ({orders.filter((o) => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled').length})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === 'delivered'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Delivered ({orders.filter((o) => o.order_status === 'Delivered').length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or pickle name..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 shadow-xs">
            <div className="w-10 h-10 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-semibold text-stone-500">Retrieving your order records...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-stone-200/80 shadow-xs max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No matching orders found'
                : 'No pickle orders placed yet'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filter to view your purchase history.'
                : 'Experience the authentic aroma and taste of handcrafted Andhra pickles made in pure groundnut oil.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-all"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Artisan Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
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
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition-all space-y-5"
                >
                  {/* Top Bar: Order ID, Date, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-black bg-stone-100 text-stone-900 px-3 py-1.5 rounded-xl border border-stone-200">
                        {order.id}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        Ordered on {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
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
                      <Link
                        href={`/orders/${order.id}`}
                        className="px-4 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Track & Invoice</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#faf7f2] border border-stone-200/60"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200/60">
                            <Image
                              src={item.image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="text-xs min-w-0 flex-1">
                            <p className="font-bold text-stone-900 truncate">
                              {item.product_name}
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5 font-medium">
                              Jar: {item.variant_weight} × {item.quantity}
                            </p>
                            <p className="font-black text-stone-900 mt-1">
                              ₹{item.total}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-200/60 text-xs text-stone-500">
                        Artisan pickle order processed ({order.shipping_address?.city || 'India'})
                      </div>
                    )}
                  </div>

                  {/* Bottom Summary Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-4 text-stone-500">
                      <span>
                        Payment: <strong className="text-stone-800">{order.payment_method}</strong> ({order.payment_status})
                      </span>
                      {order.shipping_address?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{order.shipping_address.city}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-xs text-stone-500">Total Bill:</span>
                      <span className="font-serif text-lg font-black text-[#166534]">
                        ₹{order.total_amount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
