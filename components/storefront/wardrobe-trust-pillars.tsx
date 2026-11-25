"use client";

import * as React from "react";
import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: Truck,
    title: "Free shipping over $50",
    description: "Orders above $50 ship free worldwide via DHL Express — no hidden fees, no surprises.",
  },
  {
    icon: RotateCcw,
    title: "30-day easy returns",
    description: "Changed your mind? Return unused products within 30 days, hassle-free with prepaid labels.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted by thousands",
    description: "Join over 1M+ satisfied customers worldwide who trust our sub-zero down craft every winter.",
  },
];

export function WardrobeTrustPillars() {
  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-18 border-b border-[#EAEAEA]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-4 p-6 bg-[#FAFAFA] border border-[#EAEAEA] hover:border-[#111] transition-colors duration-300"
              >
                <div className="h-10 w-10 rounded-full bg-white border border-[#DDD] flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="h-5 w-5 text-[#111]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm sm:text-base font-semibold text-[#111]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#666] font-sans leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
