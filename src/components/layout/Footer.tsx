'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Heart,
  Clock,
  ExternalLink,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-800 relative overflow-hidden font-sans">
      {/* Subtle Top Accent Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-[#9e1b1e]/60 to-transparent pointer-events-none" />

      {/* Top Feature Pillars - Clean & Minimal */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wide uppercase">70-Yr Recipe</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Grandma&apos;s authentic blend</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wide uppercase">Wood-Pressed Oils</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Pure cold-pressed sesame</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wide uppercase">Zero Preservatives</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">100% Natural sun-cured</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wide uppercase">FSSAI Certified</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Lic #13624014000189</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 Columns wide) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shadow-md">
                <Image
                  src="/images/logo.png"
                  alt="Kavyasri Pickles"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-black text-white text-lg tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                  Kavyasri <span className="text-rose-500">Pickles</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                  Traditional • Homemade
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bringing traditional Andhra home recipes, wood-pressed oils, and sun-cured spice blends straight from our kitchen to your table. Handcrafted with love and zero artificial preservatives.
            </p>

            {/* Social & Contact Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/919705222744?text=Hello%20Kavyasri%20Pickles,%20I%20would%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <div className="relative w-4 h-4">
                  <Image src="/images/whatsapp.svg" alt="WhatsApp" fill className="object-contain" />
                </div>
                <span>WhatsApp Order</span>
              </a>

              <a
                href="https://www.instagram.com/kavyasriintiruchulu?stkn=MTR3dWllNTFhM3l0NQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
              >
                <div className="relative w-4 h-4">
                  <Image src="/images/instagram.svg" alt="Instagram" fill className="object-contain" />
                </div>
                <span>Instagram</span>
              </a>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Govt FSSAI Reg: <strong className="text-slate-200">13624014000189</strong></span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>All Pickles</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Our Story</span>
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Saved Wishlist</span>
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Track Order</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Shipping & Delivery</span>
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Returns & Refunds</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>Contact Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Map */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Location & Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Kavyasri Kitchens, Andhra Pradesh & Telangana, India</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919705222744" className="hover:text-amber-400 font-semibold transition-colors">
                  +91 97052 22744
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-[11px]">Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>

              {/* Compact Map Preview */}
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 mt-2">
                <iframe
                  title="Kitchen Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15296.883908874136!2d81.097651!3d16.810783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQ4JzM4LjgiTiA4McKwMDYnMjcuNSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="90"
                  style={{ border: 0, filter: 'contrast(1.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-20 opacity-80 hover:opacity-100 transition-opacity"
                />
                <a
                  href="https://maps.google.com/?q=16.810783,81.107651"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-slate-950/90 text-amber-400 text-[10px] font-semibold rounded border border-slate-700 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Open Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Kavyasri Pickles. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>100% Secure Payments via</span>
            <span className="font-semibold text-slate-200">Razorpay • UPI • NetBanking • Cards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
