"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { MegaMenu } from "./mega-menu";

interface NavigationHeaderProps {
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export function NavigationHeader({
  cartCount,
  wishlistCount = 0,
  onOpenCart,
  onOpenSearch,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false);

  return (
    <nav className="w-full bg-[#FFFFFF] border-b border-[#EAEAEA] sticky top-0 z-40 transition-colors">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 h-18 flex items-center justify-between">
        {/* Left: Brand Logo (MONCLER Style) */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#111] hover:text-[#555] transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="inline-block">
            <span className="font-sans text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#111] uppercase">
              MONCLER
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links (SHOP ALL, WOMEN, MAN, NEW, SALE) */}
        <div className="hidden lg:flex items-center space-x-9 text-xs uppercase tracking-widest font-medium text-[#222]">
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
          >
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="hover:text-black py-2 tracking-widest transition-colors font-medium flex items-center space-x-1"
            >
              <span>WINTER 26</span>
            </button>
          </div>

          <Link
            href="/collections/women"
            className="hover:text-black py-2 tracking-widest transition-colors"
          >
            WOMEN
          </Link>

          <Link
            href="/collections/men"
            className="hover:text-black py-2 tracking-widest transition-colors"
          >
            MAN
          </Link>

          <Link
            href="/products"
            className="hover:text-black py-2 tracking-widest transition-colors"
          >
            SHOP ALL
          </Link>

          <Link
            href="/collections/sale"
            className="text-[#B91C1C] font-semibold hover:text-black py-2 tracking-widest transition-colors"
          >
            SALE
          </Link>
        </div>

        {/* Right: Search, Wishlist Heart, Shopping Bag, and MY ACCOUNT */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-[#111]">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1 text-[#333] hover:text-black transition-colors"
            aria-label="Search collection"
          >
            <Search className="h-4.5 w-4.5 stroke-[1.5]" />
          </button>

          {/* Wishlist Heart Icon */}
          <button
            onClick={onOpenSearch}
            className="relative p-1 text-[#333] hover:text-black transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-4.5 w-4.5 stroke-[1.5]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-black text-white text-[0.55rem] font-mono flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Icon with Count */}
          <button
            onClick={onOpenCart}
            className="relative p-1 text-[#333] hover:text-black transition-colors flex items-center"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
            <span className="ml-1 text-2xs font-mono font-medium text-[#111]">
              ({cartCount})
            </span>
          </button>

          {/* MY ACCOUNT Button / Link */}
          <Link
            href="/account"
            className="text-xs uppercase tracking-wider font-semibold text-[#111] hover:underline underline-offset-4 hidden sm:inline-block ml-2"
          >
            MY ACCOUNT
          </Link>
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAEAEA] bg-white px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-xs uppercase tracking-widest font-medium text-[#222]">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              SHOP ALL PRODUCTS
            </Link>
            <Link
              href="/collections/women"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              WOMEN&apos;S COLLECTION
            </Link>
            <Link
              href="/collections/men"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              MEN&apos;S COLLECTION
            </Link>
            <Link
              href="/category/jackets-coats"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              JACKETS & COATS
            </Link>
            <Link
              href="/category/sweaters-hoodies"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              SWEATERS & HOODIES
            </Link>
            <Link
              href="/category/boots-accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              BOOTS & ACCESSORIES
            </Link>
            <Link
              href="/collections/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-black"
            >
              NEW ARRIVALS
            </Link>
            <Link
              href="/collections/sale"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#B91C1C] font-semibold hover:text-black"
            >
              WINTER ARCHIVE SALE
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-black font-semibold pt-2 border-t border-[#EAEAEA]"
            >
              MY ACCOUNT
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}
