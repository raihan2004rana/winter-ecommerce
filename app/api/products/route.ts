import { NextRequest, NextResponse } from "next/server";
import { filterCatalog, PRODUCTS_CATALOG } from "@/data/products";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    // Extract filters
    const category = searchParams.get("category") || "all";
    const gender = searchParams.get("gender") || "all";
    const collection = searchParams.get("collection") || "all";
    const size = searchParams.get("size") || "all";
    const color = searchParams.get("color") || "all";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "2500");
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const searchQuery = searchParams.get("search") || searchParams.get("q") || "";
    const sortBy = (searchParams.get("sortBy") as any) || "popularity";

    // 1. Try Supabase Query if configured
    let products = [];
    let totalCount = 0;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
      try {
        const supabase = await createClient();
        let query = supabase
          .from("products")
          .select("*, product_variants(*), product_prices(*), product_images(*)", { count: "exact" })
          .eq("is_active", true);

        if (gender !== "all") query = query.eq("gender", gender);
        if (inStockOnly) query = query.gt("product_variants.stock_quantity", 0);

        const { data, count, error } = await query
          .range((page - 1) * limit, page * limit - 1);

        if (!error && data && data.length > 0) {
          products = data;
          totalCount = count || data.length;
        }
      } catch {
        // Fall back to structured domain catalog
      }
    }

    // 2. Fallback to resilient structured catalog engine
    if (products.length === 0) {
      const allFiltered = filterCatalog({
        category,
        gender,
        collection,
        size,
        color,
        minPrice,
        maxPrice,
        inStockOnly,
        searchQuery,
        sortBy,
      });

      totalCount = allFiltered.length;
      const startIndex = (page - 1) * limit;
      products = allFiltered.slice(startIndex, startIndex + limit);
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      status: "success",
      data: products,
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error?.message || "Failed to retrieve products catalog",
      },
      { status: 500 }
    );
  }
}
