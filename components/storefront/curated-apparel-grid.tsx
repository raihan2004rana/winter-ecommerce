"use client";

import * as React from "react";
import Image from "next/image";
import { REFERENCE_COLLECTION_PRODUCTS, Product } from "@/data/products";
import { Heart, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CuratedApparelGridProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart: (product: Product, size: string) => void;
}

export function CuratedApparelGrid({
  currency,
  onAddToCart,
}: CuratedApparelGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [selectedColorMap, setSelectedColorMap] = React.useState<Record<string, number>>({});

  const filterTabs = [
    { id: "all", label: "ALL GARMENTS" },
    { id: "down", label: "DOWN JACKETS" },
    { id: "parkas", label: "PARKAS & COATS" },
    { id: "boots", label: "WINTER BOOTS" },
  ];

  const filtered = activeCategory === "all"
    ? REFERENCE_COLLECTION_PRODUCTS
    : REFERENCE_COLLECTION_PRODUCTS.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="core-apparel" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#111]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#EAEAEA] pb-6">
          <div className="space-y-1">
            <span className="text-2xs font-mono uppercase tracking-[0.22em] text-[#888] block">
              Core Apparel System
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#111] uppercase">
              Winter 2026/27 Architecture
            </h2>
          </div>

          {/* Clean Category Filter Tabs */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 md:pb-0">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 text-2xs uppercase tracking-widest font-mono transition-all ${
                    isActive
                      ? "bg-[#111] text-white border border-[#111]"
                      : "bg-[#F7F7F7] text-[#555] border border-[#EAEAEA] hover:border-[#111] hover:text-[#111]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Luxury Garment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filtered.map((product) => {
            const colorIdx = selectedColorMap[product.id] || 0;
            const isSaved = !!wishlist[product.id];

            return (
              <article
                key={product.id}
                className="group relative flex flex-col space-y-3 cursor-pointer"
                onClick={() => onAddToCart(product, product.sizes[0] || "M")}
              >
                {/* Image Container with Consistent Soft Studio Background */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA]">
                  {/* Top Left Tag */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    {product.isRestock && (
                      <span className="text-[0.62rem] font-semibold tracking-widest text-[#222] uppercase bg-white/90 border border-[#E5E5E5] px-2 py-0.5">
                        RESTOCK
                      </span>
                    )}
                    {product.temperatureRating && (
                      <span className="text-[0.62rem] font-mono tracking-wider text-[#444] uppercase bg-white/90 border border-[#E5E5E5] px-2 py-0.5">
                        {product.temperatureRating}
                      </span>
                    )}
                  </div>

                  {/* Top Right Wishlist Toggle */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 hover:bg-white text-[#444] hover:text-black transition-all rounded-full shadow-xs"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isSaved ? "fill-black text-black" : "text-[#777] hover:text-black"
                      }`}
                    />
                  </button>

                  {/* Primary Studio Photography */}
                  <Image
                    src={product.primaryImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                  />

                  {/* Quick Size Select Overlay on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 border-t border-[#EAEAEA] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <p className="text-[0.65rem] uppercase tracking-widest text-[#777] mb-2 font-mono">
                      Select Size to Quick Add
                    </p>
                    <div className="grid grid-cols-5 gap-1">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product, size);
                          }}
                          className="h-7 border border-[#DDD] hover:border-black hover:bg-black hover:text-white text-2xs font-mono uppercase transition-colors flex items-center justify-center bg-white"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Garment Details & Colorway Swatches */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs uppercase tracking-widest text-[#888] font-mono">
                      {product.categoryLabel}
                    </span>
                    {/* Swatch dots */}
                    {product.colorways.length > 1 && (
                      <div className="flex items-center space-x-1.5">
                        {product.colorways.map((col, idx) => (
                          <button
                            key={col.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedColorMap((prev) => ({ ...prev, [product.id]: idx }));
                            }}
                            className={`h-2.5 w-2.5 rounded-full border transition-all ${
                              colorIdx === idx
                                ? "border-black scale-125 ring-1 ring-black/50"
                                : "border-transparent opacity-75 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="font-sans text-xs sm:text-sm font-semibold text-[#111] group-hover:text-[#555] transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#111]">
                      {formatCurrency(product.price, currency)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="font-mono text-xs text-[#999] line-through">
                        {formatCurrency(product.compareAtPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
