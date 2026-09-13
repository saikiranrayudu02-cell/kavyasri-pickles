'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Leaf, Sparkles, Filter, X, ArrowLeft } from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { DataStore } from '@/lib/data/store';
import { Product } from '@/lib/types';

export default function VegPicklesPage() {
  const allProducts = DataStore.getProducts();
  const vegPickles = useMemo(() => {
    return allProducts.filter((p) => p.category_id === 'cat-veg' || p.dietary === 'veg');
  }, [allProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(700);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredPickles = useMemo(() => {
    return vegPickles
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.short_description.toLowerCase().includes(q) ||
            p.ingredients.some((ing) => ing.toLowerCase().includes(q));
          if (!matches) return false;
        }
        if (p.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.rating * b.reviews_count - a.rating * a.reviews_count;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [vegPickles, searchQuery, maxPrice, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Category Hero Banner */}
        <div className="relative bg-linear-to-r from-[#166534] via-[#15803d] to-[#166534] rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <Leaf className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
              <span>100% Pure Vegetarian</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              Traditional Veg Pickles
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              Authentic homemade vegetarian pickles crafted with traditional recipes and premium ingredients.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/25">
                {vegPickles.length} Handcrafted Varieties
              </span>
              <span className="bg-amber-400/90 text-stone-950 px-3.5 py-1.5 rounded-full shadow-xs">
                Zero Preservatives
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/25">
                Cold-Pressed Oils
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
                placeholder="Search veg pickles or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:bg-white transition-all"
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

            {/* Price Filter & Sort */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="hidden sm:flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-xl border border-stone-200 text-xs">
                <span className="font-semibold text-stone-700">Max Price: ₹{maxPrice}</span>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-[#166534] w-24 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
          <span>
            Showing <strong>{filteredPickles.length}</strong> of {vegPickles.length} vegetarian pickles
          </span>
          <Link href="/shop" className="inline-flex items-center gap-1 font-bold text-[#166534] hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore All Categories</span>
          </Link>
        </div>

        {/* 4-Col Desktop, 3-Col Tablet, 2-Col Mobile Grid */}
        {filteredPickles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#166534] flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
              No veg pickles found
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Try clearing your search query or increasing the price filter slider.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setMaxPrice(1000);
              }}
              className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredPickles.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
