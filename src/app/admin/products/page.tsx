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
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbProducts) {
          const mapped: Product[] = dbProducts.map((p) => ({
            id: p.id,
            category_id: p.category_id || 'cat-veg',
            category_name: p.category_name || 'Traditional Pickles',
            name: p.name,
            slug: p.slug,
            short_description: p.short_description || '',
            description: p.description || '',
            price: Number(p.price),
            mrp: Number(p.mrp),
            discount_percent: Number(p.discount_percent || 0),
            weight: p.weight || '250g',
            stock_quantity: Number(p.stock_quantity || 0),
            sku: p.sku || '',
            spice_level: p.spice_level || 'Hot',
            dietary: p.dietary || 'veg',
            shelf_life: p.shelf_life || '12 Months',
            storage_instructions: p.storage_instructions || '',
            ingredients: p.ingredients || [],
            images: p.images && p.images.length > 0 ? p.images : ['/images/pickles/hero.jpg'],
            is_featured: Boolean(p.is_featured),
            is_active: Boolean(p.is_active),
            rating: Number(p.rating || 4.8),
            reviews_count: Number(p.reviews_count || 0),
            variants: [
              { id: `var-${p.id}-250`, product_id: p.id, weight: '250g', price: Number(p.price), mrp: Number(p.mrp), stock_quantity: Number(p.stock_quantity || 0) },
            ],
            created_at: p.created_at,
          }));

          setProducts(mapped);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching admin products from Supabase:', err);
      }
    }

    setProducts(DataStore.getProducts());
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Pickle Products Catalogue ({products.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your recipes, pricing, weight variants, and inventory stocks.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by pickle name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800"
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

      {/* Products Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
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
            <tbody className="divide-y divide-stone-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <Image src={prod.images[0] || '/images/pickles/hero.jpg'} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="font-bold text-stone-900 hover:text-[#166534] transition-colors"
                        >
                          {prod.name}
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                          <span>SKU: {prod.sku}</span>
                          <span>•</span>
                          <span>{prod.weight}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-stone-600 font-medium">{prod.category_name}</td>

                  <td className="p-4">
                    <div className="font-bold text-stone-900">₹{prod.price}</div>
                    <div className="text-[10px] text-stone-400 line-through">₹{prod.mrp}</div>
                  </td>

                  <td className="p-4">
                    {prod.stock_quantity <= 0 ? (
                      <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-red-200">
                        Out of Stock
                      </span>
                    ) : prod.stock_quantity <= 20 ? (
                      <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-200 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        {prod.stock_quantity} left
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                        {prod.stock_quantity} in stock
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-stone-700">{prod.spice_level}</span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        prod.is_active
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {prod.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{prod.is_active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${prod.id}`}
                        className="p-1.5 text-stone-600 hover:text-[#166534] hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit Pickle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-emerald-50 rounded-lg transition-colors"
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
        <div className="md:hidden divide-y divide-stone-100 p-3">
          {filtered.map((prod) => (
            <div key={prod.id} className="py-3 flex flex-col gap-2.5">
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <Image src={prod.images[0] || '/images/pickles/hero.jpg'} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/products/${prod.id}`}
                    className="font-serif font-bold text-sm text-stone-900 line-clamp-1"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-[11px] text-stone-500 mt-0.5">{prod.category_name} • {prod.weight}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-xs text-stone-900">₹{prod.price}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-[10px] text-stone-400 line-through">₹{prod.mrp}</span>
                    )}
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {prod.spice_level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-50 text-xs">
                <div>
                  {prod.stock_quantity <= 0 ? (
                    <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-red-200">
                      Out of Stock
                    </span>
                  ) : prod.stock_quantity <= 20 ? (
                    <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                      ⚠️ {prod.stock_quantity} left
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      {prod.stock_quantity} in stock
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(prod)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      prod.is_active
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {prod.is_active ? 'Active' : 'Hidden'}
                  </button>
                  <Link
                    href={`/admin/products/${prod.id}`}
                    className="p-1.5 text-stone-600 hover:text-[#166534] bg-stone-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"
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
