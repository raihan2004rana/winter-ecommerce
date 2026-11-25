"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export function WardrobeExactCategories() {
  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header: Shop by category */}
        <div className="mb-8 sm:mb-10 space-y-1">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111] font-normal tracking-tight">
            Shop by category
          </h2>
          <p className="text-xs sm:text-sm text-[#666] font-sans">
            Comfortable styles for women, men, and kids. Designed to be worn every day.
          </p>
        </div>

        {/* 2 Side-by-Side Large Category Cards (50/50 Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* WOMEN CARD */}
          <Link
            href="/collections/women"
            className="group relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#1C1C1E] overflow-hidden block"
          >
            <Image
              src="/images/wardrobe/2c1VUc3b1EOQSlNqomiLkIAnSgM.png"
              alt="Women Collection"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            {/* Subtle bottom shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Bottom-left Overlays */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 space-y-2 z-10">
              <span className="text-[0.68rem] font-mono font-bold tracking-widest uppercase text-white/90 bg-white/20 backdrop-blur-xs px-2.5 py-1 inline-block">
                NEW ARRIVALS
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                WOMEN
              </h3>
              <div className="pt-1">
                <span className="inline-block bg-white text-black hover:bg-black hover:text-white px-5 py-2 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors">
                  Shop women
                </span>
              </div>
            </div>
          </Link>

          {/* MEN CARD */}
          <Link
            href="/collections/men"
            className="group relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#1C1C1E] overflow-hidden block"
          >
            <Image
              src="/images/wardrobe/unabh09aC1jyo60sOZAMIop582c.png"
              alt="Men Collection"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            {/* Subtle bottom shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Bottom-left Overlays */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 space-y-2 z-10">
              <span className="text-[0.68rem] font-mono font-bold tracking-widest uppercase text-white/90 bg-white/20 backdrop-blur-xs px-2.5 py-1 inline-block">
                NEW ARRIVALS
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                MEN
              </h3>
              <div className="pt-1">
                <span className="inline-block bg-white text-black hover:bg-black hover:text-white px-5 py-2 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors">
                  Shop men
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
