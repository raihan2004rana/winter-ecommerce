"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export function WardrobeExactUgc() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 sm:py-24 border-b border-[#F0F0F0] overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 text-center space-y-4">
        {/* Top 5 Stars + 1M+ satisfied customers */}
        <div className="flex items-center justify-center space-x-1 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
          ))}
          <span className="text-2xs font-mono text-[#888] ml-1">
            1M+ satisfied customers
          </span>
        </div>

        {/* Heading: As seen on you */}
        <h2 className="font-editorial text-4xl sm:text-5xl text-[#111] font-normal tracking-tight">
          As seen on you
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#666] font-sans max-w-md mx-auto">
          Real people wearing KØRA in everyday moments.
        </p>

        {/* Follow us Button */}
        <div className="pt-1">
          <Link
            href="/products"
            className="inline-block bg-[#1E1E1E] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors"
          >
            Follow us
          </Link>
        </div>

        {/* 3D Stacked Coverflow / Fan Carousel */}
        <div className="pt-10 pb-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
          {/* Fan Background Left Card 2 */}
          <div className="absolute w-[180px] sm:w-[220px] aspect-[9/16] rounded-xl overflow-hidden shadow-md -translate-x-[160px] sm:-translate-x-[240px] scale-80 rotate-[-12deg] opacity-40 blur-[1px] pointer-events-none transition-all">
            <Image
              src="/images/wardrobe/lIT6XTSJ7w7ldhyW6UnppvsA.jpg"
              alt="Social moment"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Fan Background Left Card 1 */}
          <div className="absolute w-[200px] sm:w-[250px] aspect-[9/16] rounded-xl overflow-hidden shadow-lg -translate-x-[90px] sm:-translate-x-[140px] scale-90 rotate-[-6deg] opacity-75 pointer-events-none transition-all">
            <Image
              src="/images/wardrobe/bZjYMI83pPwIDnCh0nG79sedo.jpg"
              alt="Social moment"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Center Primary Card (The White Coat in Field from Wardrobe Framer) */}
          <div className="relative z-10 w-[240px] sm:w-[290px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-transform hover:scale-102 duration-300">
            <Image
              src="/images/wardrobe/XXPFXEgfRUbG6MILrHhmeoyixII.jpg"
              alt="As seen on you - Featured customer moment"
              fill
              unoptimized
              priority
              sizes="300px"
              className="object-cover"
            />
            <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white">
              <span className="text-2xs">♥</span>
            </div>
          </div>

          {/* Fan Background Right Card 1 */}
          <div className="absolute w-[200px] sm:w-[250px] aspect-[9/16] rounded-xl overflow-hidden shadow-lg translate-x-[90px] sm:translate-x-[140px] scale-90 rotate-[6deg] opacity-75 pointer-events-none transition-all">
            <Image
              src="/images/wardrobe/uSP5ea5zqNJXxT5jmPWYTI3wZMc.jpg"
              alt="Social moment"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Fan Background Right Card 2 */}
          <div className="absolute w-[180px] sm:w-[220px] aspect-[9/16] rounded-xl overflow-hidden shadow-md translate-x-[160px] sm:translate-x-[240px] scale-80 rotate-[12deg] opacity-40 blur-[1px] pointer-events-none transition-all">
            <Image
              src="/images/wardrobe/VHE2QuCOl6cE6GR0KXglRilpug.jpg"
              alt="Social moment"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center space-x-1.5 pt-2">
          <span className="h-1.5 w-6 rounded-full bg-[#111]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#DDD]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#DDD]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#DDD]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#DDD]" />
        </div>
      </div>
    </section>
  );
}
