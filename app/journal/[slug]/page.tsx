import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Share2, Sparkles, Check } from "lucide-react";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { AdminStore, AdminJournalArticle } from "@/lib/server/admin-store";
import { PRODUCTS_CATALOG } from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = AdminStore.getJournalArticleBySlug(slug);
  if (!article) return { title: "Journal Story | WARDROBE" };
  return {
    title: `${article.title} | WARDROBE Journal`,
    description: article.excerpt,
  };
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

  return (
    <StoreLayoutWrapper>
      <article className="w-full bg-[#FFFFFF]">
        {/* Breadcrumbs & Category Bar */}
        <div className="border-b border-[#EFEFEF] py-4 bg-[#FAFAFA]">
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
              <span className="text-[#111] truncate max-w-xs">{article.category}</span>
            </div>

            <Link
              href="/journal"
              className="inline-flex items-center space-x-1.5 text-xs text-[#111] hover:text-[#555] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Journal</span>
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <header className="max-w-[1000px] mx-auto px-6 pt-12 sm:pt-16 pb-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-2xs font-mono uppercase tracking-widest text-[#777] mb-4">
            <span className="font-semibold text-[#111]">{article.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#111] font-normal tracking-tight leading-[1.12]">
            {article.title}
          </h1>

          <p className="font-editorial italic text-base sm:text-xl text-[#555] max-w-2xl mx-auto mt-5 leading-relaxed">
            &ldquo;{article.excerpt}&rdquo;
          </p>

          <div className="mt-8 pt-6 border-t border-[#EFEFEF] flex items-center justify-center space-x-6 text-xs font-mono text-[#777]">
            <div className="flex items-center space-x-2">
              <span className="text-[#333]">Words by</span>
              <span className="font-semibold text-[#111]">{article.author || "Elena Rostova"}</span>
            </div>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
        </header>

        {/* Hero Image */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 my-6">
          <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden bg-[#F2F2F2] shadow-sm">
            <Image
              src={article.image}
              alt={article.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
          </div>
          <p className="text-2xs font-mono text-[#888] text-right mt-2 uppercase tracking-wider">
            Photography & Styling • WARDROBE Winter &apos;26 Lookbook Archive
          </p>
        </div>

        {/* Article Body Content */}
        <div className="max-w-[760px] mx-auto px-6 py-10 sm:py-16">
          <div className="space-y-6 text-sm sm:text-base text-[#222] font-sans leading-relaxed">
            {paragraphs.map((p, idx) => {
              // Section Heading
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

              // Numbered or bullet list items
              if (p.includes("\n1. ") || p.includes("\n- ") || p.startsWith("1. ") || p.startsWith("- ")) {
                const lines = p.split("\n");
                return (
                  <ul key={idx} className="space-y-2.5 my-4 pl-4 border-l-2 border-[#111]">
                    {lines.map((line, lIdx) => (
                      <li key={lIdx} className="text-xs sm:text-sm text-[#444] leading-relaxed">
                        <strong className="text-[#111]">
                          {line.replace(/^(\d+\.\s*|-\s*)/, "").split(":")[0]}:
                        </strong>
                        {line.includes(":") ? line.split(":").slice(1).join(":") : ""}
                      </li>
                    ))}
                  </ul>
                );
              }

              // First paragraph: drop-cap styling
              if (idx === 0) {
                const firstLetter = p.charAt(0);
                const restOfPara = p.slice(1);
                return (
                  <p key={idx} className="text-sm sm:text-base text-[#222] leading-relaxed">
                    <span className="float-left text-4xl sm:text-5xl font-editorial font-bold text-[#111] pr-3 pt-1 leading-none">
                      {firstLetter}
                    </span>
                    {restOfPara}
                  </p>
                );
              }

              return (
                <p key={idx} className="text-sm sm:text-base text-[#222] leading-relaxed">
                  {p}
                </p>
              );
            })}
          </div>

          {/* Atelier Styling Note Callout */}
          <div className="my-12 p-6 sm:p-8 rounded-lg bg-[#FAFAFA] border border-[#EAEAEA] relative overflow-hidden">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#111]">
                  WARDROBE Atelier Note
                </h4>
                <p className="text-xs text-[#555] font-sans mt-1.5 leading-relaxed">
                  Always allow wool and down garments 24 hours of rest between wears on wide cedar hangers. This allows natural loft recovery and extends garment longevity across decades.
                </p>
              </div>
            </div>
          </div>

          {/* Author Signature */}
          <div className="pt-8 border-t border-[#EFEFEF] flex items-center justify-between">
            <div>
              <span className="text-2xs font-mono uppercase tracking-wider text-[#777] block">
                Written by
              </span>
              <span className="text-sm font-editorial text-[#111] font-semibold">
                {article.author || "Elena Rostova"}
              </span>
              <span className="text-xs text-[#777] block mt-0.5">
                Head of Seasonal Curation &amp; Textile Research
              </span>
            </div>

            <Link
              href="/journal"
              className="text-xs font-mono uppercase tracking-wider text-[#111] hover:text-[#555] flex items-center space-x-1"
            >
              <span>All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Featured Products in this Story */}
        <section className="border-t border-[#EFEFEF] py-14 bg-[#FAFAFA]">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAEAEA]">
              <div>
                <span className="text-2xs font-mono uppercase tracking-widest text-[#777]">
                  Curated Garments
                </span>
                <h3 className="font-editorial text-2xl text-[#111] mt-0.5">
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

        {/* Read Next From The Journal */}
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
