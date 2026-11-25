"use client";

import * as React from "react";
import { PRODUCTS_CATALOG, Product } from "@/data/products";
import { EditorialPortraitCard } from "@/components/design-system/product-card";

interface NewArrivalsSectionProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart: (product: Product, size: string) => void;
}

export function NewArrivalsSection({
  currency,
  onAddToCart,
}: NewArrivalsSectionProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "down" | "parkas" | "boots">("all");

  const filteredProducts = activeTab === "all"
    ? PRODUCTS_CATALOG.slice(0, 4)
    : PRODUCTS_CATALOG.filter((p) => p.category === activeTab).slice(0, 4);

  const tabs: Array<{ key: "all" | "down" | "parkas" | "boots"; label: string }> = [
    { key: "all", label: "All Arrivals" },
    { key: "down", label: "Down Jackets" },
    { key: "parkas", label: "Parkas" },
    { key: "boots", label: "Winter Boots" },
  ];

  return (
    <section id="knitwear" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-12">
      {/* Header with Interactive Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-canvas-muted pb-6">
        <div className="space-y-1">
          <span className="editorial-caps text-forest font-semibold">Fresh From The Ateliers</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            New Season Arrivals
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-2xs uppercase tracking-widest font-mono transition-all ${
                activeTab === tab.key
                  ? "bg-charcoal text-canvas border border-charcoal"
                  : "bg-transparent text-charcoal-600 border border-canvas-muted hover:border-charcoal/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <EditorialPortraitCard
            key={`arrival-${product.id}`}
            product={{
              ...product,
              currency,
            }}
            onQuickAdd={(size) => onAddToCart(product, size)}
          />
        ))}
      </div>
    </section>
  );
}
