"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { Heart, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CuratedApparelGridProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart: (product: Product, size: string) => void;
}

// 6 Core Studio Garments matching the reference design layout & titles
const STUDIO_REFERENCE_COLLECTION = [
  {
    id: "ref-001",
    slug: "thermal-insulated-shell-coat-mint",
    title: "Thermal Insulated Shell Coat",
    price: 249.0,
    categoryKey: "waterproof",
    isRestock: false,
    image: "https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&q=85&w=800", // Mint/Teal puffer jacket
    colorways: [{ name: "Glacial Mint", hex: "#7BB5B4" }],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "ref-002",
    slug: "classic-winter-down-coat",
    title: "Classic Winter Down Coat",
    price: 349.0,
    categoryKey: "down",
    isRestock: true,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=800", // Brown quilted down jacket
    colorways: [
      { name: "Chestnut Brown", hex: "#543C32" },
      { name: "Sienna Amber", hex: "#9E6D38" },
      { name: "Alpine Teal", hex: "#7BB5B4" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "ref-003",
    slug: "premium-down-parka",
    title: "Premium Down Parka",
    price: 399.0,
    categoryKey: "parkas",
    isRestock: false,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=85&w=800", // Grey technical parka
    colorways: [{ name: "Glacier Grey", hex: "#95A1AD" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "ref-004",
    slug: "thermal-insulated-shell-coat-brown",
    title: "Thermal Insulated Shell Coat",
    price: 279.0,
    categoryKey: "waterproof",
    isRestock: false,
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=800", // Dark brown hooded shell coat
    colorways: [{ name: "Espresso", hex: "#3A2924" }],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "ref-005",
    slug: "ultra-lightweight-down-jacket",
    title: "Ultra Lightweight Down Jacket",
    price: 249.0,
    categoryKey: "down",
    isRestock: false,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800", // White/cream alpine technical jacket
    colorways: [{ name: "Snow Ivory", hex: "#F5F5F3" }],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "ref-006",
    slug: "belted-longline-down-coat",
    title: "Belted Longline Down Coat",
    price: 359.0,
    categoryKey: "parkas",
    isRestock: true,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800", // Brown belted longline down coat
    colorways: [{ name: "Charcoal Brown", hex: "#44342F" }],
    sizes: ["XS", "S", "M", "L"],
  },
];

export function CuratedApparelGrid({
  currency,
  onAddToCart,
}: CuratedApparelGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});
  const [selectedColorMap, setSelectedColorMap] = React.useState<Record<string, number>>({});
  const [sortBy, setSortBy] = React.useState<string>("popularity");

  const categoriesList = [
    { id: "all", number: "01", label: "ALL PRODUCTS" },
    { id: "waterproof", number: "02", label: "WATERPROOF JACKETS" },
    { id: "down", number: "03", label: "DOWN JACKETS" },
    { id: "parkas", number: "04", label: "PARKAS" },
    { id: "vests", number: "05", label: "INSULATED VESTS" },
    { id: "boots", number: "06", label: "BOOTS" },
    { id: "camping", number: "07", label: "CAMPING GEAR" },
  ];

  const filteredGarments = activeCategory === "all"
    ? STUDIO_REFERENCE_COLLECTION
    : STUDIO_REFERENCE_COLLECTION.filter((p) => p.categoryKey === activeCategory);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="our-collection" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#111]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* Top Header matching Reference: "OUR COLLECTION" left, "SORT BY: POPULARITY" right */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-5 mb-10">
          <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-[#111]">
            Our Collection
          </h2>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-wider text-[#666]">
            <span>Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent pr-6 pl-2 py-1 font-bold text-black border-none focus:outline-none cursor-pointer tracking-widest text-2xs uppercase"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
              <ChevronDown className="absolute right-0 top-1.5 h-3 w-3 text-black pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout: Left Categories Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* =========================================================
              LEFT COLUMN: DEPARTMENT NAVIGATION (3 COLS)
          ========================================================== */}
          <div className="lg:col-span-3 space-y-6">
            <nav className="flex flex-col space-y-2.5 divide-y divide-[#F0F0F0]">
              {categoriesList.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`pt-2.5 flex items-center space-x-3 text-2xs font-mono tracking-widest text-left transition-colors ${
                      isActive
                        ? "text-black font-bold"
                        : "text-[#888] hover:text-black font-medium"
                    }`}
                  >
                    <span className="text-[0.62rem] opacity-70">{cat.number}</span>
                    <span className="uppercase">{cat.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom-Left "SHOW MORE" Pill Button from Reference */}
            <div className="pt-6">
              <Link
                href="/products"
                className="inline-block bg-black hover:bg-[#222] text-white px-7 py-3 text-2xs uppercase tracking-widest font-mono font-semibold rounded-full transition-all shadow-sm hover:shadow-md"
              >
                Show More
              </Link>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: 3-COLUMN STUDIO PRODUCT GRID (9 COLS)
          ========================================================== */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredGarments.map((garment) => {
                const colorIdx = selectedColorMap[garment.id] || 0;
                const isSaved = !!wishlist[garment.id];

                return (
                  <article
                    key={garment.id}
                    className="group relative flex flex-col space-y-3"
                  >
                    {/* Studio Image Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA]">
                      {/* Top Left RESTOCKS Badge */}
                      {garment.isRestock && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="text-[0.62rem] font-bold tracking-widest text-black uppercase bg-white/95 border border-[#DDD] px-2 py-0.5 shadow-2xs font-mono">
                            Restocks
                          </span>
                        </div>
                      )}

                      {/* Top Right Wishlist Toggle */}
                      <button
                        onClick={(e) => toggleWishlist(garment.id, e)}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 hover:bg-white text-[#555] hover:text-black transition-all rounded-full shadow-2xs"
                        aria-label="Save to wishlist"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 transition-colors ${
                            isSaved ? "fill-black text-black" : "text-[#777] hover:text-black"
                          }`}
                        />
                      </button>

                      {/* Product Image */}
                      <Link href={`/products/${garment.slug}`} className="relative h-full w-full block">
                        <Image
                          src={garment.image}
                          alt={garment.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                          className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                        />
                      </Link>

                      {/* Quick Size Select Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 border-t border-[#EAEAEA] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <p className="text-[0.62rem] uppercase tracking-widest text-[#777] mb-2 font-mono">
                          Quick Add Size
                        </p>
                        <div className="grid grid-cols-4 gap-1">
                          {garment.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(
                                  {
                                    id: garment.id,
                                    slug: garment.slug,
                                    title: garment.title,
                                    price: garment.price,
                                    primaryImage: garment.image,
                                    colorways: garment.colorways,
                                    sizes: garment.sizes,
                                    category: "jackets-coats",
                                    categoryLabel: "Jackets & Coats",
                                    subtitle: "Technical Down Outerwear",
                                    description: "Constructed for sub-zero alpine conditions.",
                                    gender: "unisex",
                                    stockCount: 8,
                                    materials: ["Toray Nylon", "RDS Goose Down"],
                                    careInstructions: "Specialist cold clean.",
                                    fitType: "Regular Fit",
                                    rating: 4.9,
                                    reviewCount: 32,
                                    galleryImages: [garment.image],
                                  },
                                  size
                                );
                              }}
                              className="h-7 border border-[#DDD] hover:border-black hover:bg-black hover:text-white text-2xs font-mono uppercase transition-colors flex items-center justify-center bg-white"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Garment Details & Color Swatches */}
                    <div className="space-y-1 pt-1">
                      {/* Swatch dots if multiple colors */}
                      {garment.colorways.length > 1 && (
                        <div className="flex items-center space-x-1.5 pb-1">
                          {garment.colorways.map((col, idx) => (
                            <button
                              key={col.name}
                              onClick={() =>
                                setSelectedColorMap((prev) => ({ ...prev, [garment.id]: idx }))
                              }
                              className={`h-2.5 w-2.5 rounded-full border transition-all ${
                                colorIdx === idx
                                  ? "border-black scale-125 ring-1 ring-black/60"
                                  : "border-transparent opacity-75 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: col.hex }}
                              aria-label={col.name}
                            />
                          ))}
                        </div>
                      )}

                      <Link href={`/products/${garment.slug}`}>
                        <h3 className="font-sans text-xs sm:text-sm font-medium text-[#111] group-hover:text-black transition-colors line-clamp-1 hover:underline underline-offset-2">
                          {garment.title}
                        </h3>
                      </Link>

                      <div className="font-mono text-xs font-bold text-[#111]">
                        {formatCurrency(garment.price, currency)}
                      </div>
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
