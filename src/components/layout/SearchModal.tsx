'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Flame, ChevronRight, Tag } from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { Product } from '@/lib/types';
import DietaryBadge from '@/components/product/DietaryBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProducts(DataStore.getProducts().filter((p) => p.is_active));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-stone-200 bg-[#faf7f2]">
          <Search className="w-5 h-5 text-[#166534] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search by pickle name, category, or ingredients (e.g. Mango, Garlic, Gongura, Fenugreek)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-stone-900 placeholder:opacity-50 focus:outline-none text-base sm:text-lg"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-6">
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Andhra Avakaya', 'Gongura Pickle', 'Boneless Chicken', 'Garlic Pickle', 'Lemon Pickle', 'Mutton Pickle'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#166534] hover:text-white text-stone-700 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query.trim() !== '' && (
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-100 p-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-stone-500 font-medium">No pickles found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-stone-400 mt-1">
                  Try searching for Mango, Lemon, Chicken, Gongura, or Garlic.
                </p>
              </div>
            ) : (
              filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 hover:bg-[#faf7f2] rounded-xl transition-colors group"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                    <Image
                      src={product.images[0] || '/images/pickles/hero.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <DietaryBadge type={product.dietary} size="sm" />
                      <h4 className="font-semibold text-stone-900 truncate group-hover:text-[#166534] transition-colors">
                        {product.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                      <span>{product.category_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-500" />
                        {product.spice_level}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">₹{product.price}</div>
                    <div className="text-xs text-stone-400 line-through">₹{product.mrp}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#166534] group-hover:translate-x-1 transition-all" />
                </Link>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <span>
            {filtered.length} {filtered.length === 1 ? 'pickle' : 'pickles'} found
          </span>
          <span className="text-stone-400">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
