"use client";

import * as React from "react";
import { Shield, Sparkles, Award } from "lucide-react";

interface PartnerBrand {
  name: string;
  category: string;
  badge?: string;
  logoSvg: React.ReactNode;
}

const PARTNERS: PartnerBrand[] = [
  {
    name: "GORE-TEX",
    category: "Weatherproof 28,000mm Membrane",
    badge: "GUARANTEED TO KEEP YOU DRY",
    logoSvg: (
      <svg viewBox="0 0 160 40" fill="currentColor" className="h-6 w-auto tracking-widest">
        <path d="M12 28C6 28 2 23 2 16S6 4 12 4C16 4 19 6 21 9L17 12C16 10 14 8 12 8C8 8 6 12 6 16S8 24 12 24C14 24 16 23 18 21V18H12V14H22V23C19 26 16 28 12 28Z" />
        <path d="M36 28C29 28 25 23 25 16S29 4 36 4C43 4 47 9 47 16S43 28 36 28ZM36 8C32 8 30 12 30 16S32 24 36 24C40 24 42 20 42 16S40 8 36 8Z" />
        <path d="M51 5H62C66 5 69 7 69 11C69 14 67 16 64 17L70 27H64L59 18H56V27H51V5ZM56 14H61C63 14 64 13 64 11C64 9 63 9 61 9H56V14Z" />
        <path d="M74 5H88V9H79V14H87V18H79V23H88V27H74V5Z" />
        <path d="M93 14H103V18H93V14Z" />
        <path d="M109 9V5H127V9H120V27H115V9H109Z" />
        <path d="M130 5H144V9H135V14H143V18H135V23H144V27H130V5Z" />
        <path d="M147 5H153L158 13L163 5H169L161 16L169 27H163L158 19L153 27H147L155 16L147 5Z" />
      </svg>
    ),
  },
  {
    name: "VIBRAM",
    category: "Arctic Grip Alpine Traction",
    badge: "ITALIAN OUTSOLES",
    logoSvg: (
      <svg viewBox="0 0 140 40" fill="currentColor" className="h-6 w-auto">
        <polygon points="10,5 130,5 120,35 0,35" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="65" y="24" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="3" fill="currentColor">
          VIBRAM
        </text>
      </svg>
    ),
  },
  {
    name: "POLARTEC",
    category: "Thermal Pro Fleece Insulation",
    badge: "BIO-ENGINEERED WARMTH",
    logoSvg: (
      <svg viewBox="0 0 160 36" fill="currentColor" className="h-5.5 w-auto">
        <polygon points="12,6 4,30 20,30" fill="currentColor" />
        <text x="90" y="24" textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="sans-serif" letterSpacing="4" fill="currentColor">
          POLARTEC
        </text>
      </svg>
    ),
  },
  {
    name: "TORAY",
    category: "Ultralight Japanese Technical Shells",
    badge: "TORAYDELFY™ 20K",
    logoSvg: (
      <svg viewBox="0 0 140 36" fill="currentColor" className="h-5.5 w-auto">
        <circle cx="14" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="14" cy="18" r="3" fill="currentColor" />
        <text x="80" y="24" textAnchor="middle" fontSize="17" fontWeight="800" fontFamily="sans-serif" letterSpacing="3" fill="currentColor">
          'TORAY'
        </text>
      </svg>
    ),
  },
  {
    name: "PERTEX",
    category: "Quantum Down-Proof Fabrics",
    badge: "DIAMOND FUSE",
    logoSvg: (
      <svg viewBox="0 0 150 36" fill="currentColor" className="h-5.5 w-auto">
        <path d="M6 18 L18 6 L30 18 L18 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="92" y="24" textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="sans-serif" letterSpacing="4" fill="currentColor">
          PERTEX®
        </text>
      </svg>
    ),
  },
  {
    name: "CORDURA",
    category: "Ballistic Durability Fabrics",
    badge: "ADVANCED FABRICS",
    logoSvg: (
      <svg viewBox="0 0 160 36" fill="currentColor" className="h-5.5 w-auto">
        <rect x="6" y="8" width="18" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="10" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" />
        <text x="94" y="24" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="4" fill="currentColor">
          CORDURA®
        </text>
      </svg>
    ),
  },
  {
    name: "PRIMALOFT",
    category: "Gold Eco Synthetic Insulation",
    badge: "THERMOPLUME",
    logoSvg: (
      <svg viewBox="0 0 170 36" fill="currentColor" className="h-5.5 w-auto">
        <circle cx="12" cy="18" r="7" fill="currentColor" />
        <text x="96" y="24" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="sans-serif" letterSpacing="3.5" fill="currentColor">
          PRIMALOFT®
        </text>
      </svg>
    ),
  },
  {
    name: "YKK",
    category: "Aquaguard Waterproof Fasteners",
    badge: "JAPANESE PRECISION",
    logoSvg: (
      <svg viewBox="0 0 110 36" fill="currentColor" className="h-6 w-auto">
        <rect x="4" y="6" width="102" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="55" y="24" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="4" fill="currentColor">
          YKK
        </text>
      </svg>
    ),
  },
  {
    name: "SSENSE",
    category: "Curated Global Stockist",
    badge: "EXCLUSIVE PARTNER",
    logoSvg: (
      <svg viewBox="0 0 140 36" fill="currentColor" className="h-5 w-auto">
        <text x="70" y="25" textAnchor="middle" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="6" fill="currentColor">
          SSENSE
        </text>
      </svg>
    ),
  },
  {
    name: "SELFRIDGES & CO",
    category: "Oxford Street London Flagship",
    badge: "OFFICIAL RETAILER",
    logoSvg: (
      <svg viewBox="0 0 200 36" fill="currentColor" className="h-5 w-auto">
        <text x="100" y="24" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="serif" letterSpacing="4" fill="currentColor">
          SELFRIDGES & CO
        </text>
      </svg>
    ),
  },
  {
    name: "HARRODS",
    category: "Knightsbridge Luxury Department",
    badge: "CURATED SELECTION",
    logoSvg: (
      <svg viewBox="0 0 150 36" fill="currentColor" className="h-5.5 w-auto">
        <text x="75" y="25" textAnchor="middle" fontSize="19" fontStyle="italic" fontWeight="700" fontFamily="serif" letterSpacing="3" fill="currentColor">
          Harrods
        </text>
      </svg>
    ),
  },
  {
    name: "DOVER STREET MARKET",
    category: "Global Concept Spaces",
    badge: "LONDON • GINZA • NYC",
    logoSvg: (
      <svg viewBox="0 0 240 36" fill="currentColor" className="h-4.5 w-auto">
        <text x="120" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="sans-serif" letterSpacing="4" fill="currentColor">
          DOVER STREET MARKET
        </text>
      </svg>
    ),
  },
];

export function WardrobeExactPartners() {
  // Duplicate array twice to ensure seamless continuous loop
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <section className="w-full bg-[#FFFFFF] py-10 sm:py-14 border-b border-[#F0F0F0] overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[0.68rem] font-mono tracking-widest uppercase text-[#555] font-semibold">
              Technical Material Partners & Curated Global Stockists
            </span>
          </div>
          <span className="text-2xs font-mono text-[#888]">
            Engineered with the world's leading alpine innovators
          </span>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Marquee Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 py-3 cursor-default">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              title={brand.name}
              className="group flex flex-col items-center justify-center shrink-0 space-y-1.5 text-neutral-500 hover:text-neutral-900 transition-colors duration-300 px-4"
            >
              <span className="sr-only">{brand.name}</span>
              <div className="transition-transform duration-300 group-hover:scale-105">
                {brand.logoSvg}
              </div>
              <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[0.58rem] font-mono tracking-widest uppercase text-neutral-600">
                  {brand.category}
                </span>
                {brand.badge && (
                  <span className="hidden md:inline-block text-[0.52rem] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {brand.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
