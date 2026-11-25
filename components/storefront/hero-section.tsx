"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Thermometer } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-end overflow-hidden bg-charcoal text-canvas">
      {/* Background High-Res Lifestyle Photography */}
      <Image
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=2400"
        alt="Nordic Alpine Winter Expedition"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-[1.01]"
      />

      {/* Atmospheric Editorial Gradients - Subtle and Human */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent" />
      <div className="absolute inset-0 bg-radial-[at_top_right] from-transparent via-transparent to-charcoal/60" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-6">
          {/* Eyebrow & Performance Pill */}
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-canvas/40 text-canvas bg-charcoal/60">
              Winter 2026/27 Drop 01
            </Badge>
            <div className="flex items-center space-x-1.5 text-2xs font-mono tracking-widest text-canvas/80">
              <Thermometer className="h-3 w-3 text-ice-frost" />
              <span>Certified to -35°C</span>
            </div>
          </div>

          {/* Editorial Display Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.02] text-canvas">
            High Cold Archival Series
          </h1>

          {/* Subtitle / Positioning Statement */}
          <p className="text-xs sm:text-sm text-canvas/85 leading-relaxed tracking-wide max-w-xl font-sans">
            A study in thermal equilibrium. Hand-crafted down parkas, double-faced cashmere overcoats, 
            and shearling footwear built for sub-zero expeditions and quiet urban winter transit.
          </p>

          {/* Primary & Secondary Campaign CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="#outerwear">
              <Button
                variant="primary"
                size="lg"
                className="bg-canvas text-charcoal hover:bg-forest hover:text-canvas border-canvas"
              >
                Explore Expedition Drop
              </Button>
            </Link>
            <Link href="#collections">
              <Button
                variant="outline"
                size="lg"
                className="border-canvas/50 text-canvas hover:bg-canvas/10 hover:border-canvas"
              >
                View Seasonal Lookbook
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden lg:flex absolute bottom-8 right-12 items-center space-x-2 text-2xs uppercase tracking-widest font-mono text-canvas/60">
          <span>Scroll to Discover</span>
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
