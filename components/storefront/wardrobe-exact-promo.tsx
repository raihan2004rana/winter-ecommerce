"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export function WardrobeExactPromo() {
  const [time, setTime] = React.useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    millis: "00",
  });

  React.useEffect(() => {
    // Dynamic countdown clock ticking matching wardrobe.framer.ai
    let h = 18;
    let m = 42;
    let s = 30;
    let ms = 99;

    const timer = setInterval(() => {
      ms -= 1;
      if (ms < 0) {
        ms = 99;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
          if (m < 0) {
            m = 59;
            h -= 1;
            if (h < 0) h = 23;
          }
        }
      }
      setTime({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        millis: String(ms).padStart(2, "0"),
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Left Column: The exact white jackets on wooden hangers */}
          <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] w-full bg-[#1A1A1A] overflow-hidden">
            <Image
              src="/images/wardrobe/XPyPA2Z2k9RtAkYp8kiodqhmg1c.jpg"
              alt="Black Friday Deals - White winter jackets"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: Heading + Countdown + Dual Buttons */}
          <div className="flex flex-col justify-center space-y-6 md:pl-6 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="font-editorial text-3xl sm:text-5xl lg:text-[3.5rem] font-normal text-[#111] leading-[1.08] tracking-tight">
                Black Friday deals are live
              </h2>
              <p className="text-xs sm:text-sm text-[#666] font-sans leading-relaxed max-w-md mx-auto md:mx-0">
                Don’t miss reduced prices on seasonal favorites. This offer won’t last long.
              </p>
            </div>

            {/* Massive Digital Countdown: 00:00:00:00 */}
            <div className="pt-2">
              <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-light text-[#111] tracking-wider select-none">
                {time.hours}:{time.minutes}:{time.seconds}:{time.millis}
              </span>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-2">
              <Link
                href="/collections/sale"
                className="bg-[#1E1E1E] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-sm"
              >
                Shop deals
              </Link>
              <Link
                href="/products"
                className="bg-[#2D2D2D] hover:bg-black text-white px-7 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-colors shadow-sm"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
