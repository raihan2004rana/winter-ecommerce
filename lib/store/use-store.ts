"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartLineItem {
  id: string; // product.id
  cartItemId: string; // unique item id based on id-size-color
  slug: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
  maxStock: number;
}

interface StoreState {
  // Currency
  currency: "USD" | "EUR" | "GBP" | "CAD";
  setCurrency: (currency: "USD" | "EUR" | "GBP" | "CAD") => void;

  // Cart
  cart: CartLineItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, color?: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => number;

  // Wishlist
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Currency
      currency: "USD",
      setCurrency: (currency) => set({ currency }),

      // Cart
      cart: [
        {
          id: "prod-001",
          cartItemId: "prod-001-M-Obsidian",
          slug: "nordic-expedition-down-parka",
          title: "Nordic Expedition Down Parka",
          price: 685,
          size: "M",
          color: "Obsidian Slate",
          image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=600",
          quantity: 1,
          maxStock: 4,
        },
        {
          id: "prod-009",
          cartItemId: "prod-009-OneSize-RawEcru",
          slug: "brushed-cashmere-ribbed-scarf",
          title: "Thistle-Brushed Pure Cashmere Scarf",
          price: 185,
          size: "One Size",
          color: "Raw Ecru",
          image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=85&w=600",
          quantity: 1,
          maxStock: 16,
        },
      ],
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (product, size, color, quantity = 1) => {
        const selectedColor = color || product.colorways[0]?.name || "Standard";
        const selectedSize = size || product.sizes[0] || "Standard";
        const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

        set((state) => {
          const existingIndex = state.cart.findIndex((i) => i.cartItemId === cartItemId);
          if (existingIndex > -1) {
            const updated = [...state.cart];
            const item = updated[existingIndex];
            const newQty = Math.min(item.quantity + quantity, product.stockCount);
            updated[existingIndex] = { ...item, quantity: newQty };
            return { cart: updated, isCartOpen: true };
          }

          const newItem: CartLineItem = {
            id: product.id,
            cartItemId,
            slug: product.slug,
            title: product.title,
            price: product.price,
            size: selectedSize,
            color: selectedColor,
            image: product.primaryImage,
            quantity: Math.min(quantity, product.stockCount),
            maxStock: product.stockCount,
          };

          return { cart: [...state.cart, newItem], isCartOpen: true };
        });
      },

      updateCartQuantity: (cartItemId, delta) => {
        set((state) => {
          const updated = state.cart
            .map((item) => {
              if (item.cartItemId === cartItemId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return { ...item, quantity: Math.min(newQty, item.maxStock) };
              }
              return item;
            })
            .filter((i): i is CartLineItem => i !== null);

          return { cart: updated };
        });
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      getCartSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      // Wishlist
      wishlist: ["prod-001", "prod-003"],
      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        });
      },
      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      // Search Modal
      isSearchOpen: false,
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: "vallis-ore-storage",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        currency: state.currency,
      }),
    }
  )
);
