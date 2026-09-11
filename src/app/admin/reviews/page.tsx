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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Customer Reviews Moderation ({reviews.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Moderate verified buyer feedback before it displays on public pickle pages.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-stone-900">{rev.customer_name}</span>
                {rev.is_verified_purchase && (
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Buyer
                  </span>
                )}
                <span className="text-xs text-stone-400">• {rev.created_at}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    rev.is_approved
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {rev.is_approved ? 'Approved & Visible' : 'Pending Moderation'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#166534]">
                {rev.product_name || 'Artisanal Pickle'}
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed italic bg-[#faf7f2] p-3 rounded-2xl border border-stone-100">
              &ldquo;{rev.comment}&rdquo;
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              {!rev.is_approved ? (
                <button
                  onClick={() => handleModerate(rev.id, true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Review</span>
                </button>
              ) : (
                <button
                  onClick={() => handleModerate(rev.id, false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Hide from Store</span>
                </button>
              )}

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-emerald-50"
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
