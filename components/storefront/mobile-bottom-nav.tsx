"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, Search, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useFlyToCart } from "./fly-to-cart-provider";

interface MobileBottomNavProps {
  onOpenSearch: () => void;
}

export function MobileBottomNav({ onOpenSearch }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { items, openCart, isOpen: isCartOpen } = useCartStore();
  const { isCartBouncing } = useFlyToCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isHome = pathname === "/";
  const isMenu = pathname.startsWith("/collections");
  const isAccount = pathname.startsWith("/account");

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] md:hidden px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.08)] select-none"
    >
      {/* 1. HOME */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
          isHome ? "text-black font-semibold" : "text-[#777] hover:text-black"
        }`}
      >
        <Home className={`w-5 h-5 ${isHome ? "text-black stroke-[2.2]" : "text-[#777]"}`} />
        <span className="text-[10px] font-sans mt-0.5 tracking-tight">Home</span>
      </Link>

      {/* 2. MENU / CATEGORIES */}
      <Link
        href="/collections/women"
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
          isMenu ? "text-black font-semibold" : "text-[#777] hover:text-black"
        }`}
      >
        <LayoutGrid className={`w-5 h-5 ${isMenu ? "text-black stroke-[2.2]" : "text-[#777]"}`} />
        <span className="text-[10px] font-sans mt-0.5 tracking-tight">Categories</span>
      </Link>

      {/* 3. CART (With Live Badge) */}
      <button
        onClick={openCart}
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors relative ${
          isCartOpen || isCartBouncing ? "text-black font-semibold" : "text-[#777] hover:text-black"
        }`}
        aria-label="Open Shopping Bag"
      >
        <div className="relative">
          <ShoppingBag
            className={`w-5 h-5 ${
              isCartOpen ? "text-black stroke-[2.2]" : "text-[#777]"
            } ${isCartBouncing ? "animate-cart-bounce text-emerald-600" : ""}`}
          />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-black text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-sans mt-0.5 tracking-tight">Cart</span>
      </button>

      {/* 4. SEARCH */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center py-1 px-2.5 text-[#777] hover:text-black transition-colors"
        aria-label="Search Catalog"
      >
        <Search className="w-5 h-5 text-[#777]" />
        <span className="text-[10px] font-sans mt-0.5 tracking-tight">Search</span>
      </button>

      {/* 5. ACCOUNT */}
      <Link
        href="/account"
        className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
          isAccount ? "text-black font-semibold" : "text-[#777] hover:text-black"
        }`}
      >
        <User className={`w-5 h-5 ${isAccount ? "text-black stroke-[2.2]" : "text-[#777]"}`} />
        <span className="text-[10px] font-sans mt-0.5 tracking-tight">Account</span>
      </Link>
    </nav>
  );
}
