import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, paymentIntentId, event = "payment_intent.succeeded", reason } = body;

    const identifier = orderNumber || paymentIntentId;
    if (!identifier) {
      return NextResponse.json(
        { status: "fail", message: "orderNumber or paymentIntentId is required." },
        { status: 400 }
      );
    }

    if (event === "payment_intent.succeeded") {
      const order = AdminStore.markOrderAsPaid(identifier, {
        paymentIntentId,
      });

      if (!order) {
        return NextResponse.json({ status: "fail", message: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        status: "success",
        message: "Payment successfully confirmed via simulated webhook event.",
        order,
      });
    }

    if (event === "payment_intent.payment_failed") {
      const order = AdminStore.markOrderPaymentFailed(
        identifier,
        reason || "Simulated test decline (test mode failure trigger)."
      );

      if (!order) {
        return NextResponse.json({ status: "fail", message: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        status: "success",
        message: "Order marked payment_failed via simulated webhook event.",
        order,
      });
    }

    return NextResponse.json(
      { status: "fail", message: `Unsupported simulated event: ${event}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
