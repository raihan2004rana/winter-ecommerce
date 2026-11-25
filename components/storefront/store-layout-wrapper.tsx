"use client";

import * as React from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { NavigationHeader } from "@/components/storefront/navigation-header";
import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer } from "@/components/storefront/mini-cart-drawer";
import { SiteFooter } from "@/components/storefront/site-footer";
import { useStore } from "@/lib/store/use-store";
import { PRODUCTS_CATALOG } from "@/data/products";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const {
    currency,
    setCurrency,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    isSearchOpen,
    setIsSearchOpen,
    wishlist,
    addToCart,
  } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111] font-sans selection:bg-[#111] selection:text-white">
      {/* 1. Global Announcement Bar */}
      <AnnouncementBar
        activeCurrency={currency}
        onCurrencyChange={(curr) => setCurrency(curr)}
      />

      {/* 2. Global Navigation Header */}
      <NavigationHeader
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 3. Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currency={currency}
        onSelectProduct={(p) => addToCart(p, p.sizes[0] || "M")}
      />

      {/* 4. Global Mini Cart Drawer */}
      <MiniCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currency={currency}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* 5. Page Content */}
      <main className="flex-1">{children}</main>

      {/* 6. Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
