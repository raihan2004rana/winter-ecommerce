"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminCampaign } from "@/lib/server/admin-store";
import { Sparkles } from "lucide-react";

export function WardrobeExactPromo() {
  const [campaign, setCampaign] = React.useState<AdminCampaign | null>(null);
  const [time, setTime] = React.useState({
    hours: "18",
    minutes: "42",
    seconds: "30",
    millis: "99",
  });

  React.useEffect(() => {
    fetch("/api/campaigns?placement=promo_section")
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
          }).catch(() => {});
        }
      })
      .catch((err) => console.error("Failed to load promo campaign:", err));
  }, []);

  React.useEffect(() => {
    const targetDate = campaign?.countdownTimer?.enabled && campaign?.countdownTimer?.targetDate
      ? new Date(campaign.countdownTimer.targetDate).getTime()
      : null;

    if (targetDate) {
      // Real countdown towards target date
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, targetDate - now);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const millis = Math.floor((diff % 1000) / 10);

        setTime({
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
          millis: String(millis).padStart(2, "0"),
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      // High-precision ticking loop matching wardrobe.framer.ai
      let h = 18;
      let m = 42;
      let s = 30;
      let ms = 99;

      const timer = setInterval(() => {
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
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
          millis: String(ms).padStart(2, "0"),
        });
      }, 10);

      return () => clearInterval(timer);
    }
  }, [campaign]);

  const handleCtaClick = () => {
    if (!campaign) return;
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, event: "click" }),
    }).catch(() => {});
  };

  const promoImage = campaign?.desktopImage || "/images/wardrobe/black-friday.jpg";
  const badgeText = campaign?.badgeText || "FLASH SALE";
  const headline = campaign?.headline || "Black Friday deals are live";
  const subheadline =
    campaign?.subheadline ||
    "Don’t miss reduced prices on seasonal favorites. This offer won’t last long.";
  const ctaText = campaign?.ctaText || "Shop deals";
  const destinationUrl = campaign?.destinationUrl || "/products";

  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left Column: The exact white jackets on wooden hangers or campaign visual */}
          <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] w-full bg-[#1A1A1A] overflow-hidden">
            <Image
              src={promoImage}
              alt={headline}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-103"
            />
          </div>

          {/* Right Column: Heading + Countdown + Dual Buttons */}
          <div className="flex flex-col justify-center space-y-6 md:pl-6 text-center md:text-left">
            <div className="space-y-3">
              {badgeText && (
                <div className="flex items-center justify-center md:justify-start">
                  <span className="inline-flex items-center gap-1.5 bg-[#E11D48] text-white text-[0.68rem] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    {badgeText}
                  </span>
                </div>
              )}
              <h2 className="font-editorial text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#111] leading-[1.08] tracking-tight">
                {headline}
              </h2>
              <p className="text-xs sm:text-sm text-[#666] font-sans leading-relaxed max-w-md mx-auto md:mx-0">
                {subheadline}
              </p>
            </div>

            {/* Massive Digital Countdown: 00:00:00:00 */}
            <div className="pt-2">
              <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-light text-[#111] tracking-wider select-none">
                {time.hours}:{time.minutes}:{time.seconds}:{time.millis}
              </span>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-2">
              <Link
                href={destinationUrl}
                onClick={handleCtaClick}
                className="bg-[#1E1E1E] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-sm"
              >
                {ctaText}
              </Link>
              <Link
                href="/products"
                className="bg-[#2D2D2D] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-sm"
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
