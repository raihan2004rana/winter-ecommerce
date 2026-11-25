export interface WinterCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  itemCount: number;
  imageUrl: string;
  featuredSubcategories: string[];
}

export const WINTER_CATEGORIES: WinterCategory[] = [
  {
    id: "cat-outerwear",
    slug: "outerwear",
    name: "Down Parkas & Coats",
    tagline: "Sub-zero thermal armor and tailored wool silhouettes.",
    itemCount: 24,
    imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800",
    featuredSubcategories: ["Down Parkas", "Tailored Wool Overcoats", "Ski Shells", "Quilted Vests"],
  },
  {
    id: "cat-knitwear",
    slug: "knitwear",
    name: "Knitwear & Cashmere",
    tagline: "100% Mongolian Cashmere and heavy-gauge Merino knits.",
    itemCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
    featuredSubcategories: ["Cable Knits", "Turtlenecks", "Cardigans", "Thermal Mid-Layers"],
  },
  {
    id: "cat-footwear",
    slug: "footwear",
    name: "Winter Boots",
    tagline: "Shearling-lined calfskin with Arctic Grip Vibram outsoles.",
    itemCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800",
    featuredSubcategories: ["Alpine Trekking Boots", "Shearling Boots", "Waterproof Chelsea Boots"],
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Cold-Weather Accessories",
    tagline: "Brushed cashmere scarves, deerskin gloves, and thermal beanies.",
    itemCount: 30,
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800",
    featuredSubcategories: ["Cashmere Scarves", "PrimaLoft Gloves", "Merino Beanies", "Balaclavas"],
  },
];
