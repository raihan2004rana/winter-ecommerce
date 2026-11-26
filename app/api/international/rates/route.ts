import { NextRequest, NextResponse } from "next/server";
import { getLiveExchangeRates } from "@/lib/server/exchange-rates";

export async function GET(request: NextRequest) {
  try {
    const data = await getLiveExchangeRates();

    return NextResponse.json(
      {
        status: "success",
        base: data.base,
        date: data.date,
        rates: data.rates,
        source: data.source,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch live exchange rates" },
      { status: 500 }
    );
  }
}
