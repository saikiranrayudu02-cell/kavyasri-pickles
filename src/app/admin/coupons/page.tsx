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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Promotional Coupons ({coupons.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Create festive discount promo codes to drive sales and customer delight.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-extrabold text-sm px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl tracking-wider">
                  {c.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {c.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="text-xl font-extrabold text-stone-900 mt-2">
                {c.discount_type === 'percentage'
                  ? `${c.discount_value}% OFF`
                  : `₹${c.discount_value} FLAT OFF`}
              </div>

              <div className="space-y-1 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
                <p>Min. Order Amount: <strong>₹{c.min_order_amount}</strong></p>
                {c.max_discount && <p>Max Discount Cap: <strong>₹{c.max_discount}</strong></p>}
                <p>Expiry: <strong>{c.expiry_date}</strong></p>
                <p>Used: <strong>{c.times_used} / {c.usage_limit} times</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100 text-xs">
              <button
                onClick={() => handleToggleActive(c)}
                className="text-stone-600 hover:text-black font-semibold flex items-center gap-1"
              >
                {c.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{c.is_active ? 'Pause' : 'Activate'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-emerald-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold shadow"
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
