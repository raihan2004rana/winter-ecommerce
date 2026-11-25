import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    // Verify Admin Auth Status
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let isAdmin = false;

    if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profile && (profile.role === "admin" || profile.role === "super_admin")) {
            isAdmin = true;
          }
        }
      } catch {
        // Fallback check
      }
    } else {
      // In local dev without remote Supabase connected, allow inspection
      isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json(
        { status: "fail", error: "Unauthorized: Administrator privileges required." },
        { status: 403 }
      );
    }

    const sampleAuditLogs = [
      {
        id: "log-101",
        actorEmail: "admin@moncler-vallis.com",
        action: "INVENTORY_RESERVATION_SETTLED",
        entityType: "order",
        entityId: "WIN-2026-10492",
        details: "Deducted 1 unit of SKU WIN-NEP-M-BLK and 1 unit of WIN-CAS-L-ECR",
        ipAddress: "185.122.90.14",
        createdAt: "2026-11-25T13:40:00Z",
      },
      {
        id: "log-102",
        actorEmail: "staff.zurich@moncler-vallis.com",
        action: "PRICE_MATRIX_ADJUSTMENT",
        entityType: "product_price",
        entityId: "prod-001",
        details: "Updated compare_at_amount to $795.00 for currency USD",
        ipAddress: "194.209.12.50",
        createdAt: "2026-11-25T11:20:00Z",
      },
      {
        id: "log-103",
        actorEmail: "admin@moncler-vallis.com",
        action: "PROMOTION_CAMPAIGN_ACTIVATED",
        entityType: "discount",
        entityId: "WINTER2026",
        details: "Activated 15% discount for orders exceeding $200",
        ipAddress: "185.122.90.14",
        createdAt: "2026-11-25T09:15:00Z",
      },
    ];

    return NextResponse.json({
      status: "success",
      data: sampleAuditLogs.slice((page - 1) * limit, page * limit),
      meta: {
        page,
        limit,
        total: sampleAuditLogs.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to query audit logs" },
      { status: 500 }
    );
  }
}
