import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement") || undefined;
    const type = searchParams.get("type") || undefined;

    // Only get active campaigns within valid date range
    const liveCampaigns = AdminStore.getCampaigns({
      placement,
      type,
      status: "active",
    });

    return NextResponse.json(
      {
        status: "success",
        count: liveCampaigns.length,
        campaigns: liveCampaigns,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
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
