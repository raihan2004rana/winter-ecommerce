"use client";

import * as React from "react";

interface PartnerBrand {
  name: string;
  logoSvg: React.ReactNode;
}

const FAMOUS_BRANDS: PartnerBrand[] = [
  {
    name: "The North Face",
    logoSvg: (
      <svg viewBox="0 0 155 36" fill="currentColor" className="h-7 w-auto">
        <text x="0" y="10" fontSize="9" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
          THE
        </text>
        <text x="0" y="21" fontSize="9" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
          NORTH
        </text>
        <text x="0" y="32" fontSize="9" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
          FACE
        </text>
        <g transform="translate(62, 0)">
          <path d="M28 32c10 0 18-8 18-18h-4.5c0 7.5-6 13.5-13.5 13.5V32z" />
          <path d="M35 32c13.5 0 24.5-11 24.5-24.5H55C55 18 46 27.5 35 27.5V32z" />
          <path d="M42 32c17 0 31-14 31-31H68C68 14 56.5 27.5 42 27.5V32z" />
        </g>
      </svg>
    ),
  },
  {
    name: "Arc'teryx",
    logoSvg: (
      <svg viewBox="0 0 170 36" fill="currentColor" className="h-7 w-auto">
        <g transform="translate(0, 0)">
          <path
            d="M18 4c-1.5 2.5-4 4-7 4.5 2 .8 4.2.8 6.2 0-1.8 2.2-4.5 3.5-7.5 3.8 2.5.4 5.2 0 7.5-1.2-1.5 2.8-4.2 4.8-7.5 5.5 2.8.1 5.5-.8 7.8-2.5-1 3.2-3.5 5.8-6.8 7 3-.2 5.8-1.5 8-3.5-.5 3.5-2.5 6.5-5.5 8.2 3.2-.5 6-2.2 8-4.8 0 3.8-1.8 7.2-4.5 9.2 3.5-.8 6.5-3 8.5-6.2.5 4-1 8-3.5 10.5 3.5-1.2 6.5-4 8.2-7.5 1 4-.2 8.2-2.5 11 3.5-1.5 6.2-4.8 7.8-8.5.5 2 1.5 4 3 5-1-2.5-1.2-5.5-.5-8 1.5 2.5 4 4.5 7 5.5-2-2-3-5-2.8-8 2 2 5 3.5 8 3.8-2.5-1.8-3.8-4.8-3.5-7.8 2.2 1.5 5 2.2 7.8 2-2.5-2-3.8-5-3.5-8 2.5 1 5.2 1.2 7.8.5-2.8-1.8-4.2-5-3.8-8.2 2.8.5 5.5 0 8-1.5-2.8-1.5-4.5-4.5-4.5-7.8 2.8 0 5.5-.8 7.8-2.2-2.5-1.2-4.5-3.8-4.8-6.8 2.8-.5 5.2-1.8 7-3.8-2.2-.8-4.2-2.5-5-5 2.5-.8 4.8-2.2 6.2-4.2"
            transform="scale(0.5) translate(4, 4)"
          />
          <text x="44" y="24" fontSize="16" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="4.5">
            ARC'TERYX
          </text>
        </g>
      </svg>
    ),
  },
  {
    name: "Nike",
    logoSvg: (
      <svg viewBox="0 0 95 34" fill="currentColor" className="h-6.5 w-auto">
        <path d="M92.7 5.4c-12.7 7.7-27.4 14.8-40.8 19.8-9.4 3.5-17.7 5.3-24.3 5.3-8.8 0-14.7-3.7-17-10.6-2.5-7.5.8-14.5 8.9-19 6.2-3.5 14.7-4.3 22.8-2.2 1.5.4 1.2 2.5-.4 2.6-9.1.5-16.8 3.1-20.9 7.3-3.6 3.7-4.4 7.6-2.2 11.2 2.6 4.3 8.3 6.1 15.7 5 6.6-1 14.6-4.5 23-9.5 13.5-8 26.6-17.5 34.6-22.3 2-1.2 4-.8 3.5 1.4-.7 3.3-1.9 7.3-2.9 11z" />
      </svg>
    ),
  },
  {
    name: "Patagonia",
    logoSvg: (
      <svg viewBox="0 0 160 36" fill="currentColor" className="h-7 w-auto">
        <path d="M4 16 L12 6 L20 14 L28 4 L38 16 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M12 6 L16 11 L24 11" stroke="currentColor" strokeWidth="1.5" />
        <text x="44" y="24" fontSize="20" fontWeight="700" fontFamily="'Georgia', serif" fontStyle="italic" letterSpacing="0.5">
          patagonia
        </text>
      </svg>
    ),
  },
  {
    name: "Moncler",
    logoSvg: (
      <svg viewBox="0 0 150 36" fill="currentColor" className="h-7.5 w-auto">
        <g transform="translate(2, 2)">
          <path d="M16 2c-4 5-8 12-8 19 0 7 4 11 8 11s8-4 8-11c0-7-4-14-8-19z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 10c-1.5 2-3 5-3 8 0 3 1.5 5 3 5s3-2 3-5c0-3-1.5-6-3-8z" fill="currentColor" />
          <path d="M16 4 L14 8 L18 8 Z" fill="currentColor" />
        </g>
        <text x="42" y="24" fontSize="16" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="4">
          MONCLER
        </text>
      </svg>
    ),
  },
  {
    name: "Canada Goose",
    logoSvg: (
      <svg viewBox="0 0 165 36" fill="currentColor" className="h-7.5 w-auto">
        <g transform="translate(4, 3)">
          <circle cx="15" cy="15" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
          <polygon points="15,6 17,15 15,24 13,15" fill="currentColor" />
        </g>
        <text x="44" y="17" fontSize="10.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">
          CANADA
        </text>
        <text x="44" y="30" fontSize="10.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">
          GOOSE®
        </text>
      </svg>
    ),
  },
  {
    name: "Stone Island",
    logoSvg: (
      <svg viewBox="0 0 160 36" fill="currentColor" className="h-7.5 w-auto">
        <g transform="translate(4, 3)">
          <circle cx="15" cy="15" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="15,4 17,13 26,15 17,17 15,26 13,17 4,15 13,13" fill="currentColor" />
          <circle cx="15" cy="15" r="2.5" fill="#FFF" />
        </g>
        <text x="44" y="17" fontSize="10.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2">
          STONE
        </text>
        <text x="44" y="30" fontSize="10.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2">
          ISLAND
        </text>
      </svg>
    ),
  },
  {
    name: "GORE-TEX",
    logoSvg: (
      <svg viewBox="0 0 150 36" fill="currentColor" className="h-7 w-auto">
        <g transform="translate(4, 3)">
          <polygon points="15,2 28,15 15,28 2,15" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="15,8 22,15 15,22 8,15" fill="currentColor" />
        </g>
        <text x="40" y="24" fontSize="16" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">
          GORE-TEX
        </text>
      </svg>
    ),
  },
  {
    name: "Salomon",
    logoSvg: (
      <svg viewBox="0 0 155 36" fill="currentColor" className="h-6.5 w-auto">
        <g transform="translate(2, 4)">
          <path d="M4 18c0-6 4-10 10-10h4v6h-4c-2 0-4 1-4 4s2 4 4 4h4c6 0 10 4 10 10s-4 10-10 10H4v-6h10c2 0 4-1 4-4s-2-4-4-4H8c-4 0-4-4-4-4z" transform="scale(0.65)" />
        </g>
        <text x="34" y="24" fontSize="17" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3.5">
          SALOMON
        </text>
      </svg>
    ),
  },
  {
    name: "Vibram",
    logoSvg: (
      <svg viewBox="0 0 130 36" fill="currentColor" className="h-7 w-auto">
        <polygon points="8,3 122,3 114,33 0,33" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="61" y="23" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">
          vibram
        </text>
      </svg>
    ),
  },
  {
    name: "Adidas",
    logoSvg: (
      <svg viewBox="0 0 130 36" fill="currentColor" className="h-7 w-auto">
        <g transform="translate(4, 5)">
          <polygon points="0,20 6,20 12,12 6,12" />
          <polygon points="8,20 14,20 22,7 16,7" />
          <polygon points="16,20 22,20 32,2 26,2" />
        </g>
        <text x="46" y="24" fontSize="17" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">
          adidas
        </text>
      </svg>
    ),
  },
  {
    name: "Prada",
    logoSvg: (
      <svg viewBox="0 0 135 36" fill="currentColor" className="h-7 w-auto">
        <polygon points="4,4 131,4 67.5,33" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="67.5" y="19" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="'Times New Roman', serif" letterSpacing="4">
          PRADA
        </text>
        <text x="67.5" y="28" textAnchor="middle" fontSize="6.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="2">
          MILANO
        </text>
      </svg>
    ),
  },
  {
    name: "Oakley",
    logoSvg: (
      <svg viewBox="0 0 135 36" fill="currentColor" className="h-7 w-auto">
        <ellipse cx="18" cy="18" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="3" />
        <ellipse cx="18" cy="18" rx="8" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="44" y="24" fontSize="16" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="3">
          OAKLEY
        </text>
      </svg>
    ),
  },
  {
    name: "Carhartt",
    logoSvg: (
      <svg viewBox="0 0 150 36" fill="currentColor" className="h-7 w-auto">
        <g transform="translate(2, 3)">
          <path d="M15 4c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12h-6c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c2 0 3.8 1 4.9 2.5l4.7-3.7C22.4 6 18.9 4 15 4z" />
          <path d="M15 13c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
        </g>
        <text x="42" y="23" fontSize="16" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.5">
          carhartt
        </text>
      </svg>
    ),
  },
];

