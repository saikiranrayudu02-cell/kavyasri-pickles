'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative py-16 bg-[#f5ede0] border-b border-[#ede5d8] text-center px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#166534] uppercase">
              The Kavyasri Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 mt-2 leading-tight">
              70 Years of Handcrafted Perfection & Pure Family Love.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-4">
              Started in a quiet family courtyard in 1954, Kavyasri Pickles was founded on one simple rule: never compromise on grandma’s recipes or the purity of raw ingredients.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/images/pickles/hero.jpg"
                alt="Traditional Indian pickle making"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-5 text-sm text-stone-700 leading-relaxed">
              <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">Our Philosophy</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Pestle, Mortar, Sun & Wood-Pressed Oil
              </h2>
              <p>
                In an era dominated by mass factory manufacturing, artificial stabilizers, and synthetic vinegars, Kavyasri Pickles stays loyal to the age-old art of slow curing.
              </p>
              <p>
                We hand-cut raw Ramkela mangoes, hand-pick tender Andhra Gongura leaves, and use exclusively wood-pressed (ghani) sesame and mustard oils. Our pickles age naturally in white-and-brown ceramic martaban jars under direct sunlight, allowing the spices to mature, tenderize the ingredients, and naturally preserve every batch without chemical preservatives.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                <div>
                  <h4 className="font-bold text-stone-900 text-base">100% Homemade</h4>
                  <p className="text-xs text-stone-500">Prepared in family kitchens, not automated chemical factories.</p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">FSSAI Certified</h4>
                  <p className="text-xs text-stone-500">Rigorous hygiene standards with government registration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#166534] text-white text-center px-4">
          <h2 className="font-serif text-3xl font-bold mb-3">Taste The Tradition Today</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto mb-6">
            Handcrafted with love. Shipped fresh across all states in India.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d97706] hover:bg-[#b45309] text-white rounded-2xl font-bold text-sm shadow-xl"
          >
            <span>Explore All Pickles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
