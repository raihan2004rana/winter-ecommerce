import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { WINTER_COLLECTIONS } from "@/data/collections";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export function FeaturedCollections() {
  return (
    <section id="collections" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-canvas-muted pb-6">
        <div className="space-y-1">
          <span className="editorial-caps text-forest font-semibold">Curated Drops</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            Featured Winter Collections
          </h2>
        </div>
        <p className="text-xs text-charcoal-500 max-w-md">
          Each capsule is designed as a standalone cold-weather system, balancing natural fibers with technical synthetic membranes.
        </p>
      </div>

      {/* Asymmetric 3-Column Luxury Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Collection 1: Large Featured Card (7 cols) */}
        <div className="md:col-span-7 group relative flex flex-col justify-end overflow-hidden bg-charcoal aspect-editorial-tall md:aspect-auto md:min-h-[580px] p-8 sm:p-12 text-canvas">
          <Image
            src={WINTER_COLLECTIONS[0].heroImage}
            alt={WINTER_COLLECTIONS[0].title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-center opacity-85 transition-transform duration-700 ease-editorial-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

          <div className="relative z-10 space-y-3">
            <Badge variant="temp" className="border-canvas/30 text-canvas bg-charcoal/60">
              {WINTER_COLLECTIONS[0].temperatureTarget}
            </Badge>
            <h3 className="font-serif text-2xl sm:text-4xl text-canvas font-normal">
              {WINTER_COLLECTIONS[0].title}
            </h3>
            <p className="text-xs text-canvas/80 max-w-md leading-relaxed">
              {WINTER_COLLECTIONS[0].description}
            </p>
            <Link
              href="#outerwear"
              className="inline-flex items-center space-x-2 text-2xs uppercase tracking-widest font-mono text-canvas hover:text-ice-frost pt-2 transition-colors"
            >
              <span>Explore Collection ({WINTER_COLLECTIONS[0].productCount} Garments)</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Stack: 2 Smaller Curated Cards (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-8">
          {WINTER_COLLECTIONS.slice(1, 3).map((col) => (
            <div
              key={col.id}
              className="group relative flex-1 flex flex-col justify-end overflow-hidden bg-charcoal aspect-editorial-portrait sm:aspect-auto sm:min-h-[274px] p-6 sm:p-8 text-canvas"
            >
              <Image
                src={col.heroImage}
                alt={col.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center opacity-80 transition-transform duration-700 ease-editorial-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

              <div className="relative z-10 space-y-1.5">
                <span className="text-[0.62rem] uppercase tracking-widest font-mono text-canvas/70">
                  {col.eyebrow}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-canvas font-normal">
                  {col.title}
                </h4>
                <Link
                  href="#outerwear"
                  className="inline-flex items-center space-x-1.5 text-2xs uppercase tracking-widest font-mono text-canvas hover:text-ice-frost pt-1 transition-colors"
                >
                  <span>Shop Series</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
