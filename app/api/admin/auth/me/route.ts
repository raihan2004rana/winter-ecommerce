import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest, ROLE_PERMISSIONS } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  const session = getAdminSessionFromRequest(request);
  const permissions = ROLE_PERMISSIONS[session.role] || [];

  return NextResponse.json({
    status: "success",
    session,
    permissions,
  });
}
