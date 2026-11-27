import { NextResponse } from "next/server";

export async function GET() {
  try {
    const banners = [
      {
        id: "bnr-01",
        placement: "hero",
        badge: "WINTER 2026/27 • ARCHIVAL RELEASE 01",
        title: "MAULI FASHION Equilibrium",
        subtitle: "Sculpted for extreme sub-zero alpine conditions and understated city winters.",
        ctaLabel: "Shop Women's Collection",
        ctaUrl: "/collections/women",
        secondaryCtaLabel: "Shop Men's Collection",
        secondaryCtaUrl: "/collections/men",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=90&w=2560",
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "bnr-02",
        placement: "top_announcement",
        title: "Complimentary Worldwide Express Courier on orders above $250 • Carbon Neutral Alpine Logistics",
        ctaLabel: "Learn More",
        ctaUrl: "#shipping",
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "bnr-03",
        placement: "split_editorial",
        badge: "CRAFT & PRECISION",
        title: "Mastery of Extreme Cold Engineering",
        subtitle: "Every down chamber is ultrasonically welded to eliminate needle holes, wind penetration, and down leakage.",
        ctaLabel: "Read The Craft Report",
        ctaUrl: "#craftsmanship",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200",
        displayOrder: 2,
        isActive: true,
      },
    ];

    const advertisements = [
      {
        id: "ad-01",
        title: "Sub-Zero Alpine Hard Shell Series",
        adType: "editorial_card",
        imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800",
        linkUrl: "/products/nordic-expedition-down-parka",
        isActive: true,
      },
      {
        id: "ad-02",
        title: "Mongolian Raw Cashmere Drops",
        adType: "editorial_card",
        imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
        linkUrl: "/products/pure-cashmere-crewneck-sweater",
        isActive: true,
      },
    ];

    return NextResponse.json({
      status: "success",
      data: {
        banners,
        advertisements,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to load banners" },
      { status: 500 }
    );
  }
}
