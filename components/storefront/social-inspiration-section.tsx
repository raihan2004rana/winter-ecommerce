"use client";

import * as React from "react";
import Image from "next/image";
import { SOCIAL_GALLERY } from "@/data/social";
import { Camera, ArrowUpRight } from "lucide-react";

export function SocialInspirationSection() {
  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b border-canvas-muted pb-6">
        <div className="space-y-1">
          <span className="editorial-caps text-forest font-semibold">Curated Community</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            In The Alpine Field: #VallisAndOre
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-2xs uppercase tracking-widest font-mono text-charcoal hover:text-forest transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Follow @vallis_archive</span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      {/* 4-Image Grid with Hover Shoppable Pill */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {SOCIAL_GALLERY.map((post) => (
          <div
            key={post.id}
            className="group relative aspect-editorial-tall overflow-hidden bg-canvas-subtle border border-canvas-muted"
          >
            <Image
              src={post.image}
              alt={`Community post by ${post.handle}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-editorial-out"
            />
            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors" />

            {/* Shoppable Tag Pill overlay on Hover */}
            <div className="absolute inset-x-3 bottom-3 p-3 bg-canvas/95 border border-canvas-muted opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="text-[0.62rem] uppercase tracking-widest text-charcoal-400 font-mono block">
                {post.location}
              </span>
              <h4 className="text-xs font-medium text-charcoal line-clamp-1 mt-0.5">
                {post.taggedProduct.title}
              </h4>
              <span className="font-mono text-2xs font-semibold text-charcoal block mt-0.5">
                ${post.taggedProduct.price} USD
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
