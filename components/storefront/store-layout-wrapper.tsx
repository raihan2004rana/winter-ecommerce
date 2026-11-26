"use client";

import * as React from "react";
import { WardrobeAnnouncementBar } from "@/components/storefront/wardrobe-announcement-bar";
import { WardrobeExactHeader } from "@/components/storefront/wardrobe-exact-header";
import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer } from "@/components/storefront/mini-cart-drawer";
import { WardrobeExactFooter } from "@/components/storefront/wardrobe-exact-footer";
import { FlyToCartProvider } from "@/components/storefront/fly-to-cart-provider";
import { useCartStore } from "@/lib/store/cart-store";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const {
    items,
    isOpen: isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
    addItem,
  } = useCartStore();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <FlyToCartProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#111] font-sans selection:bg-[#111] selection:text-white">
        {/* 1. Global Announcement Bar (Matching Home WARDROBE design) */}
        <WardrobeAnnouncementBar />

        {/* 2. Global WARDROBE Header */}
        <WardrobeExactHeader
          cartCount={cartCount}
          onOpenCart={openCart}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* 3. Global Interactive Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          currency="USD"
          onSelectProduct={(p) =>
            addItem({
              id: p.id,
              slug: p.slug,
              title: p.title,
              price: p.price,
              size: p.sizes[0] || "M",
              color: p.colorways[0]?.name || "Standard",
              image: p.primaryImage,
              quantity: 1,
            })
          }
        />

        {/* 4. Global Mini Cart Drawer (High-Def Thumbnails + Express Transit Progress) */}
        <MiniCartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          currency="USD"
          items={items}
          onUpdateQuantity={(id, delta) => updateQuantity(id, delta)}
          onRemoveItem={(id) => removeItem(id)}
        />

        {/* 5. Page Content */}
        <main className="flex-1">{children}</main>

        {/* 6. Global WARDROBE Footer (Trust Pillars, Newsletter, Links & Card Logos) */}
        <WardrobeExactFooter />
      </div>
    </FlyToCartProvider>
  );
}
