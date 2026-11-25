"use client";

import * as React from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { NavigationHeader } from "@/components/storefront/navigation-header";
import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer, CartItem } from "@/components/storefront/mini-cart-drawer";

// Framer Wardrobe Elevated Structure Components
import { WardrobeElevatedHero } from "@/components/storefront/wardrobe-hero";
import { WardrobeBestSellers } from "@/components/storefront/wardrobe-best-sellers";
import { WardrobeCategoryGrid } from "@/components/storefront/wardrobe-category-grid";
import { WardrobeUgcSocial } from "@/components/storefront/wardrobe-ugc-social";
import { WardrobePromoCountdown } from "@/components/storefront/wardrobe-promo-countdown";
import { WardrobeJournalSection } from "@/components/storefront/wardrobe-journal-section";
import { WardrobeTrustPillars } from "@/components/storefront/wardrobe-trust-pillars";

// Supporting Editorial & Brand Heritage
import { AlpineLookbookSpread } from "@/components/storefront/alpine-lookbook-spread";
import { BrandStorySection } from "@/components/storefront/brand-story-section";
import { CustomerReviewsSection } from "@/components/storefront/customer-reviews-section";
import { NewsletterSection } from "@/components/storefront/newsletter-section";
import { SocialInspirationSection } from "@/components/storefront/social-inspiration-section";
import { SiteFooter } from "@/components/storefront/site-footer";
import { Product } from "@/data/products";

export default function StorefrontHomePage() {
  // Global Storefront State
  const [activeCurrency, setActiveCurrency] = React.useState<"USD" | "EUR" | "GBP" | "CAD">("USD");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Initial demo shopping bag with 2 items
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: "ref-001",
      title: "Thermal Insulated Shell Coat",
      price: 249,
      size: "M",
      color: "Glacial Mint",
      image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=600",
      quantity: 1,
    },
    {
      id: "ref-002",
      title: "Classic Winter Down Coat",
      price: 349,
      size: "L",
      color: "Chestnut Brown",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      quantity: 1,
    },
  ]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Handle adding garments to cart from any section
  const handleAddToCart = (product: Product, size: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          size,
          color: product.colorways[0]?.name || "Standard",
          image: product.primaryImage,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#111] font-sans selection:bg-[#111] selection:text-white">
      {/* 1. Configurable Announcement Bar */}
      <AnnouncementBar
        activeCurrency={activeCurrency}
        onCurrencyChange={(curr) => setActiveCurrency(curr)}
      />

      {/* 2. Premium Luxury Navigation Header (WARDROBE / MONCLER Style) */}
      <NavigationHeader
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Interactive Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currency={activeCurrency}
        onSelectProduct={(p) => handleAddToCart(p, p.sizes[0] || "M")}
      />

      {/* Slide-Over Shopping Bag Drawer */}
      <MiniCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currency={activeCurrency}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <main className="flex-1">
        {/* =========================================================================
            SECTION 1: HERO — "Designed for colder days" + 8K MASTER CAMPAIGN
            Exact Wardrobe structure elevated with 8K Moncler Cold Horizon canvas!
        ========================================================================== */}
        <WardrobeElevatedHero onShopClick={() => setIsCartOpen(true)} />

        {/* =========================================================================
            SECTION 2: BEST SELLERS (Wardrobe Framer 4-Column Studio Showcase)
        ========================================================================== */}
        <WardrobeBestSellers
          currency={activeCurrency}
          onAddToCart={handleAddToCart}
        />

        {/* =========================================================================
            SECTION 3: SHOP BY CATEGORY (Women, Men, Jackets, Accessories)
        ========================================================================== */}
        <WardrobeCategoryGrid />

        {/* =========================================================================
            SECTION 4: AS SEEN ON SOCIAL / UGC
        ========================================================================== */}
        <WardrobeUgcSocial />

        {/* =========================================================================
            SECTION 5: BLACK FRIDAY DEALS / SEASONAL COUNTDOWN BANNER
        ========================================================================== */}
        <WardrobePromoCountdown />

        {/* =========================================================================
            SECTION 6: THE JOURNAL — "Get dressed, feel better"
        ========================================================================== */}
        <WardrobeJournalSection />

        {/* =========================================================================
            SECTION 7: ALPINE LOOKBOOK ARCHIVE
        ========================================================================== */}
        <AlpineLookbookSpread />

        {/* =========================================================================
            SECTION 8: BRAND STORY & ATELIER HERITAGE
        ========================================================================== */}
        <BrandStorySection />

        {/* =========================================================================
            SECTION 9: TRUST & SERVICE PILLARS (Free Shipping, 30-Day Returns, Trusted)
        ========================================================================== */}
        <WardrobeTrustPillars />

        {/* =========================================================================
            SECTION 10: VERIFIED CUSTOMER REVIEWS
        ========================================================================== */}
        <CustomerReviewsSection />

        {/* =========================================================================
            SECTION 11: NEWSLETTER & VIP ACCESS (10% Off First Order)
        ========================================================================== */}
        <NewsletterSection />

        {/* =========================================================================
            SECTION 12: INSTAGRAM COMMUNITY FEED
        ========================================================================== */}
        <SocialInspirationSection />
      </main>

      {/* International Store Footer */}
      <SiteFooter />
    </div>
  );
}
