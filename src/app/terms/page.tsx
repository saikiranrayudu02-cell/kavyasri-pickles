import React from 'react';
import SubpageHeader from '@/components/layout/SubpageHeader';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6 text-sm text-stone-700 leading-relaxed">
          <span className="text-xs font-bold text-[#166534] uppercase tracking-wider">Legal</span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Terms & Conditions</h1>
          <p>
            Welcome to Kavyasri Pickles. By visiting our website or purchasing our products, you agree to the following terms and conditions.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">1. Product Information & Pricing</h3>
          <p>
            All pickle varieties are handcrafted using traditional methods. Natural variations in color, texture, and seed size are characteristic of genuine homemade food. All prices are in Indian Rupees (INR) and include GST.
          </p>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-4">2. Safe Storage</h3>
          <p>
            Pickles must be handled in accordance with the printed guidelines: store in a cool, dry place, use only dry spoons, and do not allow water to enter the jar.
          </p>
        </div>
      </main>
    </div>
  );
}
