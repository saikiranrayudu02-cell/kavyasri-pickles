import React from 'react';
import SubpageHeader from '@/components/layout/SubpageHeader';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">Policy</span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Refund & Cancellation Policy</h1>
          <p>
            Due to the perishable nature of homemade artisanal food and pickles, we cannot accept general returns once a package is delivered. However, customer satisfaction is our top priority!
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">1. Damaged or Tampered Shipments</h3>
          <p>
            If your package arrives with broken glass jars, oil leakage, or broken tamper-evident seals, please take a clear photograph or video and contact our support team at <strong>support@kavyasripickles.com</strong> within 48 hours of delivery.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">2. Immediate Replacement or Refund</h3>
          <p>
            We will immediately ship a fresh replacement jar at zero additional cost or issue a 100% refund to your original payment method within 5–7 business days.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">3. Cancellation</h3>
          <p>
            Orders can be cancelled free of charge before dispatch (within 4 hours of placing the order). Once dispatched, orders cannot be cancelled in transit.
          </p>
        </div>
      </main>
    </div>
  );
}
