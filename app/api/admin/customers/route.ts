import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;

    const customers = AdminStore.getCustomers(search);
    return NextResponse.json({ status: "success", count: customers.length, data: customers });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
