import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, couponCode, shippingCountry, shippingMethod } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { status: "fail", message: "Invalid request: items array required." },
        { status: 400 }
      );
    }

    const quote = AdminStore.validateAndCalculateCart({
      items,
      couponCode,
      shippingCountry,
      shippingMethod,
    });

    return NextResponse.json(
      {
        status: "success",
        data: quote,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to calculate cart quote" },
      { status: 500 }
    );
  }
}
