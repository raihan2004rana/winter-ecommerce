import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const article = AdminStore.getJournalArticleById(id);
    if (!article) {
      return NextResponse.json(
        { status: "fail", message: "Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "success", article });
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
    if (!hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updated = AdminStore.updateJournalArticle(id, body, {
      name: session.name,
      email: session.email,
    });

    if (!updated) {
      return NextResponse.json(
        { status: "fail", message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", article: updated });
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
    if (!hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const success = AdminStore.deleteJournalArticle(id, {
      name: session.name,
      email: session.email,
    });

    if (!success) {
      return NextResponse.json(
        { status: "fail", message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", message: "Article deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
