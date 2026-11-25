import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, PRODUCTS_CATALOG } from "@/data/products";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Try Supabase query
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, product_variants(*), product_prices(*), product_images(*), reviews(*)")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (!error && data) {
          return NextResponse.json({
            status: "success",
            data,
            meta: { timestamp: new Date().toISOString() },
          });
        }
      } catch {
        // fallback
      }
    }

    // 2. Structured Catalog Lookup
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          status: "fail",
          error: `Product with slug '${slug}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: product,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error?.message || "Internal server error retrieving product",
      },
      { status: 500 }
    );
  }
}
