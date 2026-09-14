'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle2,
  Lock,
  Percent,
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { StoreSettings } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const loadSettings = async () => {
    // 1. Populate local settings first for instant render
    const current = DataStore.getStoreSettings();
    setSettings(current);

    // 2. ALWAYS fetch live DB configuration directly from Supabase / API
    try {
      const liveSettings = await DataStore.syncSettingsFromSupabase();
      if (liveSettings) {
        setSettings(liveSettings);
      }
    } catch (err) {
      console.error('Error fetching settings from database:', err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (!settings) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    // Validate inputs before saving
    if (settings.free_shipping_threshold < 0) {
      showToast('Free Shipping Threshold cannot be negative.', 'error');
      return;
    }
    if (settings.standard_shipping_fee < 0) {
      showToast('Standard Shipping Charge cannot be negative.', 'error');
      return;
    }
    if (settings.gst_percentage < 0 || settings.gst_percentage > 100) {
      showToast('GST Rate Percentage must be between 0% and 100%.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Failed to save store settings to database.', 'error');
        return;
      }

      if (data.settings) {
        setSettings(data.settings);
        DataStore.updateStoreSettings(data.settings);
      }

      showToast('Store settings saved to database successfully! 🌶️', 'success');
    } catch (err) {
      console.error('Error saving store settings:', err);
      // Fallback local update
      DataStore.updateStoreSettings(settings);
      showToast('Saved settings locally.', 'info');
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        'Warning: This will reset all demo products, categories, orders, and reviews back to default factory seeds. Continue?'
      )
    ) {
      DataStore.resetToDefaults();
      setSettings(DataStore.getStoreSettings());
      showToast('Database reset to authentic initial seed state.', 'info');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              System Preferences
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
            Store Configuration & Settings
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Manage business identity, GST tax percentage, shipping rules, payment gateways, and regulatory details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="px-4 py-2.5 bg-red-50/80 hover:bg-red-100/80 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-red-200/60 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Business Identity */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-200/60 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#166534] flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 tracking-tight">
                Store Identity & Legal Details
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">Public brand profile and regulatory compliance IDs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Business Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Store Support Email</label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Support Phone / WhatsApp</label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Govt. FSSAI License Number</label>
              <input
                type="text"
                value={settings.fssai_number}
                onChange={(e) => setSettings({ ...settings, fssai_number: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-700 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">GSTIN Number</label>
              <input
                type="text"
                value={settings.gst_number}
                onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-700 transition-all"
              />
            </div>
          </div>
        </div>

        {/* GST & Tax Configuration Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-200/60 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center font-bold text-xs">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 tracking-tight">
                GST & Tax Rates Configuration
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">Customize Tax Percentage (%) applied at cart, checkout, & invoices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                GST Tax Status
              </label>
              <select
                value={settings.gst_enabled ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, gst_enabled: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-stone-900 transition-all"
              >
                <option value="true">Active (Apply GST Tax on Orders)</option>
                <option value="false">Disabled (Tax Exempt / 0% Tax)</option>
              </select>
              <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
                When active, the configured percentage will be added during cart & checkout calculations.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                GST Rate Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="28"
                  value={settings.gst_percentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      gst_percentage: e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-extrabold text-amber-900 pr-8 transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-stone-400">%</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
                Standard GST rate for packaged food in India is 5%. You can edit this anytime (e.g. 0%, 5%, 12%, 18%).
              </p>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-200/60 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#166534] flex items-center justify-center font-bold text-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 tracking-tight">
                Shipping & Logistics Rules
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">Free delivery threshold and standard courier tariffs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Free Shipping Threshold Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_shipping_threshold: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-emerald-900 transition-all"
              />
              <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
                Orders with subtotal above this amount receive free express delivery.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.standard_shipping_fee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    standard_shipping_fee: e.target.value === '' ? 0 : Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-stone-900 transition-all"
              />
              <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
                Flat shipping fee applied to orders below free threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-200/60 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#166534] flex items-center justify-center font-bold text-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 tracking-tight">
                Razorpay Payment Gateway & COD
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">UPI, NetBanking, Cards, and Cash on Delivery</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Gateway Engine Active</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
              Razorpay Checkout active. Supports UPI (Google Pay, PhonePe, Paytm), Visa, MasterCard, RuPay, and NetBanking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Razorpay Key ID</label>
              <input
                type="text"
                value={settings.razorpay_key_id}
                onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-700 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Cash on Delivery (COD)</label>
              <select
                value={settings.enable_cod ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, enable_cod: e.target.value === 'true' })}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-semibold text-stone-900 transition-all"
              >
                <option value="true">Enabled (Accept COD)</option>
                <option value="false">Disabled (Prepaid Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold shadow-[0_4px_16px_rgba(22,101,52,0.25)] transition-all active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save All Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
