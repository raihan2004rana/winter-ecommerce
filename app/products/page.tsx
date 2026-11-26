import * as React from "react";
import { Metadata } from "next";
import { ProductListingView } from "@/components/storefront/product-listing-view";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";

export const metadata: Metadata = {
  title: "Shop All Winter Outerwear & Apparel | WARDROBE",
  description: "Browse the complete winter catalog: down parkas, double-faced wool overcoats, pure cashmere knits, and alpine boots.",
};

export default function ProductsPage() {
  return (
    <StoreLayoutWrapper>
      <React.Suspense fallback={<div className="min-h-screen bg-white p-12 text-center text-xs font-mono">Loading Catalog...</div>}>
        <ProductListingView
          initialTitle="All Winter Apparel"
          initialSubtitle="High-performance thermal outerwear, fine knitwear, and cold-weather accessories."
        />
      </React.Suspense>
    </StoreLayoutWrapper>
  );
}
