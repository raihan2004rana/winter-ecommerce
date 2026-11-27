"use client";

import * as React from "react";
import { WardrobeExactHero } from "@/components/storefront/wardrobe-exact-hero";
import { WardrobeExactPartners } from "@/components/storefront/wardrobe-exact-partners";
import { WardrobeExactBestSellers } from "@/components/storefront/wardrobe-exact-best-sellers";
import { WardrobeExactCategories } from "@/components/storefront/wardrobe-exact-categories";
import { WardrobeExactUgc } from "@/components/storefront/wardrobe-exact-ugc";
import { WardrobeExactPromo } from "@/components/storefront/wardrobe-exact-promo";
import { WardrobeExactJournal } from "@/components/storefront/wardrobe-exact-journal";
import { WardrobeExactInstagram } from "@/components/storefront/wardrobe-exact-instagram";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { Product, PRODUCTS_CATALOG } from "@/data/products";

export default function StorefrontHomePage() {
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

  return (
    <StoreLayoutWrapper>
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
      />

      {/* 6. Section 5: As seen on you (Coverflow / 3D Fan Carousel) */}
      <WardrobeExactUgc />

      {/* 7. Section 6: Black Friday deals are live (50/50 Split Promo + Digital Timer) */}
      <WardrobeExactPromo />

      {/* 8. Section 7: Get dressed, feel better (3-Column Journal Articles) */}
      <WardrobeExactJournal />

      {/* 9. Section 8: Follow us on Instagram (4-Column Photo Grid) */}
      <WardrobeExactInstagram />
    </StoreLayoutWrapper>
  );
}
