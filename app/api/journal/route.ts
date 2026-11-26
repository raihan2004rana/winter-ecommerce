import { NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET() {
  try {
    const articles = AdminStore.getJournalArticles(true);
    return NextResponse.json({
      status: "success",
      articles,
      count: articles.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load journal articles" },
      { status: 500 }
    );
  }
}
