"use client";

import * as React from "react";
import Link from "next/link";
import { X, Sparkles, Copy, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminCampaign } from "@/lib/server/admin-store";

export function WardrobeAnnouncementBar() {
  const [campaigns, setCampaigns] = React.useState<AdminCampaign[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("wardrobe_announcement_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Fetch active announcement bar campaigns
    fetch(`/api/campaigns?placement=announcement_bar&_t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns);

          if (data.campaigns.length > 0) {
            // Track impression beacon
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
      .catch((err) => console.error("Failed to load announcement campaign:", err));
  }, []);

  // Auto-rotate if 2+ announcement campaigns are active
  React.useEffect(() => {
    if (campaigns.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [campaigns.length]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("wardrobe_announcement_dismissed", "true");
  };

  const currentCampaign = campaigns[currentIndex] || campaigns[0] || null;

  const handleCtaClick = () => {
    if (!currentCampaign) return;
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: currentCampaign.id, event: "click" }),
    }).catch(() => {});
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isDismissed || !currentCampaign) {
    return null;
  }

  const couponCode = currentCampaign.discountRule?.couponCode;

  return (
    <div className="relative w-full bg-[#0D0D0E] text-white py-2.5 border-b border-white/10 z-50 text-xs font-sans transition-all">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between gap-3">
        {/* If multiple campaigns, show prev arrow */}
        {campaigns.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + campaigns.length) % campaigns.length
              )
            }
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Center content container */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          {currentCampaign.badgeText && (
            <span className="inline-flex items-center gap-1 bg-[#E11D48] text-white text-[0.62rem] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              {currentCampaign.badgeText}
            </span>
          )}

          <span className="font-medium text-white/95 tracking-tight text-xs sm:text-[0.81rem]">
            {currentCampaign.headline}
          </span>

          {currentCampaign.subheadline && (
            <span className="hidden md:inline text-white/60 font-light text-xs">
              • {currentCampaign.subheadline}
            </span>
          )}

          {couponCode && (
            <button
              onClick={() => handleCopyCoupon(couponCode)}
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-mono font-semibold px-2 py-0.5 rounded text-[0.7rem] border border-white/20 transition-colors"
              title="Click to copy coupon code"
            >
              <span>{couponCode}</span>
              {copied ? (
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-white/70" />
              )}
            </button>
          )}

          {currentCampaign.ctaText && (
            <Link
              href={currentCampaign.destinationUrl || "/products"}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-1 text-[0.7rem] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1"
            >
              <span>{currentCampaign.ctaText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          {campaigns.length > 1 && (
            <span className="text-[0.65rem] font-mono text-white/40 ml-2">
              ({currentIndex + 1}/{campaigns.length})
            </span>
          )}
        </div>

        {/* If multiple campaigns, show next arrow */}
        {campaigns.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % campaigns.length)
            }
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="text-white/50 hover:text-white transition-colors p-1 -mr-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
