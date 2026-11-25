import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * BANNER STYLE 1: Full-Bleed Campaign Hero Banner
 * Photography-led, asymmetric editorial typography, calm restrained CTA.
 */
export function CampaignHeroBanner({
  title = "SUB-ZERO EXPEDITION",
  subtitle = "High-performance thermal outerwear engineered for extreme sub-zero alpine conditions and timeless urban transit.",
  ctaText = "Explore Collection",
  eyebrow = "Winter 2026/27 Drop 01",
  imageUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1920",
  onCtaClick,
}: {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  eyebrow?: string;
  imageUrl?: string;
  onCtaClick?: () => void;
}) {
  return (
    <section className="relative w-full aspect-editorial-wide md:min-h-[580px] flex items-end overflow-hidden bg-charcoal-900 text-canvas">
      {/* Background Photography with Subtle Contrast Overlay */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-85 scale-[1.01]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent" />

      {/* Content Placed at Lower Third with Generous Margins */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 pb-12 sm:pb-16">
        <div className="max-w-2xl space-y-4">
          <Badge variant="outline" className="border-canvas/40 text-canvas bg-charcoal-900/40">
            {eyebrow}
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-display-lg font-normal tracking-tight leading-[1.05] text-canvas">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-canvas/80 leading-relaxed tracking-wide max-w-lg">
            {subtitle}
          </p>
          <div className="pt-2 flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-canvas text-canvas hover:bg-canvas hover:text-charcoal"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            <Button
              variant="ghost"
              className="text-canvas/80 hover:text-canvas hover:bg-white/10"
            >
              View Lookbook
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * BANNER STYLE 2: Split Craft Editorial Banner
 * 50/50 balance between warm off-white craftsmanship storytelling and high-res garment detail.
 */
export function SplitCraftBanner({
  title = "RESPONSIBLE DOWN & THERMAL INTEGRITY",
  description = "Every goose down feather is 100% certified under the Responsible Down Standard (RDS). Packed with 850 fill power for maximum warmth-to-weight ratio without unnecessary bulk.",
  imageUrl = "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1200",
  ctaText = "Read Material Philosophy",
  onCtaClick,
}: {
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 border-y border-canvas-muted bg-canvas-subtle">
      {/* Text Narrative */}
      <div className="lg:col-span-6 p-8 sm:p-14 lg:p-20 flex flex-col justify-center space-y-6">
        <span className="editorial-caps text-forest font-semibold">
          Materials & Craftsmanship
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-charcoal font-normal tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed max-w-xl">
          {description}
        </p>
        <div className="pt-2">
          <Button variant="primary" size="default" onClick={onCtaClick}>
            {ctaText}
          </Button>
        </div>
      </div>

      {/* Photography Detail */}
      <div className="relative lg:col-span-6 aspect-editorial-portrait lg:aspect-auto min-h-[360px] overflow-hidden bg-canvas">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}

/**
 * BANNER STYLE 3: Minimalist Shipping Ribbon
 * Understated notification banner communicating international threshold incentives.
 */
export function MinimalShippingRibbon({
  threshold = "$200",
  currentProgress = 145,
  targetProgress = 200,
}: {
  threshold?: string;
  currentProgress?: number;
  targetProgress?: number;
}) {
  const percentage = Math.min(100, Math.round((currentProgress / targetProgress) * 100));
  const remaining = Math.max(0, targetProgress - currentProgress);

  return (
    <div className="w-full bg-forest text-canvas py-3 px-6 text-center text-xs">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-sm">Alpine Transit</span>
          <span className="text-2xs text-canvas/70">|</span>
          <span className="text-2xs uppercase tracking-editorial">
            {remaining > 0
              ? `Add $${remaining} to unlock complimentary international express delivery`
              : "Complimentary international express shipping unlocked"}
          </span>
        </div>
        <div className="w-full sm:w-48 bg-forest-deep h-1.5 rounded-none overflow-hidden">
          <div
            className="bg-ice-soft h-full transition-all duration-500 ease-editorial-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
