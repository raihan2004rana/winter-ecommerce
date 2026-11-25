# Winter Fashion & Lifestyle E-Commerce
## Master Visual Design System & Editorial Guidelines

**Brand Direction:** Premium, Editorial, Quiet Luxury, Human-Designed  
**Aesthetic Anchors:** Totême, Loro Piana, The Row, Studio Nicholson, Arc'teryx Veilance  
**Anti-Patterns Strictly Avoided:** AI-generated gradients, glassy blur, bubbly rounded pills, oversized floating buttons, neon accents, generic icon cards.

---

## 1. Color Token Architecture

The color strategy is rooted in organic winter tones — snow linen, mineral charcoal, pine needle forest, and glacial water mist.

| Token Key | Hex Value | Name | Usage |
| :--- | :--- | :--- | :--- |
| `canvas.DEFAULT` | `#FAF9F5` | Chalk / Gallery Off-White | Primary canvas background. Warm, tactile, non-glaring. |
| `canvas.subtle` | `#F4F2EC` | Raw Linen | Secondary card backgrounds, subtle surface fills. |
| `canvas.muted` | `#EDE9E1` | Alabaster Stone | Inactive tabs, container fills, subtle horizontal rules. |
| `canvas.elevated` | `#FFFFFF` | Crisp Snow | Product gallery backgrounds, elevated modal dialogs. |
| `charcoal.DEFAULT` | `#18191A` | Mineral Charcoal | Primary typography, high-contrast buttons, logos. |
| `charcoal.700` | `#2B2D2F` | Soft Charcoal | Secondary headings, active navigation links. |
| `charcoal.600` | `#494C50` | Slate Grey | Subtitles, specifications, editorial descriptions. |
| `charcoal.400` | `#9BA0A8` | Frost Grey | Input placeholders, muted icon strokes. |
| `forest.DEFAULT` | `#2B3D2E` | Alpine Pine | Primary brand accent, primary CTA hover, luxury seals. |
| `forest.deep` | `#1C281F` | Deep Spruce | Dark section fills, footer background option. |
| `forest.mist` | `#E8ECE9` | Pine Needle Mist | Background for eco/RDS certified garment badges. |
| `ice.DEFAULT` | `#768C9E` | Glacial Steel | Secondary cold-weather technical indicator. |
| `ice.frost` | `#E4EDF3` | Frost Veil | Temperature rating badge background (`-30°C Sub-Zero`). |
| `ice.mist` | `#F0F5F8` | Water Mist | Lightweight table header and filter backgrounds. |
| `alpine.amber` | `#9E6D38` | Raw Amber | Fill power badge (e.g. `850+ Goose Down`). |

---

## 2. Typography Scale & Hierarchy

The typography pairs an editorial display serif with a precision grotesque sans-serif and tabular monospace for technical specifications.

### 2.1 Font Families
- **Display Serif:** `Playfair Display` or `Didot` (`font-serif`) — Used with restraint for seasonal headlines and collection titles.
- **Body & Interface:** `Inter` / Clean Grotesque (`font-sans`) — Crisp, neutral, readable at small sizes.
- **Technical Specs & Tabular Prices:** `JetBrains Mono` / Tabular Numerals (`font-mono`) — Used for SKUs, temperature ratings, grams, and prices.

### 2.2 Scale Matrix

| Size Token | Font Size | Line Height | Letter Spacing | Contextual Usage |
| :--- | :--- | :--- | :--- | :--- |
| `text-display-lg` | 4.5rem (72px) | 4.75rem | `-0.03em` | Seasonal Campaign Hero Title |
| `text-display-sm` | 2.25rem (36px) | 2.75rem | `-0.02em` | Section Titles, Editorial Narrative Headings |
| `text-2xl` | 1.625rem (26px) | 2.0rem | `-0.025em` | Product Detail Page Garment Title |
| `text-xl` | 1.25rem (20px) | 1.75rem | `-0.02em` | Product Card Title, Modal Titles |
| `text-base` | 0.9375rem (15px) | 1.55rem | `-0.01em` | Standard Body Copy, Editorial Descriptions |
| `text-sm` | 0.84375rem (13.5px) | 1.35rem | `0.01em` | Form Labels, Navigation Menu Items |
| `text-xs` | 0.75rem (12px) | 1.125rem | `0.04em` | Secondary Metadata, Technical Bullet Points |
| `editorial-caps` | 0.71875rem (11.5px) | 1.0rem | `0.16em` | Category Tag, Fit Recommendation, Collection Eyebrow |

---

## 3. Spacing System & Rhythm

Generous whitespace establishes luxury and breathing room.

- **Micro Spacing:** `gap-1.5` (6px), `gap-2` (8px), `gap-3` (12px) — Between swatches, badges, and icon labels.
- **Component Spacing:** `p-4` (16px), `p-6` (24px), `p-8` (32px) — Card padding, modal containers.
- **Section Rhythm:**
  - Mobile: `py-12` (48px)
  - Tablet: `py-16` (64px)
  - Desktop: `py-24` (96px) to `py-32` (128px) between major seasonal narrative modules.
