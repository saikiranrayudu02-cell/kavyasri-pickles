'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Sparkles, Filter, X, ArrowLeft, Flame } from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import ProductCard from '@/components/product/ProductCard';
import { DataStore } from '@/lib/data/store';
import { Product } from '@/lib/types';

export default function SpicesPage() {
  const allProducts = DataStore.getProducts();
  const spicesProducts = useMemo(() => {
    return allProducts.filter((p) => p.category_id === 'cat-spices');
  }, [allProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const filteredSpices = useMemo(() => {
    return spicesProducts
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
  }, [spicesProducts, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Category Hero Banner */}
        <div className="relative bg-linear-to-r from-[#7c2d12] via-[#9a3412] to-[#7c2d12] rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-amber-100 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Authentic Kitchen Tradition</span>
            </div>

            <h1 className="font-rounded text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              Traditional Spices & Karam Powders
            </h1>

            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              Authentic homemade Andhra-style karam powders and traditional spice blends prepared with carefully selected ingredients.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/25">
                {spicesProducts.length} Handcrafted Karam Varieties
              </span>
              <span className="bg-amber-400/90 text-stone-950 px-3.5 py-1.5 rounded-full shadow-xs">
                ₹150 (250 Grams ONLY)
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/25">
                Zero Preservatives
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search spices or karam powders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#9a3412]/20 transition-all"
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

            {/* Sort & Info */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-stone-500 font-medium">
                Showing <strong className="text-stone-900">{filteredSpices.length}</strong> of {spicesProducts.length} spices
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredSpices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredSpices.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">No Spices Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              No spices matched your search query &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 bg-[#9a3412] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
