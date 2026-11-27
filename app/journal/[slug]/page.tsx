import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Share2,
  Sparkles,
  Check,
  Bookmark,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { AdminStore, AdminJournalArticle, JournalSection } from "@/lib/server/admin-store";
import { PRODUCTS_CATALOG } from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = AdminStore.getJournalArticleBySlug(slug);
  if (!article) return { title: "Journal Story | MAULI FASHION" };
  return {
    title: `${article.title} | MAULI FASHION Journal`,
    description: article.excerpt,
  };
}

// Cleanly renders inline bold **text** without raw asterisks
function formatTextWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-[#111]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = AdminStore.getJournalArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get related / other stories
  const allArticles = AdminStore.getJournalArticles(true);
  const otherArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  // Suggested products (3 winter pieces)
  const featuredProducts = PRODUCTS_CATALOG.slice(0, 3);

  // Content formatting
  const contentBody = article.content || article.excerpt;
  const paragraphs = contentBody.split("\n\n").filter(Boolean);

  const sections: JournalSection[] = article.sections || [];

  return (
    <StoreLayoutWrapper>
      <article className="w-full bg-[#FFFFFF]">
        {/* Top Breadcrumb Navigation */}
        <div className="border-b border-[#EFEFEF] py-3.5 bg-[#FAFAFA]">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between text-2xs font-mono uppercase tracking-wider text-[#777]">
            <div className="flex items-center space-x-2">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/journal" className="hover:text-black transition-colors">
                Journal
              </Link>
              <span>/</span>
              <span className="text-[#111] font-semibold truncate max-w-xs">{article.category}</span>
            </div>

            <Link
              href="/journal"
              className="inline-flex items-center space-x-1.5 text-xs text-[#111] hover:text-[#555] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Journal Archive</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            1. LEFT-ALIGNED EDITORIAL MASTHEAD (NOT CENTERED)
        ========================================================================= */}
        <header className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 pt-12 sm:pt-16 pb-8">
          <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-widest text-[#777] mb-4">
            <span className="bg-[#111] text-white px-2.5 py-0.5 rounded-full font-semibold">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#555]">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="text-[#888]">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Left-Aligned Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#111] font-normal tracking-tight leading-[1.12] max-w-5xl text-left">
            {article.title}
          </h1>

          {/* Left-Aligned Lead Subtitle */}
          <p className="font-editorial italic text-base sm:text-xl lg:text-2xl text-[#555] max-w-4xl text-left mt-4 leading-relaxed">
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Byline Strip (Left Aligned) */}
          <div className="mt-8 pt-6 border-t border-[#EFEFEF] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs font-mono">
              <div className="w-9 h-9 rounded-full bg-[#111] text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                {(article.author || "Elena Rostova").slice(0, 2)}
              </div>
              <div>
                <div className="text-xs font-bold text-[#111]">
                  {article.author || "Elena Rostova"}
                </div>
                <div className="text-[11px] text-[#777]">
                  Atelier Research &amp; Seasonal Styling
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono text-[#666]">
              <span className="hidden sm:inline">Winter &apos;26 Edition</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-emerald-700 font-medium">Verified Editorial</span>
            </div>
          </div>
        </header>

        {/* =========================================================================
            2. FULL-WIDTH CINEMATIC HERO COVER IMAGE
        ========================================================================= */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 mb-12">
          <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-md overflow-hidden bg-[#F2F2F2] shadow-sm">
            <Image
              src={article.image}
              alt={article.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 1600px) 100vw, 1600px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-2xs font-mono text-[#888] uppercase tracking-wider">
            <span>Cover Photography • Swiss Alps Winter Archive</span>
            <span>MAULI FASHION LOOKBOOK N° 26</span>
          </div>
        </div>

        {/* =========================================================================
            3. ASYMMETRIC 2-COLUMN MAGAZINE LAYOUT (LEFT SIDEBAR + RIGHT NARRATIVE)
        ========================================================================= */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* -------------------- LEFT COLUMN (4 Cols: Sticky Sidebar & Highlights) -------------------- */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              {/* Atelier Note Callout Box */}
              <div className="p-6 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA] relative overflow-hidden">
                <div className="flex items-center space-x-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#111] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#111]">
                    Atelier Styling Note
                  </h4>
                </div>
                <p className="text-xs text-[#555] font-sans leading-relaxed">
                  Allow natural fibers 24 hours of rest between cold-weather excursions. Monochromatic winter layering creates vertical continuity and effortless warmth.
                </p>
              </div>

              {/* Story Architecture Index */}
              {sections.length > 0 && (
                <div className="p-6 rounded-lg border border-[#EAEAEA] bg-white">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#111] mb-3 pb-2 border-b border-[#F0F0F0]">
                    In This Editorial ({sections.length + 1} Chapters)
                  </h4>
                  <ul className="space-y-2 text-xs font-sans text-[#555]">
                    <li className="flex items-center space-x-2 text-[#111] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span>Introduction: Core Layering Principles</span>
                    </li>
                    {sections.map((sec, i) => (
                      <li key={sec.id || i} className="flex items-center space-x-2 text-[#666]">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                        <span className="line-clamp-1">{sec.title || `Chapter ${i + 1}`}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Story Credits Card */}
              <div className="p-6 rounded-lg border border-[#EAEAEA] bg-white text-xs font-mono text-[#666] space-y-2.5">
                <div className="text-xs uppercase tracking-wider font-bold text-[#111] pb-2 border-b border-[#F0F0F0]">
                  Editorial Credits
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Curator</span>
                  <span className="text-[#111] font-medium">{article.author || "Elena Rostova"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Photography</span>
                  <span className="text-[#111] font-medium">St. Moritz Archive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Season</span>
                  <span className="text-[#111] font-medium">Winter 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Origin</span>
                  <span className="text-[#111] font-medium">Zurich / Milan</span>
                </div>
              </div>

              {/* Compact Featured Product Capsule */}
              <div className="p-6 rounded-lg border border-[#EAEAEA] bg-white">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0F0F0]">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#111]">
                    Featured Garments
                  </h4>
                  <Link href="/products" className="text-2xs font-mono text-[#777] hover:text-black">
                    Shop All
                  </Link>
                </div>
                <div className="space-y-3">
                  {featuredProducts.slice(0, 2).map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className="flex items-center space-x-3 group"
                    >
                      <div className="relative w-14 h-18 rounded bg-[#F5F5F7] overflow-hidden shrink-0">
                        <Image
                          src={prod.primaryImage}
                          alt={prod.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-[#111] group-hover:text-[#555] transition-colors truncate">
                          {prod.title}
                        </h5>
                        <div className="text-2xs font-mono text-[#777] uppercase">
                          {prod.category}
                        </div>
                        <div className="text-xs font-mono font-medium text-[#111] mt-0.5">
                          ${prod.price.toFixed(2)} USD
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* -------------------- RIGHT COLUMN (8 Cols: Deep Editorial Content + Multiple Images) -------------------- */}
            <main className="lg:col-span-8 space-y-10">
              {/* Main Opening Paragraphs */}
              <div className="space-y-6 text-sm sm:text-base text-[#222] font-sans leading-relaxed">
                {paragraphs.map((p, idx) => {
                  // Heading
                  if (p.startsWith("### ")) {
                    return (
                      <h3
                        key={idx}
                        className="font-editorial text-2xl sm:text-3xl text-[#111] pt-6 pb-1 font-normal tracking-tight"
                      >
                        {p.replace("### ", "")}
                      </h3>
                    );
                  }

                  // Bullet / list format
                  if (p.includes("\n1. ") || p.includes("\n- ") || p.startsWith("1. ") || p.startsWith("- ")) {
                    const lines = p.split("\n");
                    return (
                      <div key={idx} className="my-6 p-6 rounded-md bg-[#FAFAFA] border-l-4 border-[#111] space-y-3">
                        {lines.map((line, lIdx) => (
                          <div key={lIdx} className="text-xs sm:text-sm text-[#333] leading-relaxed">
                            {formatTextWithBold(line)}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // First paragraph with elegant Drop-Cap
                  if (idx === 0) {
                    const firstLetter = p.charAt(0);
                    const rest = p.slice(1);
                    return (
                      <p key={idx} className="text-sm sm:text-base text-[#222] leading-relaxed">
                        <span className="float-left text-5xl sm:text-6xl font-editorial font-bold text-[#111] pr-3 pt-1 leading-none">
                          {firstLetter}
                        </span>
                        {formatTextWithBold(rest)}
                      </p>
                    );
                  }

                  return (
                    <p key={idx} className="text-sm sm:text-base text-[#222] leading-relaxed">
                      {formatTextWithBold(p)}
                    </p>
                  );
                })}
              </div>

              {/* =========================================================================
                  MULTIPLE IMAGE & STORY SECTIONS (User Request: 1tar beshi image + title + paragraph)
              ========================================================================= */}
              {sections.length > 0 && (
                <div className="space-y-14 pt-8 border-t border-[#EFEFEF]">
                  {sections.map((sec, idx) => (
                    <section key={sec.id || idx} className="space-y-4">
                      {/* Section Title */}
                      {sec.title && (
                        <div className="pb-1">
                          <span className="text-2xs font-mono uppercase tracking-widest text-[#777] block">
                            Chapter {idx + 1}
                          </span>
                          <h3 className="font-editorial text-2xl sm:text-3xl text-[#111] font-normal tracking-tight mt-0.5">
                            {sec.title}
                          </h3>
                        </div>
                      )}

                      {/* Section Image (Upload from device or URL) */}
                      {sec.image && (
                        <div className="rounded-md overflow-hidden bg-[#F5F5F7] border border-[#EAEAEA] shadow-xs">
                          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden group">
                            <Image
                              src={sec.image}
                              alt={sec.title || `Editorial Photo ${idx + 1}`}
                              fill
                              unoptimized
                              sizes="(max-width: 1024px) 100vw, 800px"
                              className="object-cover group-hover:scale-102 transition-transform duration-700"
                            />
                          </div>
                          {sec.imageCaption && (
                            <div className="px-4 py-2.5 bg-[#FAFAFA] border-t border-[#EAEAEA] text-2xs font-mono text-[#777] flex items-center justify-between">
                              <span>{sec.imageCaption}</span>
                              <span className="uppercase text-[10px]">Photo {idx + 1}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Section Story Text / Paragraph */}
                      {sec.paragraph && (
                        <p className="text-sm sm:text-base text-[#333] font-sans leading-relaxed pt-1">
                          {formatTextWithBold(sec.paragraph)}
                        </p>
                      )}
                    </section>
                  ))}
                </div>
              )}

              {/* Editorial Quote Callout */}
              <blockquote className="my-10 p-8 rounded-lg bg-[#FAFAFA] border-l-4 border-[#111]">
                <p className="font-editorial italic text-xl sm:text-2xl text-[#111] leading-snug">
                  &ldquo;Simplicity in winter apparel is not about absence of design—it is the mastery of thermal science executed with invisible seams.&rdquo;
                </p>
                <cite className="text-2xs font-mono uppercase tracking-widest text-[#777] mt-3 block not-italic">
                  — MAULI FASHION Winter Design Manifesto, Zurich Atelier
                </cite>
              </blockquote>

              {/* Author Bio Footer Box */}
              <div className="p-6 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA] flex items-center justify-between">
                <div>
                  <span className="text-2xs font-mono uppercase tracking-wider text-[#777] block">
                    Article Curator
                  </span>
                  <h4 className="text-sm font-editorial font-bold text-[#111] mt-0.5">
                    {article.author || "Elena Rostova"}
                  </h4>
                  <p className="text-xs text-[#666] mt-1 max-w-md">
                    Curating archival silhouettes and sustainable technical cold-weather materials for sub-zero urban environments.
                  </p>
                </div>

                <Link
                  href="/journal"
                  className="px-4 py-2 bg-[#111] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-md transition-colors shrink-0"
                >
                  More Stories
                </Link>
              </div>
            </main>
          </div>
        </div>

        {/* =========================================================================
            4. FEATURED PRODUCTS SHOWCASE
        ========================================================================= */}
        <section className="border-t border-[#EFEFEF] py-14 bg-[#FAFAFA]">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAEAEA]">
              <div>
                <span className="text-2xs font-mono uppercase tracking-widest text-[#777]">
                  Curated Garments
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#111] mt-0.5">
                  Featured In This Story
                </h3>
              </div>
              <Link
                href="/products"
                className="text-xs font-mono uppercase tracking-wider text-[#555] hover:text-black flex items-center space-x-1 transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {featuredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug}`}
                  className="group block bg-white border border-[#EAEAEA] rounded-md overflow-hidden p-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#F5F5F7] rounded overflow-hidden mb-3">
                    <Image
                      src={prod.primaryImage}
                      alt={prod.title}
                      fill
                      unoptimized
                      sizes="300px"
                      className="object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-2xs font-mono uppercase tracking-wider text-[#777]">
                    {prod.category}
                  </div>
                  <h4 className="text-xs font-semibold text-[#111] mt-1 group-hover:text-[#555] transition-colors line-clamp-1">
                    {prod.title}
                  </h4>
                  <div className="text-xs font-mono font-medium text-[#111] mt-1">
                    ${prod.price.toFixed(2)} USD
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. MORE STORIES FROM THE JOURNAL
        ========================================================================= */}
        {otherArticles.length > 0 && (
          <section className="border-t border-[#EFEFEF] py-14 sm:py-20 bg-white">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EFEFEF]">
                <div>
                  <span className="text-2xs font-mono uppercase tracking-widest text-[#777]">
                    Keep Reading
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#111] mt-0.5">
                    More From The Journal
                  </h3>
                </div>
                <Link
                  href="/journal"
                  className="text-xs font-mono uppercase tracking-wider text-[#555] hover:text-black flex items-center space-x-1 transition-colors"
                >
                  <span>View All Stories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherArticles.map((item) => (
                  <article key={item.id} className="group flex flex-col space-y-3">
                    <Link
                      href={`/journal/${item.slug}`}
                      className="relative aspect-[4/3] w-full bg-[#F5F5F7] rounded-md overflow-hidden block"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-wider text-[#777]">
                      <span className="font-semibold text-[#111]">{item.category}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <Link
                      href={`/journal/${item.slug}`}
                      className="font-editorial text-xl text-[#111] group-hover:text-[#555] transition-colors leading-snug line-clamp-2"
                    >
                      {item.title}
                    </Link>

                    <p className="text-xs text-[#666] font-sans leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>

                    <div className="pt-1">
                      <Link
                        href={`/journal/${item.slug}`}
                        className="inline-flex items-center space-x-1 text-2xs font-mono uppercase tracking-wider font-semibold text-[#111] hover:text-[#555] transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </StoreLayoutWrapper>
  );
}
