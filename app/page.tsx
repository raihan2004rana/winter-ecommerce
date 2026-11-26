"use client";

import * as React from "react";
import { WardrobeAnnouncementBar } from "@/components/storefront/wardrobe-announcement-bar";
import { WardrobeExactHeader } from "@/components/storefront/wardrobe-exact-header";
import { WardrobeExactHero } from "@/components/storefront/wardrobe-exact-hero";
import { WardrobeExactPartners } from "@/components/storefront/wardrobe-exact-partners";
import { WardrobeExactBestSellers } from "@/components/storefront/wardrobe-exact-best-sellers";
import { WardrobeExactCategories } from "@/components/storefront/wardrobe-exact-categories";
import { WardrobeExactUgc } from "@/components/storefront/wardrobe-exact-ugc";
import { WardrobeExactPromo } from "@/components/storefront/wardrobe-exact-promo";
import { WardrobeExactJournal } from "@/components/storefront/wardrobe-exact-journal";
import { WardrobeExactInstagram } from "@/components/storefront/wardrobe-exact-instagram";
import { WardrobeExactFooter } from "@/components/storefront/wardrobe-exact-footer";

import { SearchModal } from "@/components/storefront/search-modal";
import { MiniCartDrawer, CartItem } from "@/components/storefront/mini-cart-drawer";
import { Product, PRODUCTS_CATALOG } from "@/data/products";
import { useCartStore } from "@/lib/store/cart-store";
import { FlyToCartProvider } from "@/components/storefront/fly-to-cart-provider";

export default function StorefrontHomePage() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>(PRODUCTS_CATALOG);

  React.useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error("Failed to load live products:", err));
  }, []);

  // Cart state initialized with authentic winter items
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: "prod-007",
      title: "Technical Polartec Thermal Zip Hoodie",
      price: 225.0,
      size: "M",
      color: "Alabaster White",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=85&w=600",
      quantity: 1,
    },
    {
      id: "prod-001",
      title: "Nordic Expedition Down Parka",
      price: 685.0,
      size: "L",
      color: "Obsidian Slate",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      quantity: 1,
    },
  ]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: Product, size: string) => {
    useCartStore.getState().addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      size,
      color: product.colorways[0]?.name || "Standard",
      image: product.primaryImage,
      quantity: 1,
    });

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

    // Open side cart drawer right after the flying thumbnail lands in header cart
    setTimeout(() => {
      setIsCartOpen(true);
    }, 680);
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
    <FlyToCartProvider>
      <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#111] font-sans selection:bg-[#111] selection:text-white">
        {/* Top Announcement Bar (Live Marketing Campaign with Coupon & Real-time Tracking) */}
        <WardrobeAnnouncementBar />

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

          {/* 2.5 Partners Marquee Section: Famous Innovation & Retail Partners Auto-Slider */}
          <WardrobeExactPartners />

          {/* 3. Section 2: Best sellers (Winter Down Parkas & Heavy Outerwear) */}
          <WardrobeExactBestSellers
            title="Best sellers"
            subtitle="Curated winter down outerwear, insulated shells & weather protection."
            items={products.slice(0, 4)}
            startIndex={0}
            count={4}
            onAddToCart={handleAddToCart}
          />

          {/* 4. Section 3: Shop by category (50/50 Split Women & Men with red tags) */}
          <WardrobeExactCategories />

          {/* 5. Section 4: Second Best sellers collection row (Winter Essentials & Knitwear) */}
          <WardrobeExactBestSellers
            title="Winter Essentials"
            subtitle="Merino knitwear, thermal fleece hoodies, trekking boots & accessories."
            items={products.slice(4, 8)}
            startIndex={4}
            count={4}
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
    </FlyToCartProvider>
  );
}
