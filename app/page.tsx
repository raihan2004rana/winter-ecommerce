"use client";

import * as React from "react";
import { WardrobeExactHeader } from "@/components/storefront/wardrobe-exact-header";
import { WardrobeExactHero } from "@/components/storefront/wardrobe-exact-hero";
import { WardrobeExactBestSellers } from "@/components/storefront/wardrobe-exact-best-sellers";
import { WardrobeExactCategories } from "@/components/storefront/wardrobe-exact-categories";
import { WardrobeExactUgc } from "@/components/storefront/wardrobe-exact-ugc";
import { WardrobeExactPromo } from "@/components/storefront/wardrobe-exact-promo";
import { WardrobeExactJournal } from "@/components/storefront/wardrobe-exact-journal";
import { WardrobeExactInstagram } from "@/components/storefront/wardrobe-exact-instagram";
import { WardrobeExactFooter } from "@/components/storefront/wardrobe-exact-footer";

import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer, CartItem } from "@/components/storefront/mini-cart-drawer";
import { Product } from "@/data/products";

export default function StorefrontHomePage() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Cart state
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: "mens-active-tank",
      title: "Mens Active Tank",
      price: 40.0,
      size: "M",
      color: "Navy",
      image: "/images/wardrobe/8RwNEkUBdMbEJWp4v6iW3kWzQjQ.png",
      quantity: 1,
    },
    {
      id: "mens-court-polo",
      title: "Mens Court Polo",
      price: 49.0,
      size: "L",
      color: "Black",
      image: "/images/wardrobe/pZNT9DG83xrRFjY0hhUxzQMVnTQ.png",
      quantity: 1,
    },
  ]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
      {/* 1. Header (WARDROBE logo, Women, Men, Journal, About, Cart Pill) */}
      <WardrobeExactHeader
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currency="USD"
        onSelectProduct={(p) => handleAddToCart(p, p.sizes[0] || "M")}
      />

      {/* Slide-Over Cart Drawer */}
      <MiniCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currency="USD"
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <main className="flex-1">
        {/* 2. Hero Section: "Designed for colder days" Hoodie Rack Banner */}
        <WardrobeExactHero />

        {/* 3. Section 2: Best sellers (4-column cards with full-width Add to Cart buttons) */}
        <WardrobeExactBestSellers
          title="Best sellers"
          onAddToCart={handleAddToCart}
        />

        {/* 4. Section 3: Shop by category (50/50 Split Women & Men with red tags) */}
        <WardrobeExactCategories />

        {/* 5. Section 4: Second Best sellers collection row */}
        <WardrobeExactBestSellers
          title="Best sellers"
          onAddToCart={handleAddToCart}
        />

        {/* 6. Section 5: As seen on you (Coverflow / 3D Fan Carousel) */}
        <WardrobeExactUgc />

        {/* 7. Section 6: Black Friday deals are live (50/50 Split Promo + Digital Timer) */}
        <WardrobeExactPromo />

        {/* 8. Section 7: Get dressed, feel better (3-Column Journal Articles) */}
        <WardrobeExactJournal />

        {/* 9. Section 8: Follow us on Instagram (4-Column Photo Grid) */}
        <WardrobeExactInstagram />
      </main>

      {/* 10. Footer (3 Guarantee Pillars + WARDROBE Newsletter, Links & Payments) */}
      <WardrobeExactFooter />
    </div>
  );
}
