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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { showToast } = useToast();

  const settings = DataStore.getStoreSettings();
  const FREE_SHIPPING_THRESHOLD = settings.free_shipping_threshold || 499;
  const STANDARD_SHIPPING_FEE = settings.standard_shipping_fee || 50;

  const cartKey = user?.id ? `kp_cart_${user.id}` : 'kp_cart_guest';
  const couponKey = user?.id ? `kp_coupon_${user.id}` : 'kp_coupon_guest';

  // Load cart from localStorage whenever user changes
  useEffect(() => {
    setHasLoaded(false);
    try {
      const saved = localStorage.getItem(cartKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]);
      }
      const savedCoupon = localStorage.getItem(couponKey);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } else {
        setAppliedCoupon(null);
      }
    } catch {
      setItems([]);
      setAppliedCoupon(null);
    } finally {
      setHasLoaded(true);
    }
  }, [cartKey, couponKey]);

  // Save cart to localStorage
  useEffect(() => {
    if (!hasLoaded) return;
    try {
      localStorage.setItem(cartKey, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(couponKey, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(couponKey);
      }
    } catch {
      // ignore
    }
  }, [items, appliedCoupon, hasLoaded, cartKey, couponKey]);

  const addToCart = (product: Product, variantWeight?: string, quantity = 1) => {
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

  // Calculations
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
