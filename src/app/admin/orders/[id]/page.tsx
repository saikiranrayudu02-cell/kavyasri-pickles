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

import TaxInvoice from '@/components/order/TaxInvoice';

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Admin Controls & Status Manager (no-print) */}
      <div className="no-print bg-white/90 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition-colors"
              title="Back to Admin Orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 font-serif">Order #{order.id}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {order.order_status}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Customer: <strong className="text-stone-800">{order.customer_name}</strong> | Email: {order.customer_email}
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Stepper */}
        <div className="pt-3 border-t border-stone-100">
          <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block mb-2">
            Update Fulfillment Status
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleUpdateStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  order.order_status === status
                    ? 'bg-[#9e1b1e] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {status}
              </button>
            ))}

            {order.order_status !== 'Cancelled' && (
              <button
                onClick={handleCancelOrder}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 ml-auto transition-all"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REDESIGNED TAX INVOICE */}
      <TaxInvoice order={order} />
    </div>
  );
}
