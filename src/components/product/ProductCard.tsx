'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Zap, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SpiceMeter from './SpiceMeter';
import DietaryBadge from './DietaryBadge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Selected weight state (defaults to first variant or product weight)
  const [selectedWeight, setSelectedWeight] = useState<string>(
    product.variants?.[0]?.weight || product.weight || '250g'
  );

  const currentVariant = product.variants?.find((v) => v.weight === selectedWeight);
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentMrp = currentVariant ? currentVariant.mrp : product.mrp;
  const currentStock = currentVariant ? currentVariant.stock_quantity : product.stock_quantity;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 15;

  const discountPercent =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : product.discount_percent;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, 1);
    router.push('/checkout');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#ede8de] hover:border-[#c4b9a8] shadow-sm hover:shadow-2xl hover:shadow-stone-300/40 transition-all duration-400 transform hover:-translate-y-1.5">
      {/* Top Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-stone-100 overflow-hidden block">
        <Image
          src={product.images[0] || '/images/pickles/hero.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-106 transition-transform duration-600 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#9e1b1e] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="bg-[#d97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md tracking-wider uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Dietary symbol & Wishlist button */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <DietaryBadge type={product.dietary} size="md" />

          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFavorited
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
              Only {currentStock} left!
            </span>
          </div>
        ) : null}
      </Link>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Spice Level */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-[#78350f]">{product.category_name}</span>
            <SpiceMeter level={product.spice_level} showText={false} />
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#9e1b1e] transition-colors">
            <h3 className="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold ml-1 text-stone-800">{product.rating}</span>
            </div>
            <span className="text-stone-400">({product.reviews_count} reviews)</span>
          </div>

          {/* Weight Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[11px] font-medium text-stone-400">Pack:</span>
              <div className="flex flex-wrap gap-1">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedWeight(variant.weight)}
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold transition-all ${
                      selectedWeight === variant.weight
                        ? 'bg-[#9e1b1e] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {variant.weight}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-stone-900">₹{currentPrice}</span>
              {currentMrp > currentPrice && (
                <span className="text-xs text-stone-400 line-through">₹{currentMrp}</span>
              )}
            </div>
            <span className="text-[11px] text-stone-500 font-medium">{selectedWeight} jar</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all border border-stone-200/80 ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-transparent'
                  : 'bg-stone-100/90 hover:bg-stone-200/90 text-stone-800 hover:text-stone-950 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`group/btn relative overflow-hidden flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs text-white transition-all shadow-md active:scale-95 ${
                isOutOfStock
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                  : 'bg-linear-to-r from-[#9e1b1e] via-[#b91c1c] to-[#c2410c] hover:from-[#881316] hover:via-[#9e1b1e] hover:to-[#b91c1c] shadow-red-950/20 hover:shadow-lg hover:shadow-red-900/35 hover:-translate-y-0.5'
              }`}
            >
              {/* Animated diagonal light sweep / shimmer */}
              {!isOutOfStock && (
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-linear-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              )}
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.85)] group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="tracking-tight">Buy Now</span>
              <ArrowRight className="w-3 h-3 text-white/80 group-hover/btn:translate-x-0.5 group-hover/btn:text-white transition-transform duration-200 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
