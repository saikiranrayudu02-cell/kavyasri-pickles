'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { DataStore } from '@/lib/data/store';
import { Product, Category, DietaryType, SpiceLevel } from '@/lib/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType | 'all'>('all');
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | 'all'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadShopData() {
      const syncedProducts = await DataStore.syncProductsFromSupabase();
      const syncedCategories = await DataStore.syncCategoriesFromSupabase();
      setProducts(syncedProducts.filter((p) => p.is_active));
      setCategories(syncedCategories.filter((c) => c.is_active));
      setIsLoading(false);
    }
    loadShopData();
  }, []);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'all');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.ingredients.some((ing) => ing.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Dietary
        if (selectedDietary !== 'all' && p.dietary !== selectedDietary) return false;

        // Spice Level
        if (selectedSpice !== 'all' && p.spice_level !== selectedSpice) return false;

        // Stock
        if (inStockOnly && p.stock_quantity <= 0) return false;

        // Price
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.rating * b.reviews_count - a.rating * a.reviews_count;
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, selectedDietary, selectedSpice, inStockOnly, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDietary('all');
    setSelectedSpice('all');
    setInStockOnly(false);
    setMaxPrice(2500);
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    selectedDietary !== 'all' ||
    selectedSpice !== 'all' ||
    inStockOnly ||
    maxPrice < 2500;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-12">
        {/* Page Header */}
        <div className="border-b border-stone-200 pb-5 sm:pb-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#9e1b1e] uppercase">
                Artisanal Pantry
              </span>
              <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
                All Homemade Pickles
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Authentic heirloom pickles, fresh non-veg delicacies, and festive combo packs.
              </p>
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors shadow-2xs ${
                  hasActiveFilters
                    ? 'bg-[#9e1b1e] text-white border-[#9e1b1e]'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-medium text-stone-600 ml-auto">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20 shadow-2xs"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
              <span className="text-xs text-stone-400 font-medium">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-[#9e1b1e] font-semibold px-2.5 py-1 rounded-full border border-red-200">
                  {categories.find((c) => c.id === selectedCategory)?.name || 'Category'}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDietary !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 font-semibold px-2.5 py-1 rounded-full">
                  {selectedDietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                  <button onClick={() => setSelectedDietary('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSpice !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                  Spice: {selectedSpice}
                  <button onClick={() => setSelectedSpice('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 font-semibold px-2.5 py-1 rounded-full">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-[#9e1b1e] hover:underline font-bold ml-2 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Content Layout: Filter Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar pb-6">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-6">
              {/* Search Bar in Filter */}
              <div>
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search pickles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                      selectedCategory === 'all'
                        ? 'bg-[#9e1b1e] text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>All Pickles</span>
                    <span>{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                        selectedCategory === cat.id
                          ? 'bg-[#9e1b1e] text-white'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-75">
                        {products.filter((p) => p.category_id === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Filter */}
              <div>
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block mb-2">
                  Dietary
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['all', 'veg', 'non-veg'] as const).map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setSelectedDietary(diet)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        selectedDietary === diet
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {diet === 'all' ? 'All' : diet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div>
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block mb-2">
                  Spice Heat
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'Mild', 'Medium', 'Hot', 'Extra Hot'] as const).map((spice) => (
                    <button
                      key={spice}
                      onClick={() => setSelectedSpice(spice)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        selectedSpice === spice
                          ? 'bg-[#d97706] text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {spice === 'all' ? 'Any Heat' : spice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-extrabold text-stone-900">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#9e1b1e] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹150</span>
                  <span>₹2500</span>
                </div>
              </div>

              {/* In Stock Only Toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded accent-[#9e1b1e] w-4 h-4"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
              <span>
                Showing <strong>{filteredProducts.length}</strong> of {products.length} pickles
              </span>
            </div>

            {/* Mobile Category Quick Chips */}
            <div className="lg:hidden mb-4 -mx-1 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#9e1b1e] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                All Pickles ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#9e1b1e] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {cat.name} ({products.filter((p) => p.category_id === cat.id).length})
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200 shadow-sm animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#9e1b1e] flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                  No pickles match your criteria
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                  No products matched your exact filter combination. Try adjusting your spice level, price slider, or category selection.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-900/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(idx % 6) * 75}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Slide-Over Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            {/* Bottom Sheet Drawer */}
            <div className="relative bg-white rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl z-10 animate-fade-in-up">
              {/* Handle bar */}
              <div className="pt-3 pb-1 flex justify-center">
                <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
              </div>

              {/* Drawer Header */}
              <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">Filters & Refine</h3>
                  <p className="text-[11px] text-stone-400">Find your ideal traditional pickle</p>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-[#9e1b1e] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 rounded-full text-stone-500 hover:bg-stone-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filter Content */}
              <div className="px-5 py-4 overflow-y-auto space-y-5 flex-1">
                {/* Search */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block mb-1.5">
                    Search Pickles
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search garlic, mango, prawns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#9e1b1e]/20"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block mb-1.5">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        selectedCategory === 'all'
                          ? 'bg-[#9e1b1e] text-white border-[#9e1b1e]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      All Pickles ({products.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold text-left truncate transition-all border ${
                          selectedCategory === cat.id
                            ? 'bg-[#9e1b1e] text-white border-[#9e1b1e]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {cat.name} ({products.filter((p) => p.category_id === cat.id).length})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Filter */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block mb-1.5">
                    Dietary
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['all', 'veg', 'non-veg'] as const).map((diet) => (
                      <button
                        key={diet}
                        onClick={() => setSelectedDietary(diet)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                          selectedDietary === diet
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {diet === 'all' ? 'All' : diet === 'veg' ? 'Veg 🌱' : 'Non-Veg 🍗'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 tracking-wider block mb-1.5">
                    Spice Heat
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['all', 'Mild', 'Medium', 'Hot', 'Extra Hot'] as const).map((spice) => (
                      <button
                        key={spice}
                        onClick={() => setSelectedSpice(spice)}
                        className={`text-xs px-3 py-2 rounded-xl font-bold transition-all border ${
                          selectedSpice === spice
                            ? 'bg-[#d97706] text-white border-[#d97706]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {spice === 'all' ? 'Any Heat' : spice}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                      Max Price: <span className="text-stone-900 font-extrabold text-xs">₹{maxPrice}</span>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="2500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#9e1b1e] cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>₹150</span>
                    <span>₹2500</span>
                  </div>
                </div>

                {/* In Stock Only Toggle */}
                <div className="pt-2 border-t border-stone-100">
                  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-xs font-bold text-stone-800">Show In-Stock Only</span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded accent-[#9e1b1e] w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Sticky Drawer Apply Button */}
              <div className="p-4 border-t border-stone-100 bg-white pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#9e1b1e] hover:bg-[#7f1d1d] active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-900/20"
                >
                  Show {filteredProducts.length} Pickles
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">Loading shop catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
