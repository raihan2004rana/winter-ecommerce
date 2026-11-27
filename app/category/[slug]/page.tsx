import * as React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListingView } from "@/components/storefront/product-listing-view";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_METADATA: Record<string, { title: string; subtitle: string; category: string }> = {
  "jackets-coats": {
    title: "Jackets & Down Coats",
    subtitle: "Sub-zero expedition down parkas, tailored wool overcoats, and 3-layer alpine hard shells.",
    category: "jackets-coats",
  },
  "sweaters-hoodies": {
    title: "Sweaters & Cashmere Hoodies",
    subtitle: "Heavyweight 450 GSM Merino wool knits, seamless turtlenecks, and Polartec fleece mid-layers.",
    category: "sweaters-hoodies",
  },
  "boots-accessories": {
    title: "Boots & Winter Accessories",
    subtitle: "Shearling-lined alpine boots with Vibram Arctic Grip, brushed cashmere scarves, and deerskin gloves.",
    category: "boots-accessories",
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = CATEGORY_METADATA[slug];

  if (!config) {
    return { title: "Category | MAULI FASHION" };
  }

  return {
    title: `${config.title} | MAULI FASHION`,
    description: config.subtitle,
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_METADATA).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const config = CATEGORY_METADATA[slug];

  if (!config) {
    notFound();
  }

  return (
    <StoreLayoutWrapper>
      <React.Suspense fallback={<div className="min-h-screen bg-white p-12 text-center text-xs font-mono">Loading Department...</div>}>
        <ProductListingView
          initialTitle={config.title}
          initialSubtitle={config.subtitle}
          initialCategory={config.category}
        />
      </React.Suspense>
    </StoreLayoutWrapper>
  );
}