interface DynamicPartner {
  id?: string;
  name: string;
  logoUrl?: string;
  logoSvg?: string | React.ReactNode;
  websiteUrl?: string;
}

export function WardrobeExactPartners() {
  const [partnerList, setPartnerList] = React.useState<DynamicPartner[]>(FAMOUS_BRANDS);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.status === "success" && Array.isArray(data.partners) && data.partners.length > 0) {
          setPartnerList(data.partners);
        }
      })
      .catch(() => {
        // keep default fallback brands
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Duplicate array for a completely seamless 60fps infinite loop
  const marqueeItems = [...partnerList, ...partnerList];

  return (
    <section className="w-full bg-[#FFFFFF] py-7 sm:py-9 border-b border-[#F0F0F0] overflow-hidden">
      {/* Infinite Seamless Scrolling Marquee Container with Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex items-center gap-14 sm:gap-20 py-1 cursor-default">
          {marqueeItems.map((brand, idx) => {
            const content = (
              <div
                title={brand.name}
                className="flex items-center justify-center shrink-0 text-neutral-400 hover:text-neutral-900 transition-all duration-300 transform hover:scale-110"
              >
                <span className="sr-only">{brand.name}</span>
                {typeof brand.logoSvg === "string" ? (
                  <div
                    className="[&>svg]:h-7 [&>svg]:w-auto [&>svg]:fill-current"
                    dangerouslySetInnerHTML={{ __html: brand.logoSvg }}
                  />
                ) : React.isValidElement(brand.logoSvg) ? (
                  brand.logoSvg
                ) : brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-7 w-auto max-w-[140px] object-contain brightness-0 opacity-40 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="font-bold tracking-widest text-xs uppercase font-mono">{brand.name}</span>
                )}
              </div>
            );

            if (brand.websiteUrl) {
              return (
                <a
                  key={`${brand.name}-${idx}`}
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 focus:outline-hidden"
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={`${brand.name}-${idx}`} className="shrink-0">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
