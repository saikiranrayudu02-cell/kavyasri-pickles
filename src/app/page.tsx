'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Flame,
  ShieldCheck,
  Award,
  Truck,
  HeartHandshake,
  Star,
  CheckCircle2,
  Leaf,
  Sun,
  PackageCheck,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SocialFloatingWidget from '@/components/layout/SocialFloatingWidget';
import ProductCard from '@/components/product/ProductCard';
import { DataStore } from '@/lib/data/store';
import { Product, Category } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setProducts(DataStore.getProducts().filter((p) => p.is_active));
    setCategories(DataStore.getCategories().filter((c) => c.is_active));
  }, []);

  const featuredPickles = products.filter((p) => p.is_featured).slice(0, 6);
  const bestsellers = products.slice(0, 4);

  // Scroll reveal observer
  const revealRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.02, rootMargin: '60px 0px 60px 0px' }
    );
    node.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      <Navbar />

      <main className="flex-1" ref={revealRef}>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-linear-to-b from-[#f5ede0] via-[#faf7f2] to-[#faf7f2] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#ede5d8]">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#9e1b1e_1px,transparent_1px)] bg-size-[16px_16px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
                <div className="animate-fade-in-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Handmade in Small Batches • Zero Preservatives</span>
                </div>

                <h1 className="animate-fade-in-up stagger-1 font-rounded text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.10]">
                  <span className="block font-bold tracking-tight text-stone-900">
                    Traditional Taste
                  </span>
                  <span className="block mt-1 sm:mt-2 font-bold bg-linear-to-r from-[#9e1b1e] via-[#c2410c] to-[#d97706] bg-clip-text text-transparent tracking-tight">
                    Homemade Love.
                  </span>
                </h1>

                <p className="animate-fade-in-up stagger-2 text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Authentic homemade pickles crafted with 70-year-old traditional family recipes, pure cold-pressed oils, sun-cured spices, and carefully selected hand-cut ingredients.
                </p>

                <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white font-semibold rounded-2xl shadow-md shadow-red-900/20 flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] btn-press text-sm sm:text-base"
                  >
                    <span>Shop All Pickles</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    href="/shop?category=cat-combos"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-stone-50 text-stone-900 font-semibold rounded-2xl border-2 border-stone-300 flex items-center justify-center gap-2 transition-colors shadow-xs text-sm sm:text-base"
                  >
                    <span>Explore Gift Combos</span>
                  </Link>
                </div>

                {/* Trust Highlights */}
                <div className="animate-fade-in-up stagger-4 grid grid-cols-3 gap-2 sm:gap-3 pt-6 border-t border-stone-200/80 max-w-md mx-auto lg:mx-0 text-left">
                  <div>
                    <div className="text-base xs:text-lg font-bold text-[#9e1b1e]">70+ Yrs</div>
                    <div className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight">Heirloom Recipe</div>
                  </div>
                  <div>
                    <div className="text-base xs:text-lg font-bold text-[#d97706]">10,000+</div>
                    <div className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight">Jars Shipped</div>
                  </div>
                  <div>
                    <div className="text-base xs:text-lg font-bold text-emerald-700">4.9 ★</div>
                    <div className="text-[10px] sm:text-xs text-stone-500 font-medium leading-tight">Customer Rating</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative animate-fade-in-up stagger-3">
                <div className="relative mx-auto max-w-lg lg:max-w-none">
                  {/* Decorative Glow */}
                  <div className="absolute -inset-4 bg-linear-to-tr from-amber-400/20 via-red-500/20 to-amber-300/20 rounded-3xl blur-2xl -z-10" />

                  {/* Main Hero Image */}
                  <div className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200">
                    <Image
                      src="/images/pickles/hero.jpg"
                      alt="Traditional Indian Pickles Spread in ceramic martaban jars"
                      fill
                      priority
                      className="object-cover object-center transform hover:scale-103 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SHOWCASE */}
        <section className="py-16 bg-white border-b border-[#ede5d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
              <span className="text-xs font-semibold tracking-widest text-[#9e1b1e] uppercase">
                Handcrafted Varieties
              </span>
              <h2 className="font-rounded text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mt-1 tracking-tight">
                Explore By Category
              </h2>
              <p className="text-sm text-stone-500 mt-2">
                From fiery Andhra gongura to succulent chicken pickles and tangy sun-cured lemons.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 reveal-on-scroll">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.id}`}
                  className="group flex flex-col items-center text-center p-3 xs:p-4 rounded-2xl bg-[#faf7f2] hover:bg-amber-50/60 border border-stone-200/80 hover:border-[#d97706] shadow-2xs hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <div className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-2.5 sm:mb-3 border-2 border-amber-200/80 group-hover:border-[#9e1b1e] transition-colors shadow-inner shrink-0">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-rounded font-semibold text-sm text-stone-900 group-hover:text-[#9e1b1e] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 group-hover:text-[#d97706] font-medium">
                    Explore Jars <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED BESTSELLERS */}
        <section className="py-16 bg-[#faf7f2] border-b border-[#ede5d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 reveal-on-scroll">
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#9e1b1e] uppercase">
                  Most Loved Delicacies
                </span>
                <h2 className="font-rounded text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mt-1 tracking-tight">
                  Signature Homemade Pickles
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#9e1b1e] hover:text-[#7f1d1d] mt-3 sm:mt-0 group"
              >
                <span>View All 12 Pickles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 reveal-on-scroll">
              {featuredPickles.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* WHY KAVYASRI PICKLES? (Brand USP) */}
        <section className="py-20 bg-linear-to-b from-[#faf7f2] via-[#f5efe4] to-[#faf7f2] border-b border-[#ede5d8] relative overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-red-200/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9e1b1e]/10 border border-[#9e1b1e]/20 text-[#9e1b1e] text-xs font-bold tracking-widest uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b1e] animate-pulse" />
                The Kavyasri Promise
              </div>
              <h2 className="font-rounded text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
                Why Our Pickles Taste Like Home
              </h2>
              <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-[#9e1b1e] to-transparent mx-auto my-4" />
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We refuse to cut corners. No commercial chemicals, no artificial acidity, and no shortcuts.
              </p>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 reveal-on-scroll">
              {/* Card 1 */}
              <div className="group relative bg-white/90 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#9e1b1e] group-hover:bg-[#9e1b1e] group-hover:text-white group-hover:border-[#9e1b1e] transition-all duration-300 shadow-sm group-hover:scale-110">
                    <Award className="w-6 h-6 stroke-2" />
                  </div>
                  <span className="font-rounded text-2xl font-bold text-stone-300 group-hover:text-amber-500/40 transition-colors">01</span>
                </div>
                <h3 className="font-rounded font-bold text-xl text-stone-900 mb-2 group-hover:text-[#9e1b1e] transition-colors">
                  Homemade Taste
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Every jar is prepared in authentic home kitchens in small batches using traditional pestle & mortar spice pounding.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-white/90 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#d97706] group-hover:bg-[#d97706] group-hover:text-white group-hover:border-[#d97706] transition-all duration-300 shadow-sm group-hover:scale-110">
                    <Leaf className="w-6 h-6 stroke-2" />
                  </div>
                  <span className="font-rounded text-2xl font-bold text-stone-300 group-hover:text-amber-500/40 transition-colors">02</span>
                </div>
                <h3 className="font-rounded font-bold text-xl text-stone-900 mb-2 group-hover:text-[#d97706] transition-colors">
                  Quality Ingredients
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Cold-pressed gingelly & mustard oils, sun-dried Guntur chillies, and hand-picked fresh produce straight from local farms.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-white/90 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700 transition-all duration-300 shadow-sm group-hover:scale-110">
                    <HeartHandshake className="w-6 h-6 stroke-2" />
                  </div>
                  <span className="font-rounded text-2xl font-bold text-stone-300 group-hover:text-amber-500/40 transition-colors">03</span>
                </div>
                <h3 className="font-rounded font-bold text-xl text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  Traditional Recipes
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Passed down across three generations of master culinary grandmothers from the fertile Andhra & Telangana heartlands.
                </p>
              </div>

              {/* Card 4 */}
              <div className="group relative bg-white/90 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300 shadow-sm group-hover:scale-110">
                    <Sun className="w-6 h-6 stroke-2" />
                  </div>
                  <span className="font-rounded text-2xl font-bold text-stone-300 group-hover:text-amber-500/40 transition-colors">04</span>
                </div>
                <h3 className="font-rounded font-bold text-xl text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                  Freshly Prepared
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Never mass-produced in giant warehouses. Each batch is aged naturally under the sun to perfection.
                </p>
              </div>

              {/* Card 5 */}
              <div className="group relative bg-white/90 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-sky-700 group-hover:bg-sky-700 group-hover:text-white group-hover:border-sky-700 transition-all duration-300 shadow-sm group-hover:scale-110">
                    <PackageCheck className="w-6 h-6 stroke-2" />
                  </div>
                  <span className="font-rounded text-2xl font-bold text-stone-300 group-hover:text-amber-500/40 transition-colors">05</span>
                </div>
                <h3 className="font-rounded font-bold text-xl text-stone-900 mb-2 group-hover:text-sky-700 transition-colors">
                  Hygienically Packed
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Packed in food-grade, leak-proof jars with tamper-evident seals and triple-layer protective bubble cushioning.
                </p>
              </div>

              {/* Card 6 */}
              <div className="group relative bg-white/90 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-purple-700 group-hover:bg-purple-700 group-hover:text-white group-hover:border-purple-700 transition-all duration-300 shadow-sm group-hover:scale-110">
                    <Truck className="w-6 h-6 stroke-2" />
                  </div>
                  <span className="font-rounded text-2xl font-bold text-stone-300 group-hover:text-amber-500/40 transition-colors">06</span>
                </div>
                <h3 className="font-rounded font-bold text-xl text-stone-900 mb-2 group-hover:text-purple-700 transition-colors">
                  Delivered to Your Door
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Speedy, insured express delivery across all pin codes in India with real-time tracking from kitchen to doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SPICE LEVEL GUIDE */}
        <section className="py-14 bg-[#fffdfa] border-b border-[#ede5d8]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest text-[#d97706] uppercase">
                Find Your Perfect Heat
              </span>
              <h2 className="font-rounded text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tracking-tight">
                Kavyasri Spice Level Guide
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { level: 'Mild', desc: 'Gentle warming spice, perfect for kids and mild palates.', pickles: 'Lemon, Amla' },
                { level: 'Medium', desc: 'Balanced everyday Indian warmth and tang.', pickles: 'Tomato, Ginger' },
                { level: 'Hot', desc: 'Authentic South Indian kick with roasted chillies.', pickles: 'Gongura, Chicken, Garlic' },
                { level: 'Extra Hot', desc: 'Bold Guntur chili punch for real spice lovers.', pickles: 'Avakaya Mango, Mutton' },
                { level: 'Fiery', desc: 'Extreme Andhra heat with cold-pressed mustard oil.', pickles: 'Ghost Chili Special' },
              ].map((item, idx) => (
                <div key={item.level} className="p-4 rounded-xl bg-[#faf7f2] border border-stone-200 text-center">
                  <div className="flex justify-center mb-2">
                    {[...Array(idx + 1)].map((_, i) => (
                      <Flame key={i} className="w-4 h-4 text-[#9e1b1e] fill-current" />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">{item.level}</h4>
                  <p className="text-[11px] text-stone-500 mt-1">{item.desc}</p>
                  <p className="text-[10px] text-[#9e1b1e] font-semibold mt-2">Try: {item.pickles}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="py-16 bg-white border-b border-[#ede5d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
              <span className="text-xs font-bold tracking-widest text-[#9e1b1e] uppercase">
                Customer Stories
              </span>
              <h2 className="font-rounded text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 mt-1 tracking-tight">
                Loved by 10,000+ Food Lovers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-on-scroll">
              {[
                {
                  name: 'Ananya Sharma',
                  location: 'Hyderabad, Telangana',
                  text: 'Tastes exactly like how my Ammamma used to prepare it in Godavari district! The crunch of the mango kernel and the fragrant cold-pressed oil is divine.',
                  pickle: 'Andhra Avakaya Mango Pickle',
                },
                {
                  name: 'Vikram Reddy',
                  location: 'Bengaluru, Karnataka',
                  text: 'The Country Chicken pickle is unbelievable. Tender boneless chunks with crispy fried curry leaves. I have already reordered 3 jars for my family!',
                  pickle: 'Country Style Chicken Pickle',
                },
                {
                  name: 'Sowmya Iyer',
                  location: 'Chennai, Tamil Nadu',
                  text: 'Pure nostalgic Gongura pachadi. Having it with steaming hot rice and a spoonful of melted desi ghee is the ultimate comfort food.',
                  pickle: 'Authentic Andhra Gongura',
                },
              ].map((rev, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(5)].map((_, star) => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-700 italic leading-relaxed mb-4">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200">
                    <div className="font-bold text-xs text-stone-900">{rev.name}</div>
                    <div className="text-[11px] text-stone-400">{rev.location}</div>
                    <div className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Buyer • {rev.pickle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER (Simple, Aesthetic & Modern) */}
        <section className="py-16 sm:py-20 bg-[#faf7f2] border-t border-b border-[#ede5d8] relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#9e1b1e]/8 text-[#9e1b1e] border border-[#9e1b1e]/20 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b1e]" />
              Authentic Kitchen Tradition
            </span>

            <h2 className="font-rounded text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Handcrafted Homemade Pickles Delivered Fresh to Your Doorstep.
            </h2>

            <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Order today and experience 100% natural, sun-cured pickles prepared in small home batches with pure wood-pressed oils and zero artificial preservatives.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#9e1b1e] hover:bg-[#800f13] text-white font-bold rounded-xl shadow-md transition-all text-sm group"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SocialFloatingWidget />
    </div>
  );
}
