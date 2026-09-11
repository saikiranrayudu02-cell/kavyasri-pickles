'use client';

import React, { useState, useEffect } from 'react';
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
  Printer,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  MessageCircle,
  Truck,
  CreditCard,
  Filter,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbOrders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbOrders) {
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
        console.error('Error fetching Supabase admin orders:', err);
      }
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
    showToast(`Shipping details copied for #${order.id}`, 'success');
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;
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

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
            <span>Customer Orders & Shipping Directory</span>
            <span className="text-sm bg-emerald-100 text-[#166534] px-2.5 py-0.5 rounded-full font-sans font-bold">
              {orders.length} Total
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            View full customer contact details, delivery addresses, ordered pickle jars, and dispatch statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-stone-200 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
              title="Rich Cards View (Detailed)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-black'
              }`}
              title="Compact Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table View</span>
            </button>
          </div>

          <button
            onClick={loadOrders}
            className="p-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-black hover:border-stone-300 flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            title="Refresh Live Orders"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone, Email, City, PIN, or Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500 font-semibold">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
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
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-16 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          Loading order database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
          <p className="text-stone-600 font-bold text-sm">No matching orders found.</p>
          <p className="text-xs text-stone-400">Try adjusting your search keywords or filter status.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= CARDS VIEW (RICH DETAILS FOR EACH ORDER) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((order) => {
            const info = getCustomerInfo(order);
            const isCopied = copiedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-extrabold text-base text-[#166534] hover:underline"
                      >
                        #{order.id}
                      </Link>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          order.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {order.payment_status} • {order.payment_method}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
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
                  <div className="flex items-center gap-2">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors focus:outline-none cursor-pointer ${
                        order.order_status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : order.order_status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : order.order_status === 'Cancelled'
                          ? 'bg-emerald-100 text-red-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
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
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  {/* Customer Information Card */}
                  <div className="bg-[#faf7f2] rounded-2xl p-4 border border-stone-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <User className="w-4 h-4 text-[#166534]" />
                        <span className="text-sm">{info.name}</span>
                      </div>

                      <button
                        onClick={() => handleCopyShippingLabel(order)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#166534] bg-white px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-emerald-50 transition-colors"
                        title="Copy full shipping details for courier paste"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied!' : 'Copy Label'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                      {/* Mobile Number */}
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200/70">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-stone-400 uppercase font-semibold">Mobile Number</p>
                          {info.phone !== 'N/A' ? (
                            <a
                              href={`tel:${info.phone}`}
                              className="font-bold text-stone-900 hover:text-[#166534] underline decoration-dotted truncate block"
                            >
                              {info.phone}
                            </a>
                          ) : (
                            <span className="text-stone-400 font-medium">N/A</span>
                          )}
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200/70">
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
                    <div className="bg-white p-3 rounded-xl border border-stone-200/70 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                        <span>Shipping Delivery Address</span>
                      </div>
                      <p className="text-stone-800 font-medium leading-relaxed pl-5">
                        {info.addressLine1}
                        {info.addressLine2 ? `, ${info.addressLine2}` : ''}
                        <br />
                        <strong className="text-stone-900">
                          {info.city}, {info.state} — {info.pincode}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* "Who Ordered What" Items List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#166534]" />
                        <span>Ordered Pickle Jars ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
                      </span>
                      <span className="text-stone-400 text-[11px] font-semibold">{order.items.length} product(s)</span>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 max-h-48 overflow-y-auto">
                      {order.items.map((item, index) => (
                        <div key={item.id} className={`flex items-center gap-3 ${index !== order.items.length - 1 ? 'border-b border-stone-200/60 pb-3 mb-3' : ''}`}>
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                            <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1 text-xs">
                            <p className="font-bold text-stone-900 truncate">{item.product_name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500">
                              <span className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-semibold">
                                {item.variant_weight}
                              </span>
                              <span>Qty: <strong>{item.quantity}</strong></span>
                              <span>•</span>
                              <span>₹{item.price} each</span>
                            </div>
                          </div>
                          <div className="text-right text-xs font-bold text-stone-900">
                            ₹{item.total}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 sm:p-5 bg-stone-50/70 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Grand Total</span>
                    <p className="font-extrabold text-lg text-[#166534]">₹{order.total_amount}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details & Invoice</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE VIEW WITH EXPANDABLE ROWS ================= */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-4 w-10"></th>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Contact</th>
                  <th className="p-4">Delivery City & PIN</th>
                  <th className="p-4">Ordered Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((order) => {
                  const info = getCustomerInfo(order);
                  const isExpanded = !!expandedOrders[order.id];

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
                            title="Toggle Full Customer & Address Details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>

                        <td className="p-4 font-mono font-bold text-stone-900">
                          <Link href={`/admin/orders/${order.id}`} className="text-[#166534] hover:underline">
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
                          <p className="font-bold text-stone-900">{info.name}</p>
                          <p className="text-[11px] text-stone-600 font-semibold">{info.phone}</p>
                          <p className="text-[10px] text-stone-400 truncate max-w-44">{info.email}</p>
                        </td>

                        <td className="p-4 text-stone-700 font-medium">
                          <p className="font-bold text-stone-900">{info.city || 'N/A'}</p>
                          <p className="text-[10px] text-stone-400">{info.state} {info.pincode}</p>
                        </td>

                        <td className="p-4 text-stone-600">
                          <span className="font-semibold text-stone-900">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} jar(s)
                          </span>
                          <p className="text-[10px] text-stone-400 truncate max-w-48">
                            {order.items.map((i) => `${i.product_name} (${i.variant_weight})`).join(', ')}
                          </p>
                        </td>

                        <td className="p-4 font-extrabold text-stone-900">
                          ₹{order.total_amount}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-xl border transition-colors focus:outline-none ${
                              order.order_status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : order.order_status === 'Shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : order.order_status === 'Cancelled'
                                ? 'bg-emerald-50 text-red-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-xl font-bold text-[11px] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </td>
                      </tr>

                      {/* Expanded Sub-row with complete Customer & Order info */}
                      {isExpanded && (
                        <tr className="bg-[#faf7f2]/80">
                          <td colSpan={8} className="p-4 border-b border-stone-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Customer Contacts */}
                              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1.5">
                                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5 border-b pb-1">
                                  <User className="w-3.5 h-3.5 text-[#166534]" />
                                  <span>Customer Info</span>
                                </h4>
                                <p className="font-bold text-stone-900">{info.name}</p>
                                <p className="text-stone-600 font-semibold">Phone: <a href={`tel:${info.phone}`} className="underline text-[#166534]">{info.phone}</a></p>
                                <p className="text-stone-600">Email: <a href={`mailto:${info.email}`} className="underline">{info.email}</a></p>
                              </div>

                              {/* Full Delivery Address */}
                              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1.5">
                                <div className="flex items-center justify-between border-b pb-1">
                                  <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#166534]" />
                                    <span>Full Shipping Address</span>
                                  </h4>
                                  <button
                                    onClick={() => handleCopyShippingLabel(order)}
                                    className="text-[10px] font-bold text-[#166534] underline"
                                  >
                                    Copy Label
                                  </button>
                                </div>
                                <p className="text-stone-800 font-medium">{info.addressLine1}</p>
                                {info.addressLine2 && <p className="text-stone-700">{info.addressLine2}</p>}
                                <p className="font-bold text-stone-900">{info.city}, {info.state} — {info.pincode}</p>
                              </div>

                              {/* Who ordered what */}
                              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1.5">
                                <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5 border-b pb-1">
                                  <Package className="w-3.5 h-3.5 text-[#166534]" />
                                  <span>Ordered Items Breakdown</span>
                                </h4>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {order.items.map((it) => (
                                    <div key={it.id} className="flex justify-between items-center text-[11px]">
                                      <span className="font-medium text-stone-800">{it.product_name} ({it.variant_weight}) x{it.quantity}</span>
                                      <span className="font-bold text-stone-900">₹{it.total}</span>
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
