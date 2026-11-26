import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partner = AdminStore.getPartnerById(id);
    if (!partner) {
      return NextResponse.json({ status: "fail", message: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json({ status: "success", partner });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "settings:write") && !hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = AdminStore.updatePartner(
      id,
      body,
      { name: session.name, email: session.email }
    );

    if (!updated) {
      return NextResponse.json({ status: "fail", message: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: `Partner "${updated.name}" updated successfully`,
      partner: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "settings:write") && !hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const success = AdminStore.deletePartner(id, {
      name: session.name,
      email: session.email,
    });

    if (!success) {
      return NextResponse.json({ status: "fail", message: "Partner not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "Partner removed successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
