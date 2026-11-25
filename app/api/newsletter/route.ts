import { NextRequest, NextResponse } from "next/server";
import { NewsletterSubscriptionSchema } from "@/lib/validations/newsletter";

// In-memory newsletter subscribers registry
const subscribersStore = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = NewsletterSubscriptionSchema.parse(body);

    const isExisting = subscribersStore.has(validated.email.toLowerCase());
    subscribersStore.add(validated.email.toLowerCase());

    return NextResponse.json({
      status: "success",
      message: isExisting
        ? "Preferences refreshed for registered address."
        : "Welcome to the Alpine Journal. Priority allocation notification enabled.",
      data: {
        email: validated.email,
        frequency: validated.frequency,
        notifyDrops: validated.notifyDrops,
        notifySales: validated.notifySales,
        status: "active",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json(
        { status: "fail", error: "Invalid email format", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to subscribe" },
      { status: 500 }
    );
  }
}
