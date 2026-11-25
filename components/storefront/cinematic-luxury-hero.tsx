"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Thermometer, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CinematicLuxuryHeroProps {
  onShopWomen?: () => void;
  onShopMen?: () => void;
}

export function CinematicLuxuryHero({
  onShopWomen,
  onShopMen,
}: CinematicLuxuryHeroProps) {
  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[94vh] flex items-end overflow-hidden bg-[#111] text-white">
      {/* 1. Dramatic High-Fashion Winter Photography */}
      <Image
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=90&w=2560"
        alt="Cold Horizon Winter Expedition"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%] scale-[1.01]"
      />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />

      {/* 2. Hero Content Container */}
      <div className="relative z-10 max-w-[1500px] mx-auto w-full px-6 sm:px-12 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Season Eyebrow */}
            <div className="flex items-center space-x-3 text-2xs uppercase tracking-[0.24em] font-mono text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white inline-block animate-pulse" />
              <span>WINTER 2026/27 • ARCHIVAL RELEASE 01</span>
            </div>

            {/* Main Editorial Title */}
            <h1 className="font-sans text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[0.92] uppercase">
              Cold Horizon
              <span className="block font-light text-white/90">Equilibrium</span>
            </h1>

            {/* Manifesto Paragraph */}
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed tracking-wide max-w-xl font-sans">
              Sculpted for extreme sub-zero alpine conditions and understated city winters.
              850 fill power Responsible Goose Down, welded Japanese shell membranes, and zero compromise.
            </p>

            {/* High-Contrast Campaign Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onShopWomen || (() => {
                  const el = document.getElementById("core-apparel");
                  el?.scrollIntoView({ behavior: "smooth" });
                })}
                className="bg-white hover:bg-[#EAEAEA] text-black px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Shop Women&apos;s Collection
              </button>
              <button
                onClick={onShopMen || (() => {
                  const el = document.getElementById("core-apparel");
                  el?.scrollIntoView({ behavior: "smooth" });
                })}
                className="border border-white/60 hover:border-white bg-black/40 hover:bg-white hover:text-black text-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all backdrop-blur-sm"
              >
                Shop Men&apos;s Collection
              </button>
            </div>
          </div>

          {/* Right Column: Alpine Weather Station Live Ticker */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end space-y-3">
            <div className="bg-black/60 border border-white/20 backdrop-blur-md p-4 sm:p-5 rounded-none space-y-2 text-white max-w-xs w-full">
              <div className="flex items-center justify-between text-2xs uppercase tracking-widest font-mono text-white/60 border-b border-white/10 pb-2">
                <span className="flex items-center space-x-1.5">
                  <Compass className="h-3.5 w-3.5 text-white/80" />
                  <span>St. Moritz Station</span>
                </span>
                <span>2,840M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-sky-300" />
                  <span className="font-mono text-2xl font-bold tracking-tight text-white">-18°C</span>
                </div>
                <div className="text-right text-2xs font-mono text-white/70">
                  <p>Powder: 85cm</p>
                  <p>Wind: 42 km/h</p>
                </div>
              </div>
              <p className="text-[0.62rem] text-white/50 tracking-wider uppercase pt-1">
                Field tested & rated for severe conditions
              </p>
            </div>

            <div className="hidden lg:flex items-center space-x-2 text-2xs uppercase tracking-widest font-mono text-white/60 pt-2">
              <span>Scroll to Explore</span>
              <ArrowDown className="h-3 w-3 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
