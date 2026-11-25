import * as React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListingView } from "@/components/storefront/product-listing-view";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const COLLECTION_METADATA: Record<string, { title: string; subtitle: string; gender?: string; collection?: string }> = {
  men: {
    title: "Men's Winter Collection",
    subtitle: "Engineered down parkas, tailored wool overcoats, heavy knitwear, and winter footwear.",
    gender: "men",
  },
  women: {
    title: "Women's Winter Collection",
    subtitle: "Cocoon down parkas, double-faced cashmere coats, thermal mid-layers, and accessories.",
    gender: "women",
  },
  "new-arrivals": {
    title: "New Season Arrivals",
    subtitle: "The latest archival drops fresh from our ateliers in Zurich, Milan, and Tokyo.",
    collection: "new-arrivals",
  },
  sale: {
    title: "Seasonal Sale Archive",
    subtitle: "Limited-time allocations and end-of-series outerwear at preferential pricing.",
    collection: "sale",
  },
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = COLLECTION_METADATA[slug];

  if (!config) {
    return { title: "Collection | VALLIS & ORE" };
  }

  return {
    title: `${config.title} | VALLIS & ORE`,
    description: config.subtitle,
  };
}

export async function generateStaticParams() {
  return Object.keys(COLLECTION_METADATA).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const config = COLLECTION_METADATA[slug];

  if (!config) {
    notFound();
  }

  return (
    <StoreLayoutWrapper>
      <React.Suspense fallback={<div className="min-h-screen bg-white p-12 text-center text-xs font-mono">Loading Collection...</div>}>
        <ProductListingView
          initialTitle={config.title}
          initialSubtitle={config.subtitle}
          initialGender={config.gender || "all"}
          initialCollection={config.collection || "all"}
        />
      </React.Suspense>
    </StoreLayoutWrapper>
  );
}
