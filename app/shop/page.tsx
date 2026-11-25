import * as React from "react";
import { Metadata } from "next";
import { ProductListingView } from "@/components/storefront/product-listing-view";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";

export const metadata: Metadata = {
  title: "Shop All Winter Outerwear & Apparel | VALLIS & ORE",
  description: "Browse the complete winter catalog: down parkas, double-faced wool overcoats, pure cashmere knits, and alpine boots.",
};

export default function ShopPage() {
  return (
    <StoreLayoutWrapper>
      <React.Suspense fallback={<div className="min-h-screen bg-white p-12 text-center text-xs font-mono">Loading Catalog...</div>}>
        <ProductListingView
          initialTitle="Shop All Winter Apparel"
          initialSubtitle="Explore our complete cold-weather wardrobe engineered for sub-zero alpine conditions and city transit."
        />
      </React.Suspense>
    </StoreLayoutWrapper>
  );
}
