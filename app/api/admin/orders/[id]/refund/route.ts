import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";
import { createStripeRefund } from "@/lib/server/stripe";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "orders:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions to refund orders." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { amount, reason = "Customer requested refund" } = body;

    const order = AdminStore.getOrderById(id) || AdminStore.getOrderByNumber(id);
    if (!order) {
      return NextResponse.json({ status: "fail", message: "Order not found" }, { status: 404 });
    }

    const refundAmount = amount ? Number(amount) : order.total;

    // Trigger Stripe API refund if Stripe payment intent exists
    if (order.stripePaymentIntentId) {
      try {
        await createStripeRefund(order.stripePaymentIntentId, Math.round(refundAmount * 100));
      } catch (stripeErr: any) {
        console.warn("Stripe refund call warning:", stripeErr.message);
      }
    }

    const refunded = AdminStore.processRefund(order.id, refundAmount, reason, {
      name: session.name,
      email: session.email,
    });

    return NextResponse.json({
      status: "success",
      message: `Successfully refunded $${refundAmount.toFixed(2)} for order ${order.orderNumber}.`,
      order: refunded,
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
