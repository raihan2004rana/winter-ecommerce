export interface WinterCollection {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  heroImage: string;
  temperatureTarget: string;
  productCount: number;
}

export const WINTER_COLLECTIONS: WinterCollection[] = [
  {
    id: "col-subzero",
    slug: "sub-zero-expedition",
    title: "Sub-Zero Expedition Series",
    eyebrow: "Tested to -35°C in Arctic Lapland",
    description: "850+ fill power RDS goose down garments paired with seam-sealed Japanese waterproof shells.",
    heroImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200",
    temperatureTarget: "-35°C to -15°C",
    productCount: 14,
  },
  {
    id: "col-cashmere",
    slug: "archival-cashmere",
    title: "Archival Cashmere & Merino",
    eyebrow: "Pure Natural Insulation",
    description: "Double-faced cashmere overcoats and dense circular-knit heavy sweaters crafted in Northern Italy.",
    heroImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1200",
    temperatureTarget: "-10°C to +5°C",
    productCount: 16,
  },
  {
    id: "col-shearling",
    slug: "the-shearling-archive",
    title: "The Shearling Footwear Archive",
    eyebrow: "Tuscan Calfskin & Vibram Arctic",
    description: "Hand-lasted boots lined with 18mm pure shearling for thermal protection on freezing terrain.",
    heroImage: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1200",
    temperatureTarget: "-25°C to 0°C",
    productCount: 8,
  },
];
