import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "@/data/products";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET() {
  try {
    const adminCategories = AdminStore.getCategories();
    
    // Map with product counts and metadata
    const categories = adminCategories.map((c) => {
      const count = PRODUCTS_CATALOG.filter((p) => {
        if (c.slug === "jackets-coats") return p.category === "jackets-coats";
        if (c.slug === "sweaters-hoodies") return p.category === "sweaters-hoodies";
        if (c.slug === "boots-accessories") return p.category === "boots-accessories";
        if (c.slug === "women") return p.gender === "women" || p.gender === "unisex";
        if (c.slug === "men") return p.gender === "men" || p.gender === "unisex";
        return true;
      }).length;

      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        imageUrl: c.image,
        count: count || c.productCount || 0,
        gender: c.gender || "all",
        featured: c.featured ?? true,
      };
    });

    return NextResponse.json({
      status: "success",
      data: categories,
      meta: {
        total: categories.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error?.message || "Failed to load categories",
      },
      { status: 500 }
    );
  }
}
