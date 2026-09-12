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
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { StoreSettings } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  const loadSettings = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbSettings } = await supabase.from('store_settings').select('*').limit(1).single();
        if (dbSettings) {
          setSettings({
            store_name: dbSettings.store_name || 'Kavyasri Pickles',
            tagline: dbSettings.tagline || 'Traditional Taste • Homemade Love',
            store_email: dbSettings.store_email || dbSettings.support_email || 'support@kavyasripickles.com',
            store_phone: dbSettings.store_phone || dbSettings.support_phone || '+91 98765 43210',
            whatsapp_number: dbSettings.whatsapp_number || '+91 98765 43210',
            fssai_number: dbSettings.fssai_number || dbSettings.fssai_license || '13624014000189',
            gst_number: dbSettings.gst_number || '36AAECK1294F1Z3',
            address: dbSettings.address || dbSettings.kitchen_address || 'Plot 42, Heritage Kitchens, RTC Colony',
            city: dbSettings.city || 'Hyderabad',
            state: dbSettings.state || 'Telangana',
            pincode: dbSettings.pincode || '500035',
            free_shipping_threshold: Number(dbSettings.free_shipping_threshold || 699),
            standard_shipping_fee: Number(dbSettings.standard_shipping_fee || dbSettings.default_shipping_fee || 70),
            razorpay_key_id: dbSettings.razorpay_key_id || '',
            is_razorpay_live: Boolean(dbSettings.is_razorpay_live ?? dbSettings.razorpay_enabled),
            enable_cod: Boolean(dbSettings.enable_cod ?? dbSettings.cod_available ?? true),
          });
          return;
        }
      } catch (err) {
        console.error('Error fetching settings from Supabase:', err);
      }
    }

    setSettings(DataStore.getStoreSettings());
  };

  useEffect(() => {
    loadSettings();
  }, []);

  if (!settings) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.updateStoreSettings(settings);

    if (isSupabaseConfigured && supabase) {
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
        razorpay_key_id: settings.razorpay_key_id,
        is_razorpay_live: settings.is_razorpay_live,
        enable_cod: settings.enable_cod,
      });
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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          Store Configuration & Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage business identity, shipping rules, payment gateways, and regulatory FSSAI details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Business Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-2 tracking-tight">
            Store Identity & Legal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Business Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Store Support Email</label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Support Phone / WhatsApp</label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Govt. FSSAI License Number</label>
              <input
                type="text"
                value={settings.fssai_number}
                onChange={(e) => setSettings({ ...settings, fssai_number: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">GSTIN</label>
              <input
                type="text"
                value={settings.gst_number}
                onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2 tracking-tight">
            <Truck className="w-4 h-4 text-[#166534]" />
            <span>Shipping & Logistics Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Free Shipping Threshold Amount (₹)
              </label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Orders with subtotal above this get free delivery.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={settings.standard_shipping_fee}
                onChange={(e) =>
                  setSettings({ ...settings, standard_shipping_fee: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Flat shipping fee for orders below threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2 tracking-tight">
            <CreditCard className="w-4 h-4 text-[#166534]" />
            <span>Razorpay Payment Gateway</span>
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gateway Engine Active</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Razorpay Checkout integration active. Supports UPI (Google Pay, PhonePe, Paytm), Visa, MasterCard, RuPay, and NetBanking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={settings.razorpay_key_id}
                onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Cash on Delivery (COD)</label>
              <select
                value={settings.enable_cod ? 'true' : 'false'}
                onChange={(e) => setSettings({ ...settings, enable_cod: e.target.value === 'true' })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-semibold"
              >
                <option value="true">Enabled (Accept COD)</option>
                <option value="false">Disabled (Prepaid Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-900/20 transition-all"
          >
            Save All Settings
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </form>
    </div>
  );
}
