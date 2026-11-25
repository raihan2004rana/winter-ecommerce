"use client";

import * as React from "react";
import Link from "next/link";
import { PRODUCTS_CATALOG, Product } from "@/data/products";
import { EditorialPortraitCard } from "@/components/design-system/product-card";
import { ArrowRight } from "lucide-react";

interface BestSellersSectionProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart: (product: Product, size: string) => void;
}

export function BestSellersSection({
  currency,
  onAddToCart,
}: BestSellersSectionProps) {
  const bestSellers = PRODUCTS_CATALOG.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section id="outerwear" className="py-20 sm:py-28 bg-canvas-subtle border-y border-canvas-muted">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-1">
            <span className="editorial-caps text-forest font-semibold">Seasonal Benchmarks</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
              Best-Selling Winter Garments
            </h2>
          </div>
          <Link
            href="#all-products"
            className="inline-flex items-center space-x-2 text-2xs uppercase tracking-widest font-medium text-charcoal hover:text-forest transition-colors"
          >
            <span>View Full Archive</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <EditorialPortraitCard
              key={product.id}
              product={{
                ...product,
                currency,
              }}
              onQuickAdd={(size) => onAddToCart(product, size)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
