export interface ProductVariantColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: "outerwear" | "knitwear" | "footwear" | "accessories" | "expedition";
  categoryLabel: string;
  collection: "sub-zero" | "cashmere" | "transit" | "shearling";
  price: number;
  compareAtPrice?: number;
  currency: "USD" | "EUR" | "GBP" | "CAD";
  primaryImage: string;
  secondaryImage: string;
  galleryImages: string[];
  temperatureRating?: string;
  tempCelsiusMin?: number;
  tempCelsiusMax?: number;
  waterproofRating?: string;
  fillPower?: string;
  materials: string[];
  careInstructions: string;
  colorways: ProductVariantColor[];
  sizes: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  stockCount: number;
  stockWarning?: string;
  rating: number;
  reviewCount: number;
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: "prod-001",
    slug: "nordic-expedition-down-parka",
    title: "Nordic Expedition Down Parka",
    subtitle: "850 Fill Power Goose Down with 20,000mm Toray Waterproof Shell",
    description:
      "Engineered for sub-zero Arctic excursions and biting urban winters. Features seamless baffle construction to prevent cold spots, an insulated storm hood with wire brim, and internal fleece-lined handwarmer pockets.",
    category: "outerwear",
    categoryLabel: "Down Parkas",
    collection: "sub-zero",
    price: 685,
    compareAtPrice: 795,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-30°C Sub-Zero",
    tempCelsiusMin: -30,
    tempCelsiusMax: -10,
    waterproofRating: "20,000mm DWR",
    fillPower: "850 Fill Goose Down",
    materials: ["100% Recycled Japanese Polyamide", "90/10 RDS Goose Down", "Microfleece Lining"],
    careInstructions: "Specialist down clean only. Tumble dry low with down balls.",
    colorways: [
      { name: "Obsidian Slate", hex: "#18191A", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1000" },
      { name: "Alpine Pine", hex: "#2B3D2E", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000" },
      { name: "Glacial Frost", hex: "#768C9E", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    isNew: true,
    isBestSeller: true,
    stockCount: 4,
    stockWarning: "Only 4 units remaining in Size L",
    rating: 4.95,
    reviewCount: 48,
  },
  {
    id: "prod-002",
    slug: "heavyweight-merino-cable-knit",
    title: "Heavyweight Merino Cable Knit",
    subtitle: "Pure 100% Tasmanian Merino Wool • 450 GSM",
    description:
      "Knit on circular looms in Northern Italy with natural moisture-wicking and odor-resistant properties. High-density ribbed collar, cuffs, and hem engineered for lasting shape retention.",
    category: "knitwear",
    categoryLabel: "Knitwear & Sweaters",
    collection: "cashmere",
    price: 345,
    compareAtPrice: 395,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-15°C Mid-Layer",
    tempCelsiusMin: -15,
    tempCelsiusMax: 5,
    fillPower: "450 GSM Virgin Wool",
    materials: ["100% Extra-fine Tasmanian Merino Wool"],
    careInstructions: "Hand wash cold inside out with wool detergent. Dry flat.",
    colorways: [
      { name: "Raw Ecru", hex: "#EDE9E1", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1000" },
      { name: "Highland Charcoal", hex: "#2B2D2F", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isBestSeller: true,
    stockCount: 12,
    rating: 4.88,
    reviewCount: 36,
  },
  {
    id: "prod-003",
    slug: "alpine-shearling-boot",
    title: "Alpine Shearling Lined Trekking Boot",
    subtitle: "Waterproof Tuscan Calfskin with Arctic Grip Vibram Outsole",
    description:
      "Fully seam-sealed waterproof leather upper with dense 18mm Australian shearling lining down through the insole. Provides traction on wet black ice and frozen trails.",
    category: "footwear",
    categoryLabel: "Winter Boots",
    collection: "shearling",
    price: 495,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-25°C Thermal Footwear",
    waterproofRating: "Fully Seam-Sealed",
    materials: ["Full-Grain Waxed Calfskin", "100% Genuine Shearling", "Vibram Arctic Grip Sole"],
    careInstructions: "Condition with beeswax balsam once per season.",
    colorways: [
      { name: "Tuscan Tan", hex: "#9E6D38", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1000" },
      { name: "Black Coal", hex: "#111213", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    isBestSeller: true,
    stockCount: 6,
    stockWarning: "Limited run of 150 pairs worldwide",
    rating: 4.92,
    reviewCount: 29,
  },
  {
    id: "prod-004",
    slug: "tailored-cashmere-overcoat",
    title: "Tailored Double-Faced Cashmere Overcoat",
    subtitle: "100% Mongolian Cashmere • Hand-Stitched Horn Buttons",
    description:
      "Unconstructed luxury tailored silhouette. Double-faced weaving provides dual-layer insulation without lining weight. Designed to layer effortlessly over knitwear or a tailored suit.",
    category: "outerwear",
    categoryLabel: "Tailored Coats",
    collection: "cashmere",
    price: 890,
    compareAtPrice: 1100,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-10°C City Winter",
    materials: ["100% Grade-A Mongolian Cashmere", "Natural Buffalo Horn Buttons"],
    careInstructions: "Specialist luxury dry clean only.",
    colorways: [
      { name: "Oatmeal Melange", hex: "#D8D2C5", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000" },
      { name: "Deep Charcoal", hex: "#1C1D1F", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["46", "48", "50", "52", "54"],
    isNew: true,
    isFlashSale: true,
    flashSaleEndsAt: "2026-12-05T23:59:59Z",
    stockCount: 3,
    stockWarning: "Flash Sale • Save $210 for next 48 hours",
    rating: 5.0,
    reviewCount: 17,
  },
  {
    id: "prod-005",
    slug: "glacier-waterproof-shell-jacket",
    title: "Glacier 3-Layer GORE Alpine Shell",
    subtitle: "28,000mm Waterproof Membrane with Micro-Seam Taping",
    description:
      "Our most technical hard shell jacket. Built for storm-force winds, blowing snow, and freezing precipitation. Dual pit zips allow rapid ventilation during high output ascents.",
    category: "expedition",
    categoryLabel: "Alpine Hard Shells",
    collection: "transit",
    price: 520,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "Windproof & Storm Armor",
    waterproofRating: "28,000mm Hydrostatic",
    materials: ["3-Layer Recycled GORE-TEX Pro", "YKK Aquaguard Zippers"],
    careInstructions: "Machine wash warm with technical cleaner. Re-apply DWR spray as needed.",
    colorways: [
      { name: "Glacial Ice", hex: "#768C9E", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000" },
      { name: "Spruce Forest", hex: "#2B3D2E", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: "prod-006",
    slug: "brushed-cashmere-ribbed-scarf",
    title: "Brushed Cashmere Ribbed Scarf",
    subtitle: "220cm Length • Hand-Finished Raw Edges",
    description:
      "Woven from high-micron cashmere fibers that undergo a gentle thistle-brushing process for exceptional fluff and warmth without scratchiness against sensitive skin.",
    category: "accessories",
    categoryLabel: "Scarves & Gloves",
    collection: "cashmere",
    price: 185,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-20°C Thermal Accessory",
    materials: ["100% Inner Mongolian Cashmere"],
    careInstructions: "Dry clean or hand wash cold.",
    colorways: [
      { name: "Raw Ecru", hex: "#EDE9E1", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000" },
      { name: "Pine Green", hex: "#2B3D2E", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=1000" },
      { name: "Obsidian", hex: "#18191A", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["One Size"],
    isBestSeller: true,
    stockCount: 15,
    rating: 4.96,
    reviewCount: 54,
  },
  {
    id: "prod-007",
    slug: "sub-zero-quilted-down-vest",
    title: "Sub-Zero Quilted Down Vest",
    subtitle: "800 Fill Power • Japanese Matte Nylon",
    description:
      "A versatile cold-weather layering essential. Lightweight warmth featuring RDS goose down, a high insulated stand collar, and a dual two-way front zip for temperature regulation.",
    category: "outerwear",
    categoryLabel: "Vests & Mid-Layers",
    collection: "sub-zero",
    price: 295,
    compareAtPrice: 350,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-15°C Versatile Layer",
    fillPower: "800 Fill Goose Down",
    materials: ["Recycled Matte Polyamide", "90/10 RDS Goose Down"],
    careInstructions: "Machine wash delicate cold. Tumble dry with tennis balls.",
    colorways: [
      { name: "Alpine Pine", hex: "#2B3D2E", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000" },
      { name: "Charcoal Slate", hex: "#2B2D2F", image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isFlashSale: true,
    flashSaleEndsAt: "2026-12-05T23:59:59Z",
    stockCount: 5,
    stockWarning: "Only 5 pieces remaining",
    rating: 4.82,
    reviewCount: 19,
  },
  {
    id: "prod-008",
    slug: "deerskin-thermal-primaloft-gloves",
    title: "Deerskin Thermal PrimaLoft Gloves",
    subtitle: "Supple American Deerskin • PrimaLoft Gold Insulation",
    description:
      "Naturally durable, buttery deerskin leather exterior with PrimaLoft Gold microfiber insulation and soft brushed Bemberg lining. Touchscreen-compatible thumb and index finger pads.",
    category: "accessories",
    categoryLabel: "Scarves & Gloves",
    collection: "transit",
    price: 145,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    secondaryImage:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000",
    galleryImages: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    ],
    temperatureRating: "-20°C Hand Warmth",
    materials: ["100% Wild Deerskin Leather", "PrimaLoft Gold Eco Microfiber"],
    careInstructions: "Leather balm conditioning.",
    colorways: [
      { name: "Nutmeg Brown", hex: "#9E6D38", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" },
      { name: "Obsidian", hex: "#18191A", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stockCount: 9,
    rating: 4.91,
    reviewCount: 31,
  },
];
