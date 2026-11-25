"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  X,
  Heart,
  ChevronDown,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Check,
} from "lucide-react";
import { filterCatalog, FilterParams, Product } from "@/data/products";
import { useStore } from "@/lib/store/use-store";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductListingViewProps {
  initialTitle?: string;
  initialSubtitle?: string;
  initialCategory?: string;
  initialGender?: string;
  initialCollection?: string;
}

export function ProductListingView({
  initialTitle = "Winter 2026/27 Catalog",
  initialSubtitle = "High-performance thermal outerwear, fine knitwear, and cold-weather accessories.",
  initialCategory = "all",
  initialGender = "all",
  initialCollection = "all",
}: ProductListingViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { currency, addToCart, toggleWishlist, isInWishlist } = useStore();

  // URL Query Synced State
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || initialCategory;
  const genderParam = searchParams.get("gender") || initialGender;
  const collectionParam = searchParams.get("collection") || initialCollection;
  const filterParam = searchParams.get("filter") || ""; // "new" or "sale"

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState(queryParam);
  const [selectedCategory, setSelectedCategory] = React.useState(categoryParam);
  const [selectedGender, setSelectedGender] = React.useState(genderParam);
  const [selectedCollection, setSelectedCollection] = React.useState(
    filterParam === "new" ? "new-arrivals" : filterParam === "sale" ? "sale" : collectionParam
  );
  const [selectedSize, setSelectedSize] = React.useState<string>("all");
  const [selectedColor, setSelectedColor] = React.useState<string>("all");
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1500]);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"popularity" | "price-asc" | "price-desc" | "newest" | "rating">("popularity");

  // Mobile Drawer & Pagination
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(8);
  const [selectedColorMap, setSelectedColorMap] = React.useState<Record<string, number>>({});

  // Filter Options Data
  const categories = [
    { id: "all", label: "All Garments" },
    { id: "jackets-coats", label: "Jackets & Coats" },
    { id: "sweaters-hoodies", label: "Sweaters & Hoodies" },
    { id: "boots-accessories", label: "Boots & Accessories" },
  ];

  const genders = [
    { id: "all", label: "All Genders" },
    { id: "men", label: "Men's Collection" },
    { id: "women", label: "Women's Collection" },
    { id: "unisex", label: "Unisex / Universal" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "40", "41", "42", "43", "44", "45"];

  const colors = [
    { name: "Obsidian", hex: "#18191A" },
    { name: "Pine", hex: "#2B3D2E" },
    { name: "Mint", hex: "#7BB5B4" },
    { name: "Ecru", hex: "#EDE9E1" },
    { name: "Brown", hex: "#543C32" },
    { name: "Slate", hex: "#95A1AD" },
    { name: "Tan", hex: "#9E6D38" },
  ];

  // Execute filtering
  const filteredProducts = React.useMemo(() => {
    return filterCatalog({
      category: selectedCategory,
      gender: selectedGender,
      collection: selectedCollection,
      size: selectedSize,
      color: selectedColor,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      inStockOnly,
      sortBy,
      searchQuery,
    });
  }, [
    selectedCategory,
    selectedGender,
    selectedCollection,
    selectedSize,
    selectedColor,
    priceRange,
    inStockOnly,
    sortBy,
    searchQuery,
  ]);

  const paginatedProducts = filteredProducts.slice(0, visibleCount);

  // Active filter indicators count
  const activeFilters = [
    searchQuery ? { label: `Search: "${searchQuery}"`, clear: () => setSearchQuery("") } : null,
    selectedCategory !== "all" ? { label: `Category: ${categories.find(c => c.id === selectedCategory)?.label}`, clear: () => setSelectedCategory("all") } : null,
    selectedGender !== "all" ? { label: `Gender: ${genders.find(g => g.id === selectedGender)?.label}`, clear: () => setSelectedGender("all") } : null,
    selectedCollection !== "all" ? { label: `Collection: ${selectedCollection}`, clear: () => setSelectedCollection("all") } : null,
    selectedSize !== "all" ? { label: `Size: ${selectedSize}`, clear: () => setSelectedSize("all") } : null,
    selectedColor !== "all" ? { label: `Color: ${selectedColor}`, clear: () => setSelectedColor("all") } : null,
    inStockOnly ? { label: "In Stock Only", clear: () => setInStockOnly(false) } : null,
    priceRange[0] > 0 || priceRange[1] < 1500 ? { label: `Price: $${priceRange[0]} - $${priceRange[1]}`, clear: () => setPriceRange([0, 1500]) } : null,
  ].filter(Boolean) as Array<{ label: string; clear: () => void }>;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedGender("all");
    setSelectedCollection("all");
    setSelectedSize("all");
    setSelectedColor("all");
    setPriceRange([0, 1500]);
    setInStockOnly(false);
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#111] min-h-screen">
      {/* 1. Header Banner */}
      <div className="border-b border-[#EAEAEA] bg-[#FAFBFD] py-12 sm:py-16 px-6 sm:px-12">
        <div className="max-w-[1500px] mx-auto space-y-3">
          <div className="flex items-center space-x-2 text-2xs uppercase tracking-[0.24em] font-mono text-[#888]">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>/</span>
            <span>Shop</span>
            {selectedCategory !== "all" && (
              <>
                <span>/</span>
                <span className="text-black font-semibold uppercase">{selectedCategory.replace("-", " & ")}</span>
              </>
            )}
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-[#111] uppercase">
            {initialTitle}
          </h1>

          <p className="text-xs sm:text-sm text-[#666] max-w-2xl leading-relaxed">
            {initialSubtitle}
          </p>
        </div>
      </div>

      {/* 2. Main Body with Sidebar & Grid */}
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 py-10">
        {/* Top Control Bar: Active filters & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAEAEA]">
          {/* Left: Mobile Filter Button & Results Count */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center space-x-2 border border-[#111] bg-white px-4 py-2 text-xs uppercase tracking-widest font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters ({activeFilters.length})</span>
            </button>

            <span className="text-2xs font-mono uppercase tracking-widest text-[#777]">
              Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} Garments
            </span>
          </div>

          {/* Right: Search Input & Sort Dropdown */}
          <div className="flex items-center space-x-3">
            {/* Inline Quick Search */}
            <div className="relative hidden sm:block w-52 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#888]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-9 pr-3 py-1.5 border border-[#EAEAEA] text-xs placeholder:text-[#999] focus:outline-none focus:border-black"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-2xs text-[#888] hover:text-black font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1.5 border border-[#EAEAEA] px-3 py-1.5 text-xs bg-white">
              <span className="text-[#888] uppercase tracking-wider text-2xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest In</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
            <span className="text-2xs font-mono uppercase text-[#888] mr-1">Active Filters:</span>
            {activeFilters.map((af, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E5E5] text-2xs font-mono uppercase tracking-wider text-[#222]"
              >
                <span>{af.label}</span>
                <button
                  onClick={af.clear}
                  className="hover:text-black text-[#888] font-bold ml-1"
                  aria-label="Remove filter"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-2xs uppercase tracking-widest text-[#999] hover:text-black underline ml-2 font-mono"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 3. Layout Grid: Sidebar Filters (3 Cols) + Product Grid (9 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 items-start">
          {/* ====================================================
              DESKTOP SIDEBAR FILTERS (3 Cols)
          ==================================================== */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4 sticky top-24">
            {/* Filter Category Block */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] font-semibold text-[#111] block border-b border-[#EAEAEA] pb-2">
                Categories
              </span>
              <div className="space-y-1.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left py-1 flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? "font-bold text-[#111]"
                        : "text-[#666] hover:text-[#111]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Collection Block */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] font-semibold text-[#111] block border-b border-[#EAEAEA] pb-2">
                Gender & Fit
              </span>
              <div className="space-y-1.5 text-xs">
                {genders.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`w-full text-left py-1 flex items-center justify-between transition-colors ${
                      selectedGender === g.id
                        ? "font-bold text-[#111]"
                        : "text-[#666] hover:text-[#111]"
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGender === g.id && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter Block */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] font-semibold text-[#111] block border-b border-[#EAEAEA] pb-2">
                Size
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setSelectedSize("all")}
                  className={`py-1.5 text-2xs font-mono uppercase border transition-colors ${
                    selectedSize === "all"
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-white text-[#555] border-[#EAEAEA] hover:border-black"
                  }`}
                >
                  All
                </button>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-1.5 text-2xs font-mono uppercase border transition-colors ${
                      selectedSize === s
                        ? "bg-[#111] text-white border-[#111]"
                        : "bg-white text-[#555] border-[#EAEAEA] hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatch Filters */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] font-semibold text-[#111] block border-b border-[#EAEAEA] pb-2">
                Color Palette
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor("all")}
                  className={`px-2.5 py-1 text-2xs font-mono uppercase border ${
                    selectedColor === "all"
                      ? "bg-[#111] text-white border-[#111]"
                      : "border-[#EAEAEA] text-[#666]"
                  }`}
                >
                  All
                </button>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center space-x-1.5 px-2 py-1 text-2xs border transition-all ${
                      selectedColor === c.name
                        ? "border-[#111] bg-[#F5F5F5]"
                        : "border-[#EAEAEA] hover:border-[#999]"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter Presets */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] font-semibold text-[#111] block border-b border-[#EAEAEA] pb-2">
                Price Brackets
              </span>
              <div className="space-y-1.5 text-xs">
                {[
                  { label: "All Prices", range: [0, 1500] as [number, number] },
                  { label: "Under $250", range: [0, 250] as [number, number] },
                  { label: "$250 to $500", range: [250, 500] as [number, number] },
                  { label: "Over $500", range: [500, 1500] as [number, number] },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPriceRange(p.range)}
                    className={`w-full text-left py-1 flex items-center justify-between ${
                      priceRange[0] === p.range[0] && priceRange[1] === p.range[1]
                        ? "font-bold text-[#111]"
                        : "text-[#666] hover:text-[#111]"
                    }`}
                  >
                    <span>{p.label}</span>
                    {priceRange[0] === p.range[0] && priceRange[1] === p.range[1] && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-2 border-t border-[#EAEAEA]">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none border-[#CCC] text-black focus:ring-0 h-4 w-4"
                />
                <span className="text-[#333] font-medium">In Stock Items Only</span>
              </label>
            </div>
          </aside>

          {/* ====================================================
              RIGHT PRODUCT GRID (9 Cols)
          ==================================================== */}
          <div className="lg:col-span-9 space-y-10">
            {paginatedProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4 border border-[#EAEAEA] bg-[#FAFBFD] p-8">
                <p className="font-sans text-xl font-bold uppercase text-[#111]">
                  No Garments Match Current Filters
                </p>
                <p className="text-xs text-[#777] max-w-sm mx-auto">
                  Try clearing some filter criteria or adjusting price boundaries to explore our complete winter collection.
                </p>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {paginatedProducts.map((product) => {
                  const isSaved = isInWishlist(product.id);
                  const colorIdx = selectedColorMap[product.id] || 0;

                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col space-y-3 cursor-pointer"
                    >
                      {/* Image Container with Link to Detail Page */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA] flex items-center justify-center p-3"
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                          {product.isRestock && (
                            <span className="text-[0.62rem] font-semibold tracking-widest text-[#222] uppercase bg-white/95 border border-[#E5E5E5] px-2 py-0.5">
                              RESTOCK
                            </span>
                          )}
                          {product.isSale && (
                            <span className="text-[0.62rem] font-semibold tracking-widest text-white uppercase bg-[#B91C1C] px-2 py-0.5">
                              SALE
                            </span>
                          )}
                          {product.temperatureRating && (
                            <span className="text-[0.62rem] font-mono tracking-wider text-[#444] uppercase bg-white/90 border border-[#E5E5E5] px-2 py-0.5">
                              {product.temperatureRating}
                            </span>
                          )}
                        </div>

                        {/* Wishlist Toggle Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 hover:bg-white text-[#444] hover:text-black transition-all rounded-full shadow-xs"
                          aria-label="Toggle wishlist"
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${
                              isSaved ? "fill-black text-black" : "text-[#777] hover:text-black"
                            }`}
                          />
                        </button>

                        {/* Primary Image */}
                        <Image
                          src={product.primaryImage}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                        />

                        {/* Slide-Up Quick Size Selector */}
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute inset-x-0 bottom-0 p-3 bg-white/95 border-t border-[#EAEAEA] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                        >
                          <p className="text-[0.62rem] uppercase tracking-widest text-[#777] mb-2 font-mono">
                            Quick Select Size
                          </p>
                          <div className="grid grid-cols-5 gap-1">
                            {product.sizes.map((sz) => (
                              <button
                                key={sz}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addToCart(product, sz);
                                }}
                                className="h-7 border border-[#DDD] hover:border-black hover:bg-black hover:text-white text-2xs font-mono uppercase transition-colors flex items-center justify-center bg-white"
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      </Link>

                      {/* Product Metadata & Swatches */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-2xs uppercase tracking-widest text-[#888] font-mono">
                          <span>{product.categoryLabel}</span>
                          {product.colorways.length > 1 && (
                            <div className="flex items-center space-x-1.5">
                              {product.colorways.map((col, idx) => (
                                <button
                                  key={col.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedColorMap((prev) => ({ ...prev, [product.id]: idx }));
                                  }}
                                  aria-label={col.name}
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

                        <Link href={`/products/${product.slug}`} className="block">
                          <h3 className="font-sans text-xs sm:text-sm font-semibold text-[#111] hover:text-[#555] transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>

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
            )}

            {/* Pagination / Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="pt-8 text-center space-y-3 border-t border-[#EAEAEA]">
                <p className="text-2xs font-mono text-[#888] uppercase tracking-widest">
                  Showing {visibleCount} of {filteredProducts.length} Garments
                </p>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8"
                >
                  Load More Garments
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Mobile Filter Slide-Out Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs">
          <div className="flex-1" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="w-full max-w-sm bg-white h-full flex flex-col p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <span className="font-sans font-bold uppercase text-sm tracking-wider">
                Filter Collection
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-[#888] hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-[#888]">Category</span>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left py-1.5 text-xs flex justify-between ${
                      selectedCategory === c.id ? "font-bold text-black" : "text-[#666]"
                    }`}
                  >
                    <span>{c.label}</span>
                    {selectedCategory === c.id && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div className="space-y-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-[#888]">Sizes</span>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-1.5 text-2xs font-mono border ${
                      selectedSize === s ? "bg-black text-white border-black" : "border-[#EAEAEA]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-[#EAEAEA] space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters ({filteredProducts.length} Items)
              </Button>
              <Button
                variant="ghost"
                className="w-full text-2xs"
                onClick={clearAllFilters}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
