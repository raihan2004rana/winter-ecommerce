import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const article = AdminStore.getJournalArticleBySlug(slug);

    if (!article || !article.isPublished) {
      return NextResponse.json(
        { status: "fail", message: "Journal article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", article });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load journal article" },
      { status: 500 }
    );
  }
}
