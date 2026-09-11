'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: string[]; // product IDs
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kp_wishlist_v1');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string, productName?: string) => {
    const isAdding = !wishlist.includes(productId);
    const updated = isAdding
      ? [...wishlist, productId]
      : wishlist.filter((id) => id !== productId);

    setWishlist(updated);
    try {
      localStorage.setItem('kp_wishlist_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (isAdding) {
      showToast(productName ? `Added ${productName} to wishlist!` : 'Added to wishlist!', 'success');
    } else {
      showToast(productName ? `Removed ${productName} from wishlist.` : 'Removed from wishlist.', 'info');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
