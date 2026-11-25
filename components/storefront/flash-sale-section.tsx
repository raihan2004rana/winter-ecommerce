"use client";

import * as React from "react";
import Image from "next/image";
import { PRODUCTS_CATALOG, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Flame, Clock, ShieldCheck } from "lucide-react";

interface FlashSaleSectionProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onAddToCart: (product: Product, size: string) => void;
}

export function FlashSaleSection({
  currency,
  onAddToCart,
}: FlashSaleSectionProps) {
  // Countdown Timer Hook (48-hour seasonal drop timer)
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 36,
    minutes: 42,
    seconds: 18,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProduct = PRODUCTS_CATALOG.find((p) => p.isFlashSale) || PRODUCTS_CATALOG[3];

  return (
    <section id="flash-sale" className="py-20 sm:py-28 bg-canvas-dark text-canvas border-y border-charcoal-700">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 6 Columns: High-Res Editorial Photography */}
          <div className="lg:col-span-6 relative aspect-editorial-portrait sm:min-h-[520px] overflow-hidden bg-charcoal-800 border border-charcoal-700">
            <Image
              src={flashSaleProduct.primaryImage}
              alt={flashSaleProduct.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge variant="temp" className="bg-charcoal-900/90 text-canvas border-charcoal-600">
                -30% ARCHIVAL DROP
              </Badge>
              <Badge variant="warning" className="bg-alpine-amber text-canvas border-transparent">
                {flashSaleProduct.stockWarning || "Only 3 Units Left"}
              </Badge>
            </div>
          </div>

          {/* Right 6 Columns: Offer Details & Countdown Clock */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-2 text-alpine-amber text-2xs uppercase tracking-widest font-mono">
              <Flame className="h-4 w-4" />
              <span>Limited-Time Alpine Flash Release</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-canvas leading-tight">
              {flashSaleProduct.title}
            </h2>

            <p className="text-xs sm:text-sm text-canvas/75 leading-relaxed max-w-xl">
              {flashSaleProduct.description}
            </p>

            {/* Countdown Clock Display */}
            <div className="bg-charcoal-800/80 border border-charcoal-700 p-5 space-y-2">
              <div className="flex items-center space-x-2 text-2xs uppercase tracking-widest text-canvas/60 font-mono">
                <Clock className="h-3.5 w-3.5" />
                <span>Allocation Window Closes In</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-charcoal-900 p-3 border border-charcoal-700">
                  <span className="font-mono text-2xl sm:text-3xl font-semibold text-canvas block">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-widest text-canvas/50">Hours</span>
                </div>
                <div className="bg-charcoal-900 p-3 border border-charcoal-700">
                  <span className="font-mono text-2xl sm:text-3xl font-semibold text-canvas block">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-widest text-canvas/50">Minutes</span>
                </div>
                <div className="bg-charcoal-900 p-3 border border-charcoal-700">
                  <span className="font-mono text-2xl sm:text-3xl font-semibold text-ice-frost block">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-widest text-canvas/50">Seconds</span>
                </div>
              </div>
            </div>

            {/* Pricing & Savings */}
            <div className="flex items-baseline space-x-4">
              <span className="font-mono text-3xl font-semibold text-canvas">
                {formatCurrency(flashSaleProduct.price, currency)}
              </span>
              {flashSaleProduct.compareAtPrice && (
                <span className="font-mono text-lg text-canvas/40 line-through">
                  {formatCurrency(flashSaleProduct.compareAtPrice, currency)}
                </span>
              )}
              <span className="text-xs font-mono text-alpine-amber font-medium">
                Save {formatCurrency((flashSaleProduct.compareAtPrice || 0) - flashSaleProduct.price, currency)}
              </span>
            </div>

            {/* Size Selector & Direct Action */}
            <div className="space-y-3 pt-2">
              <span className="text-2xs uppercase tracking-widest text-canvas/60 font-mono block">
                Select Size to Secure Allocation
              </span>
              <div className="flex flex-wrap gap-2">
                {flashSaleProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onAddToCart(flashSaleProduct, size)}
                    className="h-10 w-14 border border-charcoal-600 bg-charcoal-900 hover:border-canvas hover:bg-canvas hover:text-charcoal text-xs font-mono uppercase transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-2xs text-canvas/60 pt-2 border-t border-charcoal-700">
              <ShieldCheck className="h-3.5 w-3.5 text-forest-mist" />
              <span>Complimentary insured shipping • 30-day exchange guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
