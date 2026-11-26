import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const orders = AdminStore.getOrders({ search, status });
    return NextResponse.json({ status: "success", count: orders.length, data: orders });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "orders:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ status: "fail", message: "orderId and status required" }, { status: 400 });
    }

    const updated = AdminStore.updateOrderStatus(orderId, status, { name: session.name, email: session.email });
    if (!updated) return NextResponse.json({ status: "fail", message: "Order not found" }, { status: 404 });

    return NextResponse.json({ status: "success", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
