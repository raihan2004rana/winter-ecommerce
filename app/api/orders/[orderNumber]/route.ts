import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { status: "fail", message: "Order number required" },
        { status: 400 }
      );
    }

    const order = AdminStore.getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        { status: "fail", message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        order,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load order" },
      { status: 500 }
    );
  }
}
