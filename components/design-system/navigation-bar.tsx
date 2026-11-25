"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationBarProps {
  cartItemCount?: number;
  activeCurrency?: "USD" | "EUR" | "GBP" | "CAD";
  onCurrencyChange?: (currency: "USD" | "EUR" | "GBP" | "CAD") => void;
  onOpenCart?: () => void;
}

/**
 * Editorial International Navigation Bar
 * Avoids sticky blurred plastic headers. Features crisp warm off-white canvas,
 * understated typography, subtle hover underlines, and international currency switching.
 */
export function NavigationBar({
  cartItemCount = 2,
  activeCurrency = "USD",
  onCurrencyChange,
  onOpenCart,
}: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = React.useState(false);

  const categories = [
    { label: "Outerwear", href: "#outerwear" },
    { label: "Knitwear & Mid-Layers", href: "#knitwear" },
    { label: "Expedition Shells", href: "#expedition" },
    { label: "Winter Footwear", href: "#footwear" },
    { label: "Accessories", href: "#accessories" },
    { label: "Lookbook", href: "#lookbook" },
  ];

  const currencies: Array<"USD" | "EUR" | "GBP" | "CAD"> = ["USD", "EUR", "GBP", "CAD"];

  return (
    <header className="w-full border-b border-canvas-muted bg-canvas sticky top-0 z-50">
      {/* 1. International Announcement Ribbon */}
      <div className="bg-canvas-subtle border-b border-canvas-muted py-2 px-4 sm:px-8 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-2xs tracking-widest uppercase text-charcoal-600">
          <span className="hidden sm:inline-block">Express International Courier • Duties & Taxes Calculated at Checkout</span>
          <span className="w-full sm:w-auto text-center font-medium text-charcoal">
            Complimentary Worldwide Shipping on Orders Over $200 / €190 / £175
          </span>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-forest font-semibold">● IN STOCK</span>
            <span>WINTER 2026/27</span>
          </div>
        </div>
      </div>

      {/* 2. Main Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Desktop Primary Nav */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-forest transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-editorial font-medium text-charcoal-700">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="hover:text-charcoal hover-editorial-line py-1 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Clean Brand Wordmark */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-charcoal font-normal">
              VALLIS & ORE
            </span>
            <span className="block text-[0.6rem] uppercase tracking-[0.3em] text-charcoal-500 font-sans mt-0.5">
              High Cold Alpine
            </span>
          </Link>
        </div>

        {/* Right: Currency Selector, Search, Account & Shopping Bag */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-charcoal">
          {/* Currency Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1.5 text-2xs uppercase tracking-widest font-medium py-1 px-2 hover:bg-canvas-subtle rounded-sm transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-charcoal-500" />
              <span>{activeCurrency}</span>
              <ChevronDown className="h-3 w-3 text-charcoal-500" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-canvas-elevated border border-canvas-muted rounded-sm shadow-editorial-dropdown py-1 z-50">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      onCurrencyChange?.(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-2xs uppercase tracking-widest transition-colors ${
                      activeCurrency === curr
                        ? "bg-canvas-subtle font-semibold text-charcoal"
                        : "text-charcoal-600 hover:bg-canvas-subtle"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            className="p-1.5 hover:text-forest transition-colors"
            aria-label="Search collection"
          >
            <Search className="h-4.5 w-4.5 stroke-[1.5]" />
          </button>

          {/* Customer Account */}
          <Link
            href="#account"
            className="hidden sm:inline-block p-1.5 hover:text-forest transition-colors"
            aria-label="Customer account"
          >
            <User className="h-4.5 w-4.5 stroke-[1.5]" />
          </Link>

          {/* Shopping Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 hover:text-forest transition-colors group flex items-center space-x-1"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
            <span className="text-2xs font-mono font-medium ml-1">
              ({cartItemCount})
            </span>
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-canvas-muted bg-canvas px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-editorial font-medium text-charcoal hover:text-forest transition-colors py-1"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-canvas-muted flex items-center justify-between text-xs">
            <span className="text-charcoal-500 uppercase tracking-widest text-2xs">Regional Market</span>
            <div className="flex space-x-2">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange?.(curr)}
                  className={`px-2 py-1 text-2xs uppercase tracking-widest border ${
                    activeCurrency === curr
                      ? "border-charcoal bg-charcoal text-canvas"
                      : "border-canvas-muted text-charcoal"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
