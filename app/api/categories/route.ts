import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "@/data/products";
import { AdminStore } from "@/lib/server/admin-store";

export async function GET() {
  try {
    const adminCategories = AdminStore.getCategories();
    
    // Map with product counts and metadata
    const categories = adminCategories.map((c) => {
      let count = 0;
      if (c.slug === "jackets-coats") {
        count = PRODUCTS_CATALOG.filter((p) => p.category === "jackets-coats").length;
      } else if (c.slug === "sweaters-hoodies") {
        count = PRODUCTS_CATALOG.filter((p) => p.category === "sweaters-hoodies").length;
      } else if (c.slug === "boots-accessories") {
        count = PRODUCTS_CATALOG.filter((p) => p.category === "boots-accessories").length;
      } else if (c.slug === "women") {
        count = PRODUCTS_CATALOG.filter((p) => p.gender === "women" || p.gender === "unisex").length;
      } else if (c.slug === "men") {
        count = PRODUCTS_CATALOG.filter((p) => p.gender === "men" || p.gender === "unisex").length;
      } else if (c.slug.includes("women") || c.gender === "women") {
        if (c.slug.includes("jacket")) {
          count = PRODUCTS_CATALOG.filter((p) => (p.gender === "women" || p.gender === "unisex") && p.category === "jackets-coats").length;
        } else if (c.slug.includes("knit") || c.slug.includes("sweater")) {
          count = PRODUCTS_CATALOG.filter((p) => (p.gender === "women" || p.gender === "unisex") && p.category === "sweaters-hoodies").length;
        } else if (c.slug.includes("boot") || c.slug.includes("access")) {
          count = PRODUCTS_CATALOG.filter((p) => (p.gender === "women" || p.gender === "unisex") && p.category === "boots-accessories").length;
        } else {
          count = PRODUCTS_CATALOG.filter((p) => p.gender === "women" || p.gender === "unisex").length;
        }
      } else if (c.slug.includes("men") || c.gender === "men") {
        if (c.slug.includes("parka") || c.slug.includes("jacket")) {
          count = PRODUCTS_CATALOG.filter((p) => (p.gender === "men" || p.gender === "unisex") && p.category === "jackets-coats").length;
        } else if (c.slug.includes("fleece") || c.slug.includes("knit") || c.slug.includes("sweater")) {
          count = PRODUCTS_CATALOG.filter((p) => (p.gender === "men" || p.gender === "unisex") && p.category === "sweaters-hoodies").length;
        } else if (c.slug.includes("boot") || c.slug.includes("access")) {
          count = PRODUCTS_CATALOG.filter((p) => (p.gender === "men" || p.gender === "unisex") && p.category === "boots-accessories").length;
        } else {
          count = PRODUCTS_CATALOG.filter((p) => p.gender === "men" || p.gender === "unisex").length;
        }
      } else {
        count = c.productCount || 0;
      }

      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
        imageUrl: c.image,
        count: count || c.productCount || 0,
        productCount: count || c.productCount || 0,
        gender: c.gender || "all",
        link: c.link,
        badge: c.badge,
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
