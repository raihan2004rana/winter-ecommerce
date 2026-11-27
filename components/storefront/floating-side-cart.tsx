"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useFlyToCart } from "./fly-to-cart-provider";
import { useInternationalStore } from "@/lib/international/i18n";
import { convertCurrency } from "@/lib/server/exchange-rates";
import { formatCurrency } from "@/lib/utils";

export function FloatingSideCart() {
  const { items, openCart } = useCartStore();
  const { isCartBouncing } = useFlyToCart();
  const { currency, rates } = useInternationalStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const converted = convertCurrency(rawSubtotal, currency, rates);

  return (
    <button
      id="floating-side-cart-button"
      onClick={openCart}
      aria-label="Open Shopping Bag"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#111111] hover:bg-black text-white rounded-l-2xl shadow-2xl py-3 px-2 sm:px-2.5 border-l-2 border-y border-white/20 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-x-1 active:scale-95 group select-none ${
        isCartBouncing
          ? "animate-cart-bounce ring-2 ring-white/80 bg-black"
          : ""
      }`}
      title="View Shopping Bag"
    >
      {/* Shopping Bag Icon with Count Badge */}
      <div className="relative mb-1">
        <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-white text-black font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {cartCount}
          </span>
        )}
      </div>

      {/* Items Count Label */}
      <span className="text-[10px] font-mono font-medium text-neutral-300 uppercase tracking-tighter">
        {cartCount} {cartCount === 1 ? "Item" : "Items"}
      </span>

      {/* Dynamic Price Pill - Solid crisp white text */}
      <div className="mt-1 bg-white/10 group-hover:bg-white/25 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-white transition-colors">
        {formatCurrency(converted.amount, currency as any)}
      </div>
    </button>
  );
}
