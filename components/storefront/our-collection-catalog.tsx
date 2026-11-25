"use client";

import * as React from "react";
import Image from "next/image";
import { REFERENCE_COLLECTION_PRODUCTS, Product } from "@/data/products";
import { Heart, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OurCollectionCatalogProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart: (product: Product, size: string) => void;
}

export function OurCollectionCatalog({
  currency,
  onAddToCart,
}: OurCollectionCatalogProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"popularity" | "price-asc" | "price-desc">("popularity");
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [selectedColors, setSelectedColors] = React.useState<Record<string, number>>({});
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  // Category menu matching Image 2 reference
  const categories = [
    { id: "all", number: "01", label: "ALL PRODUCTS" },
    { id: "waterproof", number: "02", label: "WATERPROOF JACKETS" },
    { id: "down", number: "03", label: "DOWN JACKETS" },
    { id: "parkas", number: "04", label: "PARKAS" },
    { id: "vests", number: "05", label: "INSULATED VESTS" },
    { id: "boots", number: "06", label: "BOOTS" },
    { id: "camping", number: "07", label: "CAMPING GEAR" },
  ];

  // Toggle wishlist state
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter products by selected category
  const filtered = activeCategory === "all"
    ? REFERENCE_COLLECTION_PRODUCTS
    : REFERENCE_COLLECTION_PRODUCTS.filter((p) => p.category === activeCategory);

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return b.rating - a.rating; // Popularity default
  });

  return (
    <section id="our-collection" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#222]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* =========================================
              LEFT SIDEBAR: CATEGORIES & SHOW MORE
          ========================================== */}
          <aside className="lg:col-span-3 space-y-8">
            <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111] uppercase">
              OUR COLLECTION
            </h2>

            {/* Category Index List */}
            <nav className="flex flex-col border-t border-[#EBEBEB]">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center space-x-3 py-3.5 border-b border-[#EBEBEB] text-left text-xs uppercase tracking-wider transition-colors ${
                      isActive
                        ? "font-bold text-[#111]"
                        : "font-normal text-[#757575] hover:text-[#111]"
                    }`}
                  >
                    <span className="font-mono text-2xs text-[#999] w-5">
                      {cat.number}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Black Pill "SHOW MORE" Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveCategory("all")}
                className="bg-[#111111] hover:bg-[#2A2A2A] text-white rounded-full px-7 py-3 text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
              >
                SHOW MORE
              </button>
            </div>
          </aside>

          {/* =========================================
              RIGHT MAIN CONTENT: SORT & 3-COL PRODUCT GRID
          ========================================== */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Sort By Dropdown */}
            <div className="flex items-center justify-end relative">
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center space-x-1.5 text-xs uppercase tracking-widest font-medium text-[#444] hover:text-black py-1 px-2 border border-transparent hover:border-[#EAEAEA] rounded-none transition-colors"
                >
                  <span className="text-[#888]">SORT BY</span>
                  <span className="font-semibold text-[#111]">
                    {sortBy === "popularity"
                      ? "POPULARITY"
                      : sortBy === "price-asc"
                      ? "PRICE: LOW TO HIGH"
                      : "PRICE: HIGH TO LOW"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#555]" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-[#EAEAEA] shadow-lg py-1 z-30">
                    <button
                      onClick={() => {
                        setSortBy("popularity");
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-[#333] hover:bg-[#F7F7F7]"
                    >
                      Popularity
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("price-asc");
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-[#333] hover:bg-[#F7F7F7]"
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("price-desc");
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-[#333] hover:bg-[#F7F7F7]"
                    >
                      Price: High to Low
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3-Column Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {sorted.map((product) => {
                const colorIdx = selectedColors[product.id] || 0;
                const activeColor = product.colorways[colorIdx] || product.colorways[0];
                const isSaved = !!wishlist[product.id];

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col space-y-3 cursor-pointer"
                    onClick={() => onAddToCart(product, product.sizes[0] || "M")}
                  >
                    {/* Outer Card Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center p-3">
                      {/* Top Left RESTOCKS Badge */}
                      {product.isRestock && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="text-[0.62rem] font-medium tracking-widest text-[#444] uppercase bg-white/90 border border-[#E5E5E5] px-1.5 py-0.5">
                            RESTOCKS
                          </span>
                        </div>
                      )}

                      {/* Top Right Heart Outline (Wishlist) */}
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-3 right-3 z-10 p-1 text-[#555] hover:text-black transition-colors"
                        aria-label="Save to wishlist"
                      >
                        <Heart
                          className={`h-4.5 w-4.5 transition-colors ${
                            isSaved ? "fill-black text-black" : "text-[#777] hover:text-black"
                          }`}
                        />
                      </button>

                      {/* Studio Shot Image */}
                      <div className="relative h-full w-full">
                        <Image
                          src={product.primaryImage}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                        />
                      </div>

                      {/* Swatch Dots (Visible if multiple colorways exist) */}
                      {product.colorways.length > 1 && (
                        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center space-x-1.5 z-10">
                          {product.colorways.map((col, idx) => (
                            <button
                              key={col.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColors((prev) => ({ ...prev, [product.id]: idx }));
                              }}
                              aria-label={`Select ${col.name}`}
                              className={`h-2.5 w-2.5 rounded-full border transition-all ${
                                colorIdx === idx
                                  ? "border-black scale-125 ring-1 ring-black/40"
                                  : "border-transparent opacity-75 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: col.hex }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Typography & Pricing */}
                    <div className="space-y-1">
                      <h3 className="font-sans text-xs sm:text-sm font-medium text-[#111] group-hover:text-[#555] transition-colors leading-snug">
                        {product.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm font-bold text-[#111]">
                        {formatCurrency(product.price, currency)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
