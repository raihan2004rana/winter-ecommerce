import * as React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top placeholder space */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-8 sm:py-12 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-3 w-48 bg-neutral-100 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Image Skeleton (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
            </div>
            {/* Gallery thumbnails */}
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-24 bg-neutral-100 rounded" />
              ))}
            </div>
          </div>

          {/* Right Column: Garment Specs Skeleton (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            {/* Category tag */}
            <div className="h-3 w-28 bg-neutral-100 rounded" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-neutral-100 rounded" />
              <div className="h-4 w-full bg-neutral-100 rounded" />
            </div>

            {/* Price */}
            <div className="h-7 w-32 bg-neutral-100 rounded" />

            {/* Size Selector */}
            <div className="space-y-2 pt-4">
              <div className="h-3 w-20 bg-neutral-100 rounded" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-12 h-10 bg-neutral-100 rounded" />
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <div className="h-12 w-full bg-neutral-200 rounded-full" />
            </div>

            {/* Features accordion preview */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <div className="h-4 w-1/2 bg-neutral-100 rounded" />
              <div className="h-4 w-2/3 bg-neutral-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
