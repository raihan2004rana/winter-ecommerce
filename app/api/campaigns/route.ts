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

    // If promo_section requested and no active campaigns found for that exact placement,
    // check if there are other active flash_sale campaigns that can act as promotional replacement
    if (placement === "promo_section" && liveCampaigns.length === 0) {
      const flashSaleCampaigns = AdminStore.getCampaigns({
        type: "flash_sale",
        status: "active",
      });
      if (flashSaleCampaigns.length > 0) {
        liveCampaigns = flashSaleCampaigns;
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
