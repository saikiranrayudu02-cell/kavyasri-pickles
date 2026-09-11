'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
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
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    applyCoupon(couponCode);
    setIsApplying(false);
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#faf7f2]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#166534]" />
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Your Pickle Jar Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#fffbeb] border-b border-amber-200/70 px-4 py-2.5 text-xs text-amber-900">
            {freeShippingRemaining > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-700" />
                    Add <strong className="text-[#166534]">₹{freeShippingRemaining}</strong> more for{' '}
                    <strong className="text-emerald-700">FREE Delivery</strong>
                  </span>
                  <span>₹{subtotal} / ₹499</span>
                </div>
                <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-500 to-[#166534] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hooray! You&apos;ve unlocked FREE Standard Delivery! 🚚</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-stone-500 max-w-xs mb-6">
                  Add some delicious, traditional homemade pickles crafted with authentic love.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 bg-[#166534] text-white rounded-xl font-semibold text-sm hover:bg-[#14532d] transition-colors"
                >
                  Explore Pickles
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5 group">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-serif font-semibold text-sm text-stone-900 hover:text-[#166534] transition-colors line-clamp-1"
                        >
                          {item.product_name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                          {item.weight}
                        </span>
                        <span className="text-xs font-semibold text-stone-900">₹{item.price}</span>
                        {item.mrp > item.price && (
                          <span className="text-[11px] text-stone-400 line-through">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.max_stock}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-stone-900">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-[#faf7f2] space-y-3.5">
              {/* Coupon Code Field */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                      <span className="text-emerald-700 ml-1">applied (-₹{discount})</span>
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
                    placeholder="Enter Coupon (e.g. KAVYA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponCode.trim()}
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
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
                  <span>Estimated GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 px-4 bg-[#166534] hover:bg-[#14532d] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4"
                >
                  Or continue shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
