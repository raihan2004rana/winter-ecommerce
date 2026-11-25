"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { MegaMenu } from "./mega-menu";

interface NavigationHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export function NavigationHeader({
  cartCount,
  onOpenCart,
  onOpenSearch,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = React.useState(false);

  return (
    <nav className="w-full bg-canvas border-b border-canvas-muted sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-18 flex items-center justify-between">
        {/* Left: Mobile Toggle & Desktop Nav */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-forest transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-editorial font-medium text-charcoal-700">
            {/* Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
            >
              <button
                className="flex items-center space-x-1 hover:text-charcoal hover-editorial-line py-2 transition-colors"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              >
                <span>Collections</span>
                <ChevronDown className="h-3 w-3 text-charcoal-500" />
              </button>
            </div>

            <Link href="#outerwear" className="hover:text-charcoal hover-editorial-line py-2 transition-colors">
              Down Outerwear
            </Link>
            <Link href="#knitwear" className="hover:text-charcoal hover-editorial-line py-2 transition-colors">
              Knitwear
            </Link>
            <Link href="#footwear" className="hover:text-charcoal hover-editorial-line py-2 transition-colors">
              Boots
            </Link>
            <Link href="#flash-sale" className="text-forest font-semibold hover-editorial-line py-2 transition-colors">
              Alpine Drop (Sale)
            </Link>
          </div>
        </div>

        {/* Center: Brand Wordmark */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-charcoal font-normal">
              VALLIS & ORE
            </span>
            <span className="block text-[0.58rem] uppercase tracking-[0.32em] text-charcoal-500 font-sans mt-0.5">
              High Cold Alpine
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-charcoal">
          <button
            onClick={onOpenSearch}
            className="p-1.5 hover:text-forest transition-colors flex items-center space-x-1.5"
            aria-label="Open search dialog"
          >
            <Search className="h-4.5 w-4.5 stroke-[1.5]" />
            <span className="hidden md:inline-block text-2xs uppercase tracking-widest text-charcoal-500">
              Search
            </span>
          </button>

          <Link
            href="#account"
            className="hidden sm:inline-block p-1.5 hover:text-forest transition-colors"
            aria-label="Customer account portal"
          >
            <User className="h-4.5 w-4.5 stroke-[1.5]" />
          </Link>

          <button
            onClick={onOpenCart}
            className="relative p-1.5 hover:text-forest transition-colors flex items-center space-x-1 group"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
            <span className="text-2xs font-mono font-medium ml-1">
              ({cartCount})
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-canvas-muted bg-canvas px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm uppercase tracking-editorial font-medium text-charcoal">
            <Link
              href="#outerwear"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-forest"
            >
              Outerwear & Down Parkas
            </Link>
            <Link
              href="#knitwear"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-forest"
            >
              Merino & Cashmere Knits
            </Link>
            <Link
              href="#footwear"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-forest"
            >
              Alpine Shearling Boots
            </Link>
            <Link
              href="#accessories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-forest"
            >
              Cold Accessories
            </Link>
            <Link
              href="#flash-sale"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-forest font-semibold"
            >
              Limited-Time Alpine Drop (Sale)
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}
