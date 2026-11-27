"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CinematicLuxuryHero() {
  return (
    <section className="relative w-full bg-[#ECEEF1] text-[#1E2024] overflow-hidden select-none">
      {/* 
        MASTER BACKGROUND COMPOSITION
        Ultra-High-Definition 8K Master (7680x4320) with uncompressed color & unsharp masking.
      */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[580px] sm:min-h-[720px] lg:min-h-[820px] max-h-[960px] flex flex-col justify-between">
        <Image
          src="/images/hero/cold-horizon-moncler.jpg"
          alt="Moncler Cold Horizon Campaign - 2026 Winter Collection"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_35%] lg:object-center pointer-events-none contrast-[1.02] brightness-[1.01]"
        />

        {/* Dynamic crystal clarity: no milky white haze over the models */}

        {/* =========================================================================
            TOP ROW: Headline (Top Left) & Circular "SHOP NOW" Badge (Top Right)
           ========================================================================= */}
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-12 pt-8 sm:pt-12 flex items-start justify-between">
          {/* Main Editorial Headline matching Reference Design 1 */}
          <div className="animate-fade-in">
            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium tracking-tight text-[#343A46] leading-[0.92]">
              MAULI FASHION<br />
              <span className="font-light text-[#2A2F3A]">Fashion</span>
            </h1>
          </div>

          {/* Frosted Circular "SHOP NOW" Badge matching Reference Design 1 */}
          <Link
            href="/products"
            className="group relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#111] hover:text-white shrink-0 mt-1"
            aria-label="Shop the Cold Horizon Winter Collection"
          >
            {/* Ethereal Frosted Glow */}
            <div className="absolute -inset-2 rounded-full bg-white/40 blur-md pointer-events-none -z-10 group-hover:opacity-0 transition-opacity" />
            <span className="text-[0.68rem] sm:text-xs font-mono uppercase tracking-[0.2em] font-semibold text-center leading-tight transition-colors">
              Shop<br />Now
            </span>
            <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mt-1 text-[#666] group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* =========================================================================
            CENTER INTERACTIVE CONTROLS: Pins Over Left & Right Campaign Models
           ========================================================================= */}
        {/* Desktop Pin Layout (Absolute percentage placement mapped to the models) */}
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

        {/* Mobile Pin Buttons (Tappable bar shown below portrait on smaller viewports) */}
        <div className="md:hidden relative z-20 px-6 py-3 flex items-center justify-center space-x-3">
          <Link
            href="/collections/women"
            className="flex-1 bg-white/95 text-black hover:bg-black hover:text-white py-2.5 px-3 text-center text-2xs uppercase tracking-widest font-mono font-semibold shadow-sm border border-white transition-colors"
          >
            Women Collection
          </Link>
          <Link
            href="/collections/men"
            className="flex-1 bg-white/95 text-black hover:bg-black hover:text-white py-2.5 px-3 text-center text-2xs uppercase tracking-widest font-mono font-semibold shadow-sm border border-white transition-colors"
          >
            Men Collection
          </Link>
        </div>

        {/* =========================================================================
            BOTTOM EDITORIAL MANIFESTO: 2026 — Cold Horizon
           ========================================================================= */}
        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 sm:px-12 pb-8 sm:pb-12 text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#222]">
              2026 — MAULI FASHION
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
