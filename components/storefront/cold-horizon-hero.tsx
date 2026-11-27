"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ColdHorizonHeroProps {
  onExploreWomen?: () => void;
  onExploreMen?: () => void;
  onShopNow?: () => void;
}

export function ColdHorizonHero({
  onExploreWomen,
  onExploreMen,
  onShopNow,
}: ColdHorizonHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAFBFD] text-[#303644]">
      {/* 1. Snow Horizon Landscape Canvas */}
      <div className="relative w-full min-h-[700px] lg:min-h-[880px] flex flex-col justify-between pt-12 pb-16 px-6 sm:px-12 max-w-[1500px] mx-auto">
        {/* Soft Winter Horizon Background Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle gradient simulating snowy fog and distant winter tree line */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#F4F6F9] to-[#E9EDF2]" />
          {/* Distant soft snowy blur texture */}
          <div className="absolute top-[28%] inset-x-0 h-48 bg-gradient-to-r from-transparent via-[#DDE3EA]/40 to-transparent blur-3xl" />
        </div>

        {/* 2. Top Header Row: Headline & Floating Shop Now Orb */}
        <div className="relative z-10 flex items-start justify-between">
          {/* Big Editorial Headline */}
          <div className="space-y-1">
            <h1 className="font-sans text-5xl sm:text-7xl lg:text-[5.5rem] font-normal tracking-tight text-[#2D3342] leading-[0.92]">
              MAULI FASHION
              <span className="block font-normal text-[#2D3342]">Fashion</span>
            </h1>
          </div>

          {/* Floating Frosted Snowball "SHOP NOW" Button */}
          <button
            onClick={onShopNow || (() => {
              const el = document.getElementById("our-collection");
              el?.scrollIntoView({ behavior: "smooth" });
            })}
            className="group relative h-22 w-22 sm:h-26 sm:w-26 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#EDF2F7] to-[#CBD5E1] p-[2px] shadow-[0_12px_30px_rgba(45,51,66,0.12)] hover:scale-108 transition-all duration-500 ease-out flex items-center justify-center cursor-pointer"
            aria-label="Shop Collection Now"
          >
            {/* Inner Frosted Texture */}
            <div className="h-full w-full rounded-full bg-[#FFFFFF]/90 backdrop-blur-sm border border-white flex flex-col items-center justify-center text-center p-2 group-hover:bg-[#FFFFFF]">
              <span className="font-sans text-[0.68rem] sm:text-xs font-semibold tracking-widest text-[#2D3342] uppercase leading-tight">
                SHOP
              </span>
              <span className="font-sans text-[0.68rem] sm:text-xs font-semibold tracking-widest text-[#2D3342] uppercase leading-tight">
                NOW
              </span>
              <ArrowUpRight className="h-3 w-3 text-[#2D3342] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5" />
            </div>
          </button>
        </div>

        {/* 3. Center 3-Model Composition on Snowscape */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-end my-8 lg:my-0">
          {/* Left Model: Women's Collection (3 Cols) */}
          <div className="md:col-span-3 flex flex-col items-center text-center space-y-3 order-2 md:order-1">
            <div className="relative w-44 sm:w-56 h-[340px] sm:h-[420px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=800"
                alt="Women Collection model in white winter puffer"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover object-center filter drop-shadow-md hover:scale-103 transition-transform duration-700"
              />
            </div>
            <button
              onClick={onExploreWomen || (() => {
                const el = document.getElementById("our-collection");
                el?.scrollIntoView({ behavior: "smooth" });
              })}
              className="bg-white/95 hover:bg-white text-[#2D3342] border border-[#E2E6ED] px-4 py-1.5 text-2xs uppercase tracking-widest font-semibold shadow-sm hover:shadow transition-all"
            >
              WOMEN COLLECTION
            </button>
          </div>

          {/* Center Main Model: Emerging Female Portrait (6 Cols) */}
          <div className="md:col-span-6 flex flex-col items-center text-center order-1 md:order-2">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] h-[360px] sm:h-[480px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=900"
                alt="Center model in cream knit down jacket"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top hover:scale-102 transition-transform duration-700"
              />
              {/* Soft snow mist blending at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#E9EDF2] via-[#E9EDF2]/70 to-transparent" />
            </div>
          </div>

          {/* Right Model: Men's Collection (3 Cols) */}
          <div className="md:col-span-3 flex flex-col items-center text-center space-y-3 order-3">
            <div className="relative w-44 sm:w-56 h-[340px] sm:h-[420px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=85&w=800"
                alt="Men Collection model in long white down coat"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover object-center filter drop-shadow-md hover:scale-103 transition-transform duration-700"
              />
            </div>
            <button
              onClick={onExploreMen || (() => {
                const el = document.getElementById("our-collection");
                el?.scrollIntoView({ behavior: "smooth" });
              })}
              className="bg-white/95 hover:bg-white text-[#2D3342] border border-[#E2E6ED] px-4 py-1.5 text-2xs uppercase tracking-widest font-semibold shadow-sm hover:shadow transition-all"
            >
              MEN COLLECTION
            </button>
          </div>
        </div>

        {/* 4. Bottom Center: Wool Ball Emblem & Collection Manifesto */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto space-y-3 pt-6">
          {/* Wool Sphere Emblem with MONCLER text */}
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#D9E1E8] border border-[#CBD5E1] shadow-md flex items-center justify-center p-1">
            <div className="h-full w-full rounded-full bg-radial from-white to-[#E2E8F0] flex items-center justify-center">
              <span className="font-sans font-extrabold text-[0.6rem] tracking-[0.16em] text-[#2D3342] uppercase">
                MONCLER
              </span>
            </div>
          </div>

          {/* Subtitle Headline */}
          <h2 className="font-sans text-2xl sm:text-3xl font-normal tracking-tight text-[#2D3342]">
            2026 — MAULI FASHION
          </h2>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-[#4E5666] leading-relaxed max-w-lg font-sans">
            Inspired by winter landscapes, this collection blends modern design with warmth and functionality — created for life in the city and beyond.
          </p>
        </div>
      </div>
    </section>
  );
}
