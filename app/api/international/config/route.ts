import { NextRequest, NextResponse } from "next/server";
import {
  COUNTRIES_REGISTRY,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from "@/lib/international/countries";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET(request: NextRequest) {
  try {
    const taxRules = AdminStore.getTaxRules();
    const shippingZones = AdminStore.getShippingZones();

    return NextResponse.json(
      {
        status: "success",
        countries: Object.values(COUNTRIES_REGISTRY),
        currencies: SUPPORTED_CURRENCIES,
        languages: SUPPORTED_LANGUAGES,
        taxRules,
        shippingZones,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to load international configuration" },
      { status: 500 }
    );
  }
}
