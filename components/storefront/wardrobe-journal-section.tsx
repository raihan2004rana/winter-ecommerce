"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const ARTICLES = [
  {
    id: "art-1",
    category: "Style guide",
    readTime: "6 min read",
    title: "Building a quiet winter wardrobe",
    excerpt: "Fewer pieces, warmer layers, and coats that do more than one job. How to build an archival winter uniform.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
    href: "/products",
  },
  {
    id: "art-2",
    category: "How to wear",
    readTime: "4 min read",
    title: "Layering denim & shearling for transitional weather",
    excerpt: "How to wear shearling jackets and dense denim when mornings are sub-zero and afternoons warm up.",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800",
    href: "/products",
  },
  {
    id: "art-3",
    category: "Lifestyle",
    readTime: "5 min read",
    title: "What people actually wear on busy days",
    excerpt: "Real outfits for real schedules. Comfortable, simple, and put together from alpine resorts to metropolitan streets.",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=800",
    href: "/products",
  },
];

export function WardrobeJournalSection() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 sm:py-24 border-b border-[#EAEAEA]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* =========================================================================
            HEADER: "Get dressed, feel better" (Framer Wardrobe Structure)
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 text-2xs font-mono uppercase tracking-[0.25em] text-[#777] mb-1.5">
              <span>The Journal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-medium tracking-[-0.03em] text-[#111]">
              Get dressed, <span className="font-serif italic font-normal text-[#444]">feel better</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#666] font-sans mt-2 leading-relaxed">
              Simple guides, styling ideas, and trend highlights to help you get more out of every piece in your wardrobe.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest font-semibold text-[#111] hover:text-[#555] transition-colors self-start sm:self-end"
          >
            <span>View all articles</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* =========================================================================
            3-COLUMN EDITORIAL ARTICLE CARDS
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col bg-white border border-[#EAEAEA] hover:border-[#111] transition-all duration-300"
            >
              {/* Cover Image */}
              <Link
                href={article.href}
                className="relative aspect-[16/10] w-full bg-[#F5F5F7] overflow-hidden block"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[center_20%] group-hover:scale-104 transition-transform duration-700 ease-out"
                />
              </Link>

              {/* Text Content */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2.5">
                  {/* Category + Read Time */}
                  <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-wider text-[#777]">
                    <span className="font-semibold text-[#111]">{article.category}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={article.href}
                    className="block font-sans text-xl font-medium text-[#111] group-hover:text-[#444] transition-colors leading-snug"
                  >
                    {article.title}
                  </Link>

                  {/* Excerpt */}
                  <p className="text-xs text-[#666] font-sans leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                {/* Read Button */}
                <div className="pt-2 border-t border-[#F0F0F0]">
                  <Link
                    href={article.href}
                    className="inline-flex items-center space-x-1.5 text-2xs font-mono uppercase tracking-widest font-semibold text-[#111] hover:text-[#555] transition-colors"
                  >
                    <span>Read article</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
