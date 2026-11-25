# Production International Winter Fashion & Lifestyle E-Commerce Platform
## Master Project Plan & Business Specifications

**Document Version:** 1.0.0  
**Target Platform:** Next.js (TypeScript) / Tailwind CSS / PostgreSQL (Supabase) / Stripe  
**Target Markets:** United States, United Kingdom, Canada, Germany, France, Netherlands, Nordic countries, and Global Tier-1/Tier-2 destinations.

---

## 1. Executive Summary & Brand Concept

### 1.1 Vision & Market Positioning
The platform is an international, enterprise-grade direct-to-consumer (D2C) and boutique retail e-commerce system engineered specifically for high-end winter outerwear, performance cold-weather apparel, and luxury lifestyle accessories. The platform marries luxury aesthetic appeal with high-performance technical attributes (down-fill power, weatherproofing, thermal ratings, climate insulation).

Unlike generic e-commerce templates, this platform addresses the distinct operational, merchandising, and logistical nuances of the winter apparel sector:
- **High-AOV (Average Order Value) Security & Trust:** Coats and parkas range from $150 to $1,200+, demanding frictionless checkout, transparent return policies, and clear duty/tax calculations.
- **Deep Technical Merchandising:** Products require specialized filtering such as temperature tolerance ratings (-30°C to 10°C), waterproof hydrostatic head (mm), fill power (650 to 900+ Down/Synthetic), breathability, and multi-dimensional variant sizing (Chest, Sleeve, Fit Type: Slim, Regular, Relaxed, Over-Layer).
- **International Multi-Currency & Cross-Border Logistics:** Native localized shopping experiences across North America, the UK, the European Union, and worldwide with localized pricing, currency rounding, tax compliance (EU VAT, UK VAT, US Sales Tax), and international shipping rules.

---

## 2. Target Markets & Internationalization (i18n / l10n)

### 2.1 Regional Segmentation

| Region | Primary Currency | Primary Locales | Tax Model | Key Logistics & Considerations |
| :--- | :--- | :--- | :--- | :--- |
| **United States** | USD ($) | `en-US`, `es-US` | State-level dynamic sales tax | Free shipping thresholds; fast Ground/Air carrier integration. |
| **United Kingdom** | GBP (£) | `en-GB` | 20% VAT inclusive display | Post-Brexit customs; HMRC compliance; Royal Mail / DPD tracking. |
| **European Union** *(DE, FR, NL)* | EUR (€) | `de-DE`, `fr-FR`, `nl-NL`, `en-EU` | 19%-21% VAT inclusive (OSS compliant) | Strict GDPR compliance; SEPA/iDEAL & Klarna payment options; DHL Euroconnect. |
| **Canada** | CAD (C$) | `en-CA`, `fr-CA` | GST/PST/HST combined calculation | Extreme cold focus (-40°C thermal gear); Canada Post / Purolator. |
| **Rest of World** | USD ($) or EUR (€) | `en-INT` | DDU / DDP via carrier calculation | International customs forms, HS codes, harmonized tariffs. |

### 2.2 Currency Strategy
- **Base Store Currency:** USD ($)
- **Supported Operational Currencies:** USD, EUR, GBP, CAD.
- **Pricing Strategy:** 
  - **Tier 1 (Market Specific Overrides):** Fixed localized pricing tables per currency to maintain psychologically attractive retail price points (e.g., $395.00 USD, £345.00 GBP, €375.00 EUR, $495.00 CAD) rather than fluctuating auto-conversions.
  - **Tier 2 (Dynamic Conversion Fallback):** Real-time daily European Central Bank (ECB) exchange rates with configurable FX risk buffers (default: 2.5%) for unpegged currencies.
- **Locale & Currency Resolution:**
  1. Explicit user choice via Currency/Region Selector in Header/Footer.
  2. Fallback to IP Geolocation via Edge Request Headers (`x-vercel-ip-country` or Cloudflare `CF-IPCountry`).
  3. Default fallback: USD / `en-US`.

---

## 3. Product Catalog & Winter Merchandising Architecture

### 3.1 Category Taxonomy

