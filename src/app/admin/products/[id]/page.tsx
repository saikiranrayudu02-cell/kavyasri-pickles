'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Upload, ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DataStore } from '@/lib/data/store';
import { Product, SpiceLevel, DietaryType } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { logUserActivity } from '@/lib/supabase/activity';
import { ensureThreeVariants, calculateVariantPrices } from '@/lib/utils/pricing';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('cat-veg');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(249);
  const [mrp, setMrp] = useState<number>(299);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [sku, setSku] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Hot');
  const [dietary, setDietary] = useState<DietaryType>('veg');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const loadProduct = async () => {
    setLoading(true);
    if (productId && isSupabaseConfigured && supabase) {
      try {
        const { data: dbProd, error } = await supabase
          .from('products')
          .select('*')
          .filter('id', 'eq', productId)
          .maybeSingle();

        if (!error && dbProd) {
          const mapped: Product = {
            id: dbProd.id,
            category_id: dbProd.category_id || 'cat-veg',
            category_name: dbProd.category_name || 'Traditional Pickles',
            name: dbProd.name,
            slug: dbProd.slug,
            short_description: dbProd.short_description || '',
            description: dbProd.description || '',
            price: Number(dbProd.price),
            mrp: Number(dbProd.mrp),
            discount_percent: Number(dbProd.discount_percent || 0),
            weight: dbProd.weight || '250g',
            stock_quantity: Number(dbProd.stock_quantity || 0),
            sku: dbProd.sku || '',
            spice_level: (dbProd.spice_level as SpiceLevel) || 'Hot',
            dietary: (dbProd.dietary as DietaryType) || 'veg',
            shelf_life: dbProd.shelf_life || '12 Months',
            storage_instructions: dbProd.storage_instructions || '',
            ingredients: dbProd.ingredients || [],
            images: dbProd.images && dbProd.images.length > 0 ? dbProd.images : ['/images/pickles/hero.jpg'],
            is_featured: Boolean(dbProd.is_featured),
            is_active: Boolean(dbProd.is_active),
            rating: Number(dbProd.rating || 4.8),
            reviews_count: Number(dbProd.reviews_count || 0),
            variants: [
              { id: `var-${dbProd.id}-250`, product_id: dbProd.id, weight: '250g', price: Number(dbProd.price), mrp: Number(dbProd.mrp), stock_quantity: Number(dbProd.stock_quantity || 0) },
            ],
            created_at: dbProd.created_at,
          };

          setProduct(mapped);
          setName(mapped.name);
          setSlug(mapped.slug);
          setCategoryId(mapped.category_id);
          setShortDescription(mapped.short_description);
          setDescription(mapped.description);
          setPrice(mapped.price);
          setMrp(mapped.mrp);
          setStockQuantity(mapped.stock_quantity);
          setSku(mapped.sku);
          setSpiceLevel(mapped.spice_level);
          setDietary(mapped.dietary);
          setImageUrl(mapped.images[0] || '/images/pickles/hero.jpg');
          setIsFeatured(mapped.is_featured);
          setIsActive(mapped.is_active);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching product from Supabase:', err);
      }
    }

    if (productId) {
      const found = DataStore.getProductById(productId);
      if (found) {
        setProduct(found);
        setName(found.name);
        setSlug(found.slug);
        setCategoryId(found.category_id);
        setShortDescription(found.short_description);
        setDescription(found.description);
        setPrice(found.price);
        setMrp(found.mrp);
        setStockQuantity(found.stock_quantity);
        setSku(found.sku);
        setSpiceLevel(found.spice_level);
        setDietary(found.dietary);
        setImageUrl(found.images[0] || '/images/pickles/hero.jpg');
        setIsFeatured(found.is_featured);
        setIsActive(found.is_active);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

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

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-stone-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">Product not found.</p>
        <Link href="/admin/products" className="text-xs text-[#166534] font-bold mt-2 inline-block">
          Return to Products
        </Link>
      </div>
    );
  }

  const handleUpdate = async () => {
    const categories = DataStore.getCategories();
    const cat = categories.find((c) => c.id === categoryId);

    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const variants = ensureThreeVariants(product.id, price, mrp, stockQuantity);

    const updated: Product = {
      ...product,
      name,
      slug,
      category_id: categoryId,
      category_name: cat?.name || product.category_name,
      short_description: shortDescription,
      description,
      price: Number(price),
      mrp: Number(mrp),
      discount_percent: discountPercent,
      stock_quantity: Number(stockQuantity),
      sku,
      spice_level: spiceLevel,
      dietary,
      images: [imageUrl, ...(product.images.slice(1) || [])],
      is_featured: isFeatured,
      is_active: isActive,
      variants,
    };

    DataStore.saveProduct(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const validCatId = categoryId && categoryId.length === 36 ? categoryId : null;
        await supabase.from('products').upsert({
          id: product.id,
          category_id: validCatId,
          name,
          slug,
          short_description: shortDescription,
          description,
          price: Number(price),
          mrp: Number(mrp),
          discount_percent: discountPercent,
          stock_quantity: Number(stockQuantity),
          sku,
          spice_level: spiceLevel,
          dietary,
          images: [imageUrl, ...(product.images.slice(1) || [])],
          is_featured: isFeatured,
          is_active: isActive,
        });
      } catch (err) {
        console.error('Error updating product in Supabase:', err);
      }
    }

    logUserActivity({
      action: 'PRODUCT_UPDATE',
      user_email: 'kavya123@gmail.com',
      details: { product_id: product.id, name, price, stock_quantity: stockQuantity, is_active: isActive },
    });

    showToast(`Updated ${name} successfully!`, 'success');
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
                Edit Mode
              </span>
              <span className="text-[10px] text-stone-400 font-mono">ID: {product.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-0.5">Edit Pickle: {name}</h1>
            <p className="text-xs text-stone-500 font-medium">Modify recipe details, pricing, and active status.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="px-6 py-2.5 bg-linear-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white rounded-2xl text-xs font-semibold shadow-[0_4px_16px_rgba(22,101,52,0.25)] transition-all active:scale-95 flex items-center gap-1.5 self-end sm:self-auto"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
              <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                Product Image & Media
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Active Cover
              </span>
            </div>

            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100/80 border border-stone-200/80 shadow-inner group">
              <Image src={imageUrl} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[10px] text-white font-medium bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                  Current Photo
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

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">Or Select Photo Preset:</label>
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
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200/60 pb-3 tracking-tight">
              Store Visibility
            </h3>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/60 border border-stone-200/50">
              <div>
                <span className="text-xs font-bold text-stone-800 block">Visible in Public Store</span>
                <span className="text-[10px] text-stone-500">Show item in catalog</span>
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
                <span className="text-[10px] text-stone-500">Pin item to top sections</span>
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

        {/* Right Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-200/60 pb-3 tracking-tight">
              General Product Specifications
            </h3>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Pickle Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-medium transition-all text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-mono text-stone-700 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">1 KG Base Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-emerald-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">1 KG Base MRP (₹)</label>
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 text-stone-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/30 font-bold text-stone-900"
                />
              </div>
            </div>

            {/* Auto-Calculated Weight Variants Preview */}
            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/60 space-y-2.5">
              <span className="text-xs font-bold text-stone-900 block border-b border-stone-200/50 pb-1.5">
                ⚖️ Auto-Calculated Weight Variant Pricing
              </span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">250g Jar (25%)</span>
                  <span className="font-extrabold text-[#166534] text-sm">₹{calculateVariantPrices(price, mrp).price250g}</span>
                  <span className="text-[10px] text-stone-400 block line-through">MRP: ₹{calculateVariantPrices(price, mrp).mrp250g}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">500g Jar (50%)</span>
                  <span className="font-extrabold text-[#166534] text-sm">₹{calculateVariantPrices(price, mrp).price500g}</span>
                  <span className="text-[10px] text-stone-400 block line-through">MRP: ₹{calculateVariantPrices(price, mrp).mrp500g}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border-2 border-[#166534] text-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#166534] block">1 KG Jar (Base)</span>
                  <span className="font-extrabold text-[#166534] text-sm">₹{calculateVariantPrices(price, mrp).price1kg}</span>
                  <span className="text-[10px] text-stone-400 block line-through">MRP: ₹{calculateVariantPrices(price, mrp).mrp1kg}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Short Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-2xl border border-stone-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#166534]/30 transition-all text-stone-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
