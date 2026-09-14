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
    // 1. Always populate local DataStore settings first
    const current = DataStore.getStoreSettings();
    setSettings(current);

    // 2. Only fetch from Supabase if local storage key has not been customized yet
    if (isSupabaseConfigured && supabase) {
      try {
        const localStored = typeof window !== 'undefined' ? localStorage.getItem('kp_settings_v1') : null;
        if (!localStored) {
          const { data: dbSettings, error } = await supabase
            .from('store_settings')
            .select('*')
            .limit(1)
            .single();

          if (dbSettings && !error) {
            const loaded: StoreSettings = {
              store_name: dbSettings.store_name || current.store_name,
              tagline: dbSettings.tagline || current.tagline,
              store_email: dbSettings.store_email || dbSettings.support_email || current.store_email,
              store_phone: dbSettings.store_phone || dbSettings.support_phone || current.store_phone,
              whatsapp_number: dbSettings.whatsapp_number || current.whatsapp_number,
              fssai_number: dbSettings.fssai_number || dbSettings.fssai_license || current.fssai_number,
              gst_number: dbSettings.gst_number || current.gst_number,
              address: dbSettings.address || dbSettings.kitchen_address || current.address,
              city: dbSettings.city || current.city,
              state: dbSettings.state || current.state,
              pincode: dbSettings.pincode || current.pincode,
              free_shipping_threshold: Number(dbSettings.free_shipping_threshold ?? current.free_shipping_threshold),
              standard_shipping_fee: Number(
                dbSettings.standard_shipping_fee ?? dbSettings.default_shipping_fee ?? current.standard_shipping_fee
              ),
              gst_percentage: Number(dbSettings.gst_percentage ?? current.gst_percentage),
              gst_enabled: Boolean(dbSettings.gst_enabled ?? current.gst_enabled),
              razorpay_key_id: dbSettings.razorpay_key_id || current.razorpay_key_id,
              is_razorpay_live: Boolean(dbSettings.is_razorpay_live ?? dbSettings.razorpay_enabled ?? current.is_razorpay_live),
              enable_cod: Boolean(dbSettings.enable_cod ?? dbSettings.cod_available ?? current.enable_cod),
            };
            setSettings(loaded);
            DataStore.updateStoreSettings(loaded);
          }
        }
      } catch (err) {
        console.error('Error fetching settings from Supabase:', err);
      }
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (!settings) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    // 1. Authoritative local DataStore update & event broadcast
    const updated = DataStore.updateStoreSettings(settings);
    setSettings({ ...updated });

    // 2. Async sync to Supabase without overwriting local state
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('store_settings').upsert({
          id: 1,
          store_name: settings.store_name,
          tagline: settings.tagline,
          store_email: settings.store_email,
          store_phone: settings.store_phone,
          whatsapp_number: settings.whatsapp_number,
          fssai_number: settings.fssai_number,
          gst_number: settings.gst_number,
          address: settings.address,
          city: settings.city,
          state: settings.state,
          pincode: settings.pincode,
          free_shipping_threshold: settings.free_shipping_threshold,
          standard_shipping_fee: settings.standard_shipping_fee,
          gst_percentage: settings.gst_percentage,
          gst_enabled: settings.gst_enabled,
          razorpay_key_id: settings.razorpay_key_id,
          is_razorpay_live: settings.is_razorpay_live,
          enable_cod: settings.enable_cod,
        });
      } catch (err) {
        console.error('Supabase settings sync error:', err);
      }
    }

    showToast('Store settings saved successfully!', 'success');
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
