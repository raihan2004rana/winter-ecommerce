import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, PRODUCTS_CATALOG } from "@/data/products";
import { ProductDetailView } from "@/components/storefront/product-detail-view";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Garment Not Found | VALLIS & ORE" };
  }

  return {
    title: `${product.title} | VALLIS & ORE`,
    description: product.subtitle,
  };
}

export async function generateStaticParams() {
  return PRODUCTS_CATALOG.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <StoreLayoutWrapper>
      <ProductDetailView product={product} />
    </StoreLayoutWrapper>
  );
}
