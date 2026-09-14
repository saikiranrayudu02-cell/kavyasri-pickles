'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DataStore } from '@/lib/data/store';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    freeShippingRemaining,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      showToast('Please sign in to proceed to checkout!', 'info');
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mb-2">
          Your Pickle Cart
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mb-8">
          Review your selected artisanal jars before proceeding to checkout.
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-50 text-[#9e1b1e] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h2 className="font-serif font-bold text-xl text-stone-900 mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Explore our traditional Avakaya Mango, spicy Andhra Gongura, or boneless chicken pickles.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#9e1b1e] text-white rounded-xl text-xs font-bold hover:bg-[#7f1d1d]"
            >
              <span>Explore Pickles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs">
                {freeShippingRemaining > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-amber-900 font-medium">
                      <Truck className="w-4 h-4 text-[#9e1b1e]" />
                      Add ₹{freeShippingRemaining} more to unlock <strong>FREE Express Delivery</strong>!
                    </span>
                    <Link href="/shop" className="text-[#9e1b1e] font-bold hover:underline">
                      Add More
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You have unlocked FREE Standard Shipping across India!</span>
                  </div>
                )}
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs">
                <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif font-bold text-base text-stone-900 hover:text-[#9e1b1e] transition-colors"
                        >
                          {item.product_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                          <span className="bg-stone-100 px-2 py-0.5 rounded font-semibold text-stone-700">
                            {item.weight}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-stone-900">₹{item.price} each</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 px-2.5 text-stone-600 hover:bg-stone-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.max_stock}
                          className="p-1.5 px-2.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-stone-900 text-base">
                          ₹{item.price * item.quantity}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-600 text-xs mt-1 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-4"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-red-600 transition-colors"
                >
                  Clear entire cart
                </button>
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-5">
                <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
                  Order Summary
                </h3>

                {/* Coupon Box */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                        <span className="text-emerald-700 ml-1">(-₹{discount})</span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-500 hover:text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Line Items */}
                <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-stone-900">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <strong className="text-emerald-600 font-bold">FREE</strong>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST ({DataStore.getStoreSettings().gst_enabled ?? true ? `${DataStore.getStoreSettings().gst_percentage ?? 5}%` : 'Tax Exempt'})</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-stone-900 pt-3 border-t border-stone-200">
                    <span>Grand Total</span>
                    <span className="text-[#9e1b1e]">₹{total}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white font-bold rounded-2xl shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 text-sm transition-all transform active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Insured Packaging • Razorpay Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
