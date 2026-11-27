"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { WardrobeAnnouncementBar } from "@/components/storefront/wardrobe-announcement-bar";
import { WardrobeExactHeader } from "@/components/storefront/wardrobe-exact-header";
import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer } from "@/components/storefront/mini-cart-drawer";
import { WardrobeExactFooter } from "@/components/storefront/wardrobe-exact-footer";
import { FlyToCartProvider } from "@/components/storefront/fly-to-cart-provider";
import { FloatingSideCart } from "@/components/storefront/floating-side-cart";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { CookieConsentBanner } from "@/components/storefront/cookie-consent-banner";
import { LiveChatWidget } from "@/components/storefront/live-chat-widget";
import { useCartStore } from "@/lib/store/cart-store";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const {
    items,
    isOpen: isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const pathname = usePathname();

  // Automatically close cart drawer on route navigation so viewing a product never auto-opens the drawer
  React.useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

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

        {/* 5. Floating Side Cart Tab (Right-Docked Widget matching user specification) */}
        <FloatingSideCart />

        {/* 6. Page Content (with bottom padding on mobile for bottom nav) */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>

        {/* 7. Global WARDROBE Footer (Trust Pillars, Newsletter, Links & Card Logos) */}
        <WardrobeExactFooter />

        {/* 8. Mobile Bottom Navigation Bar (5 bottom icons) */}
        <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />

        {/* 9. Luxury Cookie Consent & Privacy Preferences Banner */}
        <CookieConsentBanner />

        {/* 10. Atelier Concierge Live Chat Widget */}
        <LiveChatWidget />
      </div>
    </FlyToCartProvider>
  );
}
