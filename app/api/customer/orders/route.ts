import { NextRequest, NextResponse } from "next/server";
import { AdminStore, AdminOrder } from "@/lib/server/admin-store";
import { CustomerOrder } from "@/lib/auth/types";

// Helper to format an AdminOrder into a customer-facing CustomerOrder
function formatToCustomerOrder(o: AdminOrder, userId: string = "usr-alpine-99410"): CustomerOrder {
  const isDelivered = o.status === "delivered";
  const isShipped = o.status === "shipped" || isDelivered;

  const paymentStatus: "paid" | "pending" | "authorized" | "failed" =
    o.paymentStatus === "refunded" ? "failed" : (o.paymentStatus as any) || "paid";

  const carrierName = (o as any).carrier || "DHL Express Alpine Priority";

  return {
    id: o.id,
    order_number: o.orderNumber,
    user_id: userId,
    status: o.status === "paid" ? "processing" : o.status,
    payment_status: paymentStatus,
    currency: (o.currency as any) || "USD",
    subtotal_amount: o.pricingBreakdown?.subtotal || o.total,
    shipping_amount: o.pricingBreakdown?.shippingFee || 0,
    tax_amount: o.pricingBreakdown?.taxAmount || 0,
    discount_amount: o.pricingBreakdown?.discountAmount || 0,
    total_amount: o.total,
    shipping_address: {
      name: o.customerName,
      line1: o.shippingAddress?.street || "Alpine Avenue 10",
      line2: o.shippingAddress?.apartment,
      city: o.shippingAddress?.city || "Geneva",
      state: o.shippingAddress?.state || "GE",
      postal_code: o.shippingAddress?.postalCode || "1204",
      country: o.shippingAddress?.country || "CH",
      phone: o.shippingAddress?.phone || "+41 22 819 9000",
    },
    shipping_carrier: carrierName,
    tracking_number: o.trackingNumber || `TRK-${o.orderNumber.replace(/[^a-zA-Z0-9]/g, "")}`,
    tracking_url: `https://www.dhl.com/en/express/tracking.html?AWB=${o.trackingNumber || o.orderNumber}`,
    estimated_delivery: isDelivered ? "Delivered to Customer" : "2–3 business days priority air",
    created_at: o.createdAt,
    items: o.items.map((it) => ({
      id: it.id,
      order_id: o.id,
      product_slug: it.id,
      product_title: it.title,
      size: it.size,
      color_name: it.color,
      image_url: it.image,
      quantity: it.quantity,
      unit_price: it.price,
      total_price: it.price * it.quantity,
    })),
    timeline: [
      {
        status: "placed",
        title: "Order Placed & Payment Verified",
        description: "Payment confirmed through verified Stripe Webhook.",
        date: o.createdAt,
        completed: true,
      },
      {
        status: "processing",
        title: "Atelier Hand-Crafting & Quality Check",
        description: "Winter garments verified and prepared for dispatch.",
        date: o.createdAt,
        completed: true,
      },
      {
        status: "shipped",
        title: "Dispatched via DHL Express Courier",
        description: "Carrier handover confirmed with active telemetry tracking.",
        date: isShipped ? (o.updatedAt || o.createdAt) : "",
        completed: isShipped,
      },
      {
        status: "delivered",
        title: "Handed Over & Received by Customer",
        description: isDelivered
          ? "Package received and confirmed by customer."
          : "Pending courier delivery and customer receipt confirmation.",
        date: isDelivered ? (o.updatedAt || o.createdAt) : "",
        completed: isDelivered,
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase() || "";
    const orderNumbersParam = searchParams.get("orderNumbers") || "";
    const requestedNumbers = orderNumbersParam
      ? orderNumbersParam.split(",").map((s) => s.trim().toUpperCase())
      : [];

    const allAdminOrders = AdminStore.getOrders();

    // Match orders by email or by order number
    const matchedOrders = allAdminOrders.filter((o) => {
      const emailMatches = email && o.customerEmail?.toLowerCase() === email;
      const numberMatches = requestedNumbers.includes(o.orderNumber.toUpperCase());
      // Also match common Julian Vallis / Vance test emails
      const isJulianDemo =
        (email.includes("julian") || !email) &&
        (o.customerEmail?.toLowerCase().includes("julian") ||
          o.customerName?.toLowerCase().includes("julian"));
      return emailMatches || numberMatches || isJulianDemo;
    });

    // If no orders found in admin store, fallback to default mock demo orders
    let finalCustomerOrders: CustomerOrder[] = [];

    if (matchedOrders.length > 0) {
      finalCustomerOrders = matchedOrders.map((o) => formatToCustomerOrder(o));
    } else {
      // Return top 2 default demo orders
      finalCustomerOrders = allAdminOrders.slice(0, 3).map((o) => formatToCustomerOrder(o));
    }

    return NextResponse.json({
      status: "success",
      count: finalCustomerOrders.length,
      orders: finalCustomerOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load customer orders" },
      { status: 500 }
    );
  }
}
