'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon } from '@/lib/types';
import { DataStore } from '@/lib/data/store';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingRemaining: number;
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, variantWeight?: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  buyNowItem: CartItem | null;
  startBuyNow: (product: Product, variantWeight?: string, quantity?: number) => CartItem | null;
  clearBuyNow: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { showToast } = useToast();

  const settings = DataStore.getStoreSettings();
  const FREE_SHIPPING_THRESHOLD = settings.free_shipping_threshold || 499;
  const STANDARD_SHIPPING_FEE = settings.standard_shipping_fee || 50;

  // Clean versioned storage keys to isolate from any corrupt or stale legacy keys (v3)
  const cartKey = user?.id ? `kp_cart_v3_${user.id}` : 'kp_cart_v3_guest';
  const couponKey = user?.id ? `kp_coupon_v3_${user.id}` : 'kp_coupon_v3_guest';

  // Load cart from localStorage whenever user changes
  useEffect(() => {
    setHasLoaded(false);
    try {
      if (typeof window !== 'undefined') {
        // 1. Clean up any stale legacy test keys from previous versions (v1, v2, guest, undefined)
        const legacyStaticKeys = [
          'kp_cart_guest',
          'kp_cart_undefined',
          'kp_cart_v2_guest',
          'kp_cart_v2_undefined',
          'kp_coupon_guest',
          'kp_coupon_undefined',
          'kp_coupon_v2_guest',
          'kp_coupon_v2_undefined',
        ];
        legacyStaticKeys.forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch {
            // ignore
          }
        });

        // Purge any other legacy versioned keys
        try {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (
              key &&
              (key.startsWith('kp_cart_v1_') ||
                key.startsWith('kp_cart_v2_') ||
                key.startsWith('kp_coupon_v1_') ||
                key.startsWith('kp_coupon_v2_'))
            ) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // ignore
        }
      }

      // 2. Load legitimate user cart
      const saved = localStorage.getItem(cartKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item: any) =>
              item &&
              typeof item.id === 'string' &&
              typeof item.product_id === 'string' &&
              typeof item.price === 'number' &&
              item.price > 0 &&
              typeof item.quantity === 'number' &&
              item.quantity > 0
          );
          setItems(validItems);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }

      const savedCoupon = localStorage.getItem(couponKey);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } else {
        setAppliedCoupon(null);
      }

      // 3. Load active Buy Now item from sessionStorage only if on checkout
      if (typeof window !== 'undefined') {
        const isCheckoutPage = window.location.pathname.startsWith('/checkout');
        if (isCheckoutPage) {
          const savedBuyNow = sessionStorage.getItem('kp_buynow_session');
          if (savedBuyNow) {
            setBuyNowItem(JSON.parse(savedBuyNow));
          }
        } else {
          // Remove orphan buy now session if user navigated away from checkout
          sessionStorage.removeItem('kp_buynow_session');
          setBuyNowItem(null);
        }
      }
    } catch {
      setItems([]);
      setAppliedCoupon(null);
      setBuyNowItem(null);
    } finally {
      setHasLoaded(true);
    }
  }, [cartKey, couponKey]);

  // Save cart to localStorage
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      if (items.length === 0) {
        localStorage.removeItem(cartKey);
      } else {
        localStorage.setItem(cartKey, JSON.stringify(items));
      }

      if (appliedCoupon && items.length > 0) {
        localStorage.setItem(couponKey, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(couponKey);
      }
    } catch {
      // ignore
    }
  }, [items, appliedCoupon, hasLoaded, cartKey, couponKey]);

  const addToCart = (product: Product, variantWeight?: string, quantity = 1) => {
    if (!user) {
      showToast('Please sign in to add items to your cart!', 'info');
      return;
    }

    const selectedWeight = variantWeight || product.weight || '250g';
    const variant = product.variants?.find((v) => v.weight === selectedWeight);
    const price = variant ? variant.price : product.price;
    const mrp = variant ? variant.mrp : product.mrp;
    const maxStock = variant ? variant.stock_quantity : product.stock_quantity;

    if (maxStock <= 0) {
      showToast(`${product.name} is currently out of stock!`, 'error');
      return;
    }

    const cartItemId = `${product.id}-${selectedWeight}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > maxStock) {
          showToast(`Only ${maxStock} units available in stock.`, 'info');
          return prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity: maxStock } : item
          );
        }
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: nextQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product_id: product.id,
          variant_id: variant?.id,
          product_name: product.name,
          slug: product.slug,
          image: product.images[0] || '/images/pickles/hero.jpg',
          weight: selectedWeight,
          price,
          mrp,
          quantity: Math.min(quantity, maxStock),
          max_stock: maxStock,
          dietary: product.dietary,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${product.name} (${selectedWeight}) to cart!`, 'success');
    setIsCartDrawerOpen(true);
  };

  /**
   * Start Buy Now flow - completely isolated from the standard shopping cart.
   * Does NOT add the item to `items` or increment `itemCount`.
   */
  const startBuyNow = (product: Product, variantWeight?: string, quantity = 1): CartItem | null => {
    if (!user) {
      showToast('Please sign in to buy products!', 'info');
      return null;
    }

    const selectedWeight = variantWeight || product.weight || '250g';
    const variant = product.variants?.find((v) => v.weight === selectedWeight);
    const price = variant ? variant.price : product.price;
    const mrp = variant ? variant.mrp : product.mrp;
    const maxStock = variant ? variant.stock_quantity : product.stock_quantity;

    if (maxStock <= 0) {
      showToast(`${product.name} is currently out of stock!`, 'error');
      return null;
    }

    const buyItem: CartItem = {
      id: `buynow-${product.id}-${selectedWeight}`,
      product_id: product.id,
      variant_id: variant?.id,
      product_name: product.name,
      slug: product.slug,
      image: product.images[0] || '/images/pickles/hero.jpg',
      weight: selectedWeight,
      price,
      mrp,
      quantity: Math.min(quantity, maxStock),
      max_stock: maxStock,
      dietary: product.dietary,
    };

    setBuyNowItem(buyItem);
    try {
      sessionStorage.setItem('kp_buynow_session', JSON.stringify(buyItem));
    } catch {
      // ignore
    }

    return buyItem;
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
    try {
      sessionStorage.removeItem('kp_buynow_session');
    } catch {
      // ignore
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.max_stock);
          if (quantity > item.max_stock) {
            showToast(`Max available stock is ${item.max_stock} units.`, 'info');
          }
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(cartKey);
      localStorage.removeItem(couponKey);
    } catch {
      // ignore
    }
  };

  const applyCoupon = (code: string) => {
    const subtotalAmt = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = DataStore.validateCoupon(code, subtotalAmt);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      showToast(result.message, 'success');
      return { success: true, message: result.message };
    } else {
      showToast(result.message, 'error');
      return { success: false, message: result.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Calculations strictly based on actual added cart items
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.min_order_amount) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discount_value) / 100);
      if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
        discount = appliedCoupon.max_discount;
      }
    } else {
      discount = appliedCoupon.discount_value;
    }
    discount = Math.min(discount, subtotal);
  }

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST on packaged food
  const total = taxableAmount + shipping + tax;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        freeShippingRemaining,
        appliedCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        buyNowItem,
        startBuyNow,
        clearBuyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
