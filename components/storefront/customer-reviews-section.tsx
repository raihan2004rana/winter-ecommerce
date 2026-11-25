import * as React from "react";
import { CUSTOMER_REVIEWS } from "@/data/reviews";
import { Star, ShieldCheck, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CustomerReviewsSection() {
  return (
    <section className="py-20 sm:py-28 bg-canvas-subtle border-y border-canvas-muted">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="editorial-caps text-forest font-semibold">
            Field Reports & Verified Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal tracking-tight">
            Tested in Extreme Sub-Zero Habitats
          </h2>
          <p className="text-xs text-charcoal-500">
            Real feedback from arctic photographers, alpine travelers, and northern city commuters worldwide.
          </p>
        </div>

        {/* 3-Column Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CUSTOMER_REVIEWS.map((rev) => (
            <article
              key={rev.id}
              className="bg-canvas-elevated border border-canvas-muted p-8 flex flex-col justify-between space-y-6 shadow-editorial"
            >
              <div className="space-y-4">
                {/* Rating & Temperature Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-alpine-amber">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <Badge variant="temp" className="text-[0.62rem]">
                    {rev.temperatureTestimony}
                  </Badge>
                </div>

                <h3 className="font-serif text-lg text-charcoal font-normal">
                  &quot;{rev.reviewTitle}&quot;
                </h3>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-canvas-muted flex items-center justify-between text-2xs">
                <div>
                  <span className="font-medium text-charcoal block">{rev.author}</span>
                  <span className="text-charcoal-400 font-mono">{rev.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-forest">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[0.62rem] uppercase tracking-wider font-mono">Verified Buyer</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
