import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    // Get live products from AdminStore
    const products = AdminStore.getProducts({
      category,
      search,
      status: "published",
    });

    return NextResponse.json(
      { status: "success", count: products.length, data: products },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load products" },
      { status: 500 }
    );
  }
}
