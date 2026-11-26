import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    const metrics = AdminStore.getOverviewMetrics();
    return NextResponse.json({
      status: "success",
      session,
      data: metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch overview metrics" },
      { status: 500 }
    );
  }
}
