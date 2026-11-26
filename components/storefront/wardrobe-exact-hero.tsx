"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AdminCampaign } from "@/lib/server/admin-store";

export function WardrobeExactHero() {
  const [campaign, setCampaign] = React.useState<AdminCampaign | null>(null);

  React.useEffect(() => {
    fetch("/api/campaigns?placement=hero")
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success" && data.campaigns?.length > 0) {
          const active = data.campaigns[0];
          setCampaign(active);

          // Track impression beacon
          fetch("/api/admin/campaigns/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ campaignId: active.id, event: "impression" }),
          }).catch(() => { });
        }
      })
      .catch((err) => console.error("Failed to load hero campaign:", err));
  }, []);

  const handleCtaClick = () => {
    if (!campaign) return;
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, event: "click" }),
    }).catch(() => { });
  };

  const heroImage = campaign?.desktopImage || "/images/wardrobe/super-hero.jpg";
  const badgeText = campaign?.badgeText || "NEW DROP";
  const headline = campaign?.headline || "Designed for colder days";
  const subheadline =
    campaign?.subheadline ||
    "Our winter pieces focus on comfort, form, and quiet confidence. Easy to wear. Easy to keep.";
  const ctaText = campaign?.ctaText || "Shop now";
  const destinationUrl = campaign?.destinationUrl || "/products";

  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] max-h-[860px] overflow-hidden bg-[#EAE8E4]">
      {/* 
        Hero Background: High-Definition Master of the Hoodies Rack (uploaded by user or campaign)
      */}
      <Image
        src={heroImage}
        alt={headline}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[center_35%] pointer-events-none transition-opacity duration-700"
      />

      {/* Enhanced contrast vignette ensuring bold white text pops cleanly */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />

      {/* Hero Content Box (Matching Exact Framer Positioning) */}
      <div className="relative z-10 max-w-[1500px] h-full mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
        <div className="max-w-xl space-y-4 pt-12 sm:pt-16">
          {/* Badge Pill: NEW DROP or Campaign Badge */}
          {badgeText && (
            <div>
              <span className="inline-block bg-[#E11D48] text-white text-[0.68rem] sm:text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                {badgeText}
              </span>
            </div>
          )}

          {/* Signature Headline in Bold Editorial Serif */}
          <h1
            className="font-editorial text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-white leading-[0.98] tracking-tight"
            style={{
              fontWeight: 700,
              WebkitTextStroke: "0.8px currentColor",
              textShadow: "0 4px 24px rgba(0, 0, 0, 0.75), 0 1px 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            {headline}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/95 font-sans leading-relaxed max-w-lg drop-shadow-xs">
            {subheadline}
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

          {/* Dark Pill CTA: Shop now or Campaign CTA */}
          <div className="pt-2">
            <Link
              href={destinationUrl}
              onClick={handleCtaClick}
              className="inline-block bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/10"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
