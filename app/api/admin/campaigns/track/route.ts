import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, event } = body;

    if (!campaignId || !event || (event !== "impression" && event !== "click")) {
      return NextResponse.json(
        { status: "fail", message: "campaignId and event ('impression' | 'click') are required" },
        { status: 400 }
      );
    }

    const result = AdminStore.recordCampaignEvent(campaignId, event);
    if (!result) {
      return NextResponse.json({ status: "fail", message: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      campaignId: result.id,
      event,
      impressions: result.impressions,
      clicks: result.clicks,
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
