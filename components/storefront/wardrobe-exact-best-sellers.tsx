"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/data/products";

interface WardrobeExactBestSellersProps {
  title?: string;
  onAddToCart?: (product: Product, size: string) => void;
}

const EXACT_PRODUCTS = [
  {
    id: "mens-active-tank",
    slug: "mens-active-tank",
    title: "Mens Active Tank",
    price: 40.0,
    rating: 5,
    reviews: 123,
    image: "/images/wardrobe/8RwNEkUBdMbEJWp4v6iW3kWzQjQ.png",
  },
  {
    id: "mens-court-polo",
    slug: "mens-court-polo",
    title: "Mens Court Polo",
    price: 49.0,
    rating: 5,
    reviews: 123,
    image: "/images/wardrobe/pZNT9DG83xrRFjY0hhUxzQMVnTQ.png",
  },
  {
    id: "tennis-ball-bag",
    slug: "tennis-ball-bag",
    title: "Tennis Ball Bag",
    price: 79.0,
    rating: 5,
    reviews: 123,
    image: "/images/wardrobe/tosFOLtH0l28bSTw8uQm24ESBmQ.png",
  },
  {
    id: "tennis-balls",
    slug: "tennis-balls",
    title: "Tennis Balls",
    price: 5.0,
    rating: 5,
    reviews: 123,
    image: "/images/wardrobe/72WkcsrH89DWQlX78d8ng8XzSQg.png",
  },
];

export function WardrobeExactBestSellers({
  title = "Best sellers",
  onAddToCart,
}: WardrobeExactBestSellersProps) {
  const [added, setAdded] = React.useState<string | null>(null);

  const handleAdd = (item: (typeof EXACT_PRODUCTS)[0]) => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: item.id,
          slug: item.slug,
          title: item.title,
          subtitle: "Quiet essentials",
          description: "Comfortable styles designed to be worn every day.",
          gender: "unisex",
          category: "jackets-coats",
          categoryLabel: "Essentials",
          price: item.price,
          currency: "USD",
          primaryImage: item.image,
          galleryImages: [item.image],
          materials: ["100% Premium Cotton"],
          careInstructions: "Machine wash cold",
          fitType: "Regular Fit",
          colorways: [{ name: "Standard", hex: "#111" }],
          sizes: ["S", "M", "L", "XL"],
          stockCount: 15,
          rating: item.rating,
          reviewCount: item.reviews,
        },
        "M"
      );
      setAdded(item.id);
      setTimeout(() => setAdded(null), 1500);
    }
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header: Best sellers + View all */}
        <div className="flex items-baseline justify-between mb-8 sm:mb-10">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111] font-normal tracking-tight">
            {title}
          </h2>
          <Link
            href="/products"
            className="text-xs font-mono text-[#555] hover:text-black tracking-wider uppercase transition-colors"
          >
            View all
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {EXACT_PRODUCTS.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-[#FFFFFF] border border-[#EFEFEF] hover:border-[#111] transition-all duration-300"
            >
              {/* Product Photo */}
              <Link
                href={`/products/${item.slug}`}
                className="relative aspect-[3/4] w-full bg-[#F7F7F8] overflow-hidden flex items-center justify-center"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>

              {/* Product Info & Action Button */}
              <div className="p-4 flex flex-col space-y-2.5">
                <div className="text-center space-y-1">
                  {/* Title */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-sans text-sm font-medium text-[#111] hover:text-[#555] block transition-colors"
                  >
                    {item.title}
                  </Link>

                  {/* Stars + Review Count */}
                  <div className="flex items-center justify-center space-x-1">
                    <div className="flex text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[0.68rem] font-mono text-[#888]">
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="font-mono text-sm font-semibold text-[#111]">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Full-Width Add to Cart Button (Exact Wardrobe Framer Style) */}
                <button
                  onClick={() => handleAdd(item)}
                  className={`w-full py-2.5 px-4 text-xs font-mono uppercase tracking-wider font-semibold transition-colors duration-200 ${
                    added === item.id
                      ? "bg-emerald-700 text-white"
                      : "bg-[#2B2B2B] hover:bg-black text-white"
                  }`}
                >
                  {added === item.id ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
