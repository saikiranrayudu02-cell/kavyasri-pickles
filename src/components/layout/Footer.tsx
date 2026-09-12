'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Award, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t-4 border-[#9e1b1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-[#d97706] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">70-Yr Heirloom Recipe</h4>
              <p className="text-xs text-stone-400">Authentic grandma&apos;s blend</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-[#d97706] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Wood-Pressed Oils</h4>
              <p className="text-xs text-stone-400">Pure cold-pressed gingelly & mustard</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-[#d97706] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Zero Preservatives</h4>
              <p className="text-xs text-stone-400">100% Natural sun-cured</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-11 h-11 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-[#d97706] shrink-0">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">FSSAI Certified</h4>
              <p className="text-xs text-stone-400">Lic #13624014000189</p>
            </div>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative w-56 h-12 brightness-110">
                <Image
                  src="/images/logo.svg"
                  alt="Kavyasri Pickles"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Kavyasri Pickles brings the genuine warmth and bold aromas of traditional Indian kitchens directly to your dining table. Handcrafted in small batches with farm-fresh produce and sun-cured spices.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Govt. FSSAI Reg: <strong>13624014000189</strong></span>
              </div>
            </div>

            {/* Official Social Links */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/kavyasriintiruchulu?stkn=MTR3dWllNTFhM3l0NQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700/90 border border-stone-700/80 transition-all hover:scale-105 shadow-xs"
                title="Follow @kavyasriintiruchulu on Instagram"
              >
                <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0 shadow-xs">
                  <Image src="/images/instagram.svg" alt="Instagram" fill className="object-contain" />
                </div>
                <span className="text-xs font-bold text-stone-200 group-hover:text-white">Instagram</span>
              </a>

              <a
                href="https://wa.me/919705222744?text=Hello%20Kavyasri%20Pickles,%20I%20would%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700/90 border border-stone-700/80 transition-all hover:scale-105 shadow-xs"
                title="Chat with Kavyasri Pickles on WhatsApp 9705222744"
              >
                <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0 shadow-xs">
                  <Image src="/images/whatsapp.svg" alt="WhatsApp" fill className="object-contain" />
                </div>
                <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase border-b border-stone-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-400 transition-colors">
                  All Pickles (Store)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  Our Heritage Story
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-amber-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-amber-400 transition-colors">
                  Track My Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Policies */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase border-b border-stone-800 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-amber-400 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kitchen & Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wider uppercase border-b border-stone-800 pb-2">
              Kitchen & Location
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <a
                href="https://maps.google.com/?q=16.810783,81.107651"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-amber-400 transition-colors group"
                title="Locate Kitchen on Google Maps"
              >
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 group-hover:text-amber-400" />
                <div>
                  <span className="text-stone-300 font-semibold block">Kavyasri Intiruchulu Kitchen</span>
                  <span className="text-[11px] text-amber-400 underline font-medium">
                    View on Google Maps 📍
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a
                  href="tel:+919705222744"
                  className="text-stone-300 font-bold hover:text-amber-400 transition-colors"
                >
                  +91 97052 22744
                </a>
              </div>

              <a
                href="https://wa.me/919705222744?text=Hello%20Kavyasri%20Pickles,%20I%20would%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-800/90 text-emerald-300 hover:bg-emerald-900 transition-all text-xs font-bold shadow-xs hover:scale-102"
              >
                <div className="relative w-4 h-4 overflow-hidden shrink-0">
                  <Image src="/images/whatsapp.svg" alt="WhatsApp" fill className="object-contain" />
                </div>
                <span>Chat on WhatsApp: 9705222744</span>
              </a>

              <div className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@kavyasripickles.com</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Mon - Sat: 9:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Payment Security */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Kavyasri Pickles. All Rights Reserved. Crafted with love in India.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400">100% Secure Payments powered by</span>
            <span className="font-bold text-amber-400 text-xs tracking-wider">Razorpay</span>
            <span>• UPI • Cards • NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
