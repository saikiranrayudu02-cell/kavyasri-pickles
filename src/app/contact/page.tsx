'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to our kitchen team!', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#166534] uppercase">
            We’d Love to Hear From You
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            Contact Kavyasri Pickles
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Have questions about custom wedding orders, spice levels, or bulk corporate gifting? Reach out anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              Kitchen & Headquarters
            </h3>

            <div className="space-y-4 text-xs text-stone-600">
              <a
                href="https://maps.google.com/?q=16.810783,81.107651"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-2xl bg-[#faf7f2] border border-stone-200 hover:border-red-400 hover:bg-white transition-all group"
              >
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 text-sm group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                    <span>Kitchen Location</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </strong>
                  <p className="text-stone-600 mt-0.5">Coordinates: 16.810783, 81.107651</p>
                  <span className="text-[11px] font-bold text-red-600 underline mt-1 inline-block">
                    Open in Google Maps Directions 📍
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#faf7f2] border border-stone-200">
                <Phone className="w-5 h-5 text-[#166534] shrink-0" />
                <div>
                  <strong className="text-stone-900 block text-sm">Direct Phone Call:</strong>
                  <a href="tel:+919705222744" className="font-mono font-bold text-stone-800 hover:text-[#166534]">
                    +91 97052 22744
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#faf7f2] border border-stone-200">
                <Mail className="w-5 h-5 text-[#166534] shrink-0" />
                <div>
                  <strong className="text-stone-900 block text-sm">Customer Care Email:</strong>
                  <a href="mailto:support@kavyasripickles.com" className="font-semibold text-stone-800 hover:text-[#166534]">
                    support@kavyasripickles.com
                  </a>
                </div>
              </div>
            </div>

            {/* Official Social Links in Contact Card */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Instant Messaging & Socials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="https://wa.me/919705222744?text=Hello%20Kavyasri%20Pickles,%20I%20would%20like%20to%20place%20an%20order!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100/80 transition-all font-bold text-xs"
                >
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-xs">
                    <Image src="/images/whatsapp.svg" alt="WhatsApp" fill className="object-contain" />
                  </div>
                  <div>
                    <span className="block leading-tight">Order via WhatsApp</span>
                    <span className="text-[10px] text-emerald-700 font-normal">9705222744</span>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/kavyasriintiruchulu?stkn=MTR3dWllNTFhM3l0NQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 hover:bg-rose-100/80 transition-all font-bold text-xs"
                >
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-xs">
                    <Image src="/images/instagram.svg" alt="Instagram" fill className="object-contain" />
                  </div>
                  <div>
                    <span className="block leading-tight">Instagram Reels</span>
                    <span className="text-[10px] text-rose-700 font-normal">@kavyasriintiruchulu</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-200 text-xs text-stone-600">
              <p className="font-bold text-stone-900 mb-1">Operating Hours:</p>
              <p>Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
              <p className="text-stone-400 mt-1">Orders placed on Sundays are freshly packed on Monday morning.</p>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-4">Send Us a Direct Message</h3>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-stone-900">Message Received!</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Our family support team will get back to you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Message / Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like to ask or inquire about..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
