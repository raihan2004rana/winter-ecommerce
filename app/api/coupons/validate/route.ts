import { NextRequest, NextResponse } from "next/server";
import { ValidateCouponSchema } from "@/lib/validations/newsletter";

const ACTIVE_COUPONS: Record<
  string,
  {
    type: "percentage" | "fixed_amount";
    value: number;
    minSpend: number;
    description: string;
    expiresAt: string;
  }
> = {
  WINTER2026: {
    type: "percentage",
    value: 15,
    minSpend: 200,
    description: "15% off orders over $200",
    expiresAt: "2027-03-31",
  },
  ALPINE100: {
    type: "fixed_amount",
    value: 100,
    minSpend: 600,
    description: "$100 off high-altitude expedition parkas over $600",
    expiresAt: "2027-03-31",
  },
  ARCHIVE30: {
    type: "percentage",
    value: 30,
    minSpend: 400,
    description: "30% off end-of-series archival items",
    expiresAt: "2027-03-31",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, currency } = ValidateCouponSchema.parse(body);

    const coupon = ACTIVE_COUPONS[code];

    if (!coupon) {
      return NextResponse.json(
        {
          status: "fail",
          valid: false,
          error: `Coupon code '${code}' is invalid or expired.`,
        },
        { status: 404 }
      );
    }

    if (subtotal < coupon.minSpend) {
      return NextResponse.json(
        {
          status: "fail",
          valid: false,
          error: `Code requires a minimum subtotal of ${coupon.minSpend} ${currency}. Current subtotal is ${subtotal}.`,
        },
        { status: 400 }
      );
    }

    const discountAmount =
      coupon.type === "percentage"
        ? Math.round(((subtotal * coupon.value) / 100) * 100) / 100
        : Math.min(coupon.value, subtotal);

    return NextResponse.json({
      status: "success",
      valid: true,
      data: {
        code,
        discountType: coupon.type,
        discountValue: coupon.value,
        discountAmount,
        description: coupon.description,
        newSubtotal: subtotal - discountAmount,
      },
    });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json(
        { status: "fail", error: "Invalid coupon payload", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
