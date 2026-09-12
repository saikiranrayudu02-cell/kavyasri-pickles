'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    setLoading(true);
    if (orderId && isSupabaseConfigured && supabase) {
      try {
        const { data: dbOrder, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .filter('id', 'eq', orderId)
          .maybeSingle();

        if (!orderErr && dbOrder) {
          const { data: dbItems } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', dbOrder.id);

          const mapped: Order = {
            ...dbOrder,
            items: (dbItems || []).map((it) => ({
              id: it.id,
              product_id: it.product_id || '',
              product_name: it.product_name,
              image: it.image || '/images/pickles/hero.jpg',
              variant_weight: it.variant_weight,
              price: Number(it.price),
              quantity: it.quantity,
              total: Number(it.total),
            })),
          };

          setOrder(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching order from Supabase:', err);
      }
    }

    if (orderId) {
      const found = DataStore.getOrderById(orderId);
      if (found) setOrder(found);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-stone-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center">
        <p className="text-stone-500">Order not found.</p>
        <Link href="/admin/orders" className="text-xs text-[#166534] font-bold mt-2 inline-block">
          Return to Orders
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    DataStore.updateOrderStatus(order.id, newStatus, `Status transitioned to ${newStatus}`);
    if (isSupabaseConfigured && supabase) {
      const updateData: Record<string, unknown> = { order_status: newStatus };
      if (newStatus === 'Delivered' && order.payment_method?.includes('Cash')) {
        updateData.payment_status = 'Paid';
      }
      await supabase.from('orders').update(updateData).eq('id', order.id);
    }
    await loadOrder();
    showToast(`Order status updated to ${newStatus}!`, 'success');
  };

  const handleCancelOrder = async () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      DataStore.updateOrderStatus(order.id, 'Cancelled', 'Cancelled by store administrator');
      if (isSupabaseConfigured && supabase) {
        await supabase.from('orders').update({ order_status: 'Cancelled' }).eq('id', order.id);
      }
      await loadOrder();
      showToast('Order cancelled.', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="no-print flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-white rounded-xl border border-stone-200 text-stone-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-900">Order #{order.id}</h1>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  order.order_status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.order_status === 'Cancelled'
                    ? 'bg-emerald-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.order_status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div id="printable-invoice" className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
        {/* Invoice Header (Company details & Logo) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-200 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-12 h-12 shrink-0">
                <Image src="/images/kavya_sri_logo_transparent.png" alt="Kavya Sri Pickles & Ghee" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl text-stone-900 tracking-tight leading-none">Kavya Sri</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9e1b1e]">Pickles &amp; Ghee</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 max-w-xs">
              Traditional Taste • Homemade Love
            </p>
            <p className="text-xs text-stone-500 mt-2">
              Plot 42, Heritage Kitchens, RTC Colony, Hyderabad, TS 500035
            </p>
            <p className="text-xs text-stone-500">
              FSSAI Lic: <strong>13624014000189</strong> | GST: <strong>36AAECK1294F1Z3</strong>
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-[#166534] bg-emerald-50 px-2.5 py-1 rounded-md">
              TAX INVOICE
            </span>
            <p className="text-stone-900 font-mono font-bold text-sm mt-2">Invoice #: {order.id}</p>
            <p className="text-stone-500">
              Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-stone-500">
              Payment Status: <strong className="text-emerald-700">{order.payment_status}</strong>
            </p>
          </div>
        </div>

        {/* Customer & Shipping Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-stone-700">
          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-100 space-y-1">
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 text-[#166534]">
              Billed & Shipped To:
            </h4>
            <p className="font-bold text-sm text-stone-900">{order.shipping_address.fullName}</p>
            <p>{order.shipping_address.addressLine1}</p>
            {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state} — <strong>{order.shipping_address.pincode}</strong>
            </p>
            <p className="pt-1 text-stone-500">Phone: {order.shipping_address.phone}</p>
            <p className="text-stone-500">Email: {order.customer_email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-100 space-y-1">
            <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 text-[#166534]">
              Payment & Logistics:
            </h4>
            <p>Payment Method: <strong className="text-stone-900">{order.payment_method}</strong></p>
            {order.razorpay_payment_id && (
              <p>Razorpay Transaction ID: <strong className="font-mono text-stone-900">{order.razorpay_payment_id}</strong></p>
            )}
            <p>Delivery Partner: <strong>BlueDart Express Courier</strong></p>
            <p>Dispatch Location: <strong>Kavyasri Kitchen, Hyderabad</strong></p>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-900 text-stone-900 font-bold uppercase tracking-wider">
                <th className="py-3">Pickle Variety</th>
                <th className="py-3">Weight</th>
                <th className="py-3 text-right">Price</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-semibold text-stone-900">{item.product_name}</td>
                  <td className="py-3 text-stone-600">{item.variant_weight}</td>
                  <td className="py-3 text-right font-medium">₹{item.price}</td>
                  <td className="py-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 text-right font-bold text-stone-900">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-72 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Standard Shipping</span>
              <span>{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (2.5%) + SGST (2.5%)</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t-2 border-stone-900">
              <span>Grand Total</span>
              <span className="text-[#166534]">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Disclaimer */}
        <div className="pt-8 border-t border-stone-200 text-center text-[10px] text-stone-400 space-y-1">
          <p>This is a computer-generated tax invoice and requires no physical signature.</p>
          <p>Thank you for supporting traditional Indian homemade food artisans! 🌶️</p>
        </div>
      </div>

      {/* Admin Workflow Stepper (no-print) */}
      <div className="no-print bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
          Update Order Fulfillment Status
        </h3>

        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleUpdateStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                order.order_status === status
                  ? 'bg-[#166534] text-white shadow'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {status}
            </button>
          ))}

          {order.order_status !== 'Cancelled' && (
            <button
              onClick={handleCancelOrder}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-emerald-50 hover:bg-emerald-100 ml-auto"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
