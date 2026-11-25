"use client";

import * as React from "react";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { NavigationHeader } from "@/components/storefront/navigation-header";
import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer, CartItem } from "@/components/storefront/mini-cart-drawer";
import { HeroSection } from "@/components/storefront/hero-section";
import { FeaturedCollections } from "@/components/storefront/featured-collections";
import { BestSellersSection } from "@/components/storefront/bestsellers-section";
import { NewArrivalsSection } from "@/components/storefront/new-arrivals-section";
import { SplitCraftBanner } from "@/components/design-system/editorial-banner";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { CategoryGridSection } from "@/components/storefront/category-grid-section";
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
      id: "prod-001",
      title: "Nordic Expedition Down Parka",
      price: 685,
      size: "M",
      color: "Obsidian Slate",
      image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=600",
      quantity: 1,
    },
    {
      id: "prod-006",
      title: "Brushed Cashmere Ribbed Scarf",
      price: 185,
      size: "One Size",
      color: "Pine Green",
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600",
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
    <div className="min-h-screen flex flex-col bg-canvas text-charcoal font-sans selection:bg-forest selection:text-canvas">
      {/* 1. Configurable Announcement Bar */}
      <AnnouncementBar
        activeCurrency={activeCurrency}
        onCurrencyChange={(curr) => setActiveCurrency(curr)}
      />

      {/* 2 & 3. Premium Responsive Navigation with Mega Menu */}
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
        {/* 4 & 5. Editorial Hero Section & Primary/Secondary CTAs */}
        <HeroSection />

        {/* 6. Featured Winter Collections */}
        <FeaturedCollections />

        {/* 7. Best-Selling Products */}
        <BestSellersSection
          currency={activeCurrency}
          onAddToCart={handleAddToCart}
        />

        {/* 8. New Arrivals with Tab Filters */}
        <NewArrivalsSection
          currency={activeCurrency}
          onAddToCart={handleAddToCart}
        />

        {/* 9. Seasonal Promotional Banner (Split Craft & Material Philosophy) */}
        <SplitCraftBanner
          title="RESPONSIBLE DOWN & THERMAL INTEGRITY"
          description="Every down cluster is 100% certified under the Responsible Down Standard (RDS). Packed with 850 fill power for maximum warmth-to-weight ratio without unnecessary bulk."
          ctaText="Explore Material Philosophy"
        />

        {/* 10. Limited-Time Offer / Flash Sale Section with Live Countdown */}
        <FlashSaleSection
          currency={activeCurrency}
          onAddToCart={handleAddToCart}
        />

        {/* 11. Featured Category Sections */}
        <CategoryGridSection />

        {/* 12. Promotional Advertisement Placements */}
        <PromotionalPlacements />

        {/* 13. Brand Story Section */}
        <BrandStorySection />

        {/* 14. Customer Reviews */}
        <CustomerReviewsSection />

        {/* 15. Newsletter Subscription */}
        <NewsletterSection />

        {/* 16. Instagram / Social Inspiration Section */}
        <SocialInspirationSection />
      </main>

      {/* 17. Complete Footer with Policies and Customer Support */}
      <SiteFooter />
    </div>
  );
}
