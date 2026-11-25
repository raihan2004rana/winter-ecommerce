"use client";

import * as React from "react";
import Image from "next/image";

const INSTAGRAM_PHOTOS = [
  "/images/wardrobe/bZjYMI83pPwIDnCh0nG79sedo.jpg",
  "/images/wardrobe/uSP5ea5zqNJXxT5jmPWYTI3wZMc.jpg",
  "/images/wardrobe/lIT6XTSJ7w7ldhyW6UnppvsA.jpg",
  "/images/wardrobe/VHE2QuCOl6cE6GR0KXglRilpug.jpg",
];

export function WardrobeExactInstagram() {
  return (
    <section className="w-full bg-[#FFFFFF] py-14 sm:py-20 border-b border-[#F0F0F0]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#111] font-normal tracking-tight mb-8">
          Follow us on Instagram
        </h2>

        {/* 4-Column Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {INSTAGRAM_PHOTOS.map((src, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] w-full bg-[#F5F5F7] overflow-hidden"
            >
              <Image
                src={src}
                alt={`Instagram look ${idx + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
