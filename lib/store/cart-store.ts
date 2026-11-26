"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // Product ID
  slug?: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
  availableStock?: number;
}

export interface ServerQuotePricing {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  currency: string;
}

export interface ServerQuote {
  isValid: boolean;
  errors: string[];
  couponError: string | null;
  items: Array<CartItem & { lineTotal: number }>;
  pricing: ServerQuotePricing;
  appliedCoupon: {
    code: string;
    discountType: string;
    value: number;
  } | null;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  shippingCountry: string;
  shippingMethod: "standard" | "express";
  serverQuote: ServerQuote | null;
  isSyncing: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, delta: number, size?: string, color?: string) => void;
  setQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCouponCode: (code: string | null) => void;
  setShippingCountry: (country: string) => void;
  setShippingMethod: (method: "standard" | "express") => void;
  syncServerQuote: () => Promise<ServerQuote | null>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "prod-007",
          slug: "technical-polartec-thermal-zip-hoodie",
          title: "Technical Polartec Thermal Zip Hoodie",
          price: 225.0,
          size: "M",
          color: "Alabaster White",
          image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=85&w=600",
          quantity: 1,
        },
        {
          id: "prod-001",
          slug: "nordic-expedition-down-parka",
          title: "Nordic Expedition Down Parka",
          price: 685.0,
          size: "L",
          color: "Obsidian Slate",
          image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
          quantity: 1,
        },
      ],
      isOpen: false,
      couponCode: null,
      shippingCountry: "US",
      shippingMethod: "standard",
      serverQuote: null,
      isSyncing: false,

      addItem: (newItem) => {
        const qty = newItem.quantity || 1;
        set((state) => {
          const existingIndex = state.items.findIndex(
            (it) =>
              it.id === newItem.id &&
              it.size === newItem.size &&
              it.color === newItem.color
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + qty,
            };
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { ...newItem, quantity: qty }],
            isOpen: true,
          };
        });

        // Trigger background quote sync
        get().syncServerQuote();
      },

      updateQuantity: (id, delta, size, color) => {
        set((state) => {
          const updated = state.items
            .map((it) => {
              const match =
                it.id === id &&
                (!size || it.size === size) &&
                (!color || it.color === color);
              if (!match) return it;
              const newQty = it.quantity + delta;
              return newQty > 0 ? { ...it, quantity: newQty } : null;
            })
            .filter(Boolean) as CartItem[];

          return { items: updated };
        });

        get().syncServerQuote();
      },

      setQuantity: (id, quantity, size, color) => {
        set((state) => {
          const updated = state.items
            .map((it) => {
              const match =
                it.id === id &&
                (!size || it.size === size) &&
                (!color || it.color === color);
              if (!match) return it;
              return quantity > 0 ? { ...it, quantity } : null;
            })
            .filter(Boolean) as CartItem[];

          return { items: updated };
        });

        get().syncServerQuote();
      },

      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (it) =>
              !(
                it.id === id &&
                (!size || it.size === size) &&
                (!color || it.color === color)
              )
          ),
        }));

        get().syncServerQuote();
      },

      clearCart: () => {
        set({ items: [], couponCode: null, serverQuote: null });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      setCouponCode: (code) => {
        set({ couponCode: code });
        get().syncServerQuote();
      },

      setShippingCountry: (country) => {
        set({ shippingCountry: country });
        get().syncServerQuote();
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method });
        get().syncServerQuote();
      },

      syncServerQuote: async () => {
        const { items, couponCode, shippingCountry, shippingMethod } = get();

        if (items.length === 0) {
          set({ serverQuote: null, isSyncing: false });
          return null;
        }

        try {
          set({ isSyncing: true });
          const res = await fetch("/api/cart/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: items.map((it) => ({
                productId: it.id,
                productSlug: it.slug,
                size: it.size,
                color: it.color,
                quantity: it.quantity,
              })),
              couponCode: couponCode || undefined,
              shippingCountry,
              shippingMethod,
            }),
          });

          const data = await res.json();
          if (data?.status === "success" && data.data) {
            set({ serverQuote: data.data, isSyncing: false });
            return data.data;
          }
        } catch (err) {
          console.error("Cart quote sync failed:", err);
        } finally {
          set({ isSyncing: false });
        }
        return null;
      },
    }),
    {
      name: "kora_winter_cart_store_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        shippingCountry: state.shippingCountry,
        shippingMethod: state.shippingMethod,
      }),
    }
  )
);
