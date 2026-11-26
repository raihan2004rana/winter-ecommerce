import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lowStockOnly = searchParams.get("lowStock") === "true";

    let products = AdminStore.getProducts();
    if (lowStockOnly) {
      const settings = AdminStore.getSettings();
      products = products.filter((p) => p.stockCount <= settings.lowStockThreshold);
    }

    return NextResponse.json({ status: "success", data: products });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "inventory:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const { productId, delta, reason } = body;
    if (!productId || delta === undefined) {
      return NextResponse.json({ status: "fail", message: "productId and delta are required" }, { status: 400 });
    }

    const updated = AdminStore.adjustInventory(productId, { delta, reason: reason || "Manual adjustment" }, { name: session.name, email: session.email });
    if (!updated) return NextResponse.json({ status: "fail", message: "Product not found" }, { status: 404 });

    return NextResponse.json({ status: "success", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
