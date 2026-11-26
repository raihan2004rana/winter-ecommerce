"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Sparkles, Filter, ChevronRight } from "lucide-react";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";

interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  readTime: string;
  image: string;
  author?: string;
  publishedAt: string;
  isPublished: boolean;
  order: number;
}

const DEFAULT_ARTICLES: JournalArticle[] = [
  {
    id: "art-1",
    slug: "building-a-quiet-winter-wardrobe",
    image: "/images/wardrobe/AFa3pXi6rgIjU1cTtgBzlijk5o.jpg",
    category: "Style guide",
    readTime: "6 min read",
    title: "Building a quiet winter wardrobe",
    excerpt: "Fewer pieces, warmer layers, and coats that do more than one job.",
    author: "Elena Rostova",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isPublished: true,
    order: 1,
  },
  {
    id: "art-2",
    slug: "layering-denim-for-transitional-weather",
    image: "/images/wardrobe/layer-denim.jpg",
    category: "How to wear",
    readTime: "4 min read",
    title: "Layering denim for transitional weather",
    excerpt: "How to wear denim jackets and jeans when mornings are cold and afternoons warm up.",
    author: "Julian Vance",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    isPublished: true,
    order: 2,
  },
  {
    id: "art-3",
    slug: "what-people-actually-wear-on-busy-days",
    image: "/images/wardrobe/C9YOETuP6DWDsoWsKpvONxkKE.jpg",
    category: "Lifestyle",
    readTime: "5 min read",
    title: "What people actually wear on busy days",
    excerpt: "Real outfits for real schedules. Comfortable, simple, and put together.",
    author: "Søren Lindqvist",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    isPublished: true,
    order: 3,
  },
  {
    id: "art-4",
    slug: "sub-zero-thermal-craft-and-mongolian-cashmere",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=800",
    category: "Material craft",
    readTime: "7 min read",
    title: "Sub-zero thermal craft & Mongolian cashmere",
    excerpt: "The science of 450 GSM pure wool knits engineered for alpine temperature drops.",
    author: "Astrid Lind",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    isPublished: true,
    order: 4,
  },
];

export default function JournalPage() {
  const [articles, setArticles] = React.useState<JournalArticle[]>(DEFAULT_ARTICLES);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/journal")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch((err) => {
        console.error("Failed to load journal:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory === "all") return true;
    return a.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const featured = filteredArticles[0] || articles[0];
  const gridStories = filteredArticles.slice(1);

  return (
    <StoreLayoutWrapper>
      <div className="w-full bg-[#FFFFFF] min-h-screen">
        {/* Masthead Header */}
        <section className="border-b border-[#EFEFEF] py-14 sm:py-20 bg-[#FAFAFA]">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 text-center">
            <span className="text-2xs font-mono uppercase tracking-[0.2em] text-[#777] block mb-2">
              WARDROBE Editorial Archive
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl text-[#111] font-normal tracking-tight max-w-3xl mx-auto leading-tight">
              Stories of Cold, Craft &amp; Quiet Elegance
            </h1>
            <p className="text-xs sm:text-sm text-[#666] font-sans mt-3 max-w-xl mx-auto leading-relaxed">
              Curated styling guides, sub-zero textile craft, and winter wardrobe architecture from our design studio.
            </p>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-2xs font-mono uppercase tracking-wider px-4 py-1.5 rounded-full border transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#111] text-white border-[#111] shadow-xs"
                      : "bg-white text-[#555] border-[#DDD] hover:border-[#111] hover:text-[#111]"
                  }`}
                >
                  {cat === "all" ? "All Stories" : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
          {/* Featured Hero Story */}
          {featured && (
            <div className="mb-16 pb-16 border-b border-[#EFEFEF]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Image (7 cols) */}
                <div className="lg:col-span-7">
                  <Link
                    href={`/journal/${featured.slug}`}
                    className="block relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md overflow-hidden bg-[#F2F2F2] group shadow-xs"
                  >
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <span className="text-2xs font-mono uppercase tracking-widest bg-white/95 backdrop-blur-sm text-[#111] px-3 py-1 rounded-full font-medium shadow-xs">
                        Featured Story
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Content (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-4 lg:pl-4">
                  <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-wider text-[#777]">
                    <span className="font-semibold text-[#111]">{featured.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featured.readTime}
                    </span>
                  </div>

                  <Link href={`/journal/${featured.slug}`}>
                    <h2 className="font-editorial text-2xl sm:text-4xl text-[#111] hover:text-[#555] transition-colors leading-snug">
                      {featured.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#666] font-sans leading-relaxed">
                    {featured.excerpt}
                  </p>

                  <div className="pt-2 text-2xs font-mono text-[#888]">
                    By {featured.author || "WARDROBE Editorial"} •{" "}
                    {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/journal/${featured.slug}`}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-[#111] hover:bg-black text-white text-xs font-mono uppercase tracking-wider font-medium rounded-full transition-all group shadow-xs hover:scale-102"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Stories */}
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EFEFEF]">
              <h3 className="font-editorial text-2xl text-[#111]">
                {selectedCategory === "all" ? "All Editorial Stories" : `${selectedCategory} Articles`}
              </h3>
              <span className="text-xs font-mono text-[#777]">
                Showing {filteredArticles.length} stories
              </span>
            </div>

            {gridStories.length === 0 && filteredArticles.length <= 1 ? (
              <p className="text-xs text-[#777] font-mono py-8">
                No additional stories in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {gridStories.map((story) => (
                  <article key={story.id} className="group flex flex-col space-y-3">
                    <Link
                      href={`/journal/${story.slug}`}
                      className="relative aspect-[4/3] w-full bg-[#F5F5F7] rounded-md overflow-hidden block"
                    >
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      />
                    </Link>

                    <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-wider text-[#777]">
                      <span className="font-semibold text-[#111]">{story.category}</span>
                      <span>•</span>
                      <span>{story.readTime}</span>
                    </div>

                    <Link
                      href={`/journal/${story.slug}`}
                      className="font-editorial text-xl sm:text-2xl text-[#111] group-hover:text-[#555] transition-colors leading-snug line-clamp-2"
                    >
                      {story.title}
                    </Link>

                    <p className="text-xs text-[#666] font-sans leading-relaxed line-clamp-2">
                      {story.excerpt}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-2xs font-mono">
                      <span className="text-[#888]">
                        {new Date(story.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Link
                        href={`/journal/${story.slug}`}
                        className="inline-flex items-center space-x-1 uppercase tracking-wider font-semibold text-[#111] group-hover:text-[#555] transition-colors"
                      >
                        <span>Read</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter Dispatch Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-lg bg-[#F8F8F8] border border-[#EAEAEA] text-center max-w-3xl mx-auto">
            <span className="text-2xs font-mono uppercase tracking-widest text-[#777] block mb-1">
              Curated Sunday Dispatch
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#111]">
              Receive our seasonal essays &amp; styling notes
            </h3>
            <p className="text-xs text-[#666] font-sans mt-2 max-w-md mx-auto">
              Delivered every Sunday morning. No spam or aggressive sale popups—strictly archival photography and quiet winter wardrobe direction.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for joining our Sunday Dispatch.");
              }}
              className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 text-xs bg-white border border-[#DDD] rounded-md text-[#111] placeholder:text-[#999] focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111] hover:bg-black text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
