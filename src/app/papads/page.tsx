'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Sparkles, Filter, X, ArrowLeft, Sun } from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import ProductCard from '@/components/product/ProductCard';
import { DataStore } from '@/lib/data/store';
import { Product } from '@/lib/types';

export default function PapadsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>(() => DataStore.getProducts());

  React.useEffect(() => {
    async function loadData() {
      const synced = await DataStore.syncProductsFromSupabase();
      setAllProducts(synced);
    }
    loadData();
  }, []);

  const papadsProducts = useMemo(() => {
    return allProducts.filter((p) => p.category_id === 'cat-papads' || p.category_id === 'papads');
  }, [allProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const filteredPapads = useMemo(() => {
    return papadsProducts
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.short_description.toLowerCase().includes(q) ||
            p.ingredients.some((ing) => ing.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.rating * b.reviews_count - a.rating * a.reviews_count;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [papadsProducts, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Category Hero Banner */}
        <div className="relative bg-linear-to-r from-[#9a3412] via-[#c2410c] to-[#9a3412] rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-300/30 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              Sun-Dried Andhra Delights
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Handcrafted Papads & Odiyalu
            </h1>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed mb-6">
              Authentic sun-dried sago, rice flour, urad dal odiyalu, and traditional buttermilk chillies prepared with heirloom Andhra recipes.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-amber-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> 100% Sun-Dried
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> No Preservatives
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> Crisp & Crunchy
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Sorting */}
        <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-2xl p-4 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search papads & odiyalu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Counter */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
              <span className="text-xs font-semibold text-stone-500">
                Showing <strong className="text-stone-900 font-extrabold">{filteredPapads.length}</strong> items
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="papads-sort" className="text-xs font-bold text-stone-600">
                  Sort:
                </label>
                <select
                  id="papads-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredPapads.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredPapads.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
            <Sun className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No papads or odiyalu found</h3>
            <p className="text-xs text-stone-500 mt-1">Try adjusting your search criteria</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#9e1b1e] text-white font-bold text-xs hover:bg-[#7f1d1d] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
