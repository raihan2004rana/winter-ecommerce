import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { WINTER_CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";

export function CategoryGridSection() {
  return (
    <section id="categories" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-canvas-muted pb-6">
        <div className="space-y-1">
          <span className="editorial-caps text-forest font-semibold">Department Breakdown</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            Shop by Winter Category
          </h2>
        </div>
        <p className="text-xs text-charcoal-500 max-w-md">
          Explore specialized cold-weather wardrobes organized by technical insulating tiers and natural material compositions.
        </p>
      </div>

      {/* 4 Category Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WINTER_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`#${cat.slug}`}
            className="group relative flex flex-col bg-canvas-elevated border border-canvas-muted overflow-hidden transition-all duration-300 hover:border-charcoal hover:shadow-editorial"
          >
            {/* Image */}
            <div className="relative aspect-editorial-portrait w-full overflow-hidden bg-canvas-subtle">
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-editorial-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors" />
              <div className="absolute top-3 right-3 bg-canvas/90 px-2 py-0.5 text-2xs font-mono text-charcoal">
                {cat.itemCount} Garments
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
              <div>
                <h3 className="font-serif text-lg text-charcoal group-hover:text-forest transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-canvas-muted flex items-center justify-between text-2xs uppercase tracking-widest text-charcoal-700 font-medium">
                <span>View Department</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
