"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    id: "art-1",
    image: "/images/wardrobe/AFa3pXi6rgIjU1cTtgBzlijk5o.jpg",
    category: "Style guide",
    readTime: "6 min read",
    title: "Building a quiet winter wardrobe",
    excerpt: "Fewer pieces, warmer layers, and coats that do more than one job.",
  },
  {
    id: "art-2",
    image: "/images/wardrobe/layer-denim.jpg",
    category: "How to wear",
    readTime: "4 min read",
    title: "Layering denim for transitional weather",
    excerpt: "How to wear denim jackets and jeans when mornings are cold and afternoons warm up.",
  },
  {
    id: "art-3",
    image: "/images/wardrobe/C9YOETuP6DWDsoWsKpvONxkKE.jpg",
    category: "Lifestyle",
    readTime: "5 min read",
    title: "What people actually wear on busy days",
    excerpt: "Real outfits for real schedules. Comfortable, simple, and put together.",
  },
];

export function WardrobeExactJournal() {
  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header: Get dressed, feel better + View all articles */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8 sm:mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111] font-normal tracking-tight">
              Get dressed, feel better
            </h2>
            <p className="text-xs sm:text-sm text-[#666] font-sans mt-1">
              Simple guides, styling ideas, and trend highlights to help you get more out of every piece in your wardrobe.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-mono text-[#555] hover:text-black tracking-wider uppercase transition-colors shrink-0"
          >
            view all articles
          </Link>
        </div>

        {/* 3-Column Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((item) => (
            <article key={item.id} className="group flex flex-col space-y-3">
              {/* Photo */}
              <Link
                href="/products"
                className="relative aspect-[4/3] w-full bg-[#F5F5F7] overflow-hidden block"
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

              {/* Category + Read Time */}
              <div className="flex items-center space-x-2 text-2xs font-mono text-[#777] uppercase tracking-wider">
                <span className="font-semibold text-[#111]">{item.category}</span>
                <span>•</span>
                <span>{item.readTime}</span>
              </div>

              {/* Title in Serif */}
              <Link
                href="/products"
                className="font-editorial text-2xl text-[#111] group-hover:text-[#555] transition-colors leading-snug"
              >
                {item.title}
              </Link>

              {/* Excerpt */}
              <p className="text-xs text-[#666] font-sans leading-relaxed">
                {item.excerpt}
              </p>

              {/* Read Link */}
              <div className="pt-1">
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-1 text-2xs font-mono uppercase tracking-wider font-semibold text-[#111] hover:text-[#555] transition-colors"
                >
                  <span>read article</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
