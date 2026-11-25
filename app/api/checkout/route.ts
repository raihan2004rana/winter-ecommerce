import { NextRequest, NextResponse } from "next/server";
import { CreateCheckoutIntentSchema } from "@/lib/validations/checkout";
import { getProductBySlug } from "@/data/products";

// Idempotency registry preventing duplicate charges & orders
const idempotencyStore: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateCheckoutIntentSchema.parse(body);

    // 1. Idempotency Check
    if (idempotencyStore[validated.idempotencyKey]) {
      return NextResponse.json({
        status: "success",
        idempotentReplay: true,
        data: idempotencyStore[validated.idempotencyKey],
      });
    }

    // 2. Atomic Inventory Verification & Pricing
    let subtotal = 0;
    const validatedItems = [];

    for (const item of validated.items) {
      const product = getProductBySlug(item.productSlug);
      if (!product) {
        return NextResponse.json(
          { status: "fail", error: `Garment '${item.productSlug}' not found` },
          { status: 404 }
        );
      }

      if (product.stockCount < item.quantity) {
        return NextResponse.json(
          {
            status: "fail",
            error: `Insufficient stock for ${product.title}. Only ${product.stockCount} units available.`,
            code: "INSUFFICIENT_STOCK",
          },
          { status: 409 }
        );
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        productSlug: product.slug,
        productTitle: product.title,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: lineTotal,
        imageUrl: product.primaryImage,
      });
    }

    // 3. Discount Computation
    let discountAmount = 0;
    if (validated.discountCode) {
      if (validated.discountCode.toUpperCase() === "WINTER2026") {
        discountAmount = Math.round(subtotal * 0.15 * 100) / 100;
      } else if (validated.discountCode.toUpperCase() === "ALPINE100" && subtotal >= 600) {
        discountAmount = 100;
      }
    }

    // 4. Logistics, Tax & Final Settlement
    const shippingAmount = subtotal >= 250 ? 0.0 : 35.0; // Complimentary above $250
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableSubtotal * 0.08 * 100) / 100; // 8% avg sales tax
    const totalAmount = Math.round((taxableSubtotal + shippingAmount + taxAmount) * 100) / 100;

    // 5. Generate Order Dossier
    const orderNumber = `WIN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `DHL-CH-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const responsePayload = {
      orderNumber,
      clientSecret: `pi_winter_${Date.now()}_secret_${Math.random().toString(36).slice(2, 12)}`,
      currency: validated.currency,
      subtotal,
      discountAmount,
      shippingAmount,
      taxAmount,
      totalAmount,
      shippingCarrier: "DHL Express Alpine Priority",
      trackingNumber,
      trackingUrl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber.split("-")[2]}`,
      estimatedDeliveryDays: 3,
      items: validatedItems,
      shippingAddress: validated.shippingAddress,
      status: "authorized",
      timestamp: new Date().toISOString(),
    };

    // Save in idempotency store
    idempotencyStore[validated.idempotencyKey] = responsePayload;

    return NextResponse.json({
      status: "success",
      message: "Order authorized and payment intent established.",
      data: responsePayload,
    });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json(
        { status: "fail", error: "Validation error", validationErrors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to process checkout transaction" },
      { status: 500 }
    );
  }
}
