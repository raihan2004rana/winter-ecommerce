import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function AlpineLookbookSpread() {
  return (
    <section className="py-20 sm:py-28 max-w-[1500px] mx-auto px-6 sm:px-12 bg-white text-[#111]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-[#EAEAEA] pb-6">
        <div className="space-y-1">
          <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
            Visual Campaign • St. Moritz
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#111] uppercase">
            The Alpine Field Lookbook
          </h2>
        </div>
        <p className="text-xs text-[#777] max-w-md font-sans">
          Shot on location across the Bernina Range and urban transit corridors of Zurich.
        </p>
      </div>

      {/* Asymmetric High-Fashion Editorial Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Full-Height Hero Visual (7 Cols) */}
        <div className="lg:col-span-7 group relative aspect-editorial-tall lg:aspect-auto lg:min-h-[620px] overflow-hidden bg-[#111] p-8 sm:p-12 flex flex-col justify-end text-white">
          <Image
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=1600"
            alt="Alpine Altitude Campaign Shot"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center opacity-85 group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="relative z-10 space-y-3">
            <span className="text-2xs font-mono uppercase tracking-[0.24em] text-white/70 block">
              LOOK 01 • SUB-ZERO EXPEDITION
            </span>
            <h3 className="font-sans text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight">
              Toray Shell & High-Loft Goose Down
            </h3>
            <p className="text-xs text-white/80 max-w-lg leading-relaxed">
              Tested at 3,000 meters altitude in sustained 60 km/h winds. 
              The box-wall architecture provides continuous insulating coverage across key heat loss zones.
            </p>
            <Link
              href="#core-apparel"
              className="inline-flex items-center space-x-2 text-2xs uppercase tracking-widest font-mono text-white hover:text-sky-200 pt-2 transition-colors font-semibold"
            >
              <span>Explore The Look</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Two Stacked Editorial Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Card 1: Cashmere & Tailored Outerwear */}
          <div className="group relative flex-1 min-h-[290px] overflow-hidden bg-[#111] p-6 sm:p-8 flex flex-col justify-end text-white">
            <Image
              src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=85&w=1000"
              alt="Cashmere Overcoat Editorial"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center opacity-80 group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="relative z-10 space-y-1.5">
              <span className="text-[0.62rem] font-mono uppercase tracking-widest text-white/70">
                LOOK 02 • URBAN TRANSIT
              </span>
              <h4 className="font-sans text-xl font-bold uppercase tracking-tight text-white">
                Double-Faced Cashmere Overcoat
              </h4>
              <p className="text-2xs text-white/70 line-clamp-2">
                Unstructured luxury tailored for quiet winter layering over dense Merino knits.
              </p>
            </div>
          </div>

          {/* Card 2: Shearling Footwear Architecture */}
          <div className="group relative flex-1 min-h-[290px] overflow-hidden bg-[#111] p-6 sm:p-8 flex flex-col justify-end text-white">
            <Image
              src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=85&w=1000"
              alt="Shearling Footwear Editorial"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center opacity-80 group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="relative z-10 space-y-1.5">
              <span className="text-[0.62rem] font-mono uppercase tracking-widest text-white/70">
                LOOK 03 • ICE TRACTION
              </span>
              <h4 className="font-sans text-xl font-bold uppercase tracking-tight text-white">
                Alpine Shearling Lined Boot
              </h4>
              <p className="text-2xs text-white/70 line-clamp-2">
                Welted Italian calfskin with Vibram Arctic Grip outsoles and 18mm pure shearling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
