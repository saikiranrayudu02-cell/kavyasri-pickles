'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { DataStore } from '@/lib/data/store';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const allProducts = DataStore.getProducts();
  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-[#166534] uppercase">
            Saved Favorites
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
            My Pickles Wishlist ({wishlistedProducts.length})
          </h1>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-stone-500 mb-6">
              Click the heart icon on any pickle jar to save it here for later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#166534] text-white rounded-xl text-xs font-bold hover:bg-[#14532d]"
            >
              <span>Explore Pickles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {wishlistedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
