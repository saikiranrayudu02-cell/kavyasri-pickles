'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Star,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Product } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadProducts = async () => {
    setLoading(true);
    const synced = await DataStore.syncProductsFromSupabase();
    setProducts(synced);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleActive = async (product: Product) => {
    const updated = { ...product, is_active: !product.is_active };
    DataStore.saveProduct(updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').update({ is_active: updated.is_active }).eq('id', product.id);
    }

    await loadProducts();
    showToast(
      `${product.name} is now ${updated.is_active ? 'Active on store' : 'Hidden from store'}.`,
      'info'
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      DataStore.deleteProduct(id);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('products').delete().eq('id', id);
      }

      await loadProducts();
      showToast(`Deleted ${name}.`, 'info');
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar (Apple Glass Hero) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-6 sm:p-7 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-[-0.03em] text-stone-950">
            Pickle Products Catalogue ({products.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Manage your recipes, pricing, weight variants, and inventory stocks.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4.5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 p-4 sm:p-5 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by pickle name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl border border-stone-300/80 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/90 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-extrabold text-stone-800 focus:outline-none shadow-2xs"
          >
            <option value="all">All Categories</option>
            <option value="cat-veg">Traditional Veg</option>
            <option value="cat-nonveg">Authentic Non-Veg</option>
            <option value="cat-andhra">Spicy Andhra</option>
            <option value="cat-seasonal">Seasonal Specials</option>
            <option value="cat-combos">Combo Packs</option>
          </select>
        </div>
      </div>

      {/* Products Table (macOS Finder Style) */}
      <div className="bg-linear-to-br from-white/90 via-white/80 to-white/60 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/60 text-stone-500 font-extrabold border-b border-stone-200/60">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price & MRP</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Heat</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                        <Image src={prod.images[0] || '/images/pickles/hero.jpg'} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="font-extrabold text-stone-950 hover:text-[#166534] transition-colors"
                        >
                          {prod.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium mt-0.5">
                          <span>SKU: {prod.sku}</span>
                          <span>•</span>
                          <span>{prod.weight}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-stone-700 font-bold">{prod.category_name}</td>

                  <td className="p-4">
                    <div className="font-extrabold text-stone-950 text-sm">₹{prod.price}</div>
                    <div className="text-[10px] text-stone-400 line-through font-medium">₹{prod.mrp}</div>
                  </td>

                  <td className="p-4">
                    {prod.stock_quantity <= 0 ? (
                      <span className="bg-rose-500/15 text-rose-900 border border-rose-500/20 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] backdrop-blur-xs">
                        Out of Stock
                      </span>
                    ) : prod.stock_quantity <= 20 ? (
                      <span className="bg-amber-500/15 text-amber-900 border border-amber-500/20 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] backdrop-blur-xs flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        {prod.stock_quantity} left
                      </span>
                    ) : (
                      <span className="bg-emerald-500/15 text-emerald-900 border border-emerald-500/20 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] backdrop-blur-xs">
                        {prod.stock_quantity} in stock
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="font-extrabold text-amber-800 bg-amber-500/15 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] backdrop-blur-xs">{prod.spice_level}</span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold transition-all active:scale-95 backdrop-blur-md shadow-2xs ${
                        prod.is_active
                          ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-500/20'
                          : 'bg-stone-200/70 text-stone-600 border border-stone-300/60'
                      }`}
                    >
                      {prod.is_active ? <Eye className="w-3 h-3 text-[#166534]" /> : <EyeOff className="w-3 h-3" />}
                      <span>{prod.is_active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${prod.id}`}
                        className="p-2 text-stone-600 hover:text-[#166534] hover:bg-stone-100 rounded-xl transition-all active:scale-90"
                        title="Edit Pickle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                        title="Delete Pickle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Product Card List View */}
        <div className="md:hidden divide-y divide-stone-200/50 p-4">
          {filtered.map((prod) => (
            <div key={prod.id} className="py-3.5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 shadow-2xs">
                  <Image src={prod.images[0] || '/images/pickles/hero.jpg'} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/products/${prod.id}`}
                    className="font-extrabold text-sm text-stone-950 line-clamp-1 hover:text-[#166534] transition-colors"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">{prod.category_name} • {prod.weight}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-xs text-stone-950">₹{prod.price}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-[10px] text-stone-400 line-through font-medium">₹{prod.mrp}</span>
                    )}
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {prod.spice_level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/40 text-xs">
                <div>
                  {prod.stock_quantity <= 0 ? (
                    <span className="bg-rose-500/15 text-rose-900 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] border border-rose-500/20">
                      Out of Stock
                    </span>
                  ) : prod.stock_quantity <= 20 ? (
                    <span className="bg-amber-500/15 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] border border-amber-500/20">
                      ⚠️ {prod.stock_quantity} left
                    </span>
                  ) : (
                    <span className="bg-emerald-500/15 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-500/20">
                      {prod.stock_quantity} in stock
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(prod)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all active:scale-95 ${
                      prod.is_active
                        ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-500/20'
                        : 'bg-stone-200/70 text-stone-600'
                    }`}
                  >
                    {prod.is_active ? 'Active' : 'Hidden'}
                  </button>
                  <Link
                    href={`/admin/products/${prod.id}`}
                    className="p-2 text-stone-600 hover:text-[#166534] bg-stone-100 rounded-xl active:scale-90 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl active:scale-90 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
