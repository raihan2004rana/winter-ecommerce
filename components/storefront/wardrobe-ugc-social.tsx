"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, ShoppingBag, ArrowUpRight } from "lucide-react";

const SOCIAL_MOMENTS = [
  {
    id: "ugc-1",
    handle: "@elena.winter",
    location: "St. Moritz, Switzerland",
    outfit: "Thermal Insulated Shell Coat",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800",
    productSlug: "thermal-insulated-shell-coat",
    temperature: "-14°C",
  },
  {
    id: "ugc-2",
    handle: "@julian.nordic",
    location: "Oslo, Norway",
    outfit: "Nordic Expedition Down Parka",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=800",
    productSlug: "nordic-expedition-down-parka",
    temperature: "-22°C",
  },
  {
    id: "ugc-3",
    handle: "@sophia.alp",
    location: "Cortina d'Ampezzo, Italy",
    outfit: "Alpine Merino Ribbed Turtleneck",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
    productSlug: "alpine-merino-ribbed-turtleneck",
    temperature: "-8°C",
  },
  {
    id: "ugc-4",
    handle: "@marcus.berlin",
    location: "Stockholm, Sweden",
    outfit: "Classic Winter Down Coat",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=800",
    productSlug: "classic-winter-down-coat",
    temperature: "-11°C",
  },
];

export function WardrobeUgcSocial() {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 sm:py-24 border-b border-[#EAEAEA]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* =========================================================================
            HEADER: "As seen on social" (Framer Wardrobe Structure)
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 text-2xs font-mono uppercase tracking-[0.25em] text-[#777] mb-1.5">
              <span>Community in the Field</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-medium tracking-[-0.03em] text-[#111]">
              As seen on social
            </h2>
            <p className="text-xs sm:text-sm text-[#666] font-sans mt-2 leading-relaxed">
              Real people wearing our winter silhouettes in everyday sub-zero moments.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest font-semibold text-[#111] hover:text-[#555] transition-colors self-start sm:self-end"
          >
            <Camera className="h-4 w-4" />
            <span>Tag #ColdHorizon to be featured</span>
          </a>
        </div>

        {/* =========================================================================
            4-COLUMN PORTRAIT UGC CARDS
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOCIAL_MOMENTS.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col aspect-[4/5] bg-white border border-[#EAEAEA] overflow-hidden hover:border-[#111] transition-all duration-300 shadow-2xs"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.outfit}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-[center_20%] group-hover:scale-104 transition-transform duration-700 ease-out"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* Top Handle & Temperature */}
              <div className="relative z-10 p-4 flex items-center justify-between text-white">
                <span className="text-2xs font-mono font-medium tracking-wide bg-black/40 backdrop-blur-xs px-2.5 py-1 border border-white/20">
                  {item.handle}
                </span>
                <span className="text-2xs font-mono text-white/90 bg-white/20 backdrop-blur-xs px-2 py-0.5">
                  {item.temperature}
                </span>
              </div>

              {/* Bottom Shoppable Tag */}
              <div className="relative z-10 mt-auto p-4 space-y-2">
                <div className="flex items-center space-x-1.5 text-2xs text-white/80 font-mono">
                  <MapPin className="h-3 w-3 text-white" />
                  <span>{item.location}</span>
                </div>

                <Link
                  href={`/products/${item.productSlug}`}
                  className="flex items-center justify-between w-full bg-white/95 hover:bg-black text-[#111] hover:text-white px-3 py-2 text-2xs font-mono uppercase tracking-wider font-semibold transition-colors duration-300 shadow-xs"
                >
                  <span className="truncate pr-2">{item.outfit}</span>
                  <ShoppingBag className="h-3 w-3 shrink-0" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
