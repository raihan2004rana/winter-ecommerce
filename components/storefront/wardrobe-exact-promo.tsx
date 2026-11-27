"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminCampaign } from "@/lib/server/admin-store";
import { Sparkles, Copy, Check, ArrowRight, Timer, Layers, Grid2X2 } from "lucide-react";

/**
 * Isolated high-precision countdown timer component
 * Supports both fixed targetDate and luxury aesthetic fallback ticking
 */
function PromoCountdown({
  timer,
}: {
  timer?: { enabled: boolean; targetDate?: string };
}) {
  const [time, setTime] = React.useState({
    days: "00",
    hours: "18",
    minutes: "42",
    seconds: "30",
    millis: "99",
  });

  React.useEffect(() => {
    const targetDate =
      timer?.enabled && timer?.targetDate
        ? new Date(timer.targetDate).getTime()
        : null;

    if (targetDate) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, targetDate - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const millis = Math.floor((diff % 1000) / 10);

        setTime({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
          millis: String(millis).padStart(2, "0"),
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      // Luxury ticking loop
      let h = 18;
      let m = 42;
      let s = 30;
      let ms = 99;

      const interval = setInterval(() => {
        ms -= 1;
        if (ms < 0) {
          ms = 99;
          s -= 1;
          if (s < 0) {
            s = 59;
            m -= 1;
            if (m < 0) {
              m = 59;
              h -= 1;
              if (h < 0) h = 23;
            }
          }
        }
        setTime({
          days: "00",
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
          millis: String(ms).padStart(2, "0"),
        });
      }, 10);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const hasDays = parseInt(time.days, 10) > 0;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 select-none font-mono">
      {hasDays && (
        <>
          <div className="flex flex-col items-center">
            <span className="text-lg sm:text-2xl lg:text-4xl font-light text-[#111]">{time.days}</span>
            <span className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-wider text-neutral-400">Days</span>
          </div>
          <span className="text-base sm:text-xl font-light text-neutral-300 pb-2 sm:pb-3">:</span>
        </>
      )}
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl lg:text-4xl font-light text-[#111]">{time.hours}</span>
        <span className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-wider text-neutral-400">Hrs</span>
      </div>
      <span className="text-base sm:text-xl font-light text-neutral-300 pb-2 sm:pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl lg:text-4xl font-light text-[#111]">{time.minutes}</span>
        <span className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-wider text-neutral-400">Min</span>
      </div>
      <span className="text-base sm:text-xl font-light text-neutral-300 pb-2 sm:pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl lg:text-4xl font-light text-[#111]">{time.seconds}</span>
        <span className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-wider text-neutral-400">Sec</span>
      </div>
      <span className="text-base sm:text-xl font-light text-neutral-300 pb-2 sm:pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-lg sm:text-2xl lg:text-4xl font-light text-[#E11D48]">{time.millis}</span>
        <span className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-wider text-neutral-400">Ms</span>
      </div>
    </div>
  );
}

/**
 * Copyable coupon code badge
 */
function CouponBadge({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-[0.7rem] font-mono font-semibold px-2.5 py-1 rounded transition-colors"
      title="Click to copy coupon code"
    >
      <span className="text-neutral-500 font-normal">CODE:</span>
      <span className="tracking-wider">{code}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600" />
      ) : (
        <Copy className="w-3 h-3 text-neutral-500" />
      )}
    </button>
  );
}

let cachedPromoCampaigns: AdminCampaign[] | null = null;
let lastPromoFetchTime = 0;

export function WardrobeExactPromo() {
  const [campaigns, setCampaigns] = React.useState<AdminCampaign[]>(() => cachedPromoCampaigns || []);
  const [loaded, setLoaded] = React.useState(() => !!cachedPromoCampaigns);
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const loadPromoCampaigns = React.useCallback((force = false) => {
    const now = Date.now();
    if (!force && cachedPromoCampaigns && now - lastPromoFetchTime < 60000) {
      setCampaigns(cachedPromoCampaigns);
      setLoaded(true);
      return;
    }

    fetch(`/api/campaigns?placement=promo_section`, {
      cache: "default",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.campaigns)) {
          cachedPromoCampaigns = data.campaigns;
          lastPromoFetchTime = Date.now();
          setCampaigns(data.campaigns);

          // Track impressions at most once per session per campaign
          data.campaigns.forEach((c: AdminCampaign) => {
            try {
              if (!sessionStorage.getItem(`imp_${c.id}`)) {
                sessionStorage.setItem(`imp_${c.id}`, "1");
                fetch("/api/admin/campaigns/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ campaignId: c.id, event: "impression" }),
                }).catch(() => {});
              }
            } catch {}
          });
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load promo campaign:", err);
        setLoaded(true);
      });
  }, []);

  React.useEffect(() => {
    loadPromoCampaigns(false);

    // 1. Cross-tab synchronization via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wardrobe_campaigns_sync");
      channel.onmessage = (msg) => {
        if (msg.data?.type === "CAMPAIGN_UPDATED") {
          cachedPromoCampaigns = null;
          loadPromoCampaigns(true);
        }
      };
    } catch {}

    // 2. Window focus & tab visibility change listener
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadPromoCampaigns(true);
      }
    };
    window.addEventListener("focus", () => loadPromoCampaigns(false));
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", () => loadPromoCampaigns(false));
      document.removeEventListener("visibilitychange", handleVisibility);
      if (channel) channel.close();
    };
  }, [loadPromoCampaigns]);

  const handleCtaClick = (campaignId: string) => {
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, event: "click" }),
    }).catch(() => {});
  };

  // If loaded and no campaigns are active, DO NOT RENDER (fixes the bug where paused campaign still showed)
  if (loaded && campaigns.length === 0) {
    return null;
  }

  // Still loading initial state
  if (!loaded && campaigns.length === 0) {
    return null;
  }

  // CASE 1: Single Campaign (Classic Framer 50/50 split layout)
  if (campaigns.length === 1) {
    const campaign = campaigns[0];
    const promoImage = campaign.desktopImage || "/images/wardrobe/black-friday.jpg";
    const badgeText = campaign.badgeText || "FLASH SALE";
    const headline = campaign.headline || "Black Friday deals are live";
    const subheadline =
      campaign.subheadline ||
      "Don’t miss reduced prices on seasonal favorites. This offer won’t last long.";
    const ctaText = campaign.ctaText || "Shop deals";
    const destinationUrl = campaign.destinationUrl || "/products";

    return (
      <section className="w-full bg-[#FFFFFF] py-10 sm:py-20 border-b border-[#F0F0F0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Left Column: Visual Image */}
            <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] w-full bg-[#1A1A1A] overflow-hidden">
              <Image
                src={promoImage}
                alt={headline}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-103"
              />
              {campaign.discountRule?.value && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#111] font-mono font-bold text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-md">
                  {campaign.discountRule.type === "free_shipping"
                    ? "FREE SHIPPING"
                    : `${campaign.discountRule.value}% OFF`}
                </div>
              )}
            </div>

            {/* Right Column: Heading + Countdown + Dual Buttons */}
            <div className="flex flex-col justify-center space-y-5 sm:space-y-6 md:pl-6 text-center md:text-left">
              <div className="space-y-2.5 sm:space-y-3">
                {badgeText && (
                  <div className="flex items-center justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 bg-[#E11D48] text-white text-[0.65rem] sm:text-[0.68rem] font-mono font-bold tracking-widest uppercase px-2.5 sm:px-3 py-1 rounded-full shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      {badgeText}
                    </span>
                  </div>
                )}
                <h2 className="font-editorial text-2xl xs:text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#111] leading-[1.1] sm:leading-[1.08] tracking-tight">
                  {headline}
                </h2>
                <p className="text-xs sm:text-sm text-[#666] font-sans leading-relaxed max-w-md mx-auto md:mx-0">
                  {subheadline}
                </p>
              </div>

              {/* Digital Countdown Timer */}
              <div className="pt-1 sm:pt-2 flex justify-center md:justify-start overflow-x-auto pb-1">
                <PromoCountdown timer={campaign.countdownTimer} />
              </div>

              {/* Coupon Code (if applicable) */}
              {campaign.discountRule?.couponCode && (
                <div className="flex justify-center md:justify-start pt-1">
                  <CouponBadge code={campaign.discountRule.couponCode} />
                </div>
              )}

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:space-x-3 sm:gap-0 pt-2">
                <Link
                  href={destinationUrl}
                  onClick={() => handleCtaClick(campaign.id)}
                  className="bg-[#1E1E1E] hover:bg-black text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-sm"
                >
                  {ctaText}
                </Link>
                <Link
                  href="/products"
                  className="bg-[#2D2D2D] hover:bg-black text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-sm"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // CASE 2: Multiple Campaigns (Dual Grid side-by-side or multi-column layout)
  const displayedCampaigns =
    activeTab === "all"
      ? campaigns
      : campaigns.filter((c) => c.id === activeTab);

  return (
    <section className="w-full bg-[#FFFFFF] py-10 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 space-y-6 sm:space-y-10">
        {/* Header Bar: Status Indicator + Tab Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-neutral-900 text-white text-[0.68rem] font-mono font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Campaigns ({campaigns.length} Active)
            </span>
            <span className="text-xs text-neutral-500 font-sans hidden md:inline">
              Limited-time seasonal flash offers & drop events
            </span>
          </div>

          {/* Tab Selector when 2+ campaigns run simultaneously */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                activeTab === "all"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Side-by-Side (All)
            </button>
            {campaigns.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id)}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-all max-w-[140px] truncate ${
                  activeTab === c.id
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {c.badgeText || `Offer ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>

        {/* Dual / Multi-Grid Layout: Exactly 2 equal columns on desktop */}
        <div
          className={`grid gap-8 lg:gap-10 items-stretch ${
            displayedCampaigns.length === 1
              ? "grid-cols-1"
              : displayedCampaigns.length === 2
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {displayedCampaigns.map((c) => {
            const promoImage = c.desktopImage || "/images/wardrobe/black-friday.jpg";
            const badgeText = c.badgeText || "SPECIAL OFFER";
            const headline = c.headline || c.title;
            const subheadline =
              c.subheadline ||
              "Don’t miss reduced prices on seasonal favorites. This offer won’t last long.";
            const ctaText = c.ctaText || "Shop Deals";
            const destinationUrl = c.destinationUrl || "/products";

            return (
              <div
                key={c.id}
                className="group bg-[#FBFBFA] border border-[#E8E6E1] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:border-neutral-400"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#181818] overflow-hidden">
                  <Image
                    src={promoImage}
                    alt={headline}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    {badgeText && (
                      <span className="inline-flex items-center gap-1.5 bg-[#E11D48] text-white text-[0.65rem] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                        <Sparkles className="w-3 h-3" />
                        {badgeText}
                      </span>
                    )}
                    {c.discountRule?.value && (
                      <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-mono font-bold px-3 py-1 rounded-full shadow-sm ml-auto">
                        {c.discountRule.type === "free_shipping"
                          ? "FREE SHIPPING"
                          : `${c.discountRule.value}% OFF`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-editorial text-2xl sm:text-3xl lg:text-[2.2rem] font-normal text-[#111] leading-tight tracking-tight">
                      {headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#666] font-sans leading-relaxed line-clamp-2">
                      {subheadline}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="pt-1">
                    <PromoCountdown timer={c.countdownTimer} />
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80">
                    {c.discountRule?.couponCode ? (
                      <CouponBadge code={c.discountRule.couponCode} />
                    ) : (
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                        Discount auto-applied
                      </span>
                    )}

                    <Link
                      href={destinationUrl}
                      onClick={() => handleCtaClick(c.id)}
                      className="inline-flex items-center gap-2 bg-[#1E1E1E] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all hover:scale-103 shadow-sm"
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