```
WINTER FASHION & LIFESTYLE
├── Outerwear & Jackets
│   ├── Down Parkas & Expedition Coats (Extreme Cold: -20°C to -40°C)
│   ├── Tailored Wool & Cashmere Overcoats
│   ├── Technical Ski & Alpine Shells (Waterproof 20,000mm+)
│   ├── Puffer Jackets & Lightweight Quilts
│   └── Windbreakers & Transit Shells
├── Mid-Layers & Knitwear
│   ├── 100% Cashmere Sweaters (Crewneck, Turtleneck, Cardigan)
│   ├── Merino Wool Cable Knits
│   ├── Heavyweight Thermal Hoodies & Sweatshirts (450+ GSM)
│   └── Polartec & Sherpa Fleece Jackets
├── Cold-Weather Base Layers
│   ├── Merino Wool Thermal Tops & Leggings
│   └── Compression Hydrophobic Base Layers
├── Winter Footwear & Boots
│   ├── Waterproof Shearling-Lined Winter Boots
│   ├── Alpine Snow Trekking Boots
│   └── Insulated Chelsea Boots & City Walkers
└── Lifestyle Winter Accessories
    ├── Cashmere & Brushed Wool Scarves
    ├── Insulated Ski Mittens & Deerskin Leather Gloves
    ├── Thermal Merino Beanies & Trapper Hats
    └── Balaclavas, Neck Gaiters & Thermal Socks
```

### 3.2 Winter Technical Attributes Matrix
Each product model maintains structured JSONB metadata and relational attributes:
- **Temperature Comfort Rating:** Minimum/Maximum operational temperature in Celsius and Fahrenheit (e.g., `{"min_c": -25, "max_c": -5, "label": "Sub-Zero Alpine"}`).
- **Waterproofing & Weatherproof Rating:** Hydrostatic rating (`DWR Coated`, `10,000mm`, `20,000mm Gore-Tex Grade`).
- **Insulation Specifications:** Type (`Goose Down`, `Duck Down`, `PrimaLoft Gold`, `Thermolite`), Fill Power (`650`, `750`, `850+`), Down-to-Feather Ratio (`90/10`).
- **Fabric Composition & Weight:** Outer shell material, lining material, total GSM weight.
- **Fit Profile:** `Slim Fit`, `Regular Fit`, `Relaxed Fit`, `Expedition Over-Layer Fit`.
- **Sustainability Credentials:** RDS (Responsible Down Standard), OEKO-TEX certified, 100% Recycled Polyamide.

---

## 4. Comprehensive Functional Requirements

### 4.1 Storefront & Customer Experience

#### A. Discovery & Catalog Navigation
- **Faceted Multi-Select Filtering:** Real-time URL query-synced filtering by Category, Collection, Size, Color, Price Range, Temperature Rating, Waterproofing, and Material.
- **Instant Search:** Instant server-driven search with fuzzy matching, auto-suggestions, category previews, and recent search history.
- **Product Listing Page (PLP):**
  - High-performance grid layout with dynamic responsive breakpoints (1-col mobile, 2-col tablet, 4-col desktop).
  - Secondary image hover effect (lifestyle vs. studio shot).
  - Quick-add variant drawer / bottom sheet for mobile.
  - Colorway swatch previews dynamically switching card images.
  - Badges: "New Season", "Sub-Zero Rated", "Low Stock", "Sustainable RDS".

#### B. Product Detail Page (PDP)
- **High-Resolution Media Gallery:** Desktop split-scroll / sticky view with thumbnail strip, mobile touch-swipe carousel, and click-to-zoom modal (pinch/mouse zoom).
- **Variant Selector:** Visual swatches for colors and buttons for sizes with real-time stock availability indicators (In Stock, Only 2 Left, Backorder, Out of Stock).
- **Interactive Winter Fit & Size Advisor:**
  - Metric (cm/kg) and Imperial (in/lbs) toggle.
  - Garment measurement tables (Chest, Length, Sleeve).
  - Layering recommendation indicator (e.g., "Order one size up if layering over heavy knits").
