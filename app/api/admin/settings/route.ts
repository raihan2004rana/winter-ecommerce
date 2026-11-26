import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET() {
  try {
    const settings = AdminStore.getSettings();
    return NextResponse.json({ status: "success", data: settings });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "settings:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const updated = AdminStore.updateSettings(body, { name: session.name, email: session.email });
    return NextResponse.json({ status: "success", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
