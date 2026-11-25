"use client";

import * as React from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

interface WardrobeExactHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export function WardrobeExactHeader({
  cartCount,
  onOpenCart,
  onOpenSearch,
}: WardrobeExactHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#EFEFEF] transition-all">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 h-16 flex items-center justify-between">
        {/* Left: Brand Logo WARDROBE */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1 text-[#111]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="inline-block">
            <span className="font-sans text-lg sm:text-xl font-bold tracking-[0.14em] text-[#111] uppercase">
              WARDROBE
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-sans font-medium text-[#222]">
          <Link
            href="/collections/women"
            className="hover:text-black tracking-wide transition-colors"
          >
            Women
          </Link>
          <Link
            href="/collections/men"
            className="hover:text-black tracking-wide transition-colors"
          >
            Men
          </Link>
          <Link
            href="/products"
            className="hover:text-black tracking-wide transition-colors"
          >
            Journal
          </Link>
          <Link
            href="/account"
            className="hover:text-black tracking-wide transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right: Search, Account, Cart Pill */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#222] hover:text-black transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Account Icon */}
          <Link
            href="/account"
            className="p-1.5 text-[#222] hover:text-black transition-colors"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>

          {/* Black Pill: Cart (Count) */}
          <button
            onClick={onOpenCart}
            className="bg-[#111111] hover:bg-black text-white px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight flex items-center space-x-1.5 transition-transform hover:scale-104 shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Cart ({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#EEE] bg-white px-6 py-4 space-y-3 font-sans text-sm">
          <Link
            href="/collections/women"
            onClick={() => setMobileOpen(false)}
            className="block py-1.5 text-[#222] font-medium"
          >
            Women
          </Link>
          <Link
            href="/collections/men"
            onClick={() => setMobileOpen(false)}
            className="block py-1.5 text-[#222] font-medium"
          >
            Men
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block py-1.5 text-[#222] font-medium"
          >
            Journal
          </Link>
          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            className="block py-1.5 text-[#222] font-medium"
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