- **Cold-Weather Feature Showcase:** Visual spec cards (Thermal rating gauge, weatherproofing icons, material breakdown).
- **Customer Reviews & Ratings:** Star ratings, verified buyer badges, customer uploaded fit photos, cold-weather rating feedback ("Kept me warm at -15°C in Montreal").
- **Related & Complete the Look Recommendations:** Curated lifestyle bundling (e.g., Parka + Cashmere Beanie + Leather Gloves).

#### C. Shopping Bag & Persistence
- **Dual Session Cart System:** Seamless anonymous guest cart persisted via encrypted UUID cookie, auto-merging into user cart upon login or signup.
- **Slide-Over Mini Cart (Drawer):** Dynamic subtotal, free shipping progress bar ("Add $45 more for free worldwide express shipping"), quantity adjusters with optimistic UI, and stock reservation checks.
- **Cart Abandonment Prevention:** Persistent cart state across tabs and devices for authenticated customers.

#### D. International Multi-Currency Checkout
- **Integrated Stripe Checkout / Stripe Elements:** Native PCI-DSS SAQ A compliant checkout with card tokenization, Apple Pay, Google Pay, Klarna (EU/US), iDEAL (NL), and Bancontact (BE).
- **Shipping Address & Postal Validation:** Country-specific postal code format checks, dynamic state/province pickers.
- **Shipping Zone Selector:** Standard, Express Air, and Next-Day options with real-time dynamic pricing per geographic tier and weight brackets.
- **Promotional Discount Engine:** Coupon code validation, automated seasonal discount application, and gift card balance deduction.
- **Order Confirmation & Digital Receipts:** Instant confirmation page with real-time status tracker and automated transactional email dispatch via Resend.

#### E. Customer Account Portal
- **Secure Authentication:** Email/password + Magic Link passwordless sign-in + Google/Apple OAuth via Supabase Auth.
- **Order History & Live Tracking:** Full timeline of past purchases, digital downloadable VAT invoices (PDF), carrier tracking links.
- **Address Book Management:** Multiple shipping and billing addresses with default indicators.
- **Wishlist & Saved Items:** Hearting system with stock and price drop notifications.
- **Security & Session Management:** Change password, active session logout, GDPR data download and account deletion requests.

---

### 4.2 Merchant & Administrative Operations (Admin Dashboard)

#### A. Executive Analytics & Overview
- **KPI Real-Time Metrics:** Daily/Weekly/Monthly Gross Merchandise Value (GMV), Net Revenue, Average Order Value (AOV), Conversion Rate, and Return Rates.
- **Regional Sales Heatmap:** Revenue distribution across USA, UK, DE, FR, NL, CA, and International markets.
- **Low Stock & Out-of-Stock Radar:** Immediate warnings for popular winter sizes (e.g., Size M/L in Parkas) before cold-season spikes.

#### B. Catalog & Inventory Lifecycle Management
- **Hierarchical Product Management:** Create/Edit products with rich Markdown descriptions, SEO meta tags, OpenGraph imagery, and categorization.
- **Multi-SKU Variant Generator:** Automatic matrix generation across Colors (Hex code + Name) and Sizes (XS, S, M, L, XL, XXL).
- **Inventory & Stock Adjustments:** Per-variant inventory counts, reorder thresholds, SKU tracking, and safety stock reserves.
- **Multi-Currency Pricing Matrix:** Direct editing of regional pricing overrides for USD, GBP, EUR, and CAD.
- **Supabase Storage Image Manager:** Multi-file drag-and-drop uploader with automatic WebP conversion, drag-to-reorder gallery, and alt-tag editing.

#### C. Order Processing & Fulfillment Workflow
- **Order State Machine:**
  - `pending` -> `authorized` -> `paid` -> `processing` -> `shipped` -> `delivered` / `cancelled` / `refunded`.
- **Fulfillment Panel:** Assign tracking carrier (FedEx, DHL Express, UPS, Royal Mail, DPD) and tracking code; triggers customer shipping update email.
- **Refund & Cancellation Engine:** Full and partial refunds directly processed through Stripe API with automatic inventory replenishment.

#### D. Customer & CRM Management
- **Customer Profiles:** Aggregate lifetime spend, total orders, first/last purchase date, shipping addresses, and support notes.
- **Customer Segmentation:** VIP spenders, international buyers, abandoned checkouts.

