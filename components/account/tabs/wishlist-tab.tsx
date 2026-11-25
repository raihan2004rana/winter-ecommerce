"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/use-store";
import { PRODUCTS_CATALOG } from "@/data/products";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WishlistTabProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
}

export function WishlistTab({ currency }: WishlistTabProps) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [selectedSizes, setSelectedSizes] = React.useState<Record<string, string>>({});

  // Match wishlist product IDs to product catalog
  const wishlistedProducts = PRODUCTS_CATALOG.filter((p) => wishlist.includes(p.id));

  const handleQuickAdd = (product: any) => {
    const size = selectedSizes[product.id] || product.sizes[0] || "M";
    addToCart(product, size);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
            Private Wishlist Vault ({wishlistedProducts.length})
          </h2>
          <p className="text-xs text-[#666]">
            Curated garments bookmarked for seasonal allocation and size monitoring.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <Link
            href="/products"
            className="text-2xs uppercase font-mono tracking-widest text-[#555] hover:text-black underline"
          >
            Explore More Garments →
          </Link>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#FAFBFD] border border-[#EAEAEA] flex items-center justify-center mx-auto text-[#888]">
            <Heart className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans text-base font-semibold text-[#111]">
              Your Vault is Currently Empty
            </h3>
            <p className="text-xs text-[#666] max-w-sm mx-auto">
              Explore our sub-zero down parkas, Mongolian cashmere, and shearling footwear to save items to your personal vault.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-2.5 text-2xs uppercase tracking-widest font-mono hover:bg-[#222] transition-colors"
          >
            <span>Discover Collection</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || product.sizes[0] || "M";

            return (
              <div
                key={product.id}
                className="bg-white border border-[#EAEAEA] p-4 space-y-3 relative group hover:border-black transition-colors"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full bg-[#F6F6F6] overflow-hidden">
                  <Image
                    src={product.primaryImage}
                    alt={product.title}
                    fill
                    className="object-cover object-center group-hover:scale-104 transition-transform duration-500"
                  />
                  {product.temperatureRating && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="temp">{product.temperatureRating}</Badge>
                    </div>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-black transition-colors rounded-full"
                    aria-label="Remove from vault"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[#B91C1C]" />
                  </button>
                </div>

                {/* Garment Details */}
                <div className="space-y-1">
                  <span className="text-2xs uppercase tracking-widest text-[#888] font-mono block">
                    {product.categoryLabel}
                  </span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-sans text-xs font-semibold text-[#111] hover:underline block line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <p className="font-mono text-xs font-bold text-black">
                    {formatCurrency(product.price, currency)}
                  </p>
                </div>

                {/* Size Choice & Add to Cart */}
                <div className="pt-2 border-t border-[#EAEAEA] space-y-2">
                  <div className="flex items-center justify-between text-2xs font-mono text-[#666]">
                    <span>Select Size:</span>
                    <div className="flex items-center space-x-1">
                      {product.sizes.slice(0, 4).map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))
                          }
                          className={`h-5 w-6 border text-[0.62rem] uppercase flex items-center justify-center transition-colors ${
                            currentSize === s
                              ? "bg-black text-white border-black"
                              : "border-[#DDD] text-[#555] hover:border-black"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="w-full bg-[#111] hover:bg-black text-white py-2 text-2xs uppercase tracking-widest font-mono flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Transfer to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
