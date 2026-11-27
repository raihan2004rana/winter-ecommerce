"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminCampaign } from "@/lib/server/admin-store";
import { Sparkles } from "lucide-react";

let cachedCategoryCampaign: AdminCampaign | null = null;
let lastCategoryCampaignFetchTime = 0;

export function WardrobeExactCategories() {
  const [campaign, setCampaign] = React.useState<AdminCampaign | null>(() => cachedCategoryCampaign);
  const [womenImage, setWomenImage] = React.useState<string>("/images/wardrobe/new arrival-women.avif");
  const [menImage, setMenImage] = React.useState<string>("/images/wardrobe/new arrival-men.webp");

  const loadCategoryCampaign = React.useCallback((force = false) => {
    const now = Date.now();
    if (!force && now - lastCategoryCampaignFetchTime < 60000) {
      setCampaign(cachedCategoryCampaign);
      return;
    }

    fetch(`/api/campaigns?placement=category_header`, {
      cache: "default",
    })
      .then((res) => res.json())
      .then((data) => {
        lastCategoryCampaignFetchTime = Date.now();
        if (data?.status === "success" && data.campaigns?.length > 0) {
          const active = data.campaigns[0];
          cachedCategoryCampaign = active;
          setCampaign(active);

          // Track impression beacon once per session
          try {
            if (!sessionStorage.getItem(`imp_${active.id}`)) {
              sessionStorage.setItem(`imp_${active.id}`, "1");
              fetch("/api/admin/campaigns/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ campaignId: active.id, event: "impression" }),
              }).catch(() => {});
            }
          } catch {}
        } else {
          cachedCategoryCampaign = null;
          setCampaign(null);
        }
      })
      .catch((err) => console.error("Failed to load category campaign:", err));
  }, []);

  React.useEffect(() => {
    loadCategoryCampaign(false);

    // 1. Cross-tab synchronization via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wardrobe_campaigns_sync");
      channel.onmessage = (msg) => {
        if (msg.data?.type === "CAMPAIGN_UPDATED") {
          cachedCategoryCampaign = null;
          loadCategoryCampaign(true);
        }
      };
    } catch {}

    // 2. Refetch on window focus / tab visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadCategoryCampaign(true);
      }
    };
    const handleFocus = () => loadCategoryCampaign(false);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    // 3. Load dynamic category images from admin
    fetch(`/api/categories?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          const womenCat =
            data.data.find((c: any) => c.slug === "women") ||
            data.data.find((c: any) => c.gender === "women");
          if (womenCat?.image) setWomenImage(womenCat.image);

          const menCat =
            data.data.find((c: any) => c.slug === "men") ||
            data.data.find((c: any) => c.gender === "men");
          if (menCat?.image) setMenImage(menCat.image);
        }
      })
      .catch((err) => console.error("Failed to load category images:", err));

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (channel) channel.close();
    };
  }, [loadCategoryCampaign]);

  const handleCtaClick = () => {
    if (!campaign) return;
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, event: "click" }),
    }).catch(() => {});
  };

  const title = campaign?.headline || "Shop by category";
  const subtitle =
    campaign?.subheadline ||
    "Comfortable styles for women, men, and kids. Designed to be worn every day.";
  const badgeText = campaign?.badgeText;

  return (
    <section className="w-full bg-[#FFFFFF] py-10 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header: Shop by category or dynamic campaign */}
        <div className="mb-6 sm:mb-10 space-y-1">
          {badgeText && (
            <div className="pb-1">
              <span className="inline-flex items-center gap-1 bg-[#111] text-white text-[0.62rem] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                {badgeText}
              </span>
            </div>
          )}
          <h2 className="font-editorial text-2xl sm:text-4xl text-[#111] font-normal tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#666] font-sans">
            {subtitle}
          </p>
        </div>

        {/* 2 Side-by-Side Large Category Cards (50/50 Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* WOMEN CARD */}
          <Link
            href="/collections/women"
            onClick={handleCtaClick}
            className="group relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#1C1C1E] overflow-hidden block"
          >
            <Image
              src={womenImage}
              alt="Women Collection"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            {/* Subtle bottom shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Bottom-left Overlays */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 space-y-1.5 sm:space-y-2 z-10">
              <span className="text-[0.62rem] sm:text-[0.68rem] font-mono font-bold tracking-widest uppercase text-white/90 bg-white/20 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 inline-block">
                NEW ARRIVALS
              </span>
              <h3 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                WOMEN
              </h3>
              <div className="pt-1">
                <span className="inline-block bg-white text-black hover:bg-black hover:text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors">
                  Shop women
                </span>
              </div>
            </div>
          </Link>

          {/* MEN CARD */}
          <Link
            href="/collections/men"
            onClick={handleCtaClick}
            className="group relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#1C1C1E] overflow-hidden block"
          >
            <Image
              src={menImage}
              alt="Men Collection"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            {/* Subtle bottom shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Bottom-left Overlays */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 space-y-1.5 sm:space-y-2 z-10">
              <span className="text-[0.62rem] sm:text-[0.68rem] font-mono font-bold tracking-widest uppercase text-white/90 bg-white/20 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 inline-block">
                NEW ARRIVALS
              </span>
              <h3 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                MEN
              </h3>
              <div className="pt-1">
                <span className="inline-block bg-white text-black hover:bg-black hover:text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors">
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
