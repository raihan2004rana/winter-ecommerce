import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { createStripePaymentIntent } from "@/lib/server/stripe";
import { z } from "zod";

const CreateCheckoutSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        productSlug: z.string().optional(),
        size: z.string(),
        color: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Cart cannot be empty"),
  shippingAddress: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    street: z.string().min(1, "Street address required"),
    apartment: z.string().optional(),
    city: z.string().min(1, "City required"),
    state: z.string().min(1, "State/Province required"),
    postalCode: z.string().min(1, "Postal code required"),
    country: z.string().min(2, "Country required"),
    phone: z.string().optional(),
  }),
  billingAddress: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      street: z.string().min(1, "Street address required"),
      apartment: z.string().optional(),
      city: z.string().min(1, "City required"),
      state: z.string().min(1, "State/Province required"),
      postalCode: z.string().min(1, "Postal code required"),
      country: z.string().min(2, "Country required"),
    })
    .optional(),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = CreateCheckoutSchema.safeParse(rawBody);

    if (!validated.success) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Validation failed",
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      items,
      shippingAddress,
      billingAddress,
      shippingMethod,
      couponCode,
      idempotencyKey,
    } = validated.data;

    // 1. Authoritative Server-side Financial Recalculation (Never trust browser)
    const quote = AdminStore.validateAndCalculateCart({
      items,
      couponCode,
      shippingCountry: shippingAddress.country,
      shippingMethod,
    });

    if (!quote.isValid) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Stock or product validation failed",
          errors: quote.errors,
        },
        { status: 422 }
      );
    }

    const totalInCents = Math.round(quote.pricing.total * 100);

    // 2. Generate a temporary / pending order number
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MON-${year}-${randomHex}`;

    // 3. Create Stripe PaymentIntent with server-computed total
    const paymentIntent = await createStripePaymentIntent({
      amountInCents: totalInCents,
      currency: quote.pricing.currency || "USD",
      orderNumber,
      customerEmail,
      idempotencyKey,
      metadata: {
        orderNumber,
        customerName,
        shippingCountry: shippingAddress.country,
        shippingMethod,
        couponCode: quote.appliedCoupon?.code || "",
      },
    });

    // 4. Save Pending Order to Database
    const orderItems = quote.items.map((it) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      size: it.size,
      color: it.color,
      quantity: it.quantity,
      image: it.image,
    }));

    const pendingOrder = AdminStore.createPendingOrder({
      customerName,
      customerEmail,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      pricingBreakdown: quote.pricing,
      shippingMethod,
      couponCode: quote.appliedCoupon?.code,
      stripePaymentIntentId: paymentIntent.id,
      idempotencyKey,
      currency: quote.pricing.currency,
    });

    return NextResponse.json({
      status: "success",
      orderNumber: pendingOrder.orderNumber,
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
      isSimulated: paymentIntent.isSimulated,
      pricing: quote.pricing,
      appliedCoupon: quote.appliedCoupon,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to initialize checkout session",
      },
      { status: 500 }
    );
  }
}
