import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest } from "@/lib/server/admin-auth";

export async function GET() {
  try {
    const staff = AdminStore.getStaff();
    return NextResponse.json({ status: "success", data: staff });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (session.role !== "super_admin") {
      return NextResponse.json({ status: "fail", message: "Forbidden: Super Administrator privilege required." }, { status: 403 });
    }

    const body = await request.json();
    const { staffId, role } = body;
    if (!staffId || !role) {
      return NextResponse.json({ status: "fail", message: "staffId and role required" }, { status: 400 });
    }

    const updated = AdminStore.updateStaffRole(staffId, role, { name: session.name, email: session.email });
    if (!updated) return NextResponse.json({ status: "fail", message: "Staff member not found" }, { status: 404 });

    return NextResponse.json({ status: "success", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
