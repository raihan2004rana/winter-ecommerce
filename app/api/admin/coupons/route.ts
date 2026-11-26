import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET() {
  try {
    const coupons = AdminStore.getCoupons();
    return NextResponse.json({ status: "success", data: coupons });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "coupons:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const created = AdminStore.createCoupon(body, { name: session.name, email: session.email });
    return NextResponse.json({ status: "success", data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "coupons:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ status: "fail", message: "Coupon ID required" }, { status: 400 });

    const toggled = AdminStore.toggleCoupon(id, { name: session.name, email: session.email });
    if (!toggled) return NextResponse.json({ status: "fail", message: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ status: "success", data: toggled });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
