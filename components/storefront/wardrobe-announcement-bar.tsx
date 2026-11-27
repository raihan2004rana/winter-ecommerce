"use client";

import * as React from "react";
import Link from "next/link";
import { X, Sparkles, Copy, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminCampaign } from "@/lib/server/admin-store";

let cachedAnnouncementCampaigns: AdminCampaign[] | null = null;
let lastAnnouncementFetchTime = 0;

export function WardrobeAnnouncementBar() {
  const [campaigns, setCampaigns] = React.useState<AdminCampaign[]>(() => cachedAnnouncementCampaigns || []);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [dismissedMap, setDismissedMap] = React.useState<Record<string, boolean>>({});
  const [copied, setCopied] = React.useState(false);

  const fetchCampaigns = React.useCallback((force = false) => {
    const now = Date.now();
    if (!force && cachedAnnouncementCampaigns && now - lastAnnouncementFetchTime < 60000) {
      setCampaigns(cachedAnnouncementCampaigns);
      return;
    }

    fetch(`/api/campaigns?placement=announcement_bar`, {
      cache: "default",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.campaigns)) {
          cachedAnnouncementCampaigns = data.campaigns;
          lastAnnouncementFetchTime = Date.now();
          setCampaigns(data.campaigns);

          if (data.campaigns.length > 0) {
            const campId = data.campaigns[0].id;
            // Track impression beacon at most once per session
            try {
              if (!sessionStorage.getItem(`imp_${campId}`)) {
                sessionStorage.setItem(`imp_${campId}`, "1");
                fetch("/api/admin/campaigns/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    campaignId: campId,
                    event: "impression",
                  }),
                }).catch(() => {});
              }
            } catch {}
          }
        }
      })
      .catch((err) => console.error("Failed to load announcement campaign:", err));
  }, []);

  React.useEffect(() => {
    fetchCampaigns(false);

    // 1. Real-time cross-tab synchronization via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("wardrobe_campaigns_sync");
      channel.onmessage = (msg) => {
        if (msg.data?.type === "CAMPAIGN_UPDATED") {
          // Reset dismissals for testing/admin updates
          cachedAnnouncementCampaigns = null;
          setDismissedMap({});
          fetchCampaigns(true);
        }
      };
    } catch {
      // BroadcastChannel unsupported fallback
    }

    // 2. Refetch on window focus / tab visibility change (no manual page refresh needed)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCampaigns(true);
      }
    };
    window.addEventListener("focus", () => fetchCampaigns(false));
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", () => fetchCampaigns(false));
      document.removeEventListener("visibilitychange", handleVisibility);
      if (channel) channel.close();
    };
  }, [fetchCampaigns]);

  // Auto-rotate if 2+ announcement campaigns are active
  React.useEffect(() => {
    if (campaigns.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [campaigns.length]);

  const currentCampaign = campaigns[currentIndex] || campaigns[0] || null;

  const handleDismiss = () => {
    if (!currentCampaign) return;
    setDismissedMap((prev) => ({ ...prev, [currentCampaign.id]: true }));
    try {
      sessionStorage.setItem(`wardrobe_announcement_dismissed_${currentCampaign.id}`, "true");
    } catch {}
  };

  const isCurrentDismissed =
    currentCampaign &&
    (dismissedMap[currentCampaign.id] ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem(`wardrobe_announcement_dismissed_${currentCampaign.id}`) === "true"));

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

  if (!currentCampaign || isCurrentDismissed) {
    return null;
  }

  const couponCode = currentCampaign.discountRule?.couponCode;

  return (
    <div className="relative w-full bg-[#0D0D0E] text-white py-2 sm:py-2.5 border-b border-white/10 z-50 text-xs font-sans transition-all overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-8 lg:px-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* If multiple campaigns, show prev arrow */}
        {campaigns.length > 1 && (
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + campaigns.length) % campaigns.length
              )
            }
            className="text-white/40 hover:text-white transition-colors p-1 shrink-0"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Center content container */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-center py-0.5">
          {currentCampaign.badgeText && (
            <span className="inline-flex items-center gap-1 bg-[#E11D48] text-white text-[0.6rem] sm:text-[0.62rem] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-xs shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              {currentCampaign.badgeText}
            </span>
          )}

          <span className="font-medium text-white/95 tracking-tight text-[11px] sm:text-xs md:text-[0.81rem] line-clamp-1 sm:line-clamp-none">
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
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-mono font-semibold px-2 py-0.5 rounded text-[0.68rem] sm:text-[0.7rem] border border-white/20 transition-colors shrink-0"
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
              className="inline-flex items-center gap-1 text-[0.68rem] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1 shrink-0"
            >
              <span>{currentCampaign.ctaText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          {campaigns.length > 1 && (
            <span className="text-[0.65rem] font-mono text-white/40 ml-1.5 hidden xs:inline">
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
            className="text-white/40 hover:text-white transition-colors p-1 shrink-0"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="text-white/50 hover:text-white transition-colors p-1 shrink-0 -mr-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
