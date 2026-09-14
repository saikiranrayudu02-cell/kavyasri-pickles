'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import { DataStore } from '@/lib/data/store';
import { Order, OrderStatus } from '@/lib/types';

const PIPELINE_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveOrder = async () => {
      if (!orderId) {
        if (isMounted) setIsLoading(false);
        return;
      }

      // 1. Check local DataStore
      const foundLocal = DataStore.getOrderById(orderId);
      if (foundLocal) {
        if (isMounted) {
          setOrder(foundLocal);
          setIsLoading(false);
        }
        return;
      }

      // 2. Fetch from Server API route if not in local storage
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order && isMounted) {
            setOrder(data.order);
            DataStore.saveOrder(data.order);
          }
        }
      } catch (err) {
        console.error('Failed to fetch order from server:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    resolveOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2]">
        <SubpageHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-stone-700">Verifying order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2]">
        <SubpageHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">Order Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">We couldn&apos;t find an order matching #{orderId}.</p>
          <Link href="/shop" className="px-6 py-2.5 bg-[#166534] text-white rounded-xl text-xs font-bold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = PIPELINE_STEPS.indexOf(order.order_status);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <div className="no-print">
        <SubpageHeader />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Printable Order Container */}
        <div id="printable-invoice" className="space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed & Payment Verified
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3">
              Order Placed Successfully!
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto">
              Thank you for ordering with Kavyasri Pickles! We are preparing your fresh artisanal batch with traditional homemade love.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600 mt-6 pt-6 border-t border-stone-100">
              <span className="bg-stone-100 px-3 py-1.5 rounded-xl font-mono text-stone-900 font-bold">
                Order ID: {order.id}
              </span>
              <span>•</span>
              <span>Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                Payment: {order.payment_status} ({order.payment_method})
              </span>
            </div>

            {/* Quick Action buttons */}
            <div className="no-print flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <Link
                href="/shop"
                className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Real-time Order Tracking Timeline (Section 17) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#166534]" />
              <span>Live Order Journey</span>
            </h3>

            {/* Step Pipeline */}
            <div className="relative">
              <div className="hidden sm:grid grid-cols-7 gap-2 text-center relative z-10">
                {PIPELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? isCurrent
                              ? 'bg-[#166534] text-white ring-4 ring-emerald-100 scale-110 shadow'
                              : 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 ${
                          isCurrent ? 'text-[#166534]' : isDone ? 'text-stone-800' : 'text-stone-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Connecting line behind steps */}
              <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-stone-200 z-0">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / (PIPELINE_STEPS.length - 1)) * 100)}%`,
                  }}
                />
              </div>

              {/* Mobile Timeline View */}
              <div className="sm:hidden space-y-4">
                {order.timeline.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-stone-900">{entry.status}</span>
                      <p className="text-stone-500 text-[11px]">{entry.note}</p>
                      <span className="text-[10px] text-stone-400">{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Ordered Items Table (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
                Ordered Pickles ({order.items.length})
              </h3>

              <div className="divide-y divide-stone-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{item.product_name}</p>
                        <p className="text-stone-500">{item.variant_weight} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">₹{item.total}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({order.coupon_code || 'Promo'})</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    GST {typeof order.gst_percentage === 'number' ? `(${order.gst_percentage}%)` : order.tax > 0 ? '' : '(Tax Exempt)'}
                  </span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-[#166534]">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address & Payment (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3 text-xs text-stone-700">
                <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#166534]" />
                  <span>Delivery Address</span>
                </h3>
                <p className="font-bold text-stone-900">{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.addressLine1}</p>
                {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} —{' '}
                  <strong>{order.shipping_address.pincode}</strong>
                </p>
                <p className="pt-1 text-stone-500">Phone: {order.shipping_address.phone}</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3 text-xs text-stone-700">
                <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#166534]" />
                  <span>Payment Details</span>
                </h3>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <strong className="text-stone-900">{order.payment_method}</strong>
                </div>
                {order.razorpay_payment_id && (
                  <div className="flex justify-between">
                    <span>Razorpay ID:</span>
                    <span className="font-mono text-[11px] text-stone-500">{order.razorpay_payment_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Status:</span>
                  <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {order.payment_status}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