- **Page Container Margins:**
  - `px-6` (Mobile) -> `px-10` (Tablet) -> `px-16` (Desktop, max-w-7xl/1440px).

---

## 4. Grid & Layout Rules

1. **Standard Storefront Grid:** 12-column architectural grid with 24px (1.5rem) column gutters.
2. **Product Listing Grid:**
   - Mobile: 1 column (editorial focus) or 2 columns (compact shopping).
   - Tablet: 3 columns.
   - Desktop: 4 columns with generous negative space.
3. **Image-to-Text Aspect Ratios:**
   - Editorial Tall: `aspect-[3/4]` (preferred for full-body coats, parkas, and knitwear).
   - Editorial Portrait: `aspect-[4/5]` (footwear, scarves, accessories).
   - Editorial Wide: `aspect-[16/9]` (seasonal lookbook hero banners).

---

## 5. Navigation System

The navigation is whisper-quiet, providing intuitive discovery without dominating the viewport:
- **Top Announcement Bar:** A 36px warm off-white / charcoal strip communicating international shipping thresholds and regional tax clarity.
- **Primary Header:** A clean 72px bar with minimal logo, category links with bottom underline draw on hover, currency/market selector (`USD`, `EUR`, `GBP`, `CAD`), search icon, account link, and a bag trigger with a discrete numeric counter.
- **Mobile Drawer:** Clean slide-in menu with clear hierarchical categories and dedicated lifestyle lookbook links.

---

## 6. Buttons & Form Elements

### Button Hierarchy (Zero Bubbly Radii — Crisp `rounded-none` or `rounded-[1px]`)
- **Primary Button:** Solid Charcoal (`#18191A`), off-white text, subtle hover lift to Muted Forest (`#2B3D2E`).
- **Secondary Button:** Hairline border (`#18191A`), transparent canvas, solid fill on hover.
- **Tertiary / Editorial Link:** Plain text with animated underline draw interaction on hover.
- **Quick-Add Button:** Compact, slide-up trigger on product cards.

### Form Inputs
- Hairline architectural border (`#E8E5DC`), zero drop shadows.
- Focus state highlights with a refined 1px Charcoal or Forest ring (`focus:border-charcoal focus:ring-1 focus:ring-charcoal`).
- Precision labels in `text-xs uppercase tracking-editorial`.

---

## 7. Product Card Variations

The system defines 3 distinct product card patterns:
1. **The Editorial Portrait Card (`aspect-[3/4]`):**
   - Main studio shot with secondary lifestyle shot revealed smoothly on hover.
   - Small discreet temperature rating badge (`-25°C Sub-Zero` in `ice.frost`).
   - Colorway swatch dots (clickable).
   - Editorial title in Grotesque Sans and tabular price in `font-mono`.
2. **The Minimal Grid Card:**
   - Clean borderless aesthetic.
   - Slide-up "Quick Add Size" bar triggered on card hover.
   - Real-time stock status badge ("Only 2 left in Size M").
3. **The Horizontal Story / Lookbook Card:**
   - 50/50 image and craft narrative.
   - Highlights insulation fill power, water resistance rating, and origin materials.

---

## 8. Promotional & Editorial Banners

- **Full-Bleed Campaign Banner:** Large-scale lifestyle photography, off-center serif title, discreet ghost button CTA.
- **Split Craft Feature:** Warm off-white canvas alongside technical close-up photography of goose-down baffle construction or waterproof seam taping.
- **Minimalist Shipping Strip:** Unobtrusive banner with region-tailored free delivery progress.

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Typical Device | Layout Adaptation |
| :--- | :--- | :--- | :--- |
| `sm` | 640px | Large Phones | 2-column product grid, compact navigation drawer. |
| `md` | 768px | Tablets | Filter drawer, 2 to 3 column catalog grid. |
| `lg` | 1024px | Small Laptops | 4-column catalog grid, sticky PDP gallery. |
| `xl` | 1280px | Desktops | Full mega-menu, multi-column footer. |
| `2xl` | 1440px | High-Res Displays | Fixed maximum container with generous canvas margins. |

---

## 10. Reusable UI Component Library

Located in `components/ui/` and `components/design-system/`:
- `Button` (`components/ui/button.tsx`)
- `Input` (`components/ui/input.tsx`)
- `Badge` (`components/ui/badge.tsx`)
- `Card` (`components/ui/card.tsx`)
- `Separator` (`components/ui/separator.tsx`)
- `NavigationBar` (`components/design-system/navigation-bar.tsx`)
- `ProductCard` (`components/design-system/product-card.tsx`)
- `EditorialBanner` (`components/design-system/editorial-banner.tsx`)
- `DesignSystemShowcase` (`app/design-system/page.tsx`)
