"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Star, CheckCircle, Trash2, MessageSquare } from "lucide-react";

export function ReviewsTab() {
  const { reviews } = useAuth();
  const [localReviews, setLocalReviews] = React.useState(reviews);

  const handleDelete = (id: string) => {
    setLocalReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-[#EAEAEA] pb-4">
        <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
          Client Reviews & Testimonials ({localReviews.length})
        </h2>
        <p className="text-xs text-[#666]">
          Your field feedback on alpine thermal performance, garment fit, and craftsmanship.
        </p>
      </div>

      {localReviews.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] p-12 text-center space-y-3">
          <MessageSquare className="h-8 w-8 text-[#999] mx-auto" />
          <h3 className="font-sans text-base font-semibold text-[#111]">No Reviews Submitted</h3>
          <p className="text-xs text-[#666]">
            You have not yet published feedback for any acquired garments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {localReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#EAEAEA] p-6 space-y-4 hover:border-black transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EAEAEA] pb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-12 bg-[#F6F6F6] border border-[#EAEAEA] overflow-hidden shrink-0">
                    <Image
                      src={rev.product_image}
                      alt={rev.product_title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/products/${rev.product_slug}`}
                      className="text-xs font-bold text-black hover:underline"
                    >
                      {rev.product_title}
                    </Link>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rev.rating
                              ? "fill-black text-black"
                              : "text-[#DDD]"
                          }`}
                        />
                      ))}
                      <span className="text-2xs font-mono font-bold text-black ml-1">
                        {rev.rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  {rev.is_verified_purchase && (
                    <span className="text-2xs font-mono uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified Acquisition</span>
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="text-[#999] hover:text-[#B91C1C] transition-colors p-1"
                    aria-label="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Review Body */}
              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-black">{rev.title}</h4>
                <p className="text-[#555] leading-relaxed">{rev.comment}</p>
                <div className="flex items-center space-x-3 text-2xs font-mono text-[#888] pt-2">
                  <span>Fit Assessment: <strong className="text-black uppercase">True to Size</strong></span>
                  <span>•</span>
                  <span>Published: {new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
