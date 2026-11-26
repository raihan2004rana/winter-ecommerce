"use client";

import * as React from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X, Globe, Truck } from "lucide-react";
import { useInternationalStore } from "@/lib/international/i18n";
import { getCountryConfig } from "@/lib/international/countries";
import { InternationalSelectorModal } from "./international-selector-modal";
import { InternationalShippingModal } from "./international-shipping-modal";

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
  const [isIntlOpen, setIsIntlOpen] = React.useState(false);
  const [isShippingOpen, setIsShippingOpen] = React.useState(false);

  const { country, currency, language, t } = useInternationalStore();
  const currentConfig = getCountryConfig(country);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#EFEFEF] transition-all">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 h-16 flex items-center justify-between">
          {/* Left: Brand Logo WARDROBE (Aligned exactly with container left edge) */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden mr-4 p-1 text-[#111]"
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
              {t("nav.women")}
            </Link>
            <Link
              href="/collections/men"
              className="hover:text-black tracking-wide transition-colors"
            >
              {t("nav.men")}
            </Link>
            <Link
              href="/products"
              className="hover:text-black tracking-wide transition-colors"
            >
              {t("nav.journal")}
            </Link>
            <Link
              href="/cart"
              className="hover:text-black tracking-wide transition-colors"
            >
              {t("nav.shoppingBag")}
            </Link>
            <button
              onClick={() => setIsShippingOpen(true)}
              className="hover:text-black tracking-wide transition-colors text-xs font-medium text-emerald-700 flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>DDP Shipping</span>
            </button>
          </nav>

          {/* Right: Country/Currency Selector, Search, Account, Cart Pill */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* International Selector Trigger */}
            <button
              onClick={() => setIsIntlOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              title="Change Country, Currency & Language"
            >
              <span className="text-sm shrink-0">{currentConfig.flag}</span>
              <span className="font-semibold text-black">{currency}</span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline uppercase text-gray-500">{language}</span>
            </button>

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
              {t("nav.women")}
            </Link>
            <Link
              href="/collections/men"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-[#222] font-medium"
            >
              {t("nav.men")}
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-[#222] font-medium"
            >
              {t("nav.journal")}
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-[#222] font-medium"
            >
              {t("nav.shoppingBag")}
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                setIsShippingOpen(true);
              }}
              className="block py-1.5 text-emerald-700 font-medium text-left"
            >
              DDP International Shipping Policy
            </button>
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsIntlOpen(true);
                }}
                className="w-full text-left py-2 text-xs font-mono text-gray-700 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Regional Settings ({currentConfig.name} • {currency})</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <InternationalSelectorModal
        isOpen={isIntlOpen}
        onClose={() => setIsIntlOpen(false)}
      />
      <InternationalShippingModal
        isOpen={isShippingOpen}
        onClose={() => setIsShippingOpen(false)}
      />
    </>
  );
}
