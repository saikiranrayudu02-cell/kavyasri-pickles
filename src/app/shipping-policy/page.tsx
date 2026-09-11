import React from 'react';
import SubpageHeader from '@/components/layout/SubpageHeader';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">Policy</span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Shipping & Delivery Policy</h1>
          <p>
            At Kavyasri Pickles, we take extra care to pack our homemade pickles in heavy food-grade jars with leak-proof seals and multi-layer bubble cushioning to ensure zero transit spills.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">1. Delivery Timelines</h3>
          <p>
            Orders are processed and dispatched within 24 to 48 hours. Metro cities typically receive deliveries within 2–4 business days. Regional and interior pin codes across India take 4–7 business days.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">2. Shipping Charges</h3>
          <p>
            We offer <strong>FREE Standard Shipping</strong> on all domestic orders valued at ₹499 and above. For orders under ₹499, a nominal flat shipping fee of ₹50 is applied at checkout.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">3. Tracking Your Shipment</h3>
          <p>
            Once your jar parcel is dispatched from our kitchen, an automated SMS and WhatsApp update with your live tracking number (AWB) is sent to your registered mobile phone.
          </p>
        </div>
      </main>
    </div>
  );
}
