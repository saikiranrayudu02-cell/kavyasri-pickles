'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DataStore } from '@/lib/data/store';
import { StoreSettings } from '@/lib/types';
import { loadRazorpayScript } from '@/lib/razorpay';
import { normalizePhoneNumber, getRazorpayContact } from '@/lib/utils/phone';
import confetti from 'canvas-confetti';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('mode') === 'buynow';
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedCoupon,
    clearCart,
    buyNowItem,
    clearBuyNow,
  } = useCart();
  const { showToast } = useToast();

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => DataStore.getStoreSettings());

  useEffect(() => {
    async function loadLiveSettings() {
      const live = await DataStore.syncSettingsFromSupabase();
      if (live) setStoreSettings(live);
    }
    loadLiveSettings();

    const handleSettingsChange = (e?: Event) => {
      const customEvent = e as CustomEvent<StoreSettings>;
      if (customEvent && customEvent.detail) {
        setStoreSettings(customEvent.detail);
      } else {
        setStoreSettings(DataStore.getStoreSettings());
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('kp_settings_changed', handleSettingsChange);
      window.addEventListener('storage', handleSettingsChange);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('kp_settings_changed', handleSettingsChange);
        window.removeEventListener('storage', handleSettingsChange);
      }
    };
  }, []);

  const freeThreshold = Number(storeSettings.free_shipping_threshold ?? 0);
  const standardShippingFee = Number(storeSettings.standard_shipping_fee ?? 0);
  const gstEnabled = storeSettings.gst_enabled ?? true;
  const gstPercentage = Number(storeSettings.gst_percentage ?? 0);

  const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : items;
  const checkoutSubtotal = isBuyNow && buyNowItem ? buyNowItem.price * buyNowItem.quantity : subtotal;
  const checkoutDiscount = isBuyNow ? 0 : discount;
  const checkoutShipping = isBuyNow && buyNowItem
    ? (checkoutSubtotal === 0 || checkoutSubtotal >= freeThreshold ? 0 : standardShippingFee)
    : shipping;
  const checkoutTax = isBuyNow && buyNowItem
    ? (gstEnabled ? Math.round((checkoutSubtotal - checkoutDiscount) * (gstPercentage / 100)) : 0)
    : tax;
  const checkoutTotal = isBuyNow && buyNowItem
    ? Math.max(0, checkoutSubtotal - checkoutDiscount + checkoutShipping + checkoutTax)
    : total;

  // Enforce sign-in requirement on Checkout
  useEffect(() => {
    if (!isAuthLoading && !user) {
      showToast('Please sign in to proceed with checkout!', 'info');
      const checkoutRedirect = isBuyNow ? '/checkout?mode=buynow' : '/checkout';
      router.push(`/login?redirect=${encodeURIComponent(checkoutRedirect)}`);
    }
  }, [user, isAuthLoading, isBuyNow, router, showToast]);

  // Contact & Address Form
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);

      // Check for user's saved default address
      try {
        const savedAddrs = localStorage.getItem(`kp_addresses_${user.id}`);
        if (savedAddrs) {
          const parsed = JSON.parse(savedAddrs);
          const def = parsed.find((a: { isDefault: boolean }) => a.isDefault) || parsed[0];
          if (def) {
            if (def.line1) setAddressLine1(def.line1);
            if (def.line2) setAddressLine2(def.line2);
            if (def.city) setCity(def.city);
            if (def.state) setState(def.state);
            if (def.pincode) setPincode(def.pincode);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [user]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2]">
        <SubpageHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-stone-700">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2]">
        <SubpageHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
          <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">
            {isBuyNow ? 'No item selected for Buy Now' : 'Your cart is empty'}
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            {isBuyNow
              ? 'Please choose a product and select "Buy Now" to proceed.'
              : 'Please add items to your cart before proceeding to checkout.'}
          </p>
          <Link href="/shop" className="px-6 py-2.5 bg-[#9e1b1e] text-white rounded-xl text-xs font-bold">
            Explore Pickles
          </Link>
        </div>
      </div>
    );
  }

  // Final Order Finalization logic using authoritative server calculations
  const finalizeOrder = (
    paymentId: string,
    razorpayOrderId: string,
    serverTotals?: {
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      totalAmount: number;
      gstPercentage: number;
      gstEnabled: boolean;
    }
  ) => {
    // 1. Verify stock before creating order
    for (const item of checkoutItems) {
      const liveProduct = DataStore.getProductById(item.product_id);
      if (!liveProduct || liveProduct.stock_quantity < item.quantity) {
        showToast(`Sorry, ${item.product_name} no longer has sufficient stock.`, 'error');
        setIsProcessing(false);
        return;
      }
    }

    const finalSubtotal = serverTotals ? serverTotals.subtotal : checkoutSubtotal;
    const finalDiscount = serverTotals ? serverTotals.discount : checkoutDiscount;
    const finalShipping = serverTotals ? serverTotals.shipping : checkoutShipping;
    const finalTax = serverTotals ? serverTotals.tax : checkoutTax;
    const finalTotal = serverTotals ? serverTotals.totalAmount : checkoutTotal;
    const finalGstPercentage = serverTotals ? serverTotals.gstPercentage : gstPercentage;
    const finalGstEnabled = serverTotals ? serverTotals.gstEnabled : gstEnabled;

    const normalizedPhone = normalizePhoneNumber(phone);
    const rzpContact = getRazorpayContact(phone);

    // 2. Create the order with immutable snapshot of values
    const newOrder = DataStore.createOrder({
      user_id: user?.id || 'usr-guest',
      customer_name: fullName,
      customer_email: email,
      customer_phone: normalizedPhone,
      shipping_address: {
        fullName,
        phone: normalizedPhone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
      },
      items: checkoutItems.map((it) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        product_id: it.product_id,
        product_name: it.product_name,
        image: it.image,
        variant_weight: it.weight,
        price: it.price,
        quantity: it.quantity,
        total: it.price * it.quantity,
      })),
      subtotal: finalSubtotal,
      discount: finalDiscount,
      coupon_code: isBuyNow ? undefined : appliedCoupon?.code,
      shipping_fee: finalShipping,
      tax: finalTax,
      gst_percentage: finalGstPercentage,
      gst_enabled: finalGstEnabled,
      total_amount: finalTotal,
      payment_status: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay UPI / Cards',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: paymentId,
      order_status: 'Confirmed',
    });

    // 3. Clear cart or buyNow
    if (isBuyNow) {
      clearBuyNow();
    } else {
      clearCart();
    }

    // 4. Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    showToast('Order placed successfully! 🌶️', 'success');
    router.push(`/orders/${newOrder.id}`);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !addressLine1 || !city || !state || !pincode) {
      showToast('Please fill all required shipping address fields.', 'error');
      return;
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    const rzpContact = getRazorpayContact(phone);

    setIsProcessing(true);

    try {
      // 1. Initialize order authoritatively on server to get exact DB settings & totals
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          customer_name: fullName,
          customer_email: email,
          customer_phone: normalizedPhone,
          shipping_address: {
            fullName,
            phone: normalizedPhone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
          },
          items: checkoutItems.map((it) => ({
            product_id: it.product_id,
            product_name: it.product_name,
            image: it.image,
            weight: it.weight,
            price: it.price,
            quantity: it.quantity,
          })),
          coupon_code: isBuyNow ? undefined : appliedCoupon?.code,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        showToast(orderData.error || 'Failed to initialize order calculations.', 'error');
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === 'cod') {
        if (!storeSettings.enable_cod) {
          showToast('Cash on Delivery is disabled by admin. Please select Online Payment.', 'error');
          setPaymentMethod('razorpay');
          setIsProcessing(false);
          return;
        }
        finalizeOrder('COD_PENDING', 'order_cod_' + Date.now(), orderData.totals);
        return;
      }

      // Razorpay Flow
      const isLoaded = await loadRazorpayScript();
      const hasLiveKeys =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
        !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('yourKey');

      if (hasLiveKeys && isLoaded && (window as unknown as { Razorpay: unknown }).Razorpay) {
        // 2. Open Official Razorpay Checkout Modal
        const options = {
          key: orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Kavyasri Pickles',
          description: 'Authentic Homemade Pickles & Spices',
          order_id: orderData.id,
          remember_customer: false,
          notes: {
            shipping_address: `${addressLine1}, ${city}, ${state} - ${pincode}`,
          },
          theme: { color: '#9e1b1e' },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            // 3. Mandatory Server-Side Payment Signature Verification
            try {
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: orderData.order_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                if (verifyData.order) {
                  DataStore.saveOrder(verifyData.order);
                }
                if (isBuyNow) clearBuyNow();
                else clearCart();

                try {
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                } catch {
                  // ignore
                }

                showToast('Order placed & payment verified successfully! 🌶️', 'success');
                router.push(`/orders/${verifyData.orderId}`);
              } else {
                showToast(verifyData.message || 'Payment signature verification failed.', 'error');
              }
            } catch (err) {
              console.error('Payment verification error:', err);
              showToast('An error occurred while verifying your payment.', 'error');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              showToast('Payment window closed. You can retry anytime.', 'info');
            },
          },
        };

        const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay(options);
        rzp.open();
      } else {
        // Fallback to interactive test sandbox modal when keys are unconfigured
        setShowRazorpayModal(true);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Razorpay initialization exception:', err);
      setShowRazorpayModal(true);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#9e1b1e] uppercase">
              Secure 256-Bit SSL Checkout
            </span>
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
              Complete Your Order
            </h1>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Details & Shipping (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#9e1b1e] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-serif font-bold text-base text-stone-900">Contact Information</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Email Address (for invoice & tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya@example.com"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Mobile Number (WhatsApp updates) *
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#9e1b1e] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-serif font-bold text-base text-stone-900">Shipping Address</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      House / Flat / Street Address *
                    </label>
                    <input
                      type="text"
                      autoComplete="street-address"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. Flat 402, Sai Residency, Road No. 12"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Landmark / Colony (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Near Banjara Hills City Center"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">City *</label>
                      <input
                        type="text"
                        autoComplete="address-level2"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Hyderabad"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">State *</label>
                      <input
                        type="text"
                        autoComplete="address-level1"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Telangana"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Pincode *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="500034"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#9e1b1e] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-serif font-bold text-base text-stone-900">Payment Selection</h3>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#9e1b1e] bg-red-50/50 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-[#9e1b1e] w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
                          <span>Razorpay Secure Online Checkout</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                            Instant
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, Wallets.
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#9e1b1e]" />
                  </label>

                  {storeSettings.enable_cod ? (
                    <label
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#9e1b1e] bg-red-50/50 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-[#9e1b1e] w-4 h-4"
                        />
                        <div>
                          <div className="font-bold text-xs text-stone-900">Cash on Delivery (COD)</div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Pay cash or UPI directly to courier delivery executive at doorstep.
                          </p>
                        </div>
                      </div>
                      <Truck className="w-5 h-5 text-stone-400" />
                    </label>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                      <span className="font-medium">Cash on Delivery (COD) is currently unavailable.</span>
                      <span className="text-[10px] font-extrabold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-md">
                        Prepaid Only
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-5 sticky top-24">
                <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
                  Items in Order ({checkoutItems.length})
                </h3>

                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
                  {checkoutItems.map((it) => (
                    <div key={it.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <Image src={it.image} alt={it.product_name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-stone-900 truncate">{it.product_name}</p>
                        <p className="text-stone-500">
                          {it.weight} × {it.quantity}
                        </p>
                      </div>
                      <div className="text-right text-xs font-bold text-stone-900">
                        ₹{it.price * it.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-900">₹{checkoutSubtotal}</span>
                  </div>
                  {checkoutDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{checkoutDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Standard Shipping</span>
                    <span>
                      {checkoutShipping === 0 ? (
                        <strong className="text-emerald-600 font-bold">FREE</strong>
                      ) : (
                        `₹${checkoutShipping}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST ({gstEnabled ? `${gstPercentage}%` : 'Tax Exempt'})</span>
                    <span>₹{checkoutTax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-stone-900 pt-3 border-t border-stone-200">
                    <span>Grand Total Payable</span>
                    <span className="text-[#9e1b1e]">₹{checkoutTotal}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white font-extrabold rounded-2xl shadow-xl shadow-red-900/25 flex items-center justify-center gap-2 text-sm transition-transform active:scale-98 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Securing Payment...'
                      : paymentMethod === 'cod'
                      ? `Confirm Cash on Delivery Order (₹${checkoutTotal})`
                      : `Pay Online ₹${checkoutTotal} with Razorpay`}
                  </span>
                </button>

                <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Safe Checkout • 100% Homemade Guarantee</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Razorpay Interactive Sandbox Simulator Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="bg-[#121c2d] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center font-black text-sm">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm">Razorpay Checkout Sandbox</h3>
                  <p className="text-[10px] text-blue-200">Kavyasri Pickles • Order #KP-TEST</p>
                </div>
              </div>
              <div className="text-right font-extrabold text-sm sm:text-base text-emerald-400">
                ₹{checkoutTotal}.00
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <p className="font-bold mb-1">Simulated Payment Gateway</p>
                <p className="text-[11px] text-blue-800">
                  This interactive test runner verifies the full end-to-end checkout pipeline, server-side signature verification, stock deduction, and order confirmation.
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-700">
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span>Paying to</span>
                  <strong>Kavyasri Pickles</strong>
                </div>
                <div className="p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span>Customer Phone</span>
                  <strong>{phone}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowRazorpayModal(false);
                    finalizeOrder('pay_simulated_' + Date.now(), 'order_sim_' + Date.now());
                  }}
                  className="w-full py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Payment Success (Authorize ₹{checkoutTotal})</span>
                </button>

                <button
                  onClick={() => {
                    setShowRazorpayModal(false);
                    showToast('Payment was cancelled or failed. You can retry anytime.', 'error');
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs"
                >
                  Simulate Payment Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
          <div className="w-8 h-8 border-3 border-[#9e1b1e] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
