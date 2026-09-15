'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Eye,
  RefreshCw,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  MessageCircle,
  Filter,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

type TimeFilter = 'all' | 'today' | 'yesterday' | 'weekly' | 'monthly';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error fetching admin orders API:', err);
    }

    setOrders(DataStore.getOrders());
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    DataStore.updateOrderStatus(orderId, status, `Admin updated status to ${status}`);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ order_status: status }).eq('id', orderId);
    }
    await loadOrders();
    showToast(`Order #${orderId} marked as ${status}!`, 'success');
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getCustomerInfo = (order: Order) => {
    const addr =
      typeof order.shipping_address === 'string'
        ? (function () {
            try {
              return JSON.parse(order.shipping_address as unknown as string);
            } catch {
              return {};
            }
          })()
        : order.shipping_address || {};

    const name = order.customer_name || addr.fullName || 'Valued Customer';
    const phone = order.customer_phone || addr.phone || 'N/A';
    const email = order.customer_email || 'N/A';

    const addressLine1 = addr.addressLine1 || '';
    const addressLine2 = addr.addressLine2 || '';
    const city = addr.city || '';
    const state = addr.state || '';
    const pincode = addr.pincode || '';

    const fullAddressFormatted = [
      addressLine1,
      addressLine2,
      city && state ? `${city}, ${state}` : city || state,
      pincode ? `PIN: ${pincode}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    return {
      name,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      fullAddressFormatted: fullAddressFormatted || 'No shipping address provided',
    };
  };

  const handleCopyShippingLabel = (order: Order) => {
    const info = getCustomerInfo(order);
    const textToCopy = `📦 SHIP TO ADDRESS — ORDER #${order.id}
Recipient Name: ${info.name}
Phone Number: ${info.phone}
Email Address: ${info.email}

Address Line 1: ${info.addressLine1}
Address Line 2: ${info.addressLine2 || 'N/A'}
City/State: ${info.city}, ${info.state}
PIN Code: ${info.pincode}

Payment Mode: ${order.payment_method} (${order.payment_status})
Total Amount: ₹${order.total_amount}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 3000);
    showToast(`Shipping label copied for #${order.id}`, 'success');
  };

  // Filtered List
  const filtered = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orders.filter((o) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;

      // 2. Payment Filter
      if (paymentFilter === 'paid' && o.payment_status !== 'Paid') return false;
      if (paymentFilter === 'pending' && o.payment_status === 'Paid') return false;
      if (paymentFilter === 'cod' && !o.payment_method?.toLowerCase().includes('cash')) return false;

      // 3. Time Filter
      if (timeFilter !== 'all') {
        const oDate = new Date(o.created_at);
        if (timeFilter === 'today' && oDate < startOfToday) return false;

        if (timeFilter === 'yesterday') {
          const startOfYesterday = new Date(startOfToday);
          startOfYesterday.setDate(startOfYesterday.getDate() - 1);
          if (oDate < startOfYesterday || oDate >= startOfToday) return false;
        }

        if (timeFilter === 'weekly') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          if (oDate < sevenDaysAgo) return false;
        }

        if (timeFilter === 'monthly') {
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (oDate < thirtyDaysAgo) return false;
        }
      }

      // 4. Search Filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const info = getCustomerInfo(o);
        const itemsMatch = o.items.some(
          (it) =>
            it.product_name.toLowerCase().includes(q) ||
            it.variant_weight.toLowerCase().includes(q)
        );

        return (
          o.id.toLowerCase().includes(q) ||
          info.name.toLowerCase().includes(q) ||
          info.email.toLowerCase().includes(q) ||
          info.phone.toLowerCase().includes(q) ||
          info.city.toLowerCase().includes(q) ||
          info.pincode.toLowerCase().includes(q) ||
          itemsMatch
        );
      }

      return true;
    });
  }, [orders, statusFilter, paymentFilter, timeFilter, search]);

  // Derived Stats for Filtered Set
  const filteredStats = useMemo(() => {
    const totalRev = filtered
      .filter((o) => o.order_status !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const pending = filtered.filter(
      (o) => o.order_status === 'Pending' || o.order_status === 'Processing' || o.order_status === 'Confirmed'
    ).length;

    const delivered = filtered.filter((o) => o.order_status === 'Delivered').length;

    return { totalRev, pending, delivered };
  }, [filtered]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar (Apple Glass Hero) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-7 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-[-0.03em] text-stone-950 flex items-center gap-2.5">
            <span>Customer Orders Directory</span>
            <span className="text-xs bg-emerald-500/15 text-[#166534] border border-emerald-500/20 px-3 py-1 rounded-full font-sans font-extrabold backdrop-blur-md shadow-2xs">
              {filtered.length} Orders
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Search, filter by date/status, view shipping addresses, and manage dispatch workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-stone-100/90 p-1 rounded-2xl flex items-center gap-1 border border-stone-200/80 backdrop-blur-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Rich Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
                viewMode === 'table'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={loadOrders}
            className="p-2.5 bg-stone-100/80 hover:bg-stone-200/80 border border-stone-200/60 rounded-2xl text-stone-600 hover:text-black flex items-center gap-1.5 text-xs font-bold shadow-2xs active:scale-95 transition-all backdrop-blur-md"
            title="Refresh Live Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip for Current Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-xl p-4.5 rounded-3xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Filtered Revenue</span>
          <p className="text-xl font-extrabold text-stone-950 mt-1 tracking-tight">₹{filteredStats.totalRev.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-xl p-4.5 rounded-3xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Filtered Orders</span>
          <p className="text-xl font-extrabold text-stone-950 mt-1 tracking-tight">{filtered.length}</p>
        </div>

        <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-xl p-4.5 rounded-3xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Awaiting Fulfillment</span>
          <p className="text-xl font-extrabold text-amber-800 mt-1 tracking-tight">{filteredStats.pending}</p>
        </div>

        <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-xl p-4.5 rounded-3xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Completed / Delivered</span>
          <p className="text-xl font-extrabold text-[#166534] mt-1 tracking-tight">{filteredStats.delivered}</p>
        </div>
      </div>

      {/* Advanced Multi-Filter Bar */}
      <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-4 sm:p-5 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, Mobile Phone, Email, City, Pincode, or Pickle item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-stone-300/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Time Range Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Time:</span>
            </span>
            {(['all', 'today', 'yesterday', 'weekly', 'monthly'] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 ${
                  timeFilter === tf
                    ? 'bg-linear-to-r from-[#166534] to-[#15803d] text-white shadow-md shadow-emerald-900/20 font-extrabold'
                    : 'bg-stone-100/80 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {tf === 'weekly' ? 'This Week' : tf === 'monthly' ? 'This Month' : tf}
              </button>
            ))}
          </div>

          {/* Status & Payment Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/90 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 focus:outline-none shadow-2xs"
              >
                <option value="all">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Dropdown */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-white/90 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 focus:outline-none shadow-2xs"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid Online</option>
              <option value="pending">Payment Pending</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-16 text-center text-xs text-stone-500 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-xs font-bold">
          Fetching customer order records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 space-y-2 shadow-xs">
          <p className="text-stone-700 font-bold text-sm">No orders match your filter criteria.</p>
          <p className="text-xs text-stone-400 font-medium">Try changing the time range, status, or search terms.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= CARDS VIEW (Apple Glass) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((order) => {
            const info = getCustomerInfo(order);
            const isCopied = copiedOrderId === order.id;
            const cleanPhone = info.phone !== 'N/A' ? info.phone.replace(/\D/g, '') : '';

            return (
              <div
                key={order.id}
                className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top Header */}
                <div className="p-4 sm:p-5 bg-stone-100/40 border-b border-stone-200/50 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-extrabold text-base text-[#166534] hover:underline"
                      >
                        #{order.id}
                      </Link>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border backdrop-blur-xs ${
                          order.payment_status === 'Paid'
                            ? 'bg-emerald-500/15 text-emerald-900 border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-900 border-amber-500/20'
                        }`}
                      >
                        {order.payment_status} • {order.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border transition-colors focus:outline-none cursor-pointer backdrop-blur-md shadow-2xs ${
                      order.order_status === 'Delivered'
                        ? 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30'
                        : order.order_status === 'Shipped'
                        ? 'bg-blue-500/15 text-blue-900 border-blue-500/30'
                        : order.order_status === 'Cancelled'
                        ? 'bg-rose-500/15 text-rose-900 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-900 border-amber-500/30'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  {/* Customer Info Box */}
                  <div className="bg-white/80 rounded-2xl p-4 border border-stone-200/70 space-y-3 text-xs shadow-2xs">
                    <div className="flex items-center justify-between border-b border-stone-200/50 pb-2">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <User className="w-4 h-4 text-[#166534]" />
                        <span className="text-sm font-extrabold">{info.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=Hello%20${encodeURIComponent(info.name)},%20regarding%20your%20Kavyasri%20Pickles%20order%20%23${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                            title="Message customer on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleCopyShippingLabel(order)}
                          className="inline-flex items-center gap-1 text-[10px] font-extrabold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200 hover:bg-stone-200 transition-all active:scale-95"
                          title="Copy full shipping address label"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Label'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                      {/* Mobile Phone */}
                      <div className="flex items-center gap-2 bg-stone-50/80 px-3 py-1.5 rounded-xl border border-stone-200/60">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-stone-400 uppercase font-semibold">Mobile</p>
                          {info.phone !== 'N/A' ? (
                            <a
                              href={`tel:${info.phone}`}
                              className="font-bold text-stone-900 hover:text-[#166534] underline decoration-dotted truncate block"
                            >
                              {info.phone}
                            </a>
                          ) : (
                            <span className="text-stone-400">N/A</span>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2 bg-stone-50/80 px-3 py-1.5 rounded-xl border border-stone-200/60">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-stone-400 uppercase font-semibold">Email ID</p>
                          {info.email !== 'N/A' ? (
                            <a
                              href={`mailto:${info.email}`}
                              className="font-semibold text-stone-800 hover:text-[#166534] truncate block"
                              title={info.email}
                            >
                              {info.email}
                            </a>
                          ) : (
                            <span className="text-stone-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-stone-50/80 p-3 rounded-xl border border-stone-200/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                        <span>Shipping Address</span>
                      </div>
                      <p className="text-stone-800 font-medium leading-relaxed pl-5">
                        {info.addressLine1}
                        {info.addressLine2 ? `, ${info.addressLine2}` : ''}
                        <br />
                        <strong className="text-stone-950">
                          {info.city}, {info.state} — {info.pincode}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Items Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-stone-900 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#166534]" />
                        <span>Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)} Jars)</span>
                      </span>
                      <span className="text-stone-400 text-[11px] font-semibold">{order.items.length} item(s)</span>
                    </div>

                    <div className="bg-white/80 rounded-2xl p-3 border border-stone-200/70 max-h-44 overflow-y-auto space-y-2 shadow-2xs">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 text-xs bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/50">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-2xs">
                              <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-stone-900 truncate">{item.product_name}</p>
                              <p className="text-[10px] text-stone-500">
                                {item.variant_weight} • Qty: <strong>{item.quantity}</strong>
                              </p>
                            </div>
                          </div>
                          <span className="font-extrabold text-stone-950 text-xs shrink-0">₹{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Bar */}
                <div className="p-4 sm:p-5 bg-stone-100/40 border-t border-stone-200/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Grand Total</span>
                    <p className="font-extrabold text-xl text-[#166534]">₹{order.total_amount}</p>
                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="px-4 py-2.5 bg-linear-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Invoice & Details</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE VIEW (Apple macOS Finder Style) ================= */
        <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/60 text-stone-500 font-extrabold border-b border-stone-200/60">
                <tr>
                  <th className="p-4 w-10"></th>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Delivery City & PIN</th>
                  <th className="p-4">Ordered Jars</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/40">
                {filtered.map((order) => {
                  const info = getCustomerInfo(order);
                  const isExpanded = !!expandedOrders[order.id];

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-emerald-500/5 transition-colors">
                        <td className="p-4">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="p-1 rounded-lg hover:bg-stone-200/70 text-stone-500 transition-all active:scale-90"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>

                        <td className="p-4 font-mono font-bold text-stone-900">
                          <Link href={`/admin/orders/${order.id}`} className="text-[#166534] font-extrabold hover:underline">
                            #{order.id}
                          </Link>
                          <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-extrabold text-stone-950">{info.name}</p>
                          <p className="text-[11px] text-stone-600 font-semibold">{info.phone}</p>
                          <p className="text-[10px] text-stone-400 truncate max-w-44">{info.email}</p>
                        </td>

                        <td className="p-4 text-stone-700 font-medium">
                          <p className="font-bold text-stone-900">{info.city || 'N/A'}</p>
                          <p className="text-[10px] text-stone-400">{info.state} {info.pincode}</p>
                        </td>

                        <td className="p-4 text-stone-600">
                          <span className="font-bold text-stone-900">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} jar(s)
                          </span>
                        </td>

                        <td className="p-4 font-extrabold text-stone-950 text-sm">
                          ₹{order.total_amount}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl border transition-colors focus:outline-none backdrop-blur-md shadow-2xs ${
                              order.order_status === 'Delivered'
                                ? 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30'
                                : order.order_status === 'Shipped'
                                ? 'bg-blue-500/15 text-blue-900 border-blue-500/30'
                                : order.order_status === 'Cancelled'
                                ? 'bg-rose-500/15 text-rose-900 border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-900 border-amber-500/30'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-950 hover:text-white rounded-xl font-extrabold text-[11px] transition-all active:scale-95 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>

                      {/* Expanded Sub-Row */}
                      {isExpanded && (
                        <tr className="bg-stone-50/60 backdrop-blur-xs">
                          <td colSpan={8} className="p-4 border-b border-stone-200/60">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Customer Contacts */}
                              <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/70 space-y-1.5 shadow-2xs">
                                <h4 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5 border-b pb-1.5">
                                  <User className="w-3.5 h-3.5 text-[#166534]" />
                                  <span>Customer Contact</span>
                                </h4>
                                <p className="font-bold text-stone-900">{info.name}</p>
                                <p className="text-stone-600 font-semibold">Phone: <a href={`tel:${info.phone}`} className="underline text-[#166534]">{info.phone}</a></p>
                                <p className="text-stone-600">Email: <a href={`mailto:${info.email}`} className="underline">{info.email}</a></p>
                              </div>

                              {/* Shipping Address */}
                              <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/70 space-y-1.5 shadow-2xs">
                                <div className="flex items-center justify-between border-b pb-1.5">
                                  <h4 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                                    <span>Shipping Delivery Address</span>
                                  </h4>
                                  <button
                                    onClick={() => handleCopyShippingLabel(order)}
                                    className="text-[10px] font-extrabold text-[#166534] underline"
                                  >
                                    Copy Label
                                  </button>
                                </div>
                                <p className="text-stone-800 font-medium">{info.addressLine1}</p>
                                {info.addressLine2 && <p className="text-stone-700">{info.addressLine2}</p>}
                                <p className="font-extrabold text-stone-950">{info.city}, {info.state} — {info.pincode}</p>
                              </div>

                              {/* Item Breakdown */}
                              <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/70 space-y-1.5 shadow-2xs">
                                <h4 className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5 border-b pb-1.5">
                                  <Package className="w-3.5 h-3.5 text-[#166534]" />
                                  <span>Items Breakdown</span>
                                </h4>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                  {order.items.map((it) => (
                                    <div key={it.id} className="flex justify-between items-center text-[11px]">
                                      <span className="font-medium text-stone-800">{it.product_name} ({it.variant_weight}) x{it.quantity}</span>
                                      <span className="font-extrabold text-stone-950">₹{it.total}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
