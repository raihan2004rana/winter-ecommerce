"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, ShoppingBag, Heart, Check } from "lucide-react";
import { Product, PRODUCTS_CATALOG } from "@/data/products";

interface WardrobeBestSellersProps {
  currency?: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart?: (product: Product, size: string) => void;
}

export function WardrobeBestSellers({
  currency = "USD",
  onAddToCart,
}: WardrobeBestSellersProps) {
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [addedItem, setAddedItem] = React.useState<string | null>(null);

  const bestSellers = PRODUCTS_CATALOG.filter((p) => p.isBestSeller || p.rating >= 4.9).slice(0, 4);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (product: Product, size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, size);
      setAddedItem(product.id);
      setTimeout(() => setAddedItem(null), 1800);
    }
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-16 sm:py-24 border-b border-[#EAEAEA]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* =========================================================================
            HEADER: "Best sellers" + "View all" (Framer Wardrobe Structure)
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-2xs font-mono uppercase tracking-[0.25em] text-[#777] mb-1.5">
              <span>Collection Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-medium tracking-[-0.03em] text-[#111]">
              Best sellers
            </h2>
            <p className="text-xs sm:text-sm text-[#666] font-sans mt-1">
              Quiet winter essentials designed for daily warmth and effortless layering.
            </p>
          </div>

          <Link
            href="/products?filter=best-sellers"
            className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest font-semibold text-[#111] hover:text-[#555] transition-colors self-start sm:self-end"
          >
            <span>View all ({PRODUCTS_CATALOG.length})</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* =========================================================================
            4-COLUMN PRODUCT GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.map((product) => {
            const isWishlisted = !!wishlist[product.id];
            const isJustAdded = addedItem === product.id;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-[#EAEAEA] hover:border-[#111] transition-all duration-300 relative rounded-none"
              >
                {/* Product Image Container */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[3/4] w-full bg-[#F5F5F7] overflow-hidden block"
                >
                  <Image
                    src={product.primaryImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-[center_20%] group-hover:scale-104 transition-transform duration-700 ease-out"
                  />

                  {/* Secondary Image on Hover if available */}
                  {product.secondaryImage && (
                    <Image
                      src={product.secondaryImage}
                      alt={`${product.title} Alternate`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-[center_20%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                    />
                  )}

                  {/* Badges: Best Seller / Restock */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.isBestSeller && (
                      <span className="bg-[#111] text-white text-[0.6rem] font-mono uppercase tracking-widest px-2.5 py-1 font-semibold">
                        Best seller
                      </span>
                    )}
                    {product.isRestock && (
                      <span className="bg-white/95 text-[#111] border border-[#E5E5E5] text-[0.6rem] font-mono uppercase tracking-widest px-2 py-1 font-semibold">
                        Restock
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-[#111] shadow-xs flex items-center justify-center transition-transform hover:scale-110 z-10"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted ? "fill-red-600 text-red-600" : "text-[#444]"
                      } transition-colors`}
                    />
                  </button>

                  {/* Quick Add Slide-up Drawer on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <div className="bg-white/95 backdrop-blur-xs p-2 flex items-center justify-between gap-1 shadow-md">
                      <span className="text-[0.62rem] font-mono uppercase tracking-wider text-[#777] px-1">
                        Select:
                      </span>
                      <div className="flex items-center space-x-1">
                        {product.sizes.slice(0, 4).map((size) => (
                          <button
                            key={size}
                            onClick={(e) => handleQuickAdd(product, size, e)}
                            className="h-7 min-w-7 px-1.5 text-2xs font-mono font-semibold border border-[#E5E5E5] hover:border-black hover:bg-black hover:text-white transition-colors"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Product Info Section */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      {/* Rating & Reviews */}
                      <div className="flex items-center space-x-1">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500" />
                          ))}
                        </div>
                        <span className="text-[0.68rem] font-mono text-[#777]">
                          ({product.reviewCount || 123} reviews)
                        </span>
                      </div>

                      {/* Live Stock Indicator */}
                      <span className="text-[0.62rem] font-mono text-emerald-600 font-medium">
                        In stock
                      </span>
                    </div>

                    {/* Product Title */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="block font-sans text-sm font-medium text-[#111] hover:text-[#555] transition-colors leading-snug line-clamp-1"
                    >
                      {product.title}
                    </Link>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-mono text-sm font-semibold text-[#111]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="font-mono text-xs text-[#888] line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, product.sizes[0] || "M", e)}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 text-2xs font-mono uppercase tracking-wider font-semibold border transition-all ${
                        isJustAdded
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-white border-[#DDD] hover:border-black hover:bg-black hover:text-white text-[#111]"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3 w-3" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
