'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Review } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbReviews, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbReviews) {
          const mapped: Review[] = dbReviews.map((r) => ({
            id: r.id,
            product_id: r.product_id,
            product_name: r.product_name || 'Artisanal Pickle',
            user_id: r.user_id,
            customer_name: r.customer_name || 'Customer',
            rating: Number(r.rating || 5),
            comment: r.comment || '',
            created_at: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : '',
            is_verified_purchase: Boolean(r.is_verified_purchase),
            is_approved: Boolean(r.is_approved),
          }));
          setReviews(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error loading admin reviews from Supabase:', err);
      }
    }

    setReviews(DataStore.getAllReviewsAdmin());
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (id: string, approve: boolean) => {
    DataStore.moderateReview(id, approve);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('reviews').update({ is_approved: approve }).eq('id', id);
    }
    await loadReviews();
    showToast(approve ? 'Review approved for public display.' : 'Review rejected.', 'info');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer review permanently?')) {
      DataStore.deleteReview(id);
      if (isSupabaseConfigured && supabase) {
        await supabase.from('reviews').delete().eq('id', id);
      }
      await loadReviews();
      showToast('Review deleted.', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Community & Social Proof
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
            Customer Reviews Moderation ({reviews.length})
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Moderate verified buyer feedback before it displays on public pickle pages.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-100 to-emerald-200 border border-emerald-300/60 flex items-center justify-center font-bold text-xs text-[#166534] shrink-0">
                  {rev.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-sm text-stone-900">{rev.customer_name}</span>
                  <span className="text-[10px] text-stone-400 block font-medium">Reviewed on {rev.created_at}</span>
                </div>
                {rev.is_verified_purchase && (
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Buyer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${
                    rev.is_approved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs'
                  }`}
                >
                  {rev.is_approved ? 'Approved & Visible' : 'Pending Moderation'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#166534] bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {rev.product_name || 'Artisanal Pickle'}
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-medium bg-stone-50/70 p-4 rounded-2xl border border-stone-200/60 italic">
              &ldquo;{rev.comment}&rdquo;
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200/60">
              {!rev.is_approved ? (
                <button
                  onClick={() => handleModerate(rev.id, true)}
                  className="px-4 py-2 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(22,101,52,0.25)] transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Review</span>
                </button>
              ) : (
                <button
                  onClick={() => handleModerate(rev.id, false)}
                  className="px-4 py-2 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/80 text-stone-700 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5 text-stone-500" />
                  <span>Hide from Store</span>
                </button>
              )}

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50/80 transition-colors active:scale-90"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
