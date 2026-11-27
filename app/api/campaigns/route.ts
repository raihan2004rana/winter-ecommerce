import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement") || undefined;
    const type = searchParams.get("type") || undefined;

    // Only get active campaigns within valid date range
    let liveCampaigns = AdminStore.getCampaigns({
      placement,
      type,
      status: "active",
    });

    // Special handling for promotional section (homepage countdown deal section):
    // If the user activates visual campaigns in Marketing & Ads (hero drop, flash sale, seasonal promo),
    // they expect active campaigns to be prominently displayed on the storefront.
    if (placement === "promo_section") {
      const allActiveVisual = AdminStore.getCampaigns({ status: "active" })
        .filter((c) => c.placement !== "announcement_bar" && c.desktopImage);

      // If user has 2 or more visual campaigns active, show all of them side-by-side in dual grid!
      if (allActiveVisual.length >= 2) {
        liveCampaigns = allActiveVisual;
      } else if (liveCampaigns.length === 0 && allActiveVisual.length > 0) {
        // If no campaign is explicitly tagged promo_section, fall back to the active visual campaign(s)
        liveCampaigns = allActiveVisual;
      }
    }

    return NextResponse.json(
      {
        status: "success",
        count: liveCampaigns.length,
        campaigns: liveCampaigns,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load marketing campaigns" },
      { status: 500 }
    );
  }
}
