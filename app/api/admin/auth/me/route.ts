import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest, ROLE_PERMISSIONS } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("winter_admin_session")?.value;

  if (!cookie) {
    return NextResponse.json(
      {
        status: "unauthenticated",
        session: null,
        message: "No active administrator session.",
      },
      { status: 401 }
    );
  }

  const session = getAdminSessionFromRequest(request);
  const permissions = ROLE_PERMISSIONS[session.role] || [];

  return NextResponse.json({
    status: "success",
    session,
    permissions,
  });
}
