import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function BrandStorySection() {
  const pillars = [
    {
      num: "01",
      title: "100% RDS Down Sourcing",
      description:
        "Every down cluster is certified under the Responsible Down Standard, guaranteeing ethical waterfowl treatment and pure 850+ fill power loft.",
    },
    {
      num: "02",
      title: "Japanese Membrane Shells",
      description:
        "We weave non-fluorinated waterproof textiles in Fukui, Japan, delivering 20,000mm hydrostatic protection without plastic stiffness.",
    },
    {
      num: "03",
      title: "Baffle Micro-Architecture",
      description:
        "Internal box-wall baffle construction eliminates stitch-through cold bridges, keeping body warmth trapped even during stationary alpine exposure.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-canvas border-t border-canvas-muted">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Story Intro */}
        <div className="max-w-3xl space-y-4">
          <span className="editorial-caps text-forest font-semibold">
            Brand Philosophy & Craft
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal tracking-tight leading-tight">
            The Alpine Standard: Precision Cold Protection Without Excess.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Founded with a singular engineering directive: create winter outerwear and knitwear that performs in -35°C 
            sub-zero conditions while maintaining the quiet elegance of tailored European luxury. No conspicuous logos, 
            no disposable trends—just uncompromising thermal integrity.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-canvas-muted">
          {pillars.map((p) => (
            <div key={p.num} className="space-y-3">
              <span className="font-mono text-2xs text-forest font-semibold block">
                {p.num} / CRAFT DISCIPLINE
              </span>
              <h3 className="font-serif text-xl text-charcoal font-normal">
                {p.title}
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
