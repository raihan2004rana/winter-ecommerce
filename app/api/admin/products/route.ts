import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const gender = searchParams.get("gender") || undefined;
    const status = searchParams.get("status") || undefined;

    const products = AdminStore.getProducts({ search, category, gender, status });
    return NextResponse.json({ status: "success", count: products.length, data: products });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "products:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const created = AdminStore.createProduct(body, { name: session.name, email: session.email });
    return NextResponse.json({ status: "success", data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "products:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ status: "fail", message: "Product ID required" }, { status: 400 });

    const updated = AdminStore.updateProduct(id, updates, { name: session.name, email: session.email });
    if (!updated) return NextResponse.json({ status: "fail", message: "Product not found" }, { status: 404 });

    return NextResponse.json({ status: "success", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "products:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ status: "fail", message: "Product ID required" }, { status: 400 });

    const deleted = AdminStore.deleteProduct(id, { name: session.name, email: session.email });
    if (!deleted) return NextResponse.json({ status: "fail", message: "Product not found" }, { status: 404 });

    return NextResponse.json({ status: "success", message: "Product deleted permanently" });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
