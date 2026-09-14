'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  Award,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import SubpageHeader from '@/components/layout/SubpageHeader';
import SpiceMeter from '@/components/product/SpiceMeter';
import DietaryBadge from '@/components/product/DietaryBadge';
import ProductCard from '@/components/product/ProductCard';
import { DataStore } from '@/lib/data/store';
import { Product, Review } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { user } = useAuth();
  const { addToCart, startBuyNow } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'storage' | 'reviews'>('details');

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const found = DataStore.getProductBySlug(slug);
    if (found) {
      setProduct(found);
      setSelectedImage(found.images[0] || '/images/pickles/hero.jpg');
      setSelectedWeight(found.variants?.[0]?.weight || found.weight || '250g');
      setReviews(DataStore.getReviews(found.id));
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2]">
        <SubpageHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif font-bold text-2xl text-stone-900 mb-2">Pickle Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">The requested product could not be found or has been archived.</p>
          <Link href="/shop" className="px-6 py-2.5 bg-[#166534] text-white rounded-xl text-xs font-bold">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.find((v) => v.weight === selectedWeight);
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentMrp = currentVariant ? currentVariant.mrp : product.mrp;
  const currentStock = currentVariant ? currentVariant.stock_quantity : product.stock_quantity;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 15;
  const isFavorited = isInWishlist(product.id);

  const discountPercent =
    currentMrp > currentPrice
      ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
      : product.discount_percent;

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please sign in to add items to your cart!', 'info');
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/products/${slug}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, selectedWeight, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      showToast('Please sign in to buy this product!', 'info');
      router.push(`/login?redirect=${encodeURIComponent('/checkout?mode=buynow')}`);
      return;
    }
    if (isOutOfStock) return;
    const item = startBuyNow(product, selectedWeight, quantity);
    if (item) {
      router.push('/checkout?mode=buynow');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      showToast('Please fill out your name and review message.', 'error');
      return;
    }
    setIsSubmittingReview(true);
    const newRev = DataStore.addReview({
      product_id: product.id,
      product_name: product.name,
      user_id: 'usr-customer',
      customer_name: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      is_approved: true,
      is_verified_purchase: true,
    });
    setReviews([newRev, ...reviews]);
    setReviewerName('');
    setReviewComment('');
    setIsSubmittingReview(false);
    showToast('Thank you! Your verified review has been posted.', 'success');
  };

  const relatedProducts = DataStore.getProducts()
    .filter((p) => p.id !== product.id && p.is_active)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] pb-16 sm:pb-0">
      <SubpageHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-10 pb-28 sm:pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4 sm:mb-6 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-[#166534] shrink-0">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <Link href="/shop" className="hover:text-[#166534] shrink-0">Shop</Link>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="text-stone-400 truncate max-w-40 xs:max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero: Gallery + Buying Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm">
          {/* Gallery Section (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <Image
                src={selectedImage || product.images[0] || '/images/pickles/hero.jpg'}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="bg-[#166534] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.is_featured && (
                  <span className="bg-[#d97706] text-white text-xs font-bold px-3 py-1 rounded-full shadow uppercase">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#166534] shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges below image */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free delivery on ₹{DataStore.getStoreSettings().free_shipping_threshold ?? 499}+</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>FSSAI Certified Kitchen</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Section (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Dietary & Heat */}
              <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                <span className="text-[#166534] font-bold uppercase tracking-wider">{product.category_name}</span>
                <span>•</span>
                <DietaryBadge type={product.dietary} showLabel size="md" />
                <span>•</span>
                <SpiceMeter level={product.spice_level} />
              </div>

              {/* Title */}
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-stone-900 ml-1 text-sm">{product.rating}</span>
                </div>
                <span className="text-stone-400 text-xs">({product.reviews_count} verified reviews)</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-medium">SKU: {product.sku}</span>
              </div>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-stone-700 mt-4 leading-relaxed font-normal">
                {product.short_description}
              </p>

              {/* Price Block */}
              <div className="mt-6 p-4 rounded-2xl bg-[#faf7f2] border border-stone-200/80 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">₹{currentPrice}</span>
                    {currentMrp > currentPrice && (
                      <span className="text-base sm:text-lg text-stone-400 line-through font-medium">₹{currentMrp}</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Save ₹{currentMrp - currentPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Inclusive of all taxes. Net quantity: {selectedWeight}.</p>
                </div>

                {/* Stock Indicator */}
                <div className="text-right">
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-red-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      Only {currentStock} left!
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ✓ In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Weight Variant Selector */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block mb-2">
                  Select Pack Size / Weight:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedWeight(v.weight);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                        selectedWeight === v.weight
                          ? 'border-[#166534] bg-emerald-50 text-[#166534] shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="text-sm">{v.weight}</div>
                      <div className="text-[11px] font-medium text-stone-500">₹{v.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider block mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-2 px-3 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-stone-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock || isOutOfStock}
                      className="p-2 px-3 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">Total: <strong>₹{currentPrice * quantity}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-stone-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="py-3.5 px-6 bg-stone-900 hover:bg-stone-950 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 text-sm transition-all shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 border border-stone-800"
                >
                  <ShoppingBag className="w-4 h-4 text-stone-300" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`group/buynow relative overflow-hidden py-3 px-6 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-98 disabled:opacity-50 ${
                    isOutOfStock
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                      : 'bg-linear-to-r from-[#9e1b1e] via-[#b91c1c] to-[#c2410c] hover:from-[#881316] hover:via-[#9e1b1e] hover:to-[#b91c1c] shadow-red-950/25 hover:shadow-xl hover:shadow-red-900/40 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Sweeping Shimmer Effect */}
                  {!isOutOfStock && (
                    <span className="absolute inset-0 -translate-x-full group-hover/buynow:translate-x-full transition-transform duration-700 ease-out bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  )}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.9)] group-hover/buynow:scale-125 group-hover/buynow:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-black tracking-wide uppercase">Buy Now</span>
                      <ArrowRight className="w-4 h-4 text-white/90 group-hover/buynow:translate-x-1 group-hover/buynow:text-white transition-all duration-200" />
                    </div>
                    <span className="text-[10px] text-amber-200/90 font-semibold tracking-tight mt-0.5">
                      ⚡ Instant 1-Click Checkout • COD Available
                    </span>
                  </div>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-stone-500">
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className="flex items-center gap-1.5 font-semibold hover:text-rose-600 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <div className="flex items-center gap-3 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#166534]" /> Safe Express Delivery
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> 100% Authentic
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Ingredients, Storage, Reviews) */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm">
          <div className="flex border-b border-stone-200 gap-4 sm:gap-10 overflow-x-auto no-scrollbar text-xs sm:text-sm font-bold -mx-1 px-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-[#166534] text-[#166534]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Description & Heritage
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'ingredients'
                  ? 'border-[#166534] text-[#166534]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Ingredients & Nutrition
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'storage'
                  ? 'border-[#166534] text-[#166534]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Storage & Shelf Life
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-[#166534] text-[#166534]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Verified Reviews ({reviews.length})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl text-sm text-stone-700 leading-relaxed">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200">
                    <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Traditional Method
                    </h4>
                    <p className="text-xs text-stone-500">Handcrafted in small batches of 25kg, sun-cured naturally without commercial speed-up ovens.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200">
                    <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Zero Preservatives
                    </h4>
                    <p className="text-xs text-stone-500">No sodium benzoate, no vinegar substitutes. Preserved purely by salt, turmeric, and wood-pressed oils.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4 max-w-3xl">
                <h4 className="font-extrabold text-base sm:text-lg text-stone-950 tracking-tight">What Goes Inside:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-[#faf7f2] border border-stone-200 text-xs font-semibold text-stone-800"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 mt-4">
                  <strong>Allergen Notice:</strong> Processed in a traditional facility that also handles mustard seeds, sesame, and tree nuts.
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4 max-w-3xl text-sm text-stone-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-200">
                    <span className="text-xs font-bold uppercase text-stone-400">Shelf Life</span>
                    <p className="font-bold text-stone-900 text-base mt-1">{product.shelf_life}</p>
                    <p className="text-xs text-stone-500 mt-1">From the date of packaging.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-200">
                    <span className="text-xs font-bold uppercase text-stone-400">Packaging</span>
                    <p className="font-bold text-stone-900 text-base mt-1">Vacuum-Sealed Food-Grade Jar</p>
                    <p className="text-xs text-stone-500 mt-1">Leak-proof and airtight cap seal.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs leading-relaxed">
                  <h4 className="font-bold text-stone-900 mb-1">Storage Instructions:</h4>
                  <p>{product.storage_instructions}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-3xl">
                {/* Write a Review form */}
                <div className="p-5 rounded-2xl bg-[#faf7f2] border border-stone-200">
                  <h4 className="font-extrabold text-stone-950 text-base sm:text-lg tracking-tight mb-3">Write a Customer Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Radhika K."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                        >
                          <option value="5">★★★★★ (5 - Outstanding)</option>
                          <option value="4">★★★★☆ (4 - Very Good)</option>
                          <option value="3">★★★☆☆ (3 - Good)</option>
                          <option value="2">★★☆☆☆ (2 - Average)</option>
                          <option value="1">★☆☆☆☆ (1 - Poor)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Your Honest Review</label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell us about the spice level, taste, aroma, and packaging..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-5 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold hover:bg-[#14532d]"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No reviews yet for this pickle. Be the first to review!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-white border border-stone-100 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900">{rev.customer_name}</span>
                            {rev.is_verified_purchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">{rev.created_at}</span>
                        </div>
                        <div className="flex items-center text-amber-500 mt-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Pickles Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 mb-16 sm:mb-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-xl sm:text-2xl text-stone-950 tracking-tight">
                You May Also Relish
              </h3>
              <Link href="/shop" className="text-xs font-bold text-[#166534] hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Buy Now Floating Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200/90 px-3.5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5">
        <div className="min-w-0">
          <p className="text-xs font-bold text-stone-900 truncate">{product.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm font-black text-[#166534]">₹{currentPrice * quantity}</span>
            <span className="text-[10px] text-stone-500 font-medium">({selectedWeight})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors active:scale-95"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="group/mobbtn relative overflow-hidden py-2.5 px-4 rounded-xl font-black text-xs text-white bg-linear-to-r from-[#9e1b1e] via-[#b91c1c] to-[#c2410c] shadow-md shadow-red-950/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.9)]" />
            <span>Buy Now</span>
            <ArrowRight className="w-3 h-3 text-white/90" />
          </button>
        </div>
      </div>
    </div>
  );
}
