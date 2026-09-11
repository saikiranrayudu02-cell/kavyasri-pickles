import React from 'react';
import SubpageHeader from '@/components/layout/SubpageHeader';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">Privacy</span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Privacy Policy</h1>
          <p>
            Kavyasri Pickles respects your personal privacy. We only collect the minimal information needed to process your orders, ship your jars, and send WhatsApp delivery tracking updates.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">1. Information We Collect</h3>
          <p>
            When you purchase from us, we collect your name, delivery address, phone number, and email. We never store payment card numbers, UPI PINs, or net banking passwords.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">2. Payment Security</h3>
          <p>
            All electronic transactions are processed through Razorpay’s PCI-DSS compliant secure encrypted servers.
          </p>
        </div>
      </main>
    </div>
  );
}
