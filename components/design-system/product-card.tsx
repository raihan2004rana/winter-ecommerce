"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface ProductData {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency?: "USD" | "EUR" | "GBP" | "CAD";
  primaryImage: string;
  secondaryImage?: string;
  temperatureRating?: string;
  waterproofRating?: string;
  fillPower?: string;
  colorways: Array<{ name: string; hex: string; image?: string }>;
  sizes: string[];
  stockWarning?: string;
  materials?: string[];
}

/**
 * VARIATION 1: The Editorial Portrait Card
 * High-end fashion editorial aspect ratio (aspect-[3/4]) with secondary lifestyle reveal,
 * cold-weather temperature badge, colorway swatches, and clean typography.
 */
export function EditorialPortraitCard({
  product,
  onQuickAdd,
}: {
  product: ProductData;
  onQuickAdd?: (size: string) => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(0);

  return (
    <article
      className="group relative flex flex-col bg-transparent text-charcoal transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Editorial Tall Aspect Ratio (3:4) */}
      <div className="relative aspect-editorial-tall w-full overflow-hidden bg-canvas-subtle border border-canvas-muted">
        {/* Primary Studio Shot */}
        <Image
          src={product.primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover object-center transition-all duration-700 ease-editorial-out ${
            isHovered && product.secondaryImage
              ? "opacity-0 scale-[1.03]"
              : "opacity-100 scale-100"
          }`}
        />

        {/* Secondary Lifestyle Shot (Cross-faded on hover) */}
        {product.secondaryImage && (
          <Image
            src={product.secondaryImage}
            alt={`${product.title} in the alpine environment`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-editorial-out ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
            }`}
          />
        )}

        {/* Top Badges: Temperature Rating & Fill Power */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.temperatureRating && (
            <Badge variant="temp">{product.temperatureRating}</Badge>
          )}
          {product.fillPower && (
            <Badge variant="outline" className="bg-canvas/90 backdrop-blur-none">
              {product.fillPower}
            </Badge>
          )}
        </div>

        {/* Low Stock Warning */}
        {product.stockWarning && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <Badge variant="warning">{product.stockWarning}</Badge>
          </div>
        )}

        {/* Quick Add Overlay on Hover */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-canvas/95 border-t border-canvas-muted transition-all duration-400 ease-editorial-out ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex items-center justify-between text-2xs uppercase tracking-editorial mb-2">
            <span className="text-charcoal-600">Quick Select Size</span>
            <span className="text-forest font-medium">True to Fit</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd?.(size);
                }}
                className="h-8 border border-charcoal/20 bg-canvas text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-canvas text-2xs font-mono uppercase transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography & Pricing Information */}
      <div className="mt-3.5 space-y-1.5">
        {/* Category & Swatches Row */}
        <div className="flex items-center justify-between">
          <span className="editorial-caps text-charcoal-500">
            {product.category}
          </span>
          {/* Colorway Swatches */}
          <div className="flex items-center space-x-1.5">
            {product.colorways.map((color, idx) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(idx)}
                aria-label={`Select ${color.name}`}
                className={`h-3 w-3 rounded-none border transition-all ${
                  selectedColor === idx
                    ? "border-charcoal scale-110"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Garment Title */}
        <h3 className="text-sm font-medium tracking-tight text-charcoal hover:text-forest transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-charcoal font-medium">
            {formatCurrency(product.price, product.currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-charcoal-400 line-through">
              {formatCurrency(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * VARIATION 2: Minimalist Grid Card
 * Clean, borderless presentation with instant quick-add drawer,
 * ideal for expansive catalog browsing.
 */
export function MinimalGridCard({
  product,
  onQuickAdd,
}: {
  product: ProductData;
  onQuickAdd?: (size: string) => void;
}) {
  return (
    <article className="group relative flex flex-col bg-transparent text-charcoal">
      <div className="relative aspect-editorial-portrait w-full overflow-hidden bg-canvas-subtle border border-canvas-muted/80">
        <Image
          src={product.primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-editorial-out group-hover:scale-[1.03]"
        />
        {product.waterproofRating && (
          <div className="absolute top-3 right-3">
            <Badge variant="waterproof">{product.waterproofRating}</Badge>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h4 className="text-xs uppercase tracking-editorial font-medium text-charcoal">
            {product.title}
          </h4>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {product.colorways.length} Colorways available
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-charcoal">
          {formatCurrency(product.price, product.currency)}
        </span>
      </div>
    </article>
  );
}

/**
 * VARIATION 3: Horizontal Story Card
 * 50/50 split combining alpine editorial photography with craft specifications
 * and technical thermal properties.
 */
export function HorizontalStoryCard({
  product,
  onExplore,
}: {
  product: ProductData;
  onExplore?: () => void;
}) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-12 border border-canvas-muted bg-canvas-elevated">
      {/* Left 6 Columns: Photography */}
      <div className="relative md:col-span-6 aspect-editorial-portrait md:aspect-auto md:min-h-[380px] overflow-hidden bg-canvas-subtle">
        <Image
          src={product.primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="sustainability">RDS Certified</Badge>
        </div>
      </div>

      {/* Right 6 Columns: Technical Garment Craft Story */}
      <div className="p-6 md:p-10 md:col-span-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="editorial-caps text-forest font-semibold">
              Archival Engineering
            </span>
            {product.temperatureRating && (
              <Badge variant="temp">{product.temperatureRating}</Badge>
            )}
          </div>

          <h3 className="font-serif text-2xl text-charcoal font-normal">
            {product.title}
          </h3>

          <p className="text-xs leading-relaxed text-charcoal-600">
            {product.subtitle ||
              "Engineered with box-wall baffle construction to eliminate cold spots, paired with an ultra-fine water-repellent shell membrane."}
          </p>

          {/* Technical Specs List */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-canvas-muted text-2xs uppercase tracking-editorial text-charcoal-700">
            <div>
              <span className="block text-charcoal-400">Insulation</span>
              <span className="font-mono text-xs text-charcoal">
                {product.fillPower || "850 Fill Goose Down"}
              </span>
            </div>
            <div>
              <span className="block text-charcoal-400">Weatherproof</span>
              <span className="font-mono text-xs text-charcoal">
                {product.waterproofRating || "20,000mm DWR"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-canvas-muted flex items-center justify-between">
          <span className="text-base font-mono font-medium text-charcoal">
            {formatCurrency(product.price, product.currency)}
          </span>
          <Button variant="outline" size="sm" onClick={onExplore}>
            Discover Garment
          </Button>
        </div>
      </div>
    </article>
  );
}
