"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Flame } from "lucide-react";

export function WardrobePromoCountdown() {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#111111] text-white py-16 sm:py-24 overflow-hidden border-b border-[#222]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Promotion Copy + Countdown Timer */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3.5 py-1 text-2xs font-mono uppercase tracking-[0.25em] font-semibold">
                <Flame className="h-3.5 w-3.5 animate-pulse" />
                <span>Limited Seasonal Event</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-medium tracking-tight text-white leading-[1.02]">
                Black Friday deals <br />
                <span className="font-serif italic font-normal text-white/80">are live now</span>
              </h2>

              <p className="text-sm sm:text-base text-[#AAA] font-sans leading-relaxed max-w-xl">
                Don’t miss reduced prices on seasonal favorites and archival down garments. This offer won’t last long. Complimentary express delivery included.
              </p>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center bg-[#1A1A1A] border border-[#2D2D2D] w-18 sm:w-22 py-3 sm:py-4 shadow-inner"
                >
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[0.62rem] font-mono uppercase tracking-widest text-[#777] mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/collections/sale"
                className="inline-flex items-center space-x-3 bg-white hover:bg-neutral-200 text-black px-8 py-4 text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-102 shadow-lg"
              >
                <span>Shop the event</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto bg-[#1C1C1E] border border-[#333] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=90&w=1200"
                alt="Limited Archival Down Coat"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[center_20%] scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 inset-x-6 space-y-1">
                <span className="text-2xs font-mono uppercase tracking-widest text-red-400 font-semibold block">
                  35% OFF ARCHIVAL PIECE
                </span>
                <p className="font-sans text-lg font-medium text-white">
                  Sub-Zero High Collar Cocoon Parka
                </p>
                <div className="flex items-baseline space-x-2 pt-1 font-mono">
                  <span className="text-lg font-bold text-white">$449.00</span>
                  <span className="text-sm text-neutral-400 line-through">$685.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
