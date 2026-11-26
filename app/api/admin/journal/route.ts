import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const onlyPublished = url.searchParams.get("published") === "true";
    const articles = AdminStore.getJournalArticles(onlyPublished);
    return NextResponse.json({ status: "success", articles });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "campaigns:write")) {
      return NextResponse.json(
        { status: "fail", message: "Forbidden: insufficient permissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const created = AdminStore.createJournalArticle(body, {
      name: session.name,
      email: session.email,
    });

    return NextResponse.json({ status: "success", article: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
