import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const category = AdminStore.getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { status: "fail", message: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "success", category });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "categories:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updated = AdminStore.updateCategory(id, body, {
      name: session.name,
      email: session.email,
    });

    if (!updated) {
      return NextResponse.json(
        { status: "fail", message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", category: updated });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "categories:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const success = AdminStore.deleteCategory(id, {
      name: session.name,
      email: session.email,
    });

    if (!success) {
      return NextResponse.json(
        { status: "fail", message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", message: "Category deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
