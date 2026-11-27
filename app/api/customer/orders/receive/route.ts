import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, orderNumber } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { status: "fail", message: "orderId or orderNumber required" },
        { status: 400 }
      );
    }

    const allOrders = AdminStore.getOrders();
    const order = allOrders.find(
      (o) =>
        (orderId && o.id === orderId) ||
        (orderNumber && o.orderNumber.toUpperCase() === orderNumber.toUpperCase())
    );

    if (!order) {
      return NextResponse.json(
        { status: "fail", message: "Order not found" },
        { status: 404 }
      );
    }

    // Update status to delivered and fulfillment to fulfilled
    const updated = AdminStore.updateOrderStatus(order.id, "delivered", {
      name: order.customerName || "Customer",
      email: order.customerEmail || "customer@winter.com",
    });

    return NextResponse.json({
      status: "success",
      message: "Order successfully marked as received and completed.",
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to confirm receipt" },
      { status: 500 }
    );
  }
}
