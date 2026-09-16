'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Zap, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import SpiceMeter from './SpiceMeter';
import DietaryBadge from './DietaryBadge';
import { ShineBorder } from '@/components/ui/shine-border';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addToCart, startBuyNow } = useCart();
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
    if (!user) {
      showToast('Please sign in to add items to your cart!', 'info');
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/shop';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to buy this product!', 'info');
      router.push(`/login?redirect=${encodeURIComponent('/checkout?mode=buynow')}`);
      return;
    }
    if (isOutOfStock) return;
    const item = startBuyNow(product, selectedWeight, 1);
    if (item) {
      router.push('/checkout?mode=buynow');
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  const cardContent = (
    <div className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#ede8de] hover:border-[#c4b9a8] shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Top Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-stone-100 overflow-hidden block">
        <Image
          src={product.images[0] || '/images/pickles/hero.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#9e1b1e] text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="bg-[#d97706] text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs tracking-wider uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Dietary symbol & Wishlist button */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex items-center gap-1.5 z-10">
          <DietaryBadge type={product.dietary} size="sm" />

          <button
            onClick={handleWishlistToggle}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
              isFavorited
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-amber-500/90 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
              Only {currentStock} left!
            </span>
          </div>
        ) : null}
      </Link>

      {/* Body Content */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between font-sans">
        <div>
          {/* Compact Top Meta Line: Category, Rating & Spice Meter */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-1">
            <span className="font-semibold text-[9px] sm:text-[10px] text-[#9e1b1e] tracking-wide uppercase bg-red-50/80 px-1.5 py-0.5 rounded-md border border-red-100/60 truncate max-w-[55%]">
              {product.category_name}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center text-amber-600 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/60 text-[10px] font-bold">
                <Star className="w-3 h-3 fill-current text-amber-500 mr-0.5" />
                <span>{product.rating}</span>
              </div>
              <SpiceMeter level={product.spice_level} showText={false} />
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block transition-colors">
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2 group-hover:text-[#9e1b1e] tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Weight Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex flex-wrap gap-1">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedWeight(variant.weight)}
                    className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                      selectedWeight === variant.weight
                        ? 'bg-[#9e1b1e] text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {variant.weight}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Actions Footer */}
        <div className="mt-2.5 pt-2 border-t border-stone-100">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">₹{currentPrice}</span>
              {currentMrp > currentPrice && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through font-medium">₹{currentMrp}</span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-stone-500 font-bold">{selectedWeight}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 rounded-lg font-bold text-[10px] sm:text-xs transition-all border border-stone-200/80 ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-transparent'
                  : 'bg-stone-100/90 hover:bg-stone-200/90 text-stone-800 hover:text-stone-950 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-[#166534]" />
              <span className="truncate">Add</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`group/btn relative overflow-hidden flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 rounded-lg font-bold text-[10px] sm:text-xs text-white transition-all shadow-2xs active:scale-95 ${
                isOutOfStock
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                  : 'bg-linear-to-r from-[#9e1b1e] via-[#b91c1c] to-[#c2410c] hover:from-[#881316] hover:via-[#9e1b1e] hover:to-[#b91c1c] shadow-red-950/20 hover:shadow-md'
              }`}
            >
              {!isOutOfStock && (
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-linear-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              )}
              <Zap className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" />
              <span className="tracking-tight whitespace-nowrap">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (product.is_featured) {
    return (
      <ShineBorder
        borderWidth={2}
        duration={4}
        gradient="from-amber-500 via-red-600 to-emerald-600"
        className="w-full h-full"
      >
        {cardContent}
      </ShineBorder>
    );
  }

  return cardContent;
}
