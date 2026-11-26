import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { constructStripeWebhookEvent } from "@/lib/server/stripe";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;
    try {
      event = await constructStripeWebhookEvent(rawBody, signature);
    } catch (err: any) {
      console.error("Stripe Webhook Signature Verification Failed:", err.message);
      return NextResponse.json(
        { status: "fail", message: `Webhook error: ${err.message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        const orderNumber = paymentIntent.metadata?.orderNumber;
        const intentId = paymentIntent.id;

        // Atomically sync payment status and decrement inventory
        const updated = AdminStore.markOrderAsPaid(orderNumber || intentId, {
          paymentIntentId: intentId,
          receiptEmail: paymentIntent.receipt_email || paymentIntent.customer_email,
        });

        if (!updated) {
          console.warn(`Order not found for PaymentIntent: ${intentId} (${orderNumber})`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        const orderNumber = paymentIntent.metadata?.orderNumber;
        const intentId = paymentIntent.id;
        const failureMessage =
          paymentIntent.last_payment_error?.message || "Card declined or insufficient funds.";

        AdminStore.markOrderPaymentFailed(orderNumber || intentId, failureMessage);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as any;
        const paymentIntentId = charge.payment_intent;
        const amountRefunded = (charge.amount_refunded || 0) / 100;

        if (paymentIntentId) {
          const order = AdminStore.getOrderByPaymentIntent(paymentIntentId);
          if (order) {
            AdminStore.processRefund(
              order.id,
              amountRefunded,
              "Stripe Charge Refund Webhook Event",
              { name: "Stripe System", email: "system@stripe.com" }
            );
          }
        }
        break;
      }

      default:
        // Ignore unhandled event types cleanly
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook Handler Exception:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal webhook handler error" },
      { status: 500 }
    );
  }
}
