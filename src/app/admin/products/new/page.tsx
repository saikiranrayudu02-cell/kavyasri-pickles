'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Product, SpiceLevel, DietaryType, ProductVariant } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

export default function AddProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('cat-veg');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(249);
  const [mrp, setMrp] = useState<number>(299);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [sku, setSku] = useState('');
  const [weight, setWeight] = useState('250g');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Hot');
  const [dietary, setDietary] = useState<DietaryType>('veg');
  const [shelfLife, setShelfLife] = useState('12 Months');
  const [storageInstructions, setStorageInstructions] = useState(
    'Store in a cool, dry place. Use only a dry spoon. Keep the jar lid tightly closed.'
  );
  const [ingredientsText, setIngredientsText] = useState(
    'Cold-Pressed Sesame Oil, Red Chilli Powder, Mustard Seeds, Garlic, Rock Salt'
  );
  const [imageUrl, setImageUrl] = useState('/images/pickles/mango.jpg');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug and SKU
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
    if (!sku) {
      setSku(`KP-${val.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Photo size should be less than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          showToast('Local photo loaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    setIsSaving(true);
    const categories = DataStore.getCategories();
    const cat = categories.find((c) => c.id === categoryId);

    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const newProdId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`;

    const variants: ProductVariant[] = [
      { id: `var-${newProdId}-250`, product_id: newProdId, weight: '250g', price, mrp, stock_quantity: stockQuantity },
      { id: `var-${newProdId}-500`, product_id: newProdId, weight: '500g', price: Math.round(price * 1.8), mrp: Math.round(mrp * 1.8), stock_quantity: Math.round(stockQuantity * 0.7) },
      { id: `var-${newProdId}-1kg`, product_id: newProdId, weight: '1kg', price: Math.round(price * 3.4), mrp: Math.round(mrp * 3.4), stock_quantity: Math.round(stockQuantity * 0.4) },
    ];

    const newProduct: Product = {
      id: newProdId,
      category_id: categoryId,
      category_name: cat?.name || 'Traditional Pickles',
      name,
      slug: slug || `pickle-${Date.now()}`,
      short_description: shortDescription || 'Authentic homemade pickle.',
      description: description || 'Crafted with traditional recipes and sun-cured spices.',
      price: Number(price),
      mrp: Number(mrp),
      discount_percent: discountPercent,
      weight,
      stock_quantity: Number(stockQuantity),
      sku: sku || `KP-GEN-${Date.now().toString().slice(-4)}`,
      spice_level: spiceLevel,
      dietary,
      shelf_life: shelfLife,
      storage_instructions: storageInstructions,
      ingredients: ingredientsText.split(',').map((s) => s.trim()).filter(Boolean),
      images: [imageUrl, '/images/pickles/hero.jpg'],
      is_featured: isFeatured,
      is_active: publish,
      rating: 5.0,
      reviews_count: 1,
      variants,
      created_at: new Date().toISOString(),
    };

    DataStore.saveProduct(newProduct);

    if (isSupabaseConfigured && supabase) {
      try {
        const validCatId = categoryId && categoryId.length === 36 ? categoryId : null;
        const { error: dbErr } = await supabase.from('products').upsert({
          id: newProdId,
          category_id: validCatId,
          name,
          slug: slug || `pickle-${Date.now()}`,
          short_description: shortDescription,
          description,
          price: Number(price),
          mrp: Number(mrp),
          discount_percent: discountPercent,
          weight,
          stock_quantity: Number(stockQuantity),
          sku,
          spice_level: spiceLevel,
          dietary,
          shelf_life: shelfLife,
          storage_instructions: storageInstructions,
          ingredients: ingredientsText.split(',').map((s) => s.trim()).filter(Boolean),
          images: [imageUrl, '/images/pickles/hero.jpg'],
          is_featured: isFeatured,
          is_active: publish,
          rating: 5.0,
          reviews_count: 1,
        });

        if (dbErr) console.error('Supabase product save error:', dbErr.message);
      } catch (err) {
        console.error('Error saving product to Supabase:', err);
      }
    }

    setIsSaving(false);
    showToast(`Successfully created ${name}!`, 'success');
    router.push('/admin/products');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-2xl border border-white/80 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/products"
            className="p-2.5 bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 rounded-2xl transition-all duration-200 active:scale-95 border border-stone-200/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                New Catalogue Entry
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">Add New Pickle Product</h1>
            <p className="text-xs text-stone-500 font-medium">Create a new authentic heirloom recipe for your store catalogue.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2.5 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200/80 text-stone-700 rounded-2xl text-xs font-semibold transition-all active:scale-95 shadow-2xs"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-5 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold shadow-[0_4px_16px_rgba(22,101,52,0.25)] transition-all active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isSaving ? 'Saving Recipe...' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media & Imagery (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                Product Image & Media
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Primary Photo
              </span>
            </div>

            {/* Current Preview */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100/80 border border-stone-200/80 shadow-inner group">
              <Image src={imageUrl} alt="Pickle Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[10px] text-white font-medium bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                  Active Preview
                </span>
              </div>
            </div>

            {/* Local Storage Photo Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 block">
                📁 Upload Photo from Device:
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-300/80 hover:border-[#166534] bg-stone-50/50 hover:bg-emerald-50/30 rounded-2xl cursor-pointer transition-all p-3 text-center group">
                <Upload className="w-5 h-5 text-[#166534] group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-xs font-semibold text-stone-900">
                  Select photo from computer
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  PNG, JPG, WEBP, SVG (Saved to Supabase)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Pick presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Or Select Photo Preset:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Mango', url: '/images/pickles/mango.jpg' },
                  { label: 'Gongura', url: '/images/pickles/gongura.jpg' },
                  { label: 'Chicken', url: '/images/pickles/chicken.jpg' },
                  { label: 'Lemon', url: '/images/pickles/lemon.jpg' },
                  { label: 'Garlic', url: '/images/pickles/garlic.jpg' },
                  { label: 'Tomato', url: '/images/pickles/tomato.jpg' },
                  { label: 'Mutton', url: '/images/pickles/mutton.jpg' },
                  { label: 'Platter', url: '/images/pickles/hero.jpg' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setImageUrl(item.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                      imageUrl === item.url ? 'border-[#166534] ring-3 ring-emerald-500/20 shadow-xs' : 'border-stone-200/70 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={item.url} alt={item.label} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Image Source Path / URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /images/pickles/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all font-mono text-stone-700"
              />
            </div>
          </div>

          {/* Visibility & Badges */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200/60 pb-3 tracking-tight">
              Store Visibility
            </h3>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/60 border border-stone-200/50">
              <div>
                <span className="text-xs font-bold text-stone-800 block">Active Status</span>
                <span className="text-[10px] text-stone-500">Show product in public store listing</span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#166534] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/60 border border-stone-200/50">
              <div>
                <span className="text-xs font-bold text-stone-800 block">Featured Bestseller</span>
                <span className="text-[10px] text-stone-500">Pin product on homepage & recommendations</span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#166534] w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Product Information (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-200/60 pb-3">
              <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                Basic Pickle Information
              </h3>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Pickle Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Traditional Andhra Avakaya Mango Pickle"
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="andhra-avakaya-mango-pickle"
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-600 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium text-stone-800 transition-all"
                >
                  <option value="cat-veg">Traditional Veg Pickles</option>
                  <option value="cat-nonveg">Authentic Non-Veg Pickles</option>
                  <option value="cat-andhra">Spicy Andhra Delights</option>
                  <option value="cat-seasonal">Seasonal & Gourmet Specials</option>
                  <option value="cat-combos">Handcrafted Combo Jars</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Short Description (Card snippet)</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Sun-cured raw mangoes in cold-pressed sesame oil with stone-ground chillies."
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Full Story & Recipe Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the heirloom recipe, traditional process, and taste nuances..."
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all text-stone-800"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-200/60 pb-3">
              <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                Pricing & Inventory Dynamics
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-emerald-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">MRP (₹)</label>
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 text-stone-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="KP-MNG-250"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pickle Specific Details */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-200/60 pb-3">
              <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                Authentic Recipe Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Spice Heat Level</label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Hot">Hot</option>
                  <option value="Extra Hot">Extra Hot</option>
                  <option value="Fiery">Fiery</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Dietary Type</label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value as DietaryType)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Shelf Life</label>
                <input
                  type="text"
                  value={shelfLife}
                  onChange={(e) => setShelfLife(e.target.value)}
                  placeholder="12 Months"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Ingredients (comma-separated)</label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Mango, Cold-Pressed Sesame Oil, Mustard, Red Chilli, Garlic, Salt"
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all text-stone-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Storage Instructions</label>
              <input
                type="text"
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all text-stone-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
