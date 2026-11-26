export interface ProductVariantColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  fitFeedback: "runs_small" | "true_to_size" | "runs_large";
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  gender: "men" | "women" | "unisex";
  category: "jackets-coats" | "sweaters-hoodies" | "boots-accessories";
  categoryLabel: string;
  collectionSlug?: "men" | "women" | "new-arrivals" | "sale" | "sub-zero";
  price: number;
  compareAtPrice?: number;
  currency?: "USD" | "EUR" | "GBP" | "CAD";
  primaryImage: string;
  secondaryImage?: string;
  galleryImages: string[];
  temperatureRating?: string;
  tempCelsiusMin?: number;
  tempCelsiusMax?: number;
  waterproofRating?: string;
  fillPower?: string;
  materials: string[];
  careInstructions: string;
  fitType: "Slim Fit" | "Regular Fit" | "Relaxed Layering" | "Expedition Fit";
  colorways: ProductVariantColor[];
  sizes: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isRestock?: boolean;
  isSale?: boolean;
  isFlashSale?: boolean;
  stockCount: number;
  stockWarning?: string;
  rating: number;
  reviewCount: number;
  reviews?: ProductReviewItem[];
}

export const PRODUCTS_CATALOG: Product[] = [
  // 1. Men's Down Parka
  {
    id: "prod-001",
    slug: "nordic-expedition-down-parka",
    title: "Nordic Expedition Down Parka",
    subtitle: "850 Fill Power Goose Down with 20,000mm Toray Waterproof Shell",
    description:
      "Constructed for extreme sub-zero conditions in northern climates. Features seamless ultrasonic baffles to eliminate cold spots, an insulated wire-brimmed storm hood, internal fleece handwarmer pockets, and heavy-duty two-way YKK Aquaguard zips.",
    gender: "men",
    category: "jackets-coats",
    categoryLabel: "Jackets & Coats",
    collectionSlug: "men",
    price: 685.0,
    compareAtPrice: 795.0,
    currency: "USD",
    primaryImage: "/images/products/nordic-expedition-down-parka-women2-1795661926691.webp",
    secondaryImage: "/images/products/nordic-expedition-down-parka-women1-1795661942412.webp",
    galleryImages: [
      "/images/products/nordic-expedition-down-parka-women1-1795661942412.webp",
      "/images/products/nordic-expedition-down-parka-women3-1795661947488.jpg",
    ],
    temperatureRating: "-30°C Sub-Zero",
    tempCelsiusMin: -30,
    tempCelsiusMax: -10,
    waterproofRating: "20,000mm DWR",
    fillPower: "850 Fill Goose Down",
    materials: ["100% Recycled Japanese Polyamide Shell", "90/10 RDS Certified Down", "Microfleece Thermal Lining"],
    careInstructions: "Specialist down dry clean only. Tumble dry delicate with tennis balls.",
    fitType: "Expedition Fit",
    colorways: [
      { name: "Obsidian Slate", hex: "#18191A" },
      { name: "Alpine Pine", hex: "#2B3D2E" },
      { name: "Glacial Frost", hex: "#768C9E" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
    isBestSeller: true,
    isSale: true,
    stockCount: 4,
    stockWarning: "Only 4 units remaining in Size L",
    rating: 4.95,
    reviewCount: 48,
    reviews: [
      {
        id: "r1",
        author: "Henrik L.",
        location: "Stockholm, Sweden",
        rating: 5,
        date: "November 2026",
        title: "Absolute masterclass in thermal warmth",
        comment: "Wore this at -25°C in northern Sweden during heavy snowfall. Not a hint of cold wind penetrated. The fleece pockets are brilliant.",
        fitFeedback: "true_to_size",
        verified: true,
      },
      {
        id: "r2",
        author: "Marc B.",
        location: "Montreal, Canada",
        rating: 5,
        date: "October 2026",
        title: "Warmest coat I have owned",
        comment: "Lighter than a Canada Goose parka yet significantly warmer due to the 850 fill down loft. True to European tailoring.",
        fitFeedback: "true_to_size",
        verified: true,
      },
    ],
  },

  // 2. Women's Longline Puffer
  {
    id: "prod-002",
    slug: "belted-longline-down-coat",
    title: "Belted Longline Down Cocoon Coat",
    subtitle: "Full-Length 800 Fill Power Down with Detachable Storm Belt",
    description:
      "A tailored maxi-length down coat designed for full-body thermal insulation from neck to mid-calf. Double-faced down baffles trap radiant heat, complemented by a plush down collar and storm cuffs.",
    gender: "women",
    category: "jackets-coats",
    categoryLabel: "Jackets & Coats",
    collectionSlug: "women",
    price: 549.0,
    compareAtPrice: 650.0,
    currency: "USD",
    primaryImage: "/images/products/belted-longline-down-cocoon-coata1-1795661977581.webp",
    secondaryImage: "/images/products/belted-longline-down-cocoon-coata2-1795661992101.webp",
    galleryImages: [
      "/images/products/belted-longline-down-cocoon-coata2-1795661992101.webp",
      "/images/products/belted-longline-down-cocoon-coata3-1795661998168.webp",
    ],
    temperatureRating: "-25°C Sub-Zero",
    waterproofRating: "15,000mm DWR",
    fillPower: "800 Fill Power",
    materials: ["Italian Matte Nylon Shell", "RDS Down Insulation", "Satin Interior Lining"],
    careInstructions: "Specialist cold dry clean.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Espresso Brown", hex: "#3A2924" },
      { name: "Onyx Black", hex: "#141517" },
      { name: "Raw Ecru", hex: "#EDE9E1" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    isBestSeller: true,
    isRestock: true,
    isSale: true,
    stockCount: 6,
    stockWarning: "Restocked for Winter 2026/27 Drop",
    rating: 4.96,
    reviewCount: 39,
  },

  // 3. Men's Cashmere Overcoat
  {
    id: "prod-003",
    slug: "tailored-double-faced-cashmere-overcoat",
    title: "Tailored Double-Faced Cashmere Overcoat",
    subtitle: "100% Grade-A Mongolian Cashmere • Horn Buttons",
    description:
      "Crafted from premium double-faced Mongolian cashmere for lightweight yet profound insulation. Designed to drape cleanly over suit tailoring or heavy winter knitwear.",
    gender: "men",
    category: "jackets-coats",
    categoryLabel: "Jackets & Coats",
    collectionSlug: "men",
    price: 890.0,
    compareAtPrice: 1100.0,
    currency: "USD",
    primaryImage: "/images/products/tailored-double-faced-cashmere-overcoat1-1795662014496.png",
    secondaryImage: "/images/products/tailored-double-faced-cashmere-overcoat2-1795662022090.jpg",
    galleryImages: [
      "/images/products/tailored-double-faced-cashmere-overcoat2-1795662022090.jpg",
      "/images/products/tailored-double-faced-cashmere-overcoat3-1795662026283.jpg",
    ],
    temperatureRating: "-12°C City Winter",
    materials: ["100% Grade-A Cashmere", "Natural Buffalo Horn Buttons"],
    careInstructions: "Luxury dry clean only.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Deep Charcoal", hex: "#1C1D1F" },
      { name: "Camel Melange", hex: "#B87A47" },
    ],
    sizes: ["46", "48", "50", "52", "54"],
    isNew: true,
    isSale: true,
    stockCount: 3,
    stockWarning: "Flash Sale • Save $210",
    rating: 5.0,
    reviewCount: 22,
  },

  // 4. Women's Mint Technical Puffer
  {
    id: "prod-004",
    slug: "thermal-insulated-shell-coat-mint",
    title: "Thermal Insulated Shell Coat",
    subtitle: "Japanese Ripstop in Glacial Mint with 750 Fill Down",
    description:
      "A modern boxy cropped down jacket with oversized baffles, fleece-lined pocket warmers, and a protective chimney collar.",
    gender: "women",
    category: "jackets-coats",
    categoryLabel: "Jackets & Coats",
    collectionSlug: "women",
    price: 249.0,
    currency: "USD",
    primaryImage: "/images/products/thermal-insulated-shell-coat1-1795662038525.avif",
    secondaryImage: "/images/products/thermal-insulated-shell-coat2-1795662043963.webp",
    galleryImages: [
      "/images/products/thermal-insulated-shell-coat2-1795662043963.webp",
      "/images/products/thermal-insulated-shell-coat3-1795662046895.webp",
    ],
    temperatureRating: "-20°C Thermal",
    waterproofRating: "15,000mm DWR",
    fillPower: "750 Fill Power",
    materials: ["Recycled Toray Polyamide", "RDS Goose Down"],
    careInstructions: "Machine wash delicate cold. Low tumble dry.",
    fitType: "Relaxed Layering",
    colorways: [
      { name: "Glacial Mint", hex: "#7BB5B4" },
      { name: "Snow Ivory", hex: "#F5F5F3" },
      { name: "Chocolate Brown", hex: "#543C32" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 31,
  },

  // 5. Heavyweight Merino Sweater
  {
    id: "prod-005",
    slug: "heavyweight-merino-cable-knit",
    title: "Heavyweight Merino Cable Knit Sweater",
    subtitle: "100% Virgin Tasmanian Merino Wool • 450 GSM",
    description:
      "Circular-knitted in Northern Italy using dense 450 GSM pure Tasmanian Merino wool. Features traditional honeycomb and rope cable motifs with shape-retaining ribbed collars.",
    gender: "unisex",
    category: "sweaters-hoodies",
    categoryLabel: "Sweaters & Hoodies",
    collectionSlug: "new-arrivals",
    price: 345.0,
    compareAtPrice: 395.0,
    currency: "USD",
    primaryImage: "/images/products/heavyweight-merino-cable-knit-sweater-1795664325211.avif",
    secondaryImage: "/images/products/heavyweight-merino-cable-knit-sweater2-1795664331805.jpg",
    galleryImages: [
      "/images/products/heavyweight-merino-cable-knit-sweater2-1795664331805.jpg",
      "/images/products/heavyweight-merino-cable-knit-sweater3-1795664339483.webp",
      "/images/products/heavyweight-merino-cable-knit-sweater4-1795664344694.jpg",
      "/images/products/heavyweight-merino-cable-knit-sweater5-1795664348611.webp",
    ],
    temperatureRating: "-15°C Mid-Layer",
    materials: ["100% Extra-fine Tasmanian Merino Wool"],
    careInstructions: "Hand wash cold with wool detergent. Dry flat.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Raw Ecru", hex: "#EDE9E1" },
      { name: "Highland Charcoal", hex: "#2B2D2F" },
      { name: "Alpine Pine", hex: "#2B3D2E" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    isBestSeller: true,
    isSale: true,
    stockCount: 14,
    rating: 4.89,
    reviewCount: 42,
  },

  // 6. Cashmere Turtleneck Sweater
  {
    id: "prod-006",
    slug: "cashmere-thermal-turtleneck",
    title: "Seamless Cashmere Thermal Turtleneck",
    subtitle: "Pure 2-Ply Mongolian Cashmere • Gauge 12",
    description:
      "Silky soft against bare skin, this seamless circular-knit turtleneck offers supreme insulation as an alpine base or elegant evening knit.",
    gender: "women",
    category: "sweaters-hoodies",
    categoryLabel: "Sweaters & Hoodies",
    collectionSlug: "women",
    price: 295.0,
    currency: "USD",
    primaryImage: "/images/products/seamless-cashmere-thermal-turtleneck-1795664472634.avif",
    secondaryImage: "/images/products/seamless-cashmere-thermal-turtleneck1-1795664485140.avif",
    galleryImages: [
      "/images/products/seamless-cashmere-thermal-turtleneck1-1795664485140.avif",
      "/images/products/seamless-cashmere-thermal-turtleneck2-1795664490247.webp",
      "/images/products/seamless-cashmere-thermal-turtleneck3-1795664493271.webp",
      "/images/products/seamless-cashmere-thermal-turtleneck4-1795664498079.webp",
    ],
    temperatureRating: "-10°C Base Layer",
    materials: ["100% Mongolian Cashmere 2-Ply"],
    careInstructions: "Hand wash cold. Dry flat.",
    fitType: "Slim Fit",
    colorways: [
      { name: "Oatmeal", hex: "#D8D2C5" },
      { name: "Obsidian", hex: "#18191A" },
    ],
    sizes: ["XS", "S", "M", "L"],
    isNew: true,
    stockCount: 7,
    rating: 4.94,
    reviewCount: 18,
  },

  // 7. Technical Polartec Fleece Hoodie
  {
    id: "prod-007",
    slug: "technical-polartec-thermal-hoodie",
    title: "Technical Polartec Thermal Zip Hoodie",
    subtitle: "High-Loft Thermal Pro Fleece • Reinforced Shell Panels",
    description:
      "A rugged technical fleece engineered for active winter sports and mountain approaches. Abrasion-resistant nylon panels shield shoulders from backpack wear.",
    gender: "men",
    category: "sweaters-hoodies",
    categoryLabel: "Sweaters & Hoodies",
    collectionSlug: "men",
    price: 225.0,
    compareAtPrice: 260.0,
    currency: "USD",
    primaryImage: "/images/products/technical-polartec-thermal-zip-hoodie-1795664627713.jxl",
    secondaryImage: "/images/products/technical-polartec-thermal-zip-hoodie1-1795664635118.jpg",
    galleryImages: [
      "/images/products/technical-polartec-thermal-zip-hoodie1-1795664635118.jpg",
      "/images/products/technical-polartec-thermal-zip-hoodie2-1795664638183.jpg",
      "/images/products/technical-polartec-thermal-zip-hoodie3-1795664642121.jpg",
      "/images/products/technical-polartec-thermal-zip-hoodie4-1795664644785.jxl",
    ],
    temperatureRating: "-10°C Mountain Mid-Layer",
    materials: ["Polartec Thermal Pro Fleece", "Cordura Nylon Shoulder Overlays"],
    careInstructions: "Machine wash cold. Do not use fabric softeners.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Slate Grey", hex: "#5C6570" },
      { name: "Spruce Forest", hex: "#2B3D2E" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isSale: true,
    stockCount: 10,
    rating: 4.84,
    reviewCount: 25,
  },

  // 8. Alpine Shearling Boots
  {
    id: "prod-008",
    slug: "alpine-shearling-lined-trekking-boot",
    title: "Alpine Shearling Lined Trekking Boot",
    subtitle: "Waterproof Tuscan Calfskin with Arctic Grip Vibram Outsole",
    description:
      "Hand-welted Italian leather exterior with full 18mm pure shearling lining down to the insole. The patented Vibram Arctic Grip lug sole provides maximum traction on wet ice.",
    gender: "unisex",
    category: "boots-accessories",
    categoryLabel: "Boots & Accessories",
    collectionSlug: "new-arrivals",
    price: 495.0,
    currency: "USD",
    primaryImage: "/images/products/alpine-shearling-lined-trekking-boot-1795664767917.webp",
    secondaryImage: "/images/products/alpine-shearling-lined-trekking-boot1-1795664773920.jpg",
    galleryImages: [
      "/images/products/alpine-shearling-lined-trekking-boot1-1795664773920.jpg",
      "/images/products/alpine-shearling-lined-trekking-boot2-1795664777234.webp",
      "/images/products/alpine-shearling-lined-trekking-boot3-1795664780366.jpg",
    ],
    temperatureRating: "-25°C Thermal Footwear",
    waterproofRating: "Fully Seam-Sealed",
    materials: ["Tuscan Waxed Full-Grain Calfskin", "100% Genuine Australian Shearling", "Vibram Arctic Grip Rubber"],
    careInstructions: "Condition with beeswax leather balm twice per season.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Tuscan Tan", hex: "#9E6D38" },
      { name: "Mineral Black", hex: "#111213" },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    isBestSeller: true,
    stockCount: 6,
    stockWarning: "Only 6 pairs remaining across sizes",
    rating: 4.95,
    reviewCount: 36,
  },

  // 9. Thistle-Brushed Cashmere Scarf
  {
    id: "prod-009",
    slug: "brushed-cashmere-ribbed-scarf",
    title: "Thistle-Brushed Pure Cashmere Scarf",
    subtitle: "220cm Length • Hand-Finished Raw Edges",
    description:
      "Woven from high-micron cashmere fibers that undergo a traditional thistle-brushing process for exceptional fluff and soft warmth without scratchiness.",
    gender: "unisex",
    category: "boots-accessories",
    categoryLabel: "Boots & Accessories",
    collectionSlug: "sale",
    price: 185.0,
    compareAtPrice: 220.0,
    currency: "USD",
    primaryImage: "/images/products/thistle-brushed-pure-cashmere-scarf-1795666928308.webp",
    secondaryImage: "/images/products/thistle-brushed-pure-cashmere-scarf1-1795666933710.webp",
    galleryImages: [
      "/images/products/thistle-brushed-pure-cashmere-scarf1-1795666933710.webp",
      "/images/products/thistle-brushed-pure-cashmere-scarf2-1795666936955.webp",
      "/images/products/thistle-brushed-pure-cashmere-scarf3-1795666940040.webp",
    ],
    temperatureRating: "-20°C Thermal Accessory",
    materials: ["100% Inner Mongolian Cashmere"],
    careInstructions: "Dry clean or hand wash cold.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Raw Ecru", hex: "#EDE9E1" },
      { name: "Alpine Pine", hex: "#2B3D2E" },
      { name: "Obsidian", hex: "#18191A" },
    ],
    sizes: ["One Size"],
    isBestSeller: true,
    isSale: true,
    stockCount: 16,
    rating: 4.97,
    reviewCount: 58,
  },

  // 10. Deerskin PrimaLoft Gloves
  {
    id: "prod-010",
    slug: "deerskin-thermal-primaloft-gloves",
    title: "Wild Deerskin PrimaLoft Gold Gloves",
    subtitle: "Supple American Deerskin • Touchscreen Compatible",
    description:
      "Naturally durable, buttery deerskin leather exterior with PrimaLoft Gold microfiber insulation and soft brushed Bemberg lining. Includes conductive leather fingertips.",
    gender: "unisex",
    category: "boots-accessories",
    categoryLabel: "Boots & Accessories",
    collectionSlug: "new-arrivals",
    price: 145.0,
    currency: "USD",
    primaryImage: "/images/products/gold-gloves-1795666688340.webp",
    secondaryImage: "/images/products/gold-gloves1-1795666694277.webp",
    galleryImages: [
      "/images/products/gold-gloves1-1795666694277.webp",
      "/images/products/gold-gloves2-1795666707328.webp",
      "/images/products/gold-gloves3-1795666710411.webp",
    ],
    temperatureRating: "-20°C Hand Warmth",
    materials: ["100% Wild Deerskin Leather", "PrimaLoft Gold Eco Microfiber", "Bemberg Lining"],
    careInstructions: "Leather balm conditioning.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Nutmeg Tan", hex: "#9E6D38" },
      { name: "Coal Black", hex: "#18191A" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stockCount: 12,
    rating: 4.92,
    reviewCount: 34,
  },

  // 11. GORE-TEX Alpine 3-Layer Hard Shell
  {
    id: "prod-011",
    slug: "glacier-3-layer-gore-alpine-shell",
    title: "Glacier 3-Layer GORE Alpine Shell",
    subtitle: "28,000mm Waterproof Membrane with Micro-Seam Taping",
    description:
      "Our most technical weather-defense jacket. Built to withstand blowing blizzards, freezing rain, and high mountain gusts. Features helmet-compatible storm hood and dual pit ventilation zips.",
    gender: "men",
    category: "jackets-coats",
    categoryLabel: "Jackets & Coats",
    collectionSlug: "men",
    price: 520.0,
    currency: "USD",
    primaryImage: "/images/products/glacier-3-layer-gore-alpine-shell-1795666825827.webp",
    secondaryImage: "/images/products/glacier-3-layer-gore-alpine-shell1-1795666830721.webp",
    galleryImages: [
      "/images/products/glacier-3-layer-gore-alpine-shell1-1795666830721.webp",
      "/images/products/glacier-3-layer-gore-alpine-shell2-1795666833754.webp",
      "/images/products/glacier-3-layer-gore-alpine-shell3-1795666836677.webp",
    ],
    temperatureRating: "Storm Armor (Wind/Rain/Snow)",
    waterproofRating: "28,000mm GORE-TEX Pro",
    materials: ["3-Layer Recycled GORE-TEX Pro", "YKK Aquaguard Zips"],
    careInstructions: "Machine wash warm with technical liquid detergent.",
    fitType: "Expedition Fit",
    colorways: [
      { name: "Arctic Slate", hex: "#95A1AD" },
      { name: "Spruce Forest", hex: "#2B3D2E" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
    stockCount: 7,
    rating: 4.95,
    reviewCount: 29,
  },

  // 12. Quilted Goose Down Vest
  {
    id: "prod-012",
    slug: "sub-zero-quilted-down-vest",
    title: "Sub-Zero Quilted Down Vest",
    subtitle: "800 Fill Power Goose Down with Stand Collar",
    description:
      "A versatile winter mid-layer providing core warmth without arm restriction. Japanese matte nylon exterior with two-way front zip and hidden zip waist pockets.",
    gender: "unisex",
    category: "jackets-coats",
    categoryLabel: "Jackets & Coats",
    collectionSlug: "sale",
    price: 295.0,
    compareAtPrice: 350.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200",
    secondaryImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200",
    galleryImages: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=1200",
    ],
    temperatureRating: "-15°C Versatile Core Layer",
    fillPower: "800 Fill Down",
    materials: ["Japanese Micro-Taffeta Nylon", "90/10 RDS Goose Down"],
    careInstructions: "Machine wash delicate cold. Low tumble dry with tennis balls.",
    fitType: "Regular Fit",
    colorways: [
      { name: "Alpine Pine", hex: "#2B3D2E" },
      { name: "Charcoal Slate", hex: "#2B2D2F" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    isSale: true,
    stockCount: 5,
    stockWarning: "Only 5 units remaining in stock",
    rating: 4.83,
    reviewCount: 21,
  },
];

export const REFERENCE_COLLECTION_PRODUCTS = PRODUCTS_CATALOG;

// ==========================================
// DOMAIN QUERY HELPERS
// ==========================================

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS_CATALOG.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const current = PRODUCTS_CATALOG.find((p) => p.id === currentId);
  if (!current) return PRODUCTS_CATALOG.slice(0, limit);

  return PRODUCTS_CATALOG
    .filter((p) => p.id !== currentId && (p.category === current.category || p.gender === current.gender))
    .slice(0, limit);
}

export interface FilterParams {
  category?: string;
  gender?: string;
  collection?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "popularity" | "price-asc" | "price-desc" | "newest" | "rating";
  searchQuery?: string;
}

export function filterCatalog(params: FilterParams): Product[] {
  let result = [...PRODUCTS_CATALOG];

  if (params.searchQuery && params.searchQuery.trim()) {
    const q = params.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q)) ||
        (p.temperatureRating && p.temperatureRating.toLowerCase().includes(q))
    );
  }

  if (params.category && params.category !== "all") {
    result = result.filter((p) => p.category === params.category);
  }

  if (params.gender && params.gender !== "all") {
    result = result.filter((p) => p.gender === params.gender || p.gender === "unisex");
  }

  if (params.collection && params.collection !== "all") {
    if (params.collection === "new-arrivals") {
      result = result.filter((p) => p.isNew);
    } else if (params.collection === "sale") {
      result = result.filter((p) => p.isSale || (p.compareAtPrice && p.compareAtPrice > p.price));
    } else if (params.collection === "men") {
      result = result.filter((p) => p.gender === "men" || p.gender === "unisex");
    } else if (params.collection === "women") {
      result = result.filter((p) => p.gender === "women" || p.gender === "unisex");
    }
  }

  if (params.size && params.size !== "all") {
    result = result.filter((p) => p.sizes.includes(params.size as string));
  }

  if (params.color && params.color !== "all") {
    result = result.filter((p) =>
      p.colorways.some((c) => c.name.toLowerCase().includes((params.color as string).toLowerCase()))
    );
  }

  if (typeof params.minPrice === "number") {
    result = result.filter((p) => p.price >= (params.minPrice as number));
  }

  if (typeof params.maxPrice === "number") {
    result = result.filter((p) => p.price <= (params.maxPrice as number));
  }

  if (params.inStockOnly) {
    result = result.filter((p) => p.stockCount > 0);
  }

  // Sorting
  switch (params.sortBy) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
    default:
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return result;
}
