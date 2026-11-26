import { NextRequest, NextResponse } from "next/server";
import { AdminStore, AdminCampaign } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement") || undefined;
    const type = searchParams.get("type") || undefined;
    const status = (searchParams.get("status") as "all" | "active" | "scheduled" | "expired") || "all";

    const campaigns = AdminStore.getCampaigns({ placement, type, status });

    const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const averageCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
    const now = new Date();
    const activeCount = campaigns.filter(
      (c) => c.isActive && now >= new Date(c.startDate) && now <= new Date(c.endDate)
    ).length;

    return NextResponse.json({
      status: "success",
      count: campaigns.length,
      analytics: {
        totalImpressions,
        totalClicks,
        averageCtr: `${averageCtr}%`,
        activeCount,
      },
      campaigns,
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient administrative permissions." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ status: "fail", message: "Campaign title is required" }, { status: 400 });
    }
    if (!body.placement) {
      return NextResponse.json({ status: "fail", message: "Campaign placement is required" }, { status: 400 });
    }
    if (body.placement !== "announcement_bar" && !body.desktopImage) {
      return NextResponse.json(
        { status: "fail", message: "Desktop visual image is required for this placement" },
        { status: 400 }
      );
    }

    if (body.startDate && body.endDate) {
      if (new Date(body.startDate) >= new Date(body.endDate)) {
        return NextResponse.json(
          { status: "fail", message: "Campaign end date must be after the start date" },
          { status: 400 }
        );
      }
    }

    const created = AdminStore.createCampaign(body, {
      name: session.name,
      email: session.email,
    });

    return NextResponse.json({ status: "success", data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient administrative permissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ status: "fail", message: "Campaign ID is required" }, { status: 400 });
    }

    if (updates.startDate && updates.endDate) {
      if (new Date(updates.startDate) >= new Date(updates.endDate)) {
        return NextResponse.json(
          { status: "fail", message: "Campaign end date must be after start date" },
          { status: 400 }
        );
      }
    }

    const updated = AdminStore.updateCampaign(id, updates, {
      name: session.name,
      email: session.email,
    });

    if (!updated) {
      return NextResponse.json({ status: "fail", message: "Campaign record not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient administrative permissions." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ status: "fail", message: "Campaign ID required" }, { status: 400 });
    }

    const deleted = AdminStore.deleteCampaign(id, {
      name: session.name,
      email: session.email,
    });

    if (!deleted) {
      return NextResponse.json({ status: "fail", message: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "Campaign deleted permanently" });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
