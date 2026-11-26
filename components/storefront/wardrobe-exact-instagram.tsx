"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import { InstagramPost, InstagramConfig } from "@/lib/server/admin-store";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: "ig-001",
    imageUrl: "/images/wardrobe/bZjYMI83pPwIDnCh0nG79sedo.jpg",
    permalink: "https://instagram.com/kora.winter",
    caption: "Sub-Zero Expedition Parka field testing in Tromsø, Norway.",
    likesCount: 1420,
    commentsCount: 84,
  },
  {
    id: "ig-002",
    imageUrl: "/images/wardrobe/uSP5ea5zqNJXxT5jmPWYTI3wZMc.jpg",
    permalink: "https://instagram.com/kora.winter",
    caption: "Layering essentials. Heavyweight Merino knitwear.",
    likesCount: 2190,
    commentsCount: 132,
  },
  {
    id: "ig-003",
    imageUrl: "/images/wardrobe/lIT6XTSJ7w7ldhyW6UnppvsA.jpg",
    permalink: "https://instagram.com/kora.winter",
    caption: "Quiet confidence. Cashmere overcoat in natural alpine lighting.",
    likesCount: 3840,
    commentsCount: 215,
  },
  {
    id: "ig-004",
    imageUrl: "/images/wardrobe/VHE2QuCOl6cE6GR0KXglRilpug.jpg",
    permalink: "https://instagram.com/kora.winter",
    caption: "Heavy gauge turtleneck with cold weather protection accessories.",
    likesCount: 1850,
    commentsCount: 96,
  },
];

export function WardrobeExactInstagram() {
  const [config, setConfig] = React.useState<InstagramConfig>({
    handle: "kora.winter",
    profileUrl: "https://instagram.com/kora.winter",
    autoSync: false,
    posts: FALLBACK_POSTS,
  });

  React.useEffect(() => {
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data.posts) && data.data.posts.length > 0) {
          setConfig(data.data);
        }
      })
      .catch((err) => console.error("Failed to load Instagram feed:", err));
  }, []);

  const displayPosts = config.posts && config.posts.length > 0 ? config.posts.slice(0, 4) : FALLBACK_POSTS;
  const instagramUrl = config.profileUrl || `https://instagram.com/${config.handle || "kora.winter"}`;

  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header: Title + Handle + Follow Action */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-8 sm:mb-10">
          <div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#111] font-normal tracking-tight">
              Follow us on Instagram
            </h2>
            <p className="text-xs sm:text-sm text-[#666] font-sans mt-1">
              Tag <span className="font-mono text-[#111] font-medium">@{config.handle || "kora.winter"}</span> and <span className="font-mono text-[#111] font-medium">#KoraWinter</span> to be featured.
            </p>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#111] hover:text-black py-1.5 px-3.5 rounded-full border border-neutral-300 hover:border-black transition-all bg-white shadow-2xs group shrink-0 self-start sm:self-auto"
          >
            <InstagramIcon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span>Follow @{config.handle || "kora.winter"}</span>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-black transition-colors" />
          </a>
        </div>

        {/* 4-Column Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayPosts.map((post, idx) => (
            <a
              key={post.id || idx}
              href={post.permalink || instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[3/4] w-full bg-[#F5F5F7] overflow-hidden block"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption || `Instagram look ${idx + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Sleek Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between">
                  <InstagramIcon className="w-4 h-4 text-white/90" />
                  <span className="text-[0.65rem] font-mono tracking-wider uppercase text-white/80 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    View on IG ↗
                  </span>
                </div>

                <div className="space-y-2">
                  {post.caption && (
                    <p className="text-2xs font-sans text-white/90 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 text-2xs font-mono text-white/95 pt-1 border-t border-white/20">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>{post.likesCount ? (post.likesCount > 999 ? `${(post.likesCount / 1000).toFixed(1)}k` : post.likesCount) : "1.2k"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 text-white/80" />
                      <span>{post.commentsCount || 48}</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
