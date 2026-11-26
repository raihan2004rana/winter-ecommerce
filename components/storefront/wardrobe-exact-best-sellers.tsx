"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, ShoppingBag } from "lucide-react";
import { Product, PRODUCTS_CATALOG } from "@/data/products";
import { useFlyToCart } from "./fly-to-cart-provider";

interface WardrobeExactBestSellersProps {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  items?: Product[];
  startIndex?: number;
  count?: number;
  onAddToCart?: (product: Product, size: string) => void;
}

export function WardrobeExactBestSellers({
  title = "Best sellers",
  subtitle = "Curated winter essentials designed for daily warmth and effortless layering.",
  viewAllHref = "/products",
  items,
  startIndex = 0,
  count = 4,
  onAddToCart,
}: WardrobeExactBestSellersProps) {
  const [added, setAdded] = React.useState<string | null>(null);
  const { triggerFlyToCart } = useFlyToCart();

  // Use passed items or slice from catalog
  const displayProducts = items || PRODUCTS_CATALOG.slice(startIndex, startIndex + count);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger luxurious fly-to-cart animation directly from card image
    const card = (e.currentTarget as HTMLElement).closest(".group");
    const imgEl = card?.querySelector("img");
    triggerFlyToCart(
      product.primaryImage,
      (imgEl as HTMLElement) || (e.currentTarget as HTMLElement)
    );

    if (onAddToCart) {
      onAddToCart(product, product.sizes[0] || "M");
      setAdded(product.id);
      setTimeout(() => setAdded(null), 1600);
    }
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header: Best sellers + View all */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8 sm:mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111] font-normal tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#666] font-sans mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={viewAllHref}
            className="text-xs font-mono text-[#555] hover:text-black tracking-wider uppercase transition-colors shrink-0"
          >
            View all ({PRODUCTS_CATALOG.length})
          </Link>
        </div>

        {/* 4-Column Winter Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayProducts.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-[#FFFFFF] border border-[#EFEFEF] hover:border-[#111] transition-all duration-300"
            >
              {/* Product Photo with hover alternate image */}
              <Link
                href={`/products/${item.slug}`}
                className="relative aspect-[3/4] w-full bg-[#F7F7F8] overflow-hidden flex items-center justify-center block"
              >
                <Image
                  src={item.primaryImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-[center_20%] group-hover:scale-104 transition-transform duration-500 ease-out"
                />

                {/* Secondary hover image if available */}
                {(item.galleryImages?.[0] || item.secondaryImage) && (
                  <Image
                    src={item.galleryImages?.[0] || item.secondaryImage || ""}
                    alt={`${item.title} view`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-[center_20%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                  />
                )}

                {/* Category or Restock Badge */}
                {item.isBestSeller && (
                  <div className="absolute top-3 left-3 bg-[#111] text-white text-[0.6rem] font-mono uppercase tracking-widest px-2 py-0.5 font-semibold">
                    Best seller
                  </div>
                )}
                {item.isNew && !item.isBestSeller && (
                  <div className="absolute top-3 left-3 bg-white/95 text-[#111] border border-[#E5E5E5] text-[0.6rem] font-mono uppercase tracking-widest px-2 py-0.5 font-semibold">
                    New arrival
                  </div>
                )}
              </Link>

              {/* Product Info & Action Button */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div className="text-center space-y-1">
                  {/* Title */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-sans text-sm font-medium text-[#111] hover:text-[#555] block transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>

                  {/* Stars + Review Count */}
                  <div className="flex items-center justify-center space-x-1">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[0.68rem] font-mono text-[#888]">
                      ({item.reviewCount || 128} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline justify-center space-x-2 font-mono text-sm font-semibold text-[#111]">
                    <span>${item.price.toFixed(2)}</span>
                    {item.compareAtPrice && (
                      <span className="text-xs text-[#888] line-through font-normal">
                        ${item.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Full-Width Add to Cart Button (Matching Wardrobe Reference Design) */}
                <button
                  onClick={(e) => handleAdd(item, e)}
                  className={`w-full py-2.5 px-4 text-xs font-mono uppercase tracking-wider font-semibold transition-colors duration-200 flex items-center justify-center space-x-1.5 ${
                    added === item.id
                      ? "bg-emerald-700 text-white"
                      : "bg-[#2B2B2B] hover:bg-black text-white"
                  }`}
                >
                  {added === item.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
