"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export function WardrobeExactHero() {
  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] max-h-[860px] overflow-hidden bg-[#EAE8E4]">
      {/* 
        Exact Background: The rack of white, cream, amber & forest green hoodies 
        downloaded directly from wardrobe.framer.ai
      */}
      <Image
        src="/images/wardrobe/2pHclH4j3tjoC6auh86yE9bePZE.png"
        alt="Designed for colder days - Wardrobe Collection"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[center_30%] pointer-events-none"
      />

      {/* Gentle left vignette ensuring pristine contrast for white text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />

      {/* Hero Content Box (Matching Exact Framer Positioning) */}
      <div className="relative z-10 max-w-[1500px] h-full mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
        <div className="max-w-xl space-y-4 pt-12 sm:pt-16">
          {/* Red Pill: NEW DROP */}
          <div>
            <span className="inline-block bg-[#E11D48] text-white text-[0.68rem] sm:text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
              NEW DROP
            </span>
          </div>

          {/* Signature Headline in Instrument Serif */}
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[4.75rem] font-normal text-white leading-[1.04] tracking-tight drop-shadow-md">
            Designed for colder days
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/95 font-sans leading-relaxed max-w-lg drop-shadow-xs">
            Our winter pieces focus on comfort, form, and quiet confidence. Easy to wear. Easy to keep.
          </p>

          {/* Social Proof: 5 Gold Stars + 1M+ satisfied customers */}
          <div className="flex items-center space-x-2 pt-1 text-white">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-mono text-white/95 font-medium tracking-tight">
              1M+ satisfied customers
            </span>
          </div>

          {/* Dark Pill CTA: Shop now */}
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/10"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
