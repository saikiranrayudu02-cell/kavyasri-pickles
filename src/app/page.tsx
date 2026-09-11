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
  Sparkles,
  Star,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
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
                  <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Handmade in Small Batches • Zero Preservatives</span>
                </div>

                <h1 className="animate-fade-in-up stagger-1 font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1c1917] tracking-tight leading-[1.15]">
                  Traditional Taste.{' '}
                  <span className="text-[#9e1b1e] block mt-1">Homemade Love.</span>
                </h1>

                <p className="animate-fade-in-up stagger-2 text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Authentic homemade pickles crafted with 70-year-old traditional family recipes, pure cold-pressed oils, sun-cured spices, and carefully selected hand-cut ingredients.
                </p>

                <div className="animate-fade-in-up stagger-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto px-8 py-4 bg-[#9e1b1e] hover:bg-[#7f1d1d] text-white font-bold rounded-2xl shadow-lg shadow-red-900/25 flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] btn-press"
                  >
                    <span>Shop All Pickles</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/shop?category=cat-combos"
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-stone-900 font-bold rounded-2xl border-2 border-stone-300 flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Explore Gift Combos</span>
                  </Link>
                </div>

                {/* Trust Highlights */}
                <div className="animate-fade-in-up stagger-4 grid grid-cols-3 gap-3 pt-6 border-t border-stone-200/80 max-w-md mx-auto lg:mx-0 text-left">
                  <div>
                    <div className="text-xl font-extrabold text-[#9e1b1e]">70+ Yrs</div>
                    <div className="text-xs text-stone-500 font-medium">Heirloom Recipe</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-[#d97706]">10,000+</div>
                    <div className="text-xs text-stone-500 font-medium">Jars Shipped</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-emerald-700">4.9 ★</div>
                    <div className="text-xs text-stone-500 font-medium">Customer Rating</div>
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
              <span className="text-xs font-bold tracking-widest text-[#9e1b1e] uppercase">
                Handcrafted Varieties
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
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
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#faf7f2] hover:bg-amber-50/60 border border-stone-200/80 hover:border-[#d97706] shadow-2xs hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-amber-200/80 group-hover:border-[#9e1b1e] transition-colors shadow-inner">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-900 group-hover:text-[#9e1b1e] transition-colors">
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
                <span className="text-xs font-bold tracking-widest text-[#9e1b1e] uppercase">
                  Most Loved Delicacies
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
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
        <section className="py-16 bg-white border-b border-[#ede5d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2 reveal-on-scroll">
              <span className="text-xs font-bold tracking-widest text-[#9e1b1e] uppercase">
                The Kavyasri Promise
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Why Our Pickles Taste Like Home
              </h2>
              <p className="text-sm text-stone-500 mt-2">
                We refuse to cut corners. No commercial chemicals, no artificial acidity, and no shortcuts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-on-scroll">
              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200/90 hover:border-amber-400 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-[#9e1b1e] mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Homemade Taste</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every jar is prepared in authentic home kitchens in small batches using traditional pestle & mortar spice pounding.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200/90 hover:border-amber-400 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-[#d97706] mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Quality Ingredients</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Cold-pressed gingelly & mustard oils, sun-dried Guntur chillies, and hand-picked fresh produce straight from local farms.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200/90 hover:border-amber-400 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Traditional Recipes</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Passed down across three generations of master culinary grandmothers from the fertile Andhra & Telangana heartlands.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200/90 hover:border-amber-400 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Freshly Prepared</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Never mass-produced in giant warehouses. Each batch is aged naturally under the sun to perfection.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200/90 hover:border-amber-400 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Hygienically Packed</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Packed in food-grade, leak-proof jars with tamper-evident seals and triple-layer protective bubble cushioning.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#faf7f2] border border-stone-200/90 hover:border-amber-400 transition-all duration-300 card-hover">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Delivered to Your Door</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
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
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
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
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
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

        {/* CTA BANNER */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#2b080a] via-[#450e12] to-[#230507] text-white py-16 sm:py-20 border-t border-b border-[#5c151a]">
          {/* Subtle Ambient Glow Blobs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-widest shadow-xs">
              Fresh Batches Ready To Ship
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-100">
              Bring the Taste of Homemade Pickles to Your Home.
            </h2>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
              Order today and experience authentic Indian heritage flavor crafted with fresh spices, pure wood-pressed oils, and zero preservatives.
            </p>

            <div className="pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#9e1b1e] hover:bg-[#b91c1c] text-white font-extrabold rounded-2xl shadow-2xl shadow-red-950/60 border border-red-500/30 transition-all duration-300 hover:scale-105 active:scale-98 text-base"
              >
                <span>Shop Now & Get Free Delivery</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
