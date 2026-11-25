"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationBar } from "@/components/design-system/navigation-bar";
import {
  EditorialPortraitCard,
  MinimalGridCard,
  HorizontalStoryCard,
  ProductData,
} from "@/components/design-system/product-card";
import {
  CampaignHeroBanner,
  SplitCraftBanner,
  MinimalShippingRibbon,
} from "@/components/design-system/editorial-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Sample Editorial Garments
const sampleProducts: ProductData[] = [
  {
    id: "prod-1",
    title: "Nordic Expedition Down Parka",
    subtitle: "Constructed with 850 fill-power goose down and a 20,000mm weather-resistant Japanese shell.",
    category: "Outerwear",
    price: 685,
    compareAtPrice: 795,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800",
    secondaryImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    temperatureRating: "-30°C Sub-Zero",
    waterproofRating: "20,000mm DWR",
    fillPower: "850 Fill Down",
    colorways: [
      { name: "Obsidian Slate", hex: "#18191A" },
      { name: "Alpine Pine", hex: "#2B3D2E" },
      { name: "Glacial Frost", hex: "#768C9E" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stockWarning: "Only 2 left in Size M",
  },
  {
    id: "prod-2",
    title: "Heavyweight Merino Cable Knit",
    subtitle: "Spun from 100% fine Tasmanian Merino wool for natural thermal insulation and moisture regulation.",
    category: "Knitwear",
    price: 345,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
    secondaryImage:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    temperatureRating: "-10°C Mid-Layer",
    fillPower: "450 GSM Wool",
    colorways: [
      { name: "Raw Ecru", hex: "#EDE9E1" },
      { name: "Highland Charcoal", hex: "#2B2D2F" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "prod-3",
    title: "Alpine Shearling Lined Trekking Boot",
    subtitle: "Hand-welted Italian leather with natural shearling insulation and non-slip Vibram Arctic ice outsole.",
    category: "Footwear",
    price: 495,
    currency: "USD",
    primaryImage:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800",
    secondaryImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    temperatureRating: "-20°C Thermal",
    waterproofRating: "Seam-Sealed",
    colorways: [
      { name: "Tuscan Tan", hex: "#9E6D38" },
      { name: "Mineral Black", hex: "#111213" },
    ],
    sizes: ["40", "41", "42", "43", "44"],
  },
];

export default function DesignSystemPage() {
  const [activeCurrency, setActiveCurrency] = React.useState<"USD" | "EUR" | "GBP" | "CAD">("USD");
  const [cartCount, setCartCount] = React.useState(2);

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans">
      {/* 1. Navigation System Component */}
      <NavigationBar
        cartItemCount={cartCount}
        activeCurrency={activeCurrency}
        onCurrencyChange={(curr) => setActiveCurrency(curr)}
        onOpenCart={() => alert("Mini-Cart Drawer Triggered")}
      />

      {/* Top Banner Ribbon */}
      <MinimalShippingRibbon currentProgress={160} targetProgress={200} />

      {/* Page Header */}
      <header className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 pb-12 border-b border-canvas-muted">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="editorial-caps text-forest font-semibold">
              Design System Specification • v1.0.0
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-charcoal">
              Nordic Alpine Visual Architecture
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-xl leading-relaxed">
              Quiet luxury aesthetic tailored for high-ticket winter apparel. Features warm off-white canvas,
              tactile charcoal typography, muted evergreen accents, glacial secondary tones, and sharp architectural proportions.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Storefront
              </Button>
            </Link>
            <Button
              variant="forest"
              size="sm"
              onClick={() => setCartCount((prev) => prev + 1)}
            >
              Test Bag Counter (+1)
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-24">
        {/* SECTION 1: COLOR TOKENS */}
        <section id="colors" className="space-y-8">
          <div className="space-y-1">
            <span className="editorial-caps text-charcoal-500">System Foundation</span>
            <h2 className="font-serif text-2xl text-charcoal font-normal">
              1. Color Token Hierarchy
            </h2>
            <p className="text-xs text-charcoal-600">
              Organic, natural winter color palette avoiding artificial neon tones or cold sterile greys.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Canvas DEFAULT */}
            <div className="space-y-2">
              <div className="h-24 w-full bg-canvas border border-charcoal/20 shadow-sm rounded-none" />
              <div className="text-2xs font-mono">
                <span className="font-semibold block text-charcoal">canvas.DEFAULT</span>
                <span className="text-charcoal-500">#FAF9F5 (Chalk)</span>
              </div>
            </div>

            {/* Canvas Subtle */}
            <div className="space-y-2">
              <div className="h-24 w-full bg-canvas-subtle border border-canvas-muted rounded-none" />
              <div className="text-2xs font-mono">
                <span className="font-semibold block text-charcoal">canvas.subtle</span>
                <span className="text-charcoal-500">#F4F2EC (Raw Linen)</span>
              </div>
            </div>

            {/* Charcoal DEFAULT */}
            <div className="space-y-2">
              <div className="h-24 w-full bg-charcoal rounded-none" />
              <div className="text-2xs font-mono">
                <span className="font-semibold block text-charcoal">charcoal.DEFAULT</span>
                <span className="text-charcoal-500">#18191A (Obsidian)</span>
              </div>
            </div>

            {/* Forest DEFAULT */}
            <div className="space-y-2">
              <div className="h-24 w-full bg-forest rounded-none" />
              <div className="text-2xs font-mono">
                <span className="font-semibold block text-charcoal">forest.DEFAULT</span>
                <span className="text-charcoal-500">#2B3D2E (Spruce Pine)</span>
              </div>
            </div>

            {/* Ice Frost */}
            <div className="space-y-2">
              <div className="h-24 w-full bg-ice-frost border border-ice-soft rounded-none" />
              <div className="text-2xs font-mono">
                <span className="font-semibold block text-charcoal">ice.frost</span>
                <span className="text-charcoal-500">#E4EDF3 (Glacial Mist)</span>
              </div>
            </div>

            {/* Alpine Amber */}
            <div className="space-y-2">
              <div className="h-24 w-full bg-alpine-amber rounded-none" />
              <div className="text-2xs font-mono">
                <span className="font-semibold block text-charcoal">alpine.amber</span>
                <span className="text-charcoal-500">#9E6D38 (Raw Amber)</span>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* SECTION 2: TYPOGRAPHY SCALE */}
        <section id="typography" className="space-y-8">
          <div className="space-y-1">
            <span className="editorial-caps text-charcoal-500">Scale & Legibility</span>
            <h2 className="font-serif text-2xl text-charcoal font-normal">
              2. Editorial Typography Scale
            </h2>
            <p className="text-xs text-charcoal-600">
              Balanced pairing of classical editorial serifs for hero narratives with high-density grotesques and tabular monospace for technical specifications.
            </p>
          </div>

          <div className="space-y-6 bg-canvas-subtle p-6 sm:p-10 border border-canvas-muted">
            <div className="space-y-1 border-b border-canvas-muted pb-4">
              <span className="text-2xs font-mono text-charcoal-500">Display Hero (Playfair Display 72px)</span>
              <p className="font-serif text-4xl sm:text-display-lg font-normal text-charcoal tracking-tight">
                High Cold Archival Parkas
              </p>
            </div>

            <div className="space-y-1 border-b border-canvas-muted pb-4">
              <span className="text-2xs font-mono text-charcoal-500">Section Header (Playfair Display 36px)</span>
              <p className="font-serif text-2xl sm:text-display-sm font-normal text-charcoal">
                Engineered for Sub-Zero -30°C Thermal Equilibrium
              </p>
            </div>

            <div className="space-y-1 border-b border-canvas-muted pb-4">
              <span className="text-2xs font-mono text-charcoal-500">Product Title (Inter Medium 20px)</span>
              <p className="text-xl font-medium tracking-tight text-charcoal">
                Expedition Goose Down Arctic Shell • 850 Fill Power
              </p>
            </div>

            <div className="space-y-1 border-b border-canvas-muted pb-4">
              <span className="text-2xs font-mono text-charcoal-500">Body & Garment Narrative (Inter Regular 15px)</span>
              <p className="text-base text-charcoal-700 leading-relaxed max-w-3xl">
                Precision Japanese micro-ripstop shell treated with a non-fluorinated durable water repellent (DWR) coating. 
                Internally baffled to eliminate cold bridging across the chest, shoulders, and spine during stationary alpine bivouacs.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-2xs font-mono text-charcoal-500">Tabular Specifications & Pricing (JetBrains Mono 14px)</span>
              <p className="font-mono text-sm text-charcoal tracking-wide">
                SKU: VALLIS-PK-850-BLK • WEIGHT: 1,120G • FILL: 90/10 RDS • $685.00 USD
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* SECTION 3: BUTTONS & FORM ELEMENTS */}
        <section id="buttons" className="space-y-8">
          <div className="space-y-1">
            <span className="editorial-caps text-charcoal-500">Tactile Interactions</span>
            <h2 className="font-serif text-2xl text-charcoal font-normal">
              3. Buttons & Architectural Form Elements
            </h2>
            <p className="text-xs text-charcoal-600">
              Sharp, deliberate geometry without playful pill roundings or neon hover states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons Showcase */}
            <Card className="p-6 space-y-6">
              <CardTitle>Button Variations</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Charcoal</Button>
                <Button variant="forest">Spruce Forest</Button>
                <Button variant="outline">Hairline Outline</Button>
                <Button variant="secondary">Linen Secondary</Button>
                <Button variant="ice">Glacial Ice</Button>
                <Button variant="ghost">Ghost Trigger</Button>
                <Button variant="link">Underline Editorial Link</Button>
              </div>

              <div className="pt-4 border-t border-canvas-muted flex items-center space-x-3">
                <Button variant="primary" size="sm">Small (36px)</Button>
                <Button variant="primary" size="default">Default (44px)</Button>
                <Button variant="primary" size="lg">Large (52px)</Button>
              </div>
            </Card>

            {/* Inputs Showcase */}
            <Card className="p-6 space-y-6">
              <CardTitle>Editorial Form Inputs</CardTitle>
              <div className="space-y-4">
                <Input
                  label="Shipping Destination Email"
                  placeholder="name@domain.com"
                  defaultValue="raihan@vallis-ore.com"
                />
                <Input
                  label="Postal / Postal Code (ISO-2 Format)"
                  placeholder="e.g. 10001, SW1A 1AA, 75001"
                />
                <Input
                  label="International Tax Identification Number"
                  placeholder="GB123456789 or DE123456789"
                  error="Please enter a valid EU / UK VAT number format"
                />
              </div>
            </Card>
          </div>
        </section>

        <Separator />

        {/* SECTION 4: TECHNICAL GARMENT BADGES */}
        <section id="badges" className="space-y-8">
          <div className="space-y-1">
            <span className="editorial-caps text-charcoal-500">Micro-Signaling</span>
            <h2 className="font-serif text-2xl text-charcoal font-normal">
              4. Technical Garment Badges
            </h2>
            <p className="text-xs text-charcoal-600">
              Discreet indicators communicating thermal limits, certifications, and inventory pressure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-6 bg-canvas-subtle border border-canvas-muted">
            <Badge variant="temp">-30°C Sub-Zero Alpine</Badge>
            <Badge variant="temp">-15°C Cold Transit</Badge>
            <Badge variant="waterproof">20,000mm Hydrostatic Head</Badge>
            <Badge variant="waterproof">DWR 3-Layer GORE-TEX Grade</Badge>
            <Badge variant="sustainability">100% RDS Certified Down</Badge>
            <Badge variant="sustainability">100% Recycled Polyamide</Badge>
            <Badge variant="warning">Only 2 Units Remaining</Badge>
            <Badge variant="neutral">New Season Drop</Badge>
            <Badge variant="outline">Handcrafted in Italy</Badge>
          </div>
        </section>

        <Separator />

        {/* SECTION 5: PRODUCT CARD VARIATIONS */}
        <section id="cards" className="space-y-10">
          <div className="space-y-1">
            <span className="editorial-caps text-charcoal-500">Commerce Merchandising</span>
            <h2 className="font-serif text-2xl text-charcoal font-normal">
              5. Product Card Variations
            </h2>
            <p className="text-xs text-charcoal-600">
              Three carefully engineered card treatments for catalog browsing, lookbook curation, and technical storytelling.
            </p>
          </div>

          {/* Sub-section: Variation 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-charcoal">
                Variation A: The Editorial Portrait Card (3:4 Ratio with Lifestyle Cross-fade & Quick Add)
              </h3>
              <span className="text-2xs font-mono text-charcoal-500">Primary Storefront PLP</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleProducts.map((p) => (
                <EditorialPortraitCard
                  key={p.id}
                  product={p}
                  onQuickAdd={(size) => alert(`Added ${p.title} (Size: ${size}) to shopping bag`)}
                />
              ))}
            </div>
          </div>

          {/* Sub-section: Variation 2 */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-charcoal">
                Variation B: Minimalist Grid Card
              </h3>
              <span className="text-2xs font-mono text-charcoal-500">High-Density Multi-Category Grid</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {sampleProducts.map((p) => (
                <MinimalGridCard key={`min-${p.id}`} product={p} />
              ))}
            </div>
          </div>

          {/* Sub-section: Variation 3 */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-charcoal">
                Variation C: Horizontal Craft Story Card
              </h3>
              <span className="text-2xs font-mono text-charcoal-500">Lookbooks & Editorial Features</span>
            </div>

            <HorizontalStoryCard
              product={sampleProducts[0]}
              onExplore={() => alert("Navigating to product detail")}
            />
          </div>
        </section>

        <Separator />

        {/* SECTION 6: PROMOTIONAL & EDITORIAL BANNERS */}
        <section id="banners" className="space-y-10">
          <div className="space-y-1">
            <span className="editorial-caps text-charcoal-500">Visual Campaigns</span>
            <h2 className="font-serif text-2xl text-charcoal font-normal">
              6. Promotional Banner Styles
            </h2>
            <p className="text-xs text-charcoal-600">
              Editorial, brand-first banners that integrate seamlessly with luxury merchandise without feeling like aggressive sales ads.
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <span className="text-2xs font-mono text-charcoal-500 block mb-3">Style A: Full-Bleed Campaign Hero</span>
              <CampaignHeroBanner />
            </div>

            <div>
              <span className="text-2xs font-mono text-charcoal-500 block mb-3">Style B: Split Craft & Material Philosophy</span>
              <SplitCraftBanner />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-canvas-muted bg-canvas-subtle py-16 px-6 sm:px-12 text-xs text-charcoal-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-serif text-lg text-charcoal block">VALLIS & ORE</span>
            <p className="text-2xs text-charcoal-500">Design System Foundation 1.0.0 • Strict TypeScript & Tailwind CSS</p>
          </div>
          <p className="text-2xs text-charcoal-400">Production International Winter Fashion Architecture</p>
        </div>
      </footer>
    </div>
  );
}
