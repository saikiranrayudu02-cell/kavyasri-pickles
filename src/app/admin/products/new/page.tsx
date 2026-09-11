'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Upload,
  ArrowLeft,
  Sparkles,
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white rounded-xl border border-stone-200 text-stone-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">Add New Pickle Product</h1>
            <p className="text-xs text-stone-500">Create a new authentic recipe for your store catalogue.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-bold"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-5 py-2 bg-[#166534] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold shadow"
          >
            Publish Product
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media & Imagery (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
              Product Image
            </h3>

            {/* Current Preview */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <Image src={imageUrl} alt="Pickle Preview" fill className="object-cover" />
            </div>

            {/* Local Storage Photo Uploader */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 block">
                📁 Upload Photo from Device:
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-300 hover:border-[#166534] bg-[#faf7f2] hover:bg-emerald-50/30 rounded-2xl cursor-pointer transition-all p-3 text-center group">
                <Upload className="w-6 h-6 text-[#166534] group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-bold text-stone-900">
                  Click to select photo from computer
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
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

            {/* Quick Pick presets or Custom URL */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
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
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      imageUrl === item.url ? 'border-[#166534] ring-2 ring-emerald-100' : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={item.url} alt={item.label} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Image Source Path / Supabase Storage URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /images/pickles/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Visibility & Badges */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
              Visibility Settings
            </h3>

            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-stone-800">
              <span>Visible on Public Store</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#166534] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-stone-800">
              <span>Mark as Bestseller / Featured</span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#166534] w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Product Information (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
              1. Basic Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Pickle Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Traditional Andhra Avakaya Mango Pickle"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="andhra-avakaya-mango-pickle"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-mono text-stone-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white"
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
              <label className="text-xs font-semibold text-stone-700 block mb-1">Short Description (Card snippet)</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Sun-cured raw mangoes in cold-pressed sesame oil with stone-ground chillies."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Full Story & Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the heirloom recipe, traditional process, and taste nuances..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
              2. Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">MRP (₹)</label>
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="KP-MNG-250"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pickle Specific Details */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
              3. Pickle Recipe Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Spice Heat Level</label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Hot">Hot</option>
                  <option value="Extra Hot">Extra Hot</option>
                  <option value="Fiery">Fiery</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Dietary Type</label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value as DietaryType)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Shelf Life</label>
                <input
                  type="text"
                  value={shelfLife}
                  onChange={(e) => setShelfLife(e.target.value)}
                  placeholder="12 Months"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Ingredients (comma-separated)</label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Mango, Cold-Pressed Sesame Oil, Mustard, Red Chilli, Garlic, Salt"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Storage Instructions</label>
              <input
                type="text"
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
