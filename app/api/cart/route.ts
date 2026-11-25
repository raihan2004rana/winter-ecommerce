import { NextRequest, NextResponse } from "next/server";
import { AddToCartSchema, UpdateCartItemSchema } from "@/lib/validations/cart";
import { getProductBySlug } from "@/data/products";

// Server-side in-memory cart store for session persistence
const cartStore: Record<
  string,
  Array<{
    id: string;
    productSlug: string;
    productTitle: string;
    productImage: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>
> = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get("sessionToken") || "guest-default-session";

    const items = cartStore[sessionToken] || [];
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      status: "success",
      data: {
        sessionToken,
        items,
        itemsCount,
        subtotal,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to retrieve cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = AddToCartSchema.parse(body);

    const product = getProductBySlug(validated.productSlug);
    if (!product) {
      return NextResponse.json(
        { status: "fail", error: `Garment '${validated.productSlug}' not found` },
        { status: 404 }
      );
    }

    // Inventory Consistency Check
    if (product.stockCount < validated.quantity) {
      return NextResponse.json(
        {
          status: "fail",
          error: `Insufficient stock: only ${product.stockCount} units available for ${product.title}`,
          code: "INSUFFICIENT_STOCK",
        },
        { status: 409 }
      );
    }

    if (!cartStore[validated.sessionToken]) {
      cartStore[validated.sessionToken] = [];
    }

    const existingIndex = cartStore[validated.sessionToken].findIndex(
      (item) => item.productSlug === validated.productSlug && item.size === validated.size
    );

    if (existingIndex > -1) {
      const existing = cartStore[validated.sessionToken][existingIndex];
      const newQty = existing.quantity + validated.quantity;

      if (newQty > product.stockCount) {
        return NextResponse.json(
          {
            status: "fail",
            error: `Cannot add ${validated.quantity} more: only ${product.stockCount} units in stock.`,
            code: "INSUFFICIENT_STOCK",
          },
          { status: 409 }
        );
      }

      existing.quantity = newQty;
      existing.totalPrice = newQty * existing.unitPrice;
    } else {
      cartStore[validated.sessionToken].push({
        id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productSlug: product.slug,
        productTitle: product.title,
        productImage: product.primaryImage,
        size: validated.size,
        color: validated.color || product.colorways[0]?.name || "Obsidian",
        quantity: validated.quantity,
        unitPrice: product.price,
        totalPrice: product.price * validated.quantity,
      });
    }

    const items = cartStore[validated.sessionToken];
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      status: "success",
      message: `${product.title} added to shopping bag.`,
      data: {
        sessionToken: validated.sessionToken,
        items,
        itemsCount,
        subtotal,
      },
    });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json(
        { status: "fail", error: "Validation error", validationErrors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = UpdateCartItemSchema.parse(body);

    const items = cartStore[validated.sessionToken] || [];
    const itemIndex = items.findIndex((i) => i.id === validated.itemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { status: "fail", error: "Cart line item not found" },
        { status: 404 }
      );
    }

    if (validated.quantity === 0) {
      // Remove item
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = validated.quantity;
      items[itemIndex].totalPrice = validated.quantity * items[itemIndex].unitPrice;
    }

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      status: "success",
      data: {
        sessionToken: validated.sessionToken,
        items,
        itemsCount,
        subtotal,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to modify cart" },
      { status: 500 }
    );
  }
}
