"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminCampaign } from "@/lib/server/admin-store";

export function WardrobeExactHero() {
  const [campaigns, setCampaigns] = React.useState<AdminCampaign[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const loadHeroCampaigns = React.useCallback(() => {
    fetch(`/api/campaigns?placement=hero&_t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);

          if (data.campaigns.length > 0) {
            // Track impression beacon for the first active hero campaign
            fetch("/api/admin/campaigns/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                campaignId: data.campaigns[0].id,
                event: "impression",
              }),
            }).catch(() => {});
          }
        }
      })
      .catch((err) => console.error("Failed to load hero campaign:", err));
  }, []);

  React.useEffect(() => {
    loadHeroCampaigns();

    // 1. Cross-tab synchronization via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wardrobe_campaigns_sync");
      channel.onmessage = (msg) => {
        if (msg.data?.type === "CAMPAIGN_UPDATED") {
          loadHeroCampaigns();
        }
      };
    } catch {}

    // 2. Refetch on window focus / tab visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadHeroCampaigns();
      }
    };
    window.addEventListener("focus", loadHeroCampaigns);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", loadHeroCampaigns);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (channel) channel.close();
    };
  }, [loadHeroCampaigns]);

  // Auto-slide carousel if 2+ hero campaigns are active
  React.useEffect(() => {
    if (campaigns.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [campaigns.length]);

  const currentCampaign = campaigns[currentIndex] || campaigns[0] || null;

  const handleCtaClick = () => {
    if (!currentCampaign) return;
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: currentCampaign.id, event: "click" }),
    }).catch(() => {});
  };

  const heroImage =
    currentCampaign?.desktopImage &&
    currentCampaign.desktopImage !== "/images/wardrobe/hero-hoodies-hd.jpg"
      ? currentCampaign.desktopImage
      : "/images/wardrobe/super-hero.jpg";
  const badgeText = currentCampaign?.badgeText || "NEW DROP";
  const headline = currentCampaign?.headline || "Designed for colder days";
  const subheadline =
    currentCampaign?.subheadline ||
    "Our winter pieces focus on comfort, form, and quiet confidence. Easy to wear. Easy to keep.";
  const ctaText = currentCampaign?.ctaText || "Shop now";
  const destinationUrl = currentCampaign?.destinationUrl || "/products";

  return (
    <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] max-h-[860px] overflow-hidden bg-[#EAE8E4] group">
      {/* 
        Hero Background: High-Definition Visual Image
      */}
      <Image
        key={heroImage}
        src={heroImage}
        alt={headline}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[center_35%] pointer-events-none transition-opacity duration-1000"
      />

      {/* Enhanced contrast vignette ensuring bold white text pops cleanly */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />

      {/* Hero Content Box (Matching Exact Framer Positioning) */}
      <div className="relative z-10 max-w-[1600px] h-full mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
        <div className="max-w-xl space-y-4 pt-12 sm:pt-16">
          {/* Badge Pill: NEW DROP or Campaign Badge */}
          {badgeText && (
            <div>
              <span className="inline-block bg-[#E11D48] text-white text-[0.68rem] sm:text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                {badgeText}
              </span>
            </div>
          )}

          {/* Signature Headline in Clean Editorial Serif */}
          <h1
            className="font-editorial text-5xl sm:text-7xl lg:text-[5.5rem] font-normal text-white leading-[0.98] tracking-tight transition-all duration-500"
            style={{
              fontWeight: 400,
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.65)",
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
              prefetch={true}
              onClick={handleCtaClick}
              className="inline-block bg-[#111111] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/10"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-Campaign Carousel Controls (Visible when 2+ Hero campaigns are active) */}
      {campaigns.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + campaigns.length) % campaigns.length
              )
            }
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 border border-white/20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % campaigns.length)
            }
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 border border-white/20"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
            {campaigns.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? "w-7 h-2 bg-white shadow-xs"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
