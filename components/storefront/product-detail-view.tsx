"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Star,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Thermometer,
  Maximize2,
} from "lucide-react";
import { Product, getRelatedProducts } from "@/data/products";
import { useStore } from "@/lib/store/use-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SizeGuideModal } from "@/components/storefront/size-guide-modal";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { currency, addToCart, toggleWishlist, isInWishlist } = useStore();

  const isSaved = isInWishlist(product.id);
  const relatedProducts = getRelatedProducts(product.id, 4);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState(product.colorways[0]?.name || "Standard");
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0] || "Standard");
  const [quantity, setQuantity] = React.useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = React.useState(false);
  const [addedToast, setAddedToast] = React.useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = React.useState<string | null>("specs");

  // Review Form States
  const [newReviewAuthor, setNewReviewAuthor] = React.useState("");
  const [newReviewComment, setNewReviewComment] = React.useState("");
  const [newReviewRating, setNewReviewRating] = React.useState(5);
  const [localReviews, setLocalReviews] = React.useState(product.reviews || []);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);

  // Images pool: Only display primary and user's gallery images (never stale demo secondary images)
  const allImages = React.useMemo(() => {
    if (product.galleryImages && product.galleryImages.length > 0) {
      return Array.from(
        new Set([product.primaryImage, ...product.galleryImages])
      ).filter(Boolean);
    }
    return Array.from(
      new Set([
        product.primaryImage,
        ...(product.secondaryImage ? [product.secondaryImage] : []),
      ])
    ).filter(Boolean);
  }, [product.primaryImage, product.galleryImages, product.secondaryImage]);

  const currentImage = allImages[selectedImageIndex] || product.primaryImage;

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      location: "Verified Global Customer",
      rating: newReviewRating,
      date: "Just now",
      title: "Field Verified Feedback",
      comment: newReviewComment,
      fitFeedback: "true_to_size" as const,
      verified: true,
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#111] min-h-screen">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#EAEAEA] bg-[#FAFBFD] py-4 px-6 sm:px-12 text-2xs font-mono uppercase tracking-widest text-[#888]">
        <div className="max-w-[1500px] mx-auto flex items-center space-x-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-black uppercase">
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* 2. Main Product Hero Section (Gallery Left + Details Right) */}
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* =========================================================
              LEFT COLUMN: IMAGE GALLERY & ZOOM (7 Cols)
          ========================================================== */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Primary View Container with Click-To-Zoom */}
            <div
              onClick={() => setIsZoomModalOpen(true)}
              className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA] cursor-zoom-in group"
            >
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Badges on Gallery */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                {product.temperatureRating && (
                  <Badge variant="temp">{product.temperatureRating}</Badge>
                )}
                {product.isRestock && (
                  <Badge variant="neutral">RESTOCK</Badge>
                )}
                {product.isSale && (
                  <Badge variant="neutral" className="bg-[#B91C1C] text-white">SALE</Badge>
                )}
              </div>

              {/* Hover Zoom Prompt */}
              <div className="absolute bottom-4 right-4 bg-white/90 border border-[#EAEAEA] px-3 py-1.5 flex items-center space-x-1.5 text-2xs font-mono uppercase tracking-widest text-[#333] opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-3 w-3" />
                <span>Click to Expand</span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-24 w-20 shrink-0 bg-[#F6F6F6] border transition-all ${
                      selectedImageIndex === idx
                        ? "border-black ring-1 ring-black"
                        : "border-[#EAEAEA] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} angle ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN: COMMERCE PANEL (5 Cols)
          ========================================================== */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header: Title, Category & Ratings */}
            <div className="space-y-2 border-b border-[#EAEAEA] pb-6">
              <div className="flex items-center justify-between text-2xs font-mono uppercase tracking-widest text-[#888]">
                <span>{product.categoryLabel} • {product.gender.toUpperCase()}</span>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-black">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#888]">({localReviews.length || product.reviewCount})</span>
                </div>
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#111] uppercase">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
                {product.subtitle}
              </p>

              {/* Price & Savings */}
              <div className="pt-2 flex items-baseline space-x-3">
                <span className="font-mono text-2xl font-bold text-[#111]">
                  {formatCurrency(product.price, currency)}
                </span>
                {product.compareAtPrice && (
                  <span className="font-mono text-base text-[#999] line-through">
                    {formatCurrency(product.compareAtPrice, currency)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-2xs font-mono uppercase px-2 py-0.5 bg-[#B91C1C] text-white font-semibold">
                    Save {formatCurrency(product.compareAtPrice - product.price, currency)}
                  </span>
                )}
              </div>
            </div>

            {/* Variant Selector: Colorways */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-2xs font-mono uppercase tracking-widest text-[#888]">
                  Selected Color: <strong className="text-black font-semibold">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {product.colorways.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center space-x-2 px-3 py-1.5 border text-xs transition-all ${
                      selectedColor === col.name
                        ? "border-black bg-[#F5F5F5] font-semibold"
                        : "border-[#EAEAEA] hover:border-[#999]"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Selector: Sizes & Size Guide Trigger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-2xs font-mono uppercase tracking-widest text-[#888]">
                  Select Size: <strong className="text-black font-semibold">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center space-x-1 text-2xs uppercase tracking-widest font-mono text-black hover:underline"
                >
                  <Ruler className="h-3 w-3" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 border text-xs font-mono uppercase transition-all flex items-center justify-center ${
                      selectedSize === sz
                        ? "bg-black text-white border-black font-bold"
                        : "bg-white text-[#333] border-[#EAEAEA] hover:border-black"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Stock Warning Notice */}
              <div className="flex items-center justify-between text-2xs pt-1">
                <span className="flex items-center space-x-1.5 text-forest font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest animate-pulse" />
                  <span>In Stock — Ready for International Courier Dispatch</span>
                </span>
                {product.stockWarning && (
                  <span className="text-alpine-amber font-mono font-medium">
                    {product.stockWarning}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector + Add to Cart + Wishlist CTA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3">
                {/* Quantity Controller */}
                <div className="flex items-center border border-[#EAEAEA] h-12 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-sm hover:bg-[#F5F5F5] font-mono"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="w-10 h-full flex items-center justify-center text-sm hover:bg-[#F5F5F5] font-mono"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <Button
                  variant="primary"
                  className="flex-1 h-12 text-xs font-bold uppercase tracking-widest"
                  onClick={handleAdd}
                >
                  Add to Shopping Bag • {formatCurrency(product.price * quantity, currency)}
                </Button>

                {/* Wishlist Heart Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`h-12 w-12 border flex items-center justify-center transition-all ${
                    isSaved
                      ? "border-black bg-black text-white"
                      : "border-[#EAEAEA] hover:border-black text-[#555]"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Confirmation Toast */}
              {addedToast && (
                <div className="p-3 bg-forest-mist border border-forest/30 text-forest text-xs font-mono uppercase tracking-widest flex items-center justify-between animate-in fade-in">
                  <span>✓ Added to Shopping Bag</span>
                  <span>Size: {selectedSize}</span>
                </div>
              )}
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#EAEAEA] text-center text-2xs font-mono text-[#666]">
              <div className="p-2 space-y-1">
                <Truck className="h-4 w-4 mx-auto text-[#111]" />
                <span className="block font-semibold text-black">Express Courier</span>
                <span>Free over $200</span>
              </div>
              <div className="p-2 space-y-1 border-x border-[#EAEAEA]">
                <ShieldCheck className="h-4 w-4 mx-auto text-[#111]" />
                <span className="block font-semibold text-black">DDP Guaranteed</span>
                <span>Duties & VAT Paid</span>
              </div>
              <div className="p-2 space-y-1">
                <RotateCcw className="h-4 w-4 mx-auto text-[#111]" />
                <span className="block font-semibold text-black">30-Day Returns</span>
                <span>Prepaid Labels</span>
              </div>
            </div>

            {/* Accordion Modules: Specs, Shipping, Warranty */}
            <div className="space-y-3 pt-2">
              {/* Module 1: Technical Specs */}
              <div className="border border-[#EAEAEA]">
                <button
                  onClick={() => toggleSection("specs")}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-left bg-[#FAFBFD]"
                >
                  <span>Technical Specifications & Materials</span>
                  {openSection === "specs" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSection === "specs" && (
                  <div className="p-5 text-xs text-[#555] space-y-3 border-t border-[#EAEAEA] bg-white leading-relaxed">
                    <p>{product.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0F0F0] font-mono text-2xs">
                      <div>
                        <span className="text-[#999] block">Thermal Index</span>
                        <span className="text-black font-semibold">{product.temperatureRating || "Sub-Zero Rated"}</span>
                      </div>
                      <div>
                        <span className="text-[#999] block">Weatherproofing</span>
                        <span className="text-black font-semibold">{product.waterproofRating || "DWR Finish"}</span>
                      </div>
                      <div>
                        <span className="text-[#999] block">Insulation Fill</span>
                        <span className="text-black font-semibold">{product.fillPower || "RDS Certified"}</span>
                      </div>
                      <div>
                        <span className="text-[#999] block">Garment Fit</span>
                        <span className="text-black font-semibold">{product.fitType}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#F0F0F0]">
                      <span className="font-semibold text-black block mb-1">Material Composition:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-2xs">
                        {product.materials.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Module 2: Shipping & Customs */}
              <div className="border border-[#EAEAEA]">
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-left bg-[#FAFBFD]"
                >
                  <span>International Delivery & DDP Customs</span>
                  {openSection === "shipping" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSection === "shipping" && (
                  <div className="p-5 text-xs text-[#555] space-y-2 border-t border-[#EAEAEA] bg-white leading-relaxed">
                    <p>
                      Orders to the USA, UK, Canada, and European Union are dispatched via DHL Express / FedEx Air.
                    </p>
                    <p>
                      <strong>Delivered Duty Paid (DDP):</strong> All customs clearance fees, cross-border duties, and European VAT are settled prior to delivery. No surprise courier bills at your door.
                    </p>
                  </div>
                )}
              </div>

              {/* Module 3: 30-Day Winter Returns */}
              <div className="border border-[#EAEAEA]">
                <button
                  onClick={() => toggleSection("returns")}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-left bg-[#FAFBFD]"
                >
                  <span>30-Day Returns & Lifetime Baffle Warranty</span>
                  {openSection === "returns" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSection === "returns" && (
                  <div className="p-5 text-xs text-[#555] space-y-2 border-t border-[#EAEAEA] bg-white leading-relaxed">
                    <p>
                      We accept unworn returns and exchanges within 30 days of parcel delivery in original archival packaging.
                    </p>
                    <p>
                      Every coat is protected under our lifetime down baffle and seam warranty against manufacturing defects.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. CUSTOMER REVIEWS & RATINGS BREAKDOWN
        ========================================================== */}
        <div className="mt-24 pt-16 border-t border-[#EAEAEA] space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-6">
            <div className="space-y-1">
              <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888]">
                Verified Field Reports
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111]">
                Customer Ratings & Cold Evaluations
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-3xl font-bold text-black">{product.rating}</span>
              <div className="space-y-0.5">
                <div className="flex text-black">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-2xs text-[#777] font-mono">Based on {localReviews.length} Verified Field Tests</span>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localReviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-[#FAFBFD] border border-[#EAEAEA] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-black">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-2xs font-mono text-[#888]">{rev.date}</span>
                </div>
                <h4 className="font-sans font-bold text-sm text-[#111]">{rev.title}</h4>
                <p className="text-xs text-[#666] leading-relaxed">{rev.comment}</p>
                <div className="pt-2 border-t border-[#F0F0F0] flex items-center justify-between text-2xs font-mono text-[#777]">
                  <span>{rev.author} • {rev.location}</span>
                  <span className="text-forest font-semibold">✓ Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>

          {/* Write a Review Submission Form */}
          <div className="p-8 bg-white border border-[#EAEAEA] space-y-4 max-w-2xl">
            <h3 className="font-sans text-lg font-bold uppercase text-[#111]">
              Submit a Field Evaluation
            </h3>
            {reviewSubmitted ? (
              <div className="p-4 bg-forest-mist border border-forest/30 text-forest text-xs font-mono">
                Thank you. Your field report has been verified and added to the review ledger.
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="Your Name (e.g. Erik S.)"
                    required
                    className="p-3 border border-[#EAEAEA] text-xs focus:outline-none focus:border-black"
                  />
                  <div className="flex items-center space-x-2 border border-[#EAEAEA] px-3">
                    <span className="text-2xs text-[#777] font-mono">Rating:</span>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="bg-transparent text-xs font-bold focus:outline-none"
                    >
                      <option value={5}>5 Stars - Exceptional Cold Warmth</option>
                      <option value={4}>4 Stars - High Performance</option>
                      <option value={3}>3 Stars - Standard Fit</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share your thermal performance experience, sizing feedback, and conditions tested..."
                  required
                  rows={3}
                  className="w-full p-3 border border-[#EAEAEA] text-xs focus:outline-none focus:border-black"
                />
                <Button type="submit" variant="primary" size="sm">
                  Publish Review
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* =========================================================
            4. RELATED PRODUCTS ("COMPLETE THE LOOK")
        ========================================================== */}
        <div className="mt-24 pt-16 border-t border-[#EAEAEA] space-y-8">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
            <div>
              <span className="text-2xs font-mono uppercase tracking-[0.2em] text-[#888]">
                Curated Pairing
              </span>
              <h2 className="font-sans text-2xl font-bold uppercase tracking-tight text-[#111]">
                Complete The Alpine Look
              </h2>
            </div>
            <Link
              href="/products"
              className="text-2xs uppercase tracking-widest font-mono text-black hover:underline"
            >
              View All Garments →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="group flex flex-col space-y-2.5"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] border border-[#EAEAEA]">
                  <Image
                    src={rel.primaryImage}
                    alt={rel.title}
                    fill
                    className="object-cover object-center group-hover:scale-104 transition-transform duration-500"
                  />
                  {rel.temperatureRating && (
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant="temp" className="text-[0.62rem]">
                        {rel.temperatureRating}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-2xs uppercase tracking-widest text-[#888] font-mono">
                    {rel.categoryLabel}
                  </span>
                  <h4 className="font-sans text-xs font-semibold text-[#111] group-hover:text-[#555] line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="font-mono text-xs font-bold text-black mt-0.5">
                    {formatCurrency(rel.price, currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productTitle={product.title}
        category={product.categoryLabel}
      />

      {/* 6. High-Res Zoom Modal */}
      {isZoomModalOpen && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 p-2 border border-white/20 hover:border-white"
            >
              ✕ Close Zoom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
