import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromotionalPlacements() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-6 sm:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Placement 1: Urban Winter Commute */}
        <div className="group relative aspect-editorial-wide md:aspect-[16/10] overflow-hidden bg-charcoal p-8 sm:p-12 flex flex-col justify-end text-canvas border border-canvas-muted">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
            alt="Urban Winter Commute"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center opacity-75 group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="editorial-caps text-ice-frost block">City Transit Series</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-canvas font-normal">
              Tailored Double-Faced Wool & Cashmere
            </h3>
            <p className="text-xs text-canvas/80 max-w-sm leading-relaxed">
              Designed for sub-zero urban commutes. Thermal structure without technical bulk.
            </p>
            <div className="pt-2">
              <Link href="#outerwear">
                <Button variant="outline" size="sm" className="border-canvas text-canvas hover:bg-canvas hover:text-charcoal">
                  Shop Tailored Coats
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Placement 2: Alpine Glacier Shield */}
        <div className="group relative aspect-editorial-wide md:aspect-[16/10] overflow-hidden bg-charcoal p-8 sm:p-12 flex flex-col justify-end text-canvas border border-canvas-muted">
          <Image
            src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200"
            alt="Alpine Hard Shells"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center opacity-75 group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="editorial-caps text-forest-mist block">Weatherproof Armor</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-canvas font-normal">
              3-Layer GORE-TEX Storm Defense
            </h3>
            <p className="text-xs text-canvas/80 max-w-sm leading-relaxed">
              28,000mm hydrostatic head rating built to withstand blowing blizzards and wet snow.
            </p>
            <div className="pt-2">
              <Link href="#outerwear">
                <Button variant="outline" size="sm" className="border-canvas text-canvas hover:bg-canvas hover:text-charcoal">
                  Discover Hard Shells
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
