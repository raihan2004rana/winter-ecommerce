export interface ProductVariantColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: "all" | "waterproof" | "down" | "parkas" | "vests" | "boots" | "camping";
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  currency?: "USD" | "EUR" | "GBP" | "CAD";
  primaryImage: string;
  secondaryImage?: string;
  temperatureRating?: string;
  waterproofRating?: string;
  fillPower?: string;
  materials?: string[];
  stockWarning?: string;
  colorways: ProductVariantColor[];
  sizes: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isRestock?: boolean;
  isFlashSale?: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
}

export const REFERENCE_COLLECTION_PRODUCTS: Product[] = [
  {
    id: "ref-001",
    slug: "thermal-insulated-shell-coat-mint",
    title: "Thermal Insulated Shell Coat",
    subtitle: "Japanese technical ripstop in Glacial Mint with 750 fill down insulation",
    description: "Cold-weather technical puffer engineered with high-loft down and weather-resistant shell finish.",
    category: "down",
    categoryLabel: "Down Jackets",
    price: 249.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=900",
    secondaryImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-20°C Thermal",
    waterproofRating: "15,000mm DWR",
    fillPower: "750 Fill Power",
    colorways: [
      { name: "Glacial Mint", hex: "#7BB5B4" },
      { name: "Chocolate Brown", hex: "#543C32" },
      { name: "Alabaster White", hex: "#F3F0E8" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockCount: 8,
    rating: 4.9,
    reviewCount: 32,
  },
  {
    id: "ref-002",
    slug: "classic-winter-down-coat-brown",
    title: "Classic Winter Down Coat",
    subtitle: "Diamond quilt pattern with water-repellent nylon taffeta and lightweight down",
    description: "Classic diamond-quilted silhouette offering lightweight warmth and versatile cold-weather layering.",
    category: "down",
    categoryLabel: "Down Jackets",
    price: 349.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=900",
    secondaryImage: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-15°C Versatile",
    isRestock: true,
    colorways: [
      { name: "Sienna Brown", hex: "#7A4D3B" },
      { name: "Caramel", hex: "#B87A47" },
      { name: "Sage Green", hex: "#87A196" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stockCount: 5,
    rating: 4.85,
    reviewCount: 24,
  },
  {
    id: "ref-003",
    slug: "premium-down-parka-grey",
    title: "Premium Down Parka",
    subtitle: "850 Fill Power RDS down with storm-grade weatherproofing and dual taped zippers",
    description: "Expedition-level down parka built with waterproof storm hood and internal heat-trapping baffles.",
    category: "parkas",
    categoryLabel: "Parkas",
    price: 399.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=85&w=900",
    secondaryImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-30°C Sub-Zero",
    waterproofRating: "20,000mm GORE-TEX",
    fillPower: "850 Fill Goose Down",
    colorways: [
      { name: "Arctic Slate", hex: "#95A1AD" },
      { name: "Obsidian Black", hex: "#18191A" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isBestSeller: true,
    stockCount: 4,
    rating: 4.96,
    reviewCount: 48,
  },
  {
    id: "ref-004",
    slug: "thermal-insulated-shell-coat-brown",
    title: "Thermal Insulated Shell Coat",
    subtitle: "Matte chocolate shell with high collar and technical storm cuffs",
    description: "Sleek monochromatic hooded shell designed for harsh cold winds and wet snow conditions.",
    category: "waterproof",
    categoryLabel: "Waterproof Jackets",
    price: 279.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=85&w=900",
    secondaryImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-20°C Thermal",
    waterproofRating: "18,000mm DWR",
    colorways: [
      { name: "Deep Chocolate", hex: "#3B2E2A" },
      { name: "Forest Pine", hex: "#2B3D2E" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockCount: 11,
    rating: 4.88,
    reviewCount: 19,
  },
  {
    id: "ref-005",
    slug: "ultra-lightweight-down-jacket-white",
    title: "Ultra Lightweight Down Jacket",
    subtitle: "High-density micro-ripstop shell in snow ivory with ergonomic storm hood",
    description: "Engineered for maximum thermal retention per gram. Packable alpine shell with RDS certified down.",
    category: "down",
    categoryLabel: "Down Jackets",
    price: 249.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=900",
    secondaryImage: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-15°C Cold",
    waterproofRating: "DWR Finished",
    fillPower: "800 Fill Down",
    colorways: [
      { name: "Snow White", hex: "#F5F5F3" },
      { name: "Pewter Grey", hex: "#6D7278" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    stockCount: 9,
    rating: 4.92,
    reviewCount: 27,
  },
  {
    id: "ref-006",
    slug: "belted-longline-down-coat",
    title: "Belted Longline Down Coat",
    subtitle: "Full-length box-wall quilted coat with detachable storm belt and plush down collar",
    description: "Maxi-length down cocoon coat offering total body thermal insulation from head to ankle.",
    category: "parkas",
    categoryLabel: "Parkas",
    price: 359.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=85&w=900",
    secondaryImage: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-25°C Sub-Zero",
    isRestock: true,
    colorways: [
      { name: "Espresso Brown", hex: "#3A2924" },
      { name: "Onyx Black", hex: "#141517" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stockCount: 3,
    rating: 4.97,
    reviewCount: 41,
  },
  {
    id: "ref-007",
    slug: "alpine-shearling-insulated-boot",
    title: "Alpine Shearling Insulated Boot",
    subtitle: "Seam-sealed Italian calfskin with 18mm pure shearling and Vibram Arctic sole",
    description: "Designed for wet ice and deep powder with non-slip Arctic Grip technology.",
    category: "boots",
    categoryLabel: "Boots",
    price: 385.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-25°C Thermal",
    colorways: [
      { name: "Tuscan Tan", hex: "#9E6D38" },
      { name: "Coal Black", hex: "#111213" },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    stockCount: 6,
    rating: 4.91,
    reviewCount: 33,
  },
  {
    id: "ref-008",
    slug: "technical-quilted-winter-vest",
    title: "Technical Quilted Winter Vest",
    subtitle: "800 Fill Power Goose Down with high insulated collar",
    description: "Versatile alpine mid-layer engineered for core body heat retention.",
    category: "vests",
    categoryLabel: "Insulated Vests",
    price: 195.0,
    currency: "USD",
    primaryImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=900",
    temperatureRating: "-10°C Layer",
    colorways: [
      { name: "Alpine Pine", hex: "#2B3D2E" },
      { name: "Charcoal", hex: "#2B2D2F" },
    ],
    sizes: ["S", "M", "L", "XL"],
    stockCount: 10,
    rating: 4.8,
    reviewCount: 15,
  },
];

export const PRODUCTS_CATALOG: Product[] = REFERENCE_COLLECTION_PRODUCTS;

