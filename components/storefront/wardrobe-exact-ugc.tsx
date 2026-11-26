"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const SLIDES = [
  {
    id: 0,
    image: "/images/wardrobe/slider-1.jpg",
    alt: "Customer in Navy Knit Top",
    handle: "@elena.style",
  },
  {
    id: 1,
    image: "/images/wardrobe/slider-2.avif",
    alt: "Customer in Red Sweater & Sunglasses",
    handle: "@sophia.alp",
  },
  {
    id: 2,
    image: "/images/wardrobe/slider-3.avif",
    alt: "Customer in White Coat in Meadow",
    handle: "@nordic.kora",
  },
  {
    id: 3,
    image: "/images/wardrobe/slider-4.jpg",
    alt: "Customer in Green Studio",
    handle: "@marcus.vogue",
  },
  {
    id: 4,
    image: "/images/wardrobe/slider-5.jpg",
    alt: "Customer in Camel Overcoat",
    handle: "@clara.berlin",
  },
  {
    id: 5,
    image: "/images/wardrobe/VHE2QuCOl6cE6GR0KXglRilpug.jpg",
    alt: "Customer in Beige Shearling Coat",
    handle: "@aspen.winter",
  },
];

export function WardrobeExactUgc() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
  const [liked, setLiked] = React.useState<Record<number, boolean>>({});

  const total = SLIDES.length;

  // Auto-slide interval: slides automatically every 3.2 seconds
  React.useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Touch and drag swipe handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX === null) return;
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = touchStartX - clientX;

    if (diff > 40) {
      nextSlide(); // Swiped left -> next slide
    } else if (diff < -40) {
      prevSlide(); // Swiped right -> prev slide
    }
    setTouchStartX(null);
  };

  const toggleLike = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section
      className="w-full bg-[#FFFFFF] py-16 sm:py-24 border-b border-[#F0F0F0] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 text-center space-y-4">
        {/* Top 5 Stars + 1M+ satisfied customers */}
        <div className="flex items-center justify-center space-x-1 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
          ))}
          <span className="text-2xs font-mono text-[#888] ml-1">
            1M+ satisfied customers
          </span>
        </div>

        {/* Heading: As seen on you */}
        <h2 className="font-editorial text-4xl sm:text-5xl text-[#111] font-normal tracking-tight">
          As seen on you
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#666] font-sans max-w-md mx-auto">
          Real people wearing KØRA in everyday moments.
        </p>

        {/* Follow us Button */}
        <div className="pt-1">
          <Link
            href="/products"
            className="inline-block bg-[#1E1E1E] hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors shadow-xs"
          >
            Follow us
          </Link>
        </div>

        {/* =========================================================================
            3D FAN / COVERFLOW SLIDER (AUTOMATIC & INTERACTIVE)
           ========================================================================= */}
        <div
          className="pt-10 pb-4 relative flex items-center justify-center min-h-[420px] sm:min-h-[490px] cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
        >
          {/* Left Arrow Trigger */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-12 lg:left-24 z-40 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black shadow-md border border-[#EAEAEA] flex items-center justify-center transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow Trigger */}
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-12 lg:right-24 z-40 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black shadow-md border border-[#EAEAEA] flex items-center justify-center transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Cards Loop with 3D Matrix Math */}
          <div className="relative w-full max-w-4xl h-[380px] sm:h-[450px] flex items-center justify-center">
            {SLIDES.map((slide, idx) => {
              // Calculate shortest circular distance
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;
              const isVisible = Math.abs(diff) <= 2;

              // Compute exact 3D positioning
              let translateX = 0;
              let scale = 1;
              let rotateZ = 0;
              let zIndex = 30;
              let opacity = 1;
              let blur = "0px";

              if (diff === 0) {
                translateX = 0;
                scale = 1;
                rotateZ = 0;
                zIndex = 30;
                opacity = 1;
                blur = "0px";
              } else if (diff === 1) {
                translateX = 175; // Right 1
                scale = 0.9;
                rotateZ = 7;
                zIndex = 20;
                opacity = 0.85;
                blur = "0.5px";
              } else if (diff === -1) {
                translateX = -175; // Left 1
                scale = 0.9;
                rotateZ = -7;
                zIndex = 20;
                opacity = 0.85;
                blur = "0.5px";
              } else if (diff === 2) {
                translateX = 310; // Right 2
                scale = 0.8;
                rotateZ = 13;
                zIndex = 10;
                opacity = 0.45;
                blur = "1.5px";
              } else if (diff === -2) {
                translateX = -310; // Left 2
                scale = 0.8;
                rotateZ = -13;
                zIndex = 10;
                opacity = 0.45;
                blur = "1.5px";
              } else {
                translateX = diff > 0 ? 450 : -450;
                scale = 0.65;
                rotateZ = diff > 0 ? 20 : -20;
                zIndex = 1;
                opacity = 0;
                blur = "4px";
              }

              return (
                <div
                  key={slide.id}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    transform: `translate3d(${translateX}px, 0, 0) scale(${scale}) rotate(${rotateZ}deg)`,
                    zIndex,
                    opacity: isVisible ? opacity : 0,
                    filter: `blur(${blur})`,
                    transition:
                      "transform 650ms cubic-bezier(0.25, 1, 0.5, 1), opacity 650ms ease, filter 650ms ease",
                    pointerEvents: isVisible ? "auto" : "none",
                  }}
                  className={`absolute w-[220px] sm:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer ${isCenter
                      ? "shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-[3px] border-white ring-1 ring-black/5"
                      : "shadow-xl border border-white/60 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    unoptimized
                    sizes="300px"
                    className="object-cover"
                  />

                  {/* Gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Heart Like Badge */}
                  <button
                    onClick={(e) => toggleLike(idx, e)}
                    className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/60 transition-transform active:scale-125 z-10"
                    aria-label="Like moment"
                  >
                    <Heart
                      className={`h-4 w-4 ${liked[idx] ? "fill-red-500 text-red-500" : "text-white"
                        } transition-colors`}
                    />
                  </button>

                  {/* Handle Tag at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-2xs font-mono">
                    <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-white/20">
                      {slide.handle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots (Clickable) */}
        <div className="flex items-center justify-center space-x-2 pt-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Jump to slide ${i + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${activeIndex === i
                  ? "w-7 bg-[#111]"
                  : "w-2 bg-[#D1D1D6] hover:bg-[#8E8E93]"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
