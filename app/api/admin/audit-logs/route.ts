import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    const auditLogs = AdminStore.getAuditLogs();

    return NextResponse.json({
      status: "success",
      auditLogs,
      session,
      meta: {
        total: auditLogs.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to query audit logs" },
      { status: 500 }
    );
  }
}
