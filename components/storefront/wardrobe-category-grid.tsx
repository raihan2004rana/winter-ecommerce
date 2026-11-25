"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    key: "women",
    title: "WOMEN",
    subtitle: "Tailored wool coats, cashmere knits & insulated parkas",
    href: "/collections/women",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=900",
    itemCount: "42 Styles",
    cta: "Shop women",
  },
  {
    key: "men",
    title: "MEN",
    subtitle: "Technical down jackets, alpine fleece & layering layers",
    href: "/collections/men",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=900",
    itemCount: "38 Styles",
    cta: "Shop men",
  },
  {
    key: "jackets-coats",
    title: "JACKETS & COATS",
    subtitle: "850 Fill Goose Down with Toray 20,000mm waterproof shells",
    href: "/collections/jackets-coats",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=900",
    itemCount: "24 Outerwear",
    cta: "Explore coats",
  },
  {
    key: "boots-accessories",
    title: "BOOTS & ACCESSORIES",
    subtitle: "Vibram Arctic Grip boots, deerskin gloves & shearling caps",
    href: "/collections/boots-accessories",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=85&w=900",
    itemCount: "19 Accessories",
    cta: "Shop accessories",
  },
];

export function WardrobeCategoryGrid() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 sm:py-24 border-b border-[#EAEAEA]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* =========================================================================
            HEADER: "Shop by category" (Framer Wardrobe Structure)
           ========================================================================= */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-1.5 text-2xs font-mono uppercase tracking-[0.25em] text-[#777] mb-1.5">
            <span>Essential Departments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-medium tracking-[-0.03em] text-[#111]">
            Shop by category
          </h2>
          <p className="text-xs sm:text-sm text-[#666] font-sans mt-2 leading-relaxed">
            Comfortable styles for women, men, and cold-weather layering. Designed to be worn every day.
          </p>
        </div>

        {/* =========================================================================
            4-COLUMN EDITORIAL CATEGORY CARDS
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group relative flex flex-col aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] bg-[#F5F5F7] overflow-hidden border border-[#EAEAEA] hover:border-[#111] transition-all duration-300"
            >
              {/* Category Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Vignette for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 group-hover:from-black/85 transition-colors duration-300" />

              {/* Top Tag: Item Count */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="text-2xs font-mono uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-xs px-2.5 py-1 border border-white/20">
                  {cat.itemCount}
                </span>
                <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Bottom Content: Title & Pill Button */}
              <div className="relative z-10 mt-auto p-6 space-y-3">
                <div>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/80 font-sans line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center space-x-2 bg-white group-hover:bg-black text-black group-hover:text-white px-4 py-2 text-2xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm">
                    <span>{cat.cta}</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
