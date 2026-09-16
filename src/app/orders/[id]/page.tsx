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

import TaxInvoice from '@/components/order/TaxInvoice';

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

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <div className="no-print">
        <SubpageHeader />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Header Confirmation Banner (no-print) */}
        <div className="no-print bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed & Payment Verified
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            Order Placed Successfully!
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Thank you for ordering with Kavyasri Pickles! We are preparing your fresh artisanal batch with traditional homemade love.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-stone-600 mt-4 pt-4 border-t border-stone-100">
            <span className="bg-stone-100 px-3 py-1 rounded-lg font-mono text-stone-900 font-bold">
              Order ID: {order.id}
            </span>
            <span>•</span>
            <span>Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span>•</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
              Payment: {order.payment_status} ({order.payment_method})
            </span>
          </div>
        </div>

        {/* Real-time Order Tracking Timeline (no-print) */}
        <div className="no-print bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <h3 className="font-serif font-bold text-base text-stone-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#166534]" />
            <span>Live Order Journey</span>
          </h3>

          <div className="relative">
            <div className="hidden sm:grid grid-cols-7 gap-2 text-center relative z-10">
              {PIPELINE_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
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
                      className={`text-[10px] font-bold mt-2 ${
                        isCurrent ? 'text-[#166534]' : isDone ? 'text-stone-800' : 'text-stone-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-stone-200 z-0">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (PIPELINE_STEPS.length - 1)) * 100)}%`,
                }}
              />
            </div>

            <div className="sm:hidden space-y-3">
              {order.timeline?.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
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

        {/* REDESIGNED TAX INVOICE */}
        <TaxInvoice order={order} />
      </main>
    </div>
  );
}
