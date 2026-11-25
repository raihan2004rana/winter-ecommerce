"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Star, ShieldCheck, Sparkles } from "lucide-react";

interface WardrobeHeroProps {
  onShopClick?: () => void;
}

export function WardrobeElevatedHero({ onShopClick }: WardrobeHeroProps) {
  return (
    <section className="relative w-full bg-[#FFFFFF] text-[#111] overflow-hidden">
      {/* =========================================================================
          TOP EDITORIAL INTRO: "Designed for colder days" (Framer Wardrobe Structure)
         ========================================================================= */}
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 pt-10 sm:pt-16 pb-8 sm:pb-12 border-b border-[#EAEAEA]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Left Column: Tagline + Headline + Subtitle */}
          <div className="max-w-3xl space-y-4">
            {/* Tagline / Drop Indicator */}
            <div className="inline-flex items-center space-x-2 bg-[#F4F4F5] border border-[#E4E4E7] px-3.5 py-1.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-2xs font-mono uppercase tracking-[0.2em] font-semibold text-[#555]">
                Winter 26/27 Drop • Quiet Essentials
              </span>
            </div>

            {/* Signature Headline */}
            <h1 className="font-sans text-4xl sm:text-6xl lg:text-[4.75rem] font-medium tracking-[-0.035em] text-[#111] leading-[0.96]">
              Designed for <span className="font-serif italic font-normal text-[#444]">colder days</span>
            </h1>

            {/* Subtitle / Manifesto */}
            <p className="text-base sm:text-lg text-[#555] font-sans font-normal leading-relaxed max-w-xl">
              Our winter pieces focus on comfort, form, and quiet confidence. Easy to wear. Easy to keep.
            </p>
          </div>

          {/* Right Column: Social Proof + Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-6 shrink-0">
            {/* Rating & Social Proof Badge (1M+ satisfied customers) */}
            <div className="flex items-center space-x-3 bg-[#FAF8F5] border border-[#EFEBE4] px-4 py-2.5 rounded-full shadow-2xs">
              {/* Star Rating */}
              <div className="flex items-center space-x-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs font-mono font-medium tracking-tight text-[#333]">
                <strong className="font-bold text-[#111]">1M+</strong> satisfied customers
              </span>
            </div>

            {/* Dual CTAs */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Link
                href="/products"
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-[#111] hover:bg-black text-white px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 hover:shadow-lg hover:scale-102"
              >
                <span>Shop now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/collections/sale"
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#F9F9F9] text-[#111] border border-[#DDD] px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 hover:border-black"
              >
                <span>Seasonal sale</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CENTERPIECE: 8K CINEMATIC CAMPAIGN CANVAS (MONCLER COLD HORIZON)
          Seamlessly embedding the 8K master canvas with interactive model pills!
         ========================================================================= */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[580px] sm:min-h-[720px] lg:min-h-[820px] max-h-[960px] flex flex-col justify-between overflow-hidden bg-[#ECEEF1]">
        <Image
          src="/images/hero/cold-horizon-moncler.jpg"
          alt="Moncler Cold Horizon Campaign - 2026 Winter Collection"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_35%] lg:object-center pointer-events-none contrast-[1.02] brightness-[1.01]"
        />

        {/* Top Floating Row: Campaign Wordmark + Floating "SHOP NOW" Circular Badge */}
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-12 pt-8 sm:pt-12 flex items-start justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <span className="text-2xs font-mono uppercase tracking-[0.25em] text-[#555] block mb-1">
              Archival Campaign
            </span>
            <p className="font-sans text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#343A46] leading-[0.92]">
              Cold Horizon<br />
              <span className="font-light text-[#2A2F3A]">Fashion</span>
            </p>
          </div>

          {/* Frosted Circular "SHOP NOW" Badge matching Reference Design */}
          <Link
            href="/products"
            className="group pointer-events-auto relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#111] hover:text-white shrink-0 mt-1"
            aria-label="Shop the Winter Collection"
          >
            <div className="absolute -inset-2 rounded-full bg-white/40 blur-md pointer-events-none -z-10 group-hover:opacity-0 transition-opacity" />
            <span className="text-[0.68rem] sm:text-xs font-mono uppercase tracking-[0.2em] font-semibold text-center leading-tight transition-colors">
              Shop<br />Now
            </span>
            <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-1 text-[#666] group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Interactive Model Pins (Mapped to the 3 Models in the Snow) */}
        <div className="hidden md:block absolute inset-0 z-20 pointer-events-none max-w-[1600px] mx-auto">
          {/* Left Model: Women Collection Pin */}
          <div className="absolute left-[12%] lg:left-[14%] xl:left-[17%] top-[60%] lg:top-[66%] pointer-events-auto -translate-x-1/2">
            <Link
              href="/collections/women"
              className="inline-block bg-white/95 hover:bg-black text-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 text-[0.68rem] sm:text-xs font-sans font-medium tracking-[0.22em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/60"
            >
              WOMEN COLLECTION
            </Link>
          </div>

          {/* Center Wool Sphere: MONCLER Brand Inscription */}
          <div className="absolute left-1/2 top-[72%] lg:top-[74%] xl:top-[75%] -translate-x-1/2 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-xs border border-white/90 px-4 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-full">
              <span className="font-sans font-bold tracking-[0.28em] text-[0.68rem] sm:text-xs uppercase text-[#111]">
                MONCLER
              </span>
            </div>
          </div>

          {/* Right Model: Men Collection Pin */}
          <div className="absolute right-[12%] lg:right-[14%] xl:right-[17%] top-[60%] lg:top-[66%] pointer-events-auto translate-x-1/2">
            <Link
              href="/collections/men"
              className="inline-block bg-white/95 hover:bg-black text-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 text-[0.68rem] sm:text-xs font-sans font-medium tracking-[0.22em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/60"
            >
              MEN COLLECTION
            </Link>
          </div>
        </div>

        {/* Mobile Pin Buttons */}
        <div className="md:hidden relative z-20 px-6 py-3 flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-xs">
          <Link
            href="/collections/women"
            className="flex-1 bg-white/95 text-black hover:bg-black hover:text-white py-2.5 px-3 text-center text-2xs uppercase tracking-widest font-mono font-semibold shadow-xs border border-white transition-colors"
          >
            Women Collection
          </Link>
          <Link
            href="/collections/men"
            className="flex-1 bg-white/95 text-black hover:bg-black hover:text-white py-2.5 px-3 text-center text-2xs uppercase tracking-widest font-mono font-semibold shadow-xs border border-white transition-colors"
          >
            Men Collection
          </Link>
        </div>

        {/* Bottom Campaign Manifesto: 2026 — Cold Horizon */}
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-12 pb-8 sm:pb-12 text-center pointer-events-none">
          <div className="max-w-xl mx-auto space-y-1.5 pointer-events-auto">
            <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#222]">
              2026 — Cold Horizon
            </h2>
            <p className="text-xs sm:text-sm text-[#555] font-sans leading-relaxed max-w-lg mx-auto">
              Inspired by winter landscapes, this collection blends modern design with warmth and functionality — created for life in the city and beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
