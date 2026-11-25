"use client";

import * as React from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { NavigationHeader } from "@/components/storefront/navigation-header";
import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer, CartItem } from "@/components/storefront/mini-cart-drawer";
import { ColdHorizonHero } from "@/components/storefront/cold-horizon-hero";
import { OurCollectionCatalog } from "@/components/storefront/our-collection-catalog";
import { FeaturedCollections } from "@/components/storefront/featured-collections";
import { SplitCraftBanner } from "@/components/design-system/editorial-banner";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { PromotionalPlacements } from "@/components/storefront/promotional-placements";
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
      color: "Sienna Brown",
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
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#222] font-sans selection:bg-[#111] selection:text-white">
      {/* 1. Configurable Announcement Bar */}
      <AnnouncementBar
        activeCurrency={activeCurrency}
        onCurrencyChange={(curr) => setActiveCurrency(curr)}
      />

      {/* 2 & 3. Premium Reference Navigation (MONCLER, WINTER 26, WOMEN, MAN, MY ACCOUNT) */}
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
            SECTION 1 (IMAGE 1 REFERENCE): COLD HORIZON FASHION SNOWSCAPE HERO
        ========================================================================== */}
        <ColdHorizonHero
          onShopNow={() => {
            const el = document.getElementById("our-collection");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* =========================================================================
            SECTION 2 (IMAGE 2 REFERENCE): OUR COLLECTION INDEXED CATALOG
        ========================================================================== */}
        <OurCollectionCatalog
          currency={activeCurrency}
          onAddToCart={handleAddToCart}
        />

        {/* =========================================================================
            COMPLEMENTARY WINTER EDITORIAL SECTIONS
        ========================================================================== */}
        {/* Featured Winter Collections */}
        <FeaturedCollections />

        {/* Seasonal Promotional Banner: Material Philosophy */}
        <SplitCraftBanner
          title="RESPONSIBLE DOWN & THERMAL INTEGRITY"
          description="Every down cluster is 100% certified under the Responsible Down Standard (RDS). Packed with 850 fill power for maximum warmth-to-weight ratio without unnecessary bulk."
          ctaText="Explore Material Philosophy"
        />

        {/* Limited-Time Offer / Flash Sale Section with Live Countdown */}
        <FlashSaleSection
          currency={activeCurrency}
          onAddToCart={handleAddToCart}
        />

        {/* Dual Promotional Advertisement Placements */}
        <PromotionalPlacements />

        {/* Brand Story Section */}
        <BrandStorySection />

        {/* Customer Reviews & Field Reports */}
        <CustomerReviewsSection />

        {/* Newsletter Subscription */}
        <NewsletterSection />

        {/* Shoppable Social Inspiration Section */}
        <SocialInspirationSection />
      </main>

      {/* International Store Footer */}
      <SiteFooter />
    </div>
  );
}
