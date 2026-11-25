"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Compass, Thermometer } from "lucide-react";

export function CinematicLuxuryHero() {
  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#F3F4F6] text-[#111]">
      {/* 1. Ethereal Sub-Zero Alpine Landscape Background */}
      <Image
        src="https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&q=90&w=2560"
        alt="Cold Horizon Alpine Landscape"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_40%] opacity-40 scale-[1.02]"
      />

      {/* Atmospheric Glacial Lighting Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F3F4F6]/95 via-transparent to-[#F3F4F6]/90" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#F3F4F6]/20 to-[#F3F4F6]/80 pointer-events-none" />

      {/* 2. Top Bar Details & Floating "SHOP NOW" Circular Badge */}
      <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6 sm:px-12 pt-8 sm:pt-10 flex items-start justify-between">
        {/* Main Editorial Headline */}
        <div className="space-y-1">
          <span className="text-2xs font-mono uppercase tracking-[0.28em] text-[#666] block">
            Winter 2026/27 Archival Campaign
          </span>
          <h1 className="font-sans text-4xl sm:text-6xl lg:text-[4.75rem] font-bold tracking-tight text-[#111] leading-[0.92] uppercase">
            Cold Horizon
            <span className="block font-light text-[#333]">Fashion</span>
          </h1>
        </div>

        {/* Floating Circular "SHOP NOW" Badge (Reference Design Feature) */}
        <Link
          href="/products"
          className="group relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/90 border border-white/80 backdrop-blur-md shadow-lg hover:shadow-xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white shrink-0 mt-2"
        >
          <span className="text-[0.62rem] sm:text-2xs font-mono uppercase tracking-widest font-bold text-center leading-tight">
            Shop<br />Now
          </span>
          <ArrowUpRight className="h-3 w-3 mt-1 text-[#888] group-hover:text-white transition-colors" />
        </Link>
      </div>

      {/* 3. Center Trio Fashion Models Composition (Reference Design Tribute) */}
      <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6 sm:px-12 py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          {/* Left Model: Women's Collection */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start space-y-3 group">
            <Link
              href="/collections/women"
              className="relative aspect-[3/4] w-full max-w-[280px] bg-white/60 border border-white overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 rounded-none block"
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800"
                alt="Women's Winter Puffer Look"
                fill
                sizes="(max-width: 1024px) 80vw, 25vw"
                className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

              {/* Bottom Pill Badge */}
              <div className="absolute bottom-4 inset-x-4">
                <span className="w-full bg-white/95 hover:bg-black hover:text-white text-black py-2 px-3 text-2xs uppercase tracking-widest font-mono font-semibold text-center block transition-colors shadow-xs">
                  Women Collection →
                </span>
              </div>
            </Link>
          </div>

          {/* Center Feature: Editorial Hero Portrait */}
          <div className="lg:col-span-6 flex flex-col items-center text-center space-y-6">
            <div className="relative aspect-[4/5] w-full max-w-[420px] bg-white/80 border border-white overflow-hidden shadow-xl rounded-none group">
              <Image
                src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=90&w=1200"
                alt="Cold Horizon Center Campaign Model"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-[center_25%] group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

              <div className="absolute bottom-5 inset-x-6 text-white space-y-1">
                <span className="text-[0.62rem] font-mono uppercase tracking-[0.28em] text-white/80 block">
                  850 Fill Goose Down • Toray Shell
                </span>
                <p className="font-serif text-lg sm:text-xl font-normal text-white">
                  Sub-Zero High Collar Cocoon Parka
                </p>
              </div>
            </div>

            {/* Circular Wool Sphere MONCLER Logo Badge */}
            <div className="h-14 w-14 rounded-full bg-white border border-[#DDD] shadow-md flex items-center justify-center p-1">
              <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black font-sans">
                MONCLER
              </span>
            </div>
          </div>

          {/* Right Model: Men's Collection */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end space-y-3 group">
            <Link
              href="/collections/men"
              className="relative aspect-[3/4] w-full max-w-[280px] bg-white/60 border border-white overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 rounded-none block"
            >
              <Image
                src="https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=800"
                alt="Men's Winter Puffer Look"
                fill
                sizes="(max-width: 1024px) 80vw, 25vw"
                className="object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

              {/* Bottom Pill Badge */}
              <div className="absolute bottom-4 inset-x-4">
                <span className="w-full bg-white/95 hover:bg-black hover:text-white text-black py-2 px-3 text-2xs uppercase tracking-widest font-mono font-semibold text-center block transition-colors shadow-xs">
                  Men Collection →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Editorial Manifesto & Station Ticker */}
      <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6 sm:px-12 pb-10 sm:pb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-[#DDD] pt-6">
          {/* Manifesto Text */}
          <div className="space-y-1.5 max-w-xl text-center md:text-left">
            <h3 className="font-sans text-sm sm:text-base font-bold uppercase tracking-widest text-[#111]">
              2026 — Cold Horizon
            </h3>
            <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
              Inspired by winter landscapes, this collection blends modern design with warmth and functionality — created for life in the city and beyond.
            </p>
          </div>

          {/* Alpine Field Station Ticker */}
          <div className="flex items-center justify-center md:justify-end space-x-6 text-2xs font-mono text-[#666]">
            <div className="flex items-center space-x-1.5 bg-white/80 border border-[#E5E5E5] px-3 py-1.5 shadow-2xs">
              <Compass className="h-3.5 w-3.5 text-[#111]" />
              <span>St. Moritz Station • 2,840M</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/80 border border-[#E5E5E5] px-3 py-1.5 shadow-2xs">
              <Thermometer className="h-3.5 w-3.5 text-sky-600" />
              <span className="font-bold text-black">-18°C</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
