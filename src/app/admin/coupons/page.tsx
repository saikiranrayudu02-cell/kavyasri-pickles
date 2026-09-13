'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Eye, EyeOff, Edit2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Coupon } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AdminCouponsPage() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(499);
  const [maxDiscount, setMaxDiscount] = useState<number>(150);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(200);

  const loadCoupons = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbCoupons, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbCoupons) {
          const mapped: Coupon[] = dbCoupons.map((c) => ({
            id: c.id,
            code: c.code,
            discount_type: c.discount_type,
            discount_value: Number(c.discount_value),
            min_order_amount: Number(c.min_order_amount),
            max_discount: c.max_discount ? Number(c.max_discount) : undefined,
            expiry_date: c.expiry_date,
            usage_limit: Number(c.usage_limit),
            times_used: Number(c.times_used || 0),
            is_active: Boolean(c.is_active),
          }));
          setCoupons(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error loading coupons from Supabase:', err);
      }
    }

    setCoupons(DataStore.getCoupons());
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(499);
    setMaxDiscount(150);
    setExpiryDate('2026-12-31');
    setUsageLimit(200);
    setShowModal(true);
  };

  const openEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discount_type);
    setDiscountValue(c.discount_value);
    setMinOrderAmount(c.min_order_amount);
    setMaxDiscount(c.max_discount || 0);
    setExpiryDate(c.expiry_date);
    setUsageLimit(c.usage_limit);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const couponToSave: Coupon = {
      id: editingCoupon ? editingCoupon.id : `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrderAmount),
      max_discount: discountType === 'percentage' && maxDiscount ? Number(maxDiscount) : undefined,
      expiry_date: expiryDate,
      usage_limit: Number(usageLimit),
      times_used: editingCoupon ? editingCoupon.times_used : 0,
      is_active: editingCoupon ? editingCoupon.is_active : true,
    };

    DataStore.saveCoupon(couponToSave);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('coupons').upsert({
        id: couponToSave.id,
        code: couponToSave.code,
        discount_type: couponToSave.discount_type,
        discount_value: couponToSave.discount_value,
        min_order_amount: couponToSave.min_order_amount,
        max_discount: couponToSave.max_discount || null,
        expiry_date: couponToSave.expiry_date,
        usage_limit: couponToSave.usage_limit,
        times_used: couponToSave.times_used,
        is_active: couponToSave.is_active,
      });
    }

    await loadCoupons();
    setShowModal(false);
    showToast(editingCoupon ? `Coupon ${code} updated!` : `Coupon ${code} created!`, 'success');
  };

  const handleToggleActive = async (c: Coupon) => {
    const updated = { ...c, is_active: !c.is_active };
    DataStore.saveCoupon(updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('coupons').update({ is_active: updated.is_active }).eq('id', c.id);
    }

    await loadCoupons();
    showToast(`Coupon ${c.code} is now ${updated.is_active ? 'Active' : 'Paused'}.`, 'info');
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      DataStore.deleteCoupon(id);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('coupons').delete().eq('id', id);
      }

      await loadCoupons();
      showToast(`Coupon ${code} deleted.`, 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Offers & Campaigns
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
            Promotional Coupons ({coupons.length})
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Create festive discount promo codes to drive sales and customer delight.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_16px_rgba(22,101,52,0.25)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono font-extrabold text-xs px-3.5 py-1.5 bg-amber-500/10 text-amber-900 border border-amber-300/60 rounded-2xl tracking-wider shadow-2xs">
                  {c.code}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                    c.is_active
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  {c.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="text-2xl font-extrabold text-stone-900 tracking-tight">
                {c.discount_type === 'percentage'
                  ? `${c.discount_value}% OFF`
                  : `₹${c.discount_value} FLAT OFF`}
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 mt-4 pt-4 border-t border-stone-200/60 font-medium">
                <p className="flex justify-between">
                  <span className="text-stone-400">Min. Order:</span> <strong>₹{c.min_order_amount}</strong>
                </p>
                {c.max_discount && (
                  <p className="flex justify-between">
                    <span className="text-stone-400">Max Discount:</span> <strong>₹{c.max_discount}</strong>
                  </p>
                )}
                <p className="flex justify-between">
                  <span className="text-stone-400">Valid Until:</span> <strong>{c.expiry_date}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-stone-400">Redemptions:</span> <strong>{c.times_used} / {c.usage_limit}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/60 text-xs">
              <button
                onClick={() => handleToggleActive(c)}
                className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 transition-all active:scale-95 text-[11px]"
              >
                {c.is_active ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                <span>{c.is_active ? 'Pause' : 'Activate'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100/80 transition-colors active:scale-90"
                  title="Edit Coupon"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50/80 transition-colors active:scale-90"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-white/80 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl text-stone-900 mb-1 tracking-tight">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>
            <p className="text-xs text-stone-500 mb-5 font-medium">Configure discount parameters, min spend, and limits.</p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-semibold text-stone-900 tracking-wider transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium text-stone-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium text-stone-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium text-stone-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100/80 rounded-2xl transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold shadow-[0_4px_16px_rgba(22,101,52,0.25)] transition-all active:scale-95"
                >
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