#### E. Marketing, Discounts & Banner CMS
- **Promotional Rule Engine:** Percentage discounts (e.g., 20% off Winter Launch), Fixed amount ($50 off orders over $250), Free Shipping coupons.
- **Storefront Banner CMS:** Manage top notification bar messages ("Free Worldwide Shipping on Orders Over $200 / £175 / €190"), Hero carousel banners, and seasonal promo countdown timers.

---

## 5. Non-Functional Requirements & Engineering Standards

### 5.1 Performance Targets
- **Core Web Vitals:**
  - **LCP (Largest Contentful Paint):** < 1.2 seconds on 4G mobile.
  - **INP (Interaction to Next Paint):** < 100 milliseconds.
  - **CLS (Cumulative Layout Shift):** < 0.05.
- **Edge Caching & CDN:** Static assets, product catalogs, and category listings cached globally via Edge CDN with on-demand cache revalidation (`revalidateTag` / `revalidatePath`).
- **Image Optimization:** Automated Next.js Image optimization serving next-gen AVIF/WebP formats with explicit blur placeholders.

### 5.2 Security & Compliance
- **Payment Compliance:** Zero credit card data touches our application server; 100% tokenized through Stripe Elements / Payment Intents conforming to PCI-DSS Level 1 / SAQ A.
- **Database Row Level Security (RLS):** Every PostgreSQL table in Supabase enforces strict RLS policies ensuring customers can only read/write their own records, and admin tables are restricted to authenticated users with `admin` or `super_admin` claims.
- **Data Privacy & Regulation:** GDPR compliance for EU visitors (cookie consent management, right to access, right to be forgotten) and CCPA compliance for California residents.
- **Anti-Abuse & Rate Limiting:** Rate limiting on checkout endpoints, authentication attempts, coupon validation, and contact forms.
- **Input Sanitization & Schema Validation:** 100% of client inputs and server action payloads validated using Zod schemas.

---

## 6. Architecture & System Modules Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS STOREFRONT & ADMIN                      │
│                                                                        │
│   Storefront (app/(storefront))        Admin Console (app/(admin))     │
│   ├── Catalog & Faceted PLP            ├── Executive Analytics         │
│   ├── High-Res Zoomable PDP            ├── Inventory Matrix & SKU Mgmt │
│   ├── Dynamic Sizing & Fit Advisor     ├── Order Fulfillment & Returns │
│   ├── Mini-Cart & Guest/User Bag       ├── Multi-Currency Price Editor │
│   └── Multi-Step Stripe Checkout       └── Promotion & CMS Controller  │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SERVER-SIDE APPLICATION LAYER                    │
│                                                                        │
│   Next.js Server Actions & API Route Handlers                          │
│   ├── Zod Payload Validation & Security Sanitation                     │
│   ├── RBAC Admin Session Guards & Supabase SSR Auth Cookies           │
│   ├── Idempotent Inventory Lock & Decrement Engine                     │
│   └── Stripe Webhook Ingestion & Signature Verification                │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        SUPABASE & POSTGRESQL         │  │       EXTERNAL SERVICES      │
│                                      │  │                              │
│   • Relational Schema with RLS       │  │   • Stripe Payments & Radar  │
│   • Supabase Auth (JWT & Roles)      │  │   • Resend Transactional     │
│   • Supabase S3-Compatible Storage   │  │   • Global Carrier Tracking  │
│   • Real-Time Stock Subscriptions    │  │   • Fixer/ECB Exchange Rates │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 7. Next Steps & Approval Workflow
This project plan serves as the architectural foundation. The subsequent detailed technical deliverables are:
1. `ARCHITECTURE.md` - Technical stack justification, folder structure, data flow, and security boundaries.
2. `DATABASE_SCHEMA.md` - Complete SQL schema with indexes, constraints, triggers, and Row Level Security policies.
3. `API_DOCUMENTATION.md` - Server Actions, REST route handlers, Stripe webhook specifications, and contract types.
4. `DEVELOPMENT_ROADMAP.md` - Phased milestone schedule, sprint deliverables, test criteria, and production go-live checklist.
