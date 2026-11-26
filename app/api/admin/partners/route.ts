import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get("active") === "true";
    const partners = AdminStore.getPartners(onlyActive);

    const activeCount = partners.filter((p) => p.isActive).length;
    const totalCount = partners.length;

    return NextResponse.json({
      status: "success",
      count: totalCount,
      activeCount,
      partners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load partners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "settings:write") && !hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Reset defaults action
    if (body.action === "reset_defaults") {
      const resetPartners = AdminStore.resetDefaultPartners({
        name: session.name,
        email: session.email,
      });
      return NextResponse.json({
        status: "success",
        message: "Brand partner logos reset to 14 defaults successfully",
        partners: resetPartners,
      });
    }

    // Validation
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { status: "fail", message: "Partner brand name is required" },
        { status: 400 }
      );
    }

    if (!body.logoUrl && !body.logoSvg) {
      return NextResponse.json(
        { status: "fail", message: "Either logo image URL or SVG markup is required" },
        { status: 400 }
      );
    }

    const newPartner = AdminStore.createPartner(
      {
        name: body.name.trim(),
        logoUrl: body.logoUrl?.trim() || undefined,
        logoSvg: body.logoSvg?.trim() || undefined,
        websiteUrl: body.websiteUrl?.trim() || undefined,
        order: typeof body.order === "number" ? body.order : undefined,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
      { name: session.name, email: session.email }
    );

    return NextResponse.json(
      {
        status: "success",
        message: `Partner brand "${newPartner.name}" added successfully.`,
        partner: newPartner,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to create partner" },
      { status: 500 }
    );
  }
}
