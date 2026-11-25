import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "@/data/products";

export async function GET() {
  try {
    const categories = [
      {
        id: "cat-01",
        slug: "jackets-coats",
        name: "Jackets & Down Coats",
        description: "Sub-zero expedition down parkas, tailored wool overcoats, and 3-layer alpine hard shells.",
        imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800",
        count: PRODUCTS_CATALOG.filter((p) => p.category === "jackets-coats").length,
        subcategories: [
          { name: "Expedition Down Parkas", slug: "jackets-coats" },
          { name: "Tailored Wool Overcoats", slug: "jackets-coats" },
          { name: "3-Layer GORE Shells", slug: "jackets-coats" },
          { name: "Lightweight Vests", slug: "jackets-coats" },
        ],
      },
      {
        id: "cat-02",
        slug: "sweaters-hoodies",
        name: "Sweaters & Hoodies",
        description: "Heavyweight 450 GSM Merino wool knits, seamless turtlenecks, and Polartec fleece mid-layers.",
        imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
        count: PRODUCTS_CATALOG.filter((p) => p.category === "sweaters-hoodies").length,
        subcategories: [
          { name: "Mongolian Cashmere", slug: "sweaters-hoodies" },
          { name: "Heavyweight Merino Knits", slug: "sweaters-hoodies" },
          { name: "Thermal Turtlenecks", slug: "sweaters-hoodies" },
          { name: "High-Pile Fleece", slug: "sweaters-hoodies" },
        ],
      },
      {
        id: "cat-03",
        slug: "boots-accessories",
        name: "Boots & Accessories",
        description: "Shearling-lined alpine boots with Vibram Arctic Grip, brushed cashmere scarves, and deerskin gloves.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        count: PRODUCTS_CATALOG.filter((p) => p.category === "boots-accessories").length,
        subcategories: [
          { name: "Shearling Alpine Boots", slug: "boots-accessories" },
          { name: "Vibram Ice Walkers", slug: "boots-accessories" },
          { name: "Cashmere Scarves", slug: "boots-accessories" },
          { name: "PrimaLoft Deerskin Gloves", slug: "boots-accessories" },
        ],
      },
    ];

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
