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
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Action Bar (no-print) */}
      <div className="no-print flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2.5 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/70 text-stone-600 hover:text-black active:scale-90 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-stone-950">Order #{order.id}</h1>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border backdrop-blur-md shadow-2xs ${
                  order.order_status === 'Delivered'
                    ? 'bg-emerald-500/15 text-emerald-900 border-emerald-500/20'
                    : order.order_status === 'Cancelled'
                    ? 'bg-rose-500/15 text-rose-900 border-rose-500/20'
                    : 'bg-amber-500/15 text-amber-900 border-amber-500/20'
                }`}
              >
                {order.order_status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Placed on {new Date(order.created_at).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4.5 py-2.5 bg-linear-to-r from-stone-900 to-stone-800 hover:from-black hover:to-stone-900 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container (Apple Glass) */}
      <div id="printable-invoice" className="bg-linear-to-br from-white/95 via-white/90 to-white/80 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-6 sm:p-10 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
        {/* Invoice Header (Company details & Logo) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-200/60 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-stone-300 shadow-xs">
                <Image src="/images/logo.png" alt="Kavyasri Pickles" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-stone-900 text-lg leading-tight">
                  Kavyasri <span className="text-[#166534]">Pickles</span>
                </span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Traditional • Homemade
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2 font-medium">
              Plot 42, Heritage Kitchens, RTC Colony, Hyderabad, TS 500035
            </p>
            <p className="text-xs text-stone-500">
              FSSAI Lic: <strong>13624014000189</strong> | GST: <strong>36AAECK1294F1Z3</strong>
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#166534] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl shadow-2xs">
              TAX INVOICE
            </span>
            <p className="text-stone-950 font-mono font-extrabold text-sm mt-3">Invoice #: {order.id}</p>
            <p className="text-stone-500 font-medium">
              Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-stone-500 font-medium">
              Payment Status: <strong className="text-[#166534]">{order.payment_status}</strong>
            </p>
          </div>
        </div>

        {/* Customer & Shipping Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-stone-700">
          <div className="p-5 rounded-3xl bg-stone-50/70 border border-stone-200/60 space-y-1.5 shadow-2xs">
            <h4 className="font-extrabold uppercase tracking-widest text-[11px] mb-2 text-[#166534]">
              Billed & Shipped To:
            </h4>
            <p className="font-extrabold text-sm text-stone-950">{order.shipping_address.fullName}</p>
            <p className="font-medium text-stone-800">{order.shipping_address.addressLine1}</p>
            {order.shipping_address.addressLine2 && <p className="font-medium text-stone-800">{order.shipping_address.addressLine2}</p>}
            <p className="font-medium text-stone-800">
              {order.shipping_address.city}, {order.shipping_address.state} — <strong className="text-stone-950">{order.shipping_address.pincode}</strong>
            </p>
            <p className="pt-1 text-stone-500 font-medium">Phone: <strong className="text-stone-800">{order.shipping_address.phone}</strong></p>
            <p className="text-stone-500 font-medium">Email: <strong className="text-stone-800">{order.customer_email}</strong></p>
          </div>

          <div className="p-5 rounded-3xl bg-stone-50/70 border border-stone-200/60 space-y-1.5 shadow-2xs">
            <h4 className="font-extrabold uppercase tracking-widest text-[11px] mb-2 text-[#166534]">
              Payment & Logistics:
            </h4>
            <p className="font-medium text-stone-800">Payment Method: <strong className="text-stone-950">{order.payment_method}</strong></p>
            {order.razorpay_payment_id && (
              <p className="font-medium text-stone-800">Razorpay Transaction ID: <strong className="font-mono text-stone-950">{order.razorpay_payment_id}</strong></p>
            )}
            <p className="font-medium text-stone-800">Delivery Partner: <strong className="text-stone-950">BlueDart Express Courier</strong></p>
            <p className="font-medium text-stone-800">Dispatch Location: <strong className="text-stone-950">Kavyasri Kitchen, Hyderabad</strong></p>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-950 text-stone-950 font-extrabold uppercase tracking-widest text-[11px]">
                <th className="py-3.5">Pickle Variety</th>
                <th className="py-3.5">Weight</th>
                <th className="py-3.5 text-right">Price</th>
                <th className="py-3.5 text-center">Qty</th>
                <th className="py-3.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/60">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 font-bold text-stone-900">{item.product_name}</td>
                  <td className="py-3.5 text-stone-600 font-medium">{item.variant_weight}</td>
                  <td className="py-3.5 text-right font-medium">₹{item.price}</td>
                  <td className="py-3.5 text-center font-extrabold">{item.quantity}</td>
                  <td className="py-3.5 text-right font-extrabold text-stone-950">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="flex justify-end pt-4">
          <div className="w-full sm:w-72 space-y-2 text-xs text-stone-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-950">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#166534] font-extrabold">
                <span>Coupon Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Standard Shipping</span>
              <span className="font-bold text-stone-950">{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {typeof order.gst_percentage === 'number' && order.gst_percentage > 0
                  ? `CGST (${(order.gst_percentage / 2).toFixed(1).replace(/\.0$/, '')}%) + SGST (${(order.gst_percentage / 2).toFixed(1).replace(/\.0$/, '')}%)`
                  : order.tax > 0
                  ? 'CGST + SGST Tax'
                  : 'GST Tax (Exempt)'}
              </span>
              <span className="font-bold text-stone-950">₹{order.tax}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-950 pt-2.5 border-t-2 border-stone-950">
              <span>Grand Total</span>
              <span className="text-[#166534]">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Disclaimer */}
        <div className="pt-8 border-t border-stone-200/60 text-center text-[10px] text-stone-400 space-y-1 font-medium">
          <p>This is a computer-generated tax invoice and requires no physical signature.</p>
          <p>Thank you for supporting traditional Indian homemade food artisans! 🌶️</p>
        </div>
      </div>

      {/* Admin Workflow Stepper (no-print) */}
      <div className="no-print bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <h3 className="font-extrabold text-base text-stone-950 border-b border-stone-200/50 pb-3 tracking-[-0.02em]">
          Update Order Fulfillment Status
        </h3>

        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleUpdateStatus(status)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all active:scale-95 ${
                order.order_status === status
                  ? 'bg-linear-to-r from-[#166534] to-[#15803d] text-white shadow-md shadow-emerald-900/20'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              {status}
            </button>
          ))}

          {order.order_status !== 'Cancelled' && (
            <button
              onClick={handleCancelOrder}
              className="px-3.5 py-2 rounded-2xl text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 ml-auto active:scale-95 transition-all"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
