"use client";

import * as React from "react";
import Link from "next/link";
import { X, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { AdminCampaign } from "@/lib/server/admin-store";

export function WardrobeAnnouncementBar() {
  const [campaign, setCampaign] = React.useState<AdminCampaign | null>(null);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("wardrobe_announcement_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Fetch active announcement bar campaign
    fetch("/api/campaigns?placement=announcement_bar")
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
      .catch((err) => console.error("Failed to load announcement campaign:", err));
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("wardrobe_announcement_dismissed", "true");
  };

  const handleCtaClick = () => {
    if (!campaign) return;
    fetch("/api/admin/campaigns/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: campaign.id, event: "click" }),
    }).catch(() => {});
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isDismissed || !campaign) {
    return null;
  }

  const couponCode = campaign.discountRule?.couponCode;

  return (
    <div className="relative w-full bg-[#0D0D0E] text-white py-2.5 border-b border-white/10 z-50 text-xs font-sans transition-all">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between gap-3">
        {/* Center content container */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          {campaign.badgeText && (
            <span className="inline-flex items-center gap-1 bg-[#E11D48] text-white text-[0.62rem] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              {campaign.badgeText}
            </span>
          )}

          <span className="font-medium text-white/95 tracking-tight text-xs sm:text-[0.81rem]">
            {campaign.headline}
          </span>

          {campaign.subheadline && (
            <span className="hidden md:inline text-white/60 font-light text-xs">
              • {campaign.subheadline}
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

          {campaign.ctaText && (
            <Link
              href={campaign.destinationUrl || "/products"}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-1 text-[0.7rem] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1"
            >
              <span>{campaign.ctaText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

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
