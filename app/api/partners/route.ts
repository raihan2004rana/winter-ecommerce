import { NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET() {
  try {
    const partners = AdminStore.getPartners(true); // only active
    return NextResponse.json({
      status: "success",
      count: partners.length,
      partners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to retrieve partners" },
      { status: 500 }
    );
  }
}
