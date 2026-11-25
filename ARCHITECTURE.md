# Production International Winter Fashion & Lifestyle E-Commerce Platform
## System Architecture & Engineering Specifications

**Document Version:** 1.0.0  
**Status:** Architecture Blueprint  
**Authors:** Senior Full-Stack Software Architect & Technical Lead

---

## 1. High-Level Architectural Overview

The application is structured as a modern, decoupled, multi-tier enterprise e-commerce platform leveraging the **Next.js App Router (React Server Components)** paired with **Supabase (PostgreSQL with Row Level Security)** and **Stripe** for payment processing.

The architecture emphasizes:
1. **Server-First Compute & Zero Client Bloat:** Heavy business logic, catalog queries, price calculations, inventory validation, and database operations execute securely on the server via Server Components and Server Actions.
2. **Resilient Cross-Border Multi-Currency Handling:** Prices are maintained in localized matrices with automatic or manual foreign exchange (FX) management, currency rounding rules, and geo-ip routing.
3. **Defense-in-Depth Security:** Database-level Row Level Security (RLS), cryptographic webhook signature verification, type-safe schema validation (Zod), and role-based access control (RBAC).
4. **Sub-second Global Performance:** Global CDN edge caching, dynamic asset optimization, and granular React Server Component streaming (`Suspense`).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT TIERS                                         │
│                                                                                        │
│   Desktop Web / Mobile Web (Responsive Alpine Luxury UI)                              │
│   ├── Static & Dynamic RSC Payloads (Streaming HTML)                                   │
│   ├── Hydrated Islands (Zustand: Mini-Cart, Currency Switcher, Filter Drawer)         │
│   └── Embedded Stripe Elements (PCI DSS SAQ A Tokenization)                            │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTPS / WSS
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              NEXT.JS EDGE & ROUTING TIER                               │
│                                                                                        │
│   Next.js Middleware (Edge Runtime)                                                    │
│   ├── Geo-IP Header Inspection (Country, Currency, Locale Detection)                   │
│   ├── Supabase SSR Session Refresh & Cookie Propagation                               │
│   ├── Admin Route Protection Guard (/admin/* RBAC verification)                        │
│   └── Rate Limiting (Sliding Window Algorithm)                                         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             APPLICATION & LOGIC TIER                                   │
│                                                                                        │
│   Next.js App Router (Node.js Server Runtime)                                          │
│   ├── Server Components (RSC)               ├── Server Actions (Mutations)             │
│   │   • High-Performance Catalog Fetching   │   • Cart Management & Merging            │
│   │   • SEO & JSON-LD Structured Data       │   • Atomic Stock Reservation Checkout    │
│   │   • Server-rendered Admin Tables        │   • Admin Product/Order Management       │
│   └── Route Handlers (/api/*)               └── Zod Validation & Domain Services       │
│       • Stripe Webhook Controller               • Currency Service                     │
│       • Health & Readiness Probes               • Tax & Duty Calculation Engine        │
│       • Digital PDF Invoice Generator           • Shipping Tier Resolution             │
└──────────────────┬─────────────────────────────────┬───────────────────┬───────────────┘
                   │                                 │                   │
                   ▼                                 ▼                   ▼
┌──────────────────────────────────────┐  ┌──────────────────┐  ┌────────────────────────┐
│       SUPABASE DATA PLATFORM         │  │ STRIPE PAYMENTS  │  │  EXTERNAL INTEGRATIONS │
│                                      │  │                  │  │                        │
│   • PostgreSQL Database (v15+)       │  │ • PaymentIntents │  │ • Resend Email API     │
│   • Connection Pooler (Supavisor)    │  │ • Webhooks       │  │ • Exchange Rates API   │
│   • Row Level Security (RLS)         │  │ • Stripe Radar   │  │ • Carrier Tracking     │
│   • Supabase Auth (JWT & Roles)      │  │ • Apple/Google   │  │   (DHL, FedEx, UPS)    │
│   • Supabase Storage (CDN S3)        │  │   Pay & Klarna   │  │ • Headless CMS / CDN   │
└──────────────────────────────────────┘  └──────────────────┘  └────────────────────────┘
```

---

## 2. Technology Stack Selection & Justification

| Technology Tier | Selected Framework / Library | Version | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | 15.x / React 19 | Industry-standard React meta-framework. Delivers Server Components (zero client JS for product pages), Server Actions for mutation safety, automatic image optimization, and nested layout route groups (`(storefront)` vs `(admin)`). |
| **Language** | **TypeScript** | 5.x | Strict type safety across database schemas, API contracts, Zod validators, and React component props. Eliminates runtime type errors. |
| **Styling & Design System** | **Tailwind CSS + Tailwind Animate** | 3.4+ / 4.x | Utility-first CSS providing deterministic styling, ultra-small CSS bundle size, and effortless custom theme configuration matching our winter alpine luxury aesthetic. |
| **UI Primitives** | **Radix UI Primitives (Shadcn UI)** | Latest | Unstyled, accessible, keyboard-navigable UI primitives (Dialog, Dropdown, Accordion, Slider, Drawer, Toast, Tooltip) customized with Tailwind CSS. |
| **State Management** | **Zustand** | 5.x | Lightweight, un-opinionated state store for client-only state: slide-over mini-cart, active currency selection, search bar open/closed state, and fit advisor drawer. |
| **Database & Auth** | **Supabase (PostgreSQL 15+)** | Cloud / Self-hosted | Enterprise relational database with native JSONB support for technical garment specs, built-in Row Level Security (RLS), integrated Auth (OAuth, magic links, passwords), and edge-accelerated S3 storage. |
| **Database Client** | **Supabase SSR Client (`@supabase/ssr`)** | Latest | Official Supabase SSR client providing cookie-based session management that seamlessly synchronizes user auth state across Next.js Middleware, Server Components, and Server Actions. |
| **Validation** | **Zod** | 3.x | Declarative, TypeScript-first schema validation for form submissions, API payloads, Server Actions, and environment variables. |
| **Payments** | **Stripe (SDK + React Elements)** | Latest | World-class international payment gateway supporting multi-currency charges, Apple Pay, Google Pay, Klarna, iDEAL, SEPA, robust fraud protection (Stripe Radar), and automated webhooks. |
| **Transactional Email** | **Resend + React Email** | Latest | High-deliverability transactional emails built with React components, supporting order confirmations, shipping updates, and invoice delivery. |
| **Icons & Media** | **Lucide React** | Latest | Consistent, clean icon set covering all e-commerce, weather, navigation, and luxury UI needs. |

---

## 3. Customized Design System: "Nordic Alpine Luxury"

The visual aesthetic reflects cold-weather alpine sophistication: clean lines, frosty glassmorphism accents, deep Nordic hues, crisp typography, and high-contrast accessibility.

### 3.1 Color Palette Architecture

```typescript
// tailwind.config.ts color tokens
export const winterThemeColors = {
  // Primary Backgrounds & Canvas
  snow: {
    50: '#FBFDFD',
    100: '#F4F7F8', // Main storefront background
    200: '#E7ECEF', // Subtle card borders
  },
  // Deep Nordic Monochromes (Text & High-Contrast Elements)
  nordic: {
    900: '#0B0F14', // Deep obsidian black (Header, Primary buttons)
    800: '#141B22', // Charcoal slate (Card surfaces in dark mode)
    700: '#222C37', // Subdued dark
    500: '#526071', // Secondary text & labels
    400: '#8A99AD', // Muted text & placeholders
  },
  // Technical Winter Accents
  frost: {
    ice: '#E0F2FE',    // Glacial tint for technical badge highlights
    blue: '#0284C7',   // Cold-weather performance tag
    cyan: '#06B6D4',   // Waterproof rating highlight
  },
  alpine: {
    amber: '#D97706',  // Warmth / Down fill power indicator (e.g., 850 Fill)
    crimson: '#DC2626',// Sub-Zero temperature alert (-30°C) & Sale tags
    pine: '#064E3B',   // Eco-friendly / RDS certified badge
  }
};
```

### 3.2 Typography & Spacing Hierarchy
- **Display Heading:** `Inter` or `Syne` / `Playfair Display` for luxury winter outerwear headlines.
- **Body & Technical Specs:** `Inter` / `Geist Sans` for legibility of sizes, dimensions, and garment materials.
- **Monospace:** `Geist Mono` / `JetBrains Mono` for SKUs, order tracking IDs, currency codes, and temperature ratings.

---

## 4. Complete Application Folder Structure

The project leverages Next.js App Router route groups to cleanly decouple the **Storefront (`app/(storefront)`)**, the **Admin Dashboard (`app/(admin)`)**, and shared **API Endpoints (`app/api`)**.

```
c:\Users\Raihan\WINTER-ECOMMERCE\
├── .env.example                       # Documented environment variable template
├── .env.local                         # Local environment secrets (ignored by Git)
├── .gitignore                         # Strict Git ignore configuration
├── next.config.ts                     # Next.js compiler & image remote domain config
├── package.json                       # Dependencies and build scripts
├── postcss.config.mjs                 # PostCSS configuration
├── tailwind.config.ts                 # Custom Nordic Alpine design system tokens
├── tsconfig.json                      # Strict TypeScript compiler configuration
│
├── app/                               # Next.js App Router Root
│   ├── layout.tsx                     # Root HTML shell, fonts, and global providers
│   ├── globals.css                    # Tailwind imports, custom utilities & scrollbars
│   ├── not-found.tsx                  # Branded 404 Cold Weather Not Found page
│   ├── error.tsx                      # Global error boundary
│   │
│   ├── (storefront)/                  # Route Group: Public Storefront
│   │   ├── layout.tsx                 # Storefront layout (Header, Nav, Mini-Cart, Footer)
│   │   ├── page.tsx                   # Homepage (Hero, Winter Drops, Curated Collections)
│   │   │
│   │   ├── products/                  # Catalog & Discovery
│   │   │   ├── page.tsx               # Product Listing Page (PLP) with dynamic filters
│   │   │   └── [slug]/                # Product Detail Page (PDP)
│   │   │       ├── page.tsx           # High-Res PDP with Gallery, Specs, and Size Advisor
│   │   │       └── loading.tsx        # Skeleton loader for instant perceived speed
│   │   │
│   │   ├── collections/               # Curated Collections
│   │   │   ├── page.tsx               # Collections index (Parkas, Cashmere, Expedition)
│   │   │   └── [slug]/page.tsx        # Collection specific listing
│   │   │
│   │   ├── cart/                      # Dedicated Full-Page Shopping Bag
│   │   │   └── page.tsx               # Line items, promo code, shipping estimator
│   │   │
│   │   ├── checkout/                  # Multi-Currency Checkout Experience
│   │   │   ├── page.tsx               # Checkout Shell (Stripe Elements / Payment Form)
│   │   │   ├── success/page.tsx       # Order Success & Real-Time Tracking Link
│   │   │   └── cancel/page.tsx        # Graceful payment cancellation handler
│   │   │
│   │   ├── account/                   # Customer Account Portal (Protected)
│   │   │   ├── layout.tsx             # Account sidebar navigation
│   │   │   ├── page.tsx               # Overview: Recent orders, profile summary
│   │   │   ├── orders/                # Customer Order History
│   │   │   │   ├── page.tsx           # Order list with statuses and tracking links
│   │   │   │   └── [orderId]/page.tsx # Order detail & digital invoice download
│   │   │   ├── addresses/page.tsx     # Shipping & billing address book
│   │   │   └── wishlist/page.tsx      # Saved items with stock alert triggers
│   │   │
│   │   ├── auth/                      # Customer Authentication
│   │   │   ├── login/page.tsx         # Email/Password + Magic Link + Social login
│   │   │   ├── register/page.tsx      # Customer registration
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── callback/route.ts      # OAuth / Magic Link PKCE auth callback
│   │   │
│   │   └── pages/                     # Informational & Compliance Pages
│   │       ├── size-guide/page.tsx    # Comprehensive measurement tables & fit guide
│   │       ├── sustainability/page.tsx# RDS Down & Eco-materials commitment
│   │       ├── shipping/page.tsx      # International delivery tiers, duties & customs
│   │       └── returns/page.tsx       # 30-day winter exchange and refund policy
│   │
│   ├── (admin)/                       # Route Group: Merchant & Admin Operations
│   │   ├── admin/
│   │   │   ├── layout.tsx             # Admin sidebar, top bar, admin breadcrumbs
│   │   │   ├── page.tsx               # Executive Dashboard (GMV, AOV, Sales Heatmap)
│   │   │   │
│   │   │   ├── products/              # Product Management
│   │   │   │   ├── page.tsx           # Product catalog table with search & bulk actions
│   │   │   │   ├── new/page.tsx       # Multi-variant product creator
│   │   │   │   └── [id]/edit/page.tsx # Product editor & variant SKU generator
│   │   │   │
│   │   │   ├── inventory/             # Stock & Warehouse Operations
│   │   │   │   └── page.tsx           # Low-stock alerts, SKU adjustments, bulk updates
│   │   │   │
│   │   │   ├── orders/                # Order Fulfillment
│   │   │   │   ├── page.tsx           # Orders list filtered by status (paid, shipped)
│   │   │   │   └── [id]/page.tsx      # Order detail, tracking assignment, refund trigger
│   │   │   │
│   │   │   ├── customers/             # Customer Insights
│   │   │   │   ├── page.tsx           # Customer directory with LTV and order counts
│   │   │   │   └── [id]/page.tsx      # Individual customer purchase history & notes
│   │   │   │
│   │   │   ├── discounts/             # Promotions Engine
│   │   │   │   ├── page.tsx           # Active coupon codes and automated rules
│   │   │   │   └── new/page.tsx       # Discount creator (fixed, percentage, free ship)
│   │   │   │
│   │   │   ├── content/               # Storefront CMS
│   │   │   │   └── banners/page.tsx   # Top banner announcements & hero sliders
│   │   │   │
│   │   │   └── settings/              # Store Configuration
│   │   │       ├── page.tsx           # Multi-currency rates, shipping zones, tax rules
│   │   │       └── users/page.tsx     # Admin staff roles & permissions
│   │
│   └── api/                           # Route Handlers (Edge & Server APIs)
│       ├── webhooks/
│       │   └── stripe/route.ts        # Stripe Webhook Handler (checkout, refunds)
│       ├── currency/
│       │   └── rates/route.ts         # Scheduled FX currency sync endpoint
│       ├── invoices/[id]/route.ts     # Dynamic PDF VAT receipt generator
│       └── health/route.ts            # System health check & uptime probe
│
├── actions/                           # Next.js Server Actions (Mutations)
│   ├── cart.actions.ts                # Add to cart, update qty, remove, merge guest cart
│   ├── checkout.actions.ts            # Create Stripe Checkout / PaymentIntent, check stock
│   ├── product.actions.ts             # Admin create/update/delete product & variants
│   ├── order.actions.ts               # Admin update status, assign tracking, issue refund
│   ├── discount.actions.ts            # Validate coupon code against cart requirements
│   ├── address.actions.ts             # Create, edit, delete customer address
│   └── auth.actions.ts                # Sign in, sign up, sign out, password reset
│
├── components/                        # Reusable Component Architecture
│   ├── ui/                            # Shadcn / Radix Primitive Components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   └── toast.tsx
│   │
│   ├── storefront/                    # Storefront Specific Components
│   │   ├── header/                    # Storefront Header, Mega Menu, Search Trigger
│   │   ├── footer/                    # Multi-column Footer, Newsletter, Currency Picker
│   │   ├── cart/                      # Slide-over Mini-Cart & Cart Line Items
│   │   ├── product/                   # ProductCard, Gallery, VariantSelector, SpecsGrid
│   │   ├── sizing/                    # WinterFitAdvisorModal, MeasurementTable
│   │   ├── checkout/                  # AddressForm, ShippingMethodPicker, StripeWrapper
│   │   └── banners/                   # AnnouncementBar, SeasonalCountdown
│   │
│   ├── admin/                         # Admin Dashboard Specific Components
│   │   ├── sidebar.tsx                # Admin Collapsible Navigation
│   │   ├── topbar.tsx                 # Admin Search & Profile Menu
│   │   ├── analytics/                 # MetricCard, SalesChart, RegionalBreakdown
│   │   ├── product-form/              # MultiVariantMatrix, MediaUploader, PriceOverrides
│   │   └── order-details/             # Timeline, ShippingLabelDialog, RefundModal
│   │
│   └── shared/                        # Shared Utility Components
│       ├── currency-price.tsx         # Universal currency formatted price component
│       ├── image-with-fallback.tsx    # Next.js Image wrapper with skeleton placeholder
│       └── confirm-dialog.tsx         # Reusable confirmation modal for destructive ops
│
├── lib/                               # Core Utilities, Clients & Singletons
│   ├── supabase/                      # Supabase Client Initializers
│   │   ├── client.ts                  # Browser Client (createBrowserClient)
│   │   ├── server.ts                  # Server Client for RSC & Actions (createServerClient)
│   │   ├── admin.ts                   # Supabase Service Role Client (Bypasses RLS)
│   │   └── middleware.ts              # Session refresher for Next.js Middleware
│   │
│   ├── stripe/                        # Stripe Integration
│   │   ├── server.ts                  # Stripe Node SDK instance
│   │   └── client.ts                  # Stripe.js loadStripe browser loader
│   │
│   ├── email/                         # Resend Transactional Email Dispatcher
│   │   ├── client.ts                  # Resend SDK instance
│   │   └── templates/                 # React Email Templates
│   │       ├── order-confirmation.tsx
│   │       ├── shipping-update.tsx
│   │       └── refund-issued.tsx
│   │
│   ├── currency/                      # Currency & FX Conversion Utilities
│   │   ├── formatters.ts              # Intl.NumberFormat currency display utilities
│   │   ├── exchange.ts                # Real-time exchange rate calculation & buffers
│   │   └── constants.ts               # Supported currencies (USD, EUR, GBP, CAD)
│   │
│   ├── validators/                    # Zod Schema Definitions
│   │   ├── product.schema.ts          # Product creation & variant validation
│   │   ├── checkout.schema.ts         # Shipping address & checkout input validation
│   │   ├── cart.schema.ts             # Cart mutation payload validation
│   │   └── auth.schema.ts             # Login, signup & reset password validation
│   │
│   └── utils.ts                       # General helpers: cn (clsx + twMerge), slugify, dates
│
├── hooks/                             # Custom React Hooks
│   ├── use-cart.ts                    # Zustand cart hook with optimistic updates
│   ├── use-currency.ts                # Zustand currency switcher & active currency state
│   ├── use-media-query.ts             # Responsive viewport detection hook
│   └── use-debounce.ts                # Debounced input for live catalog search
│
├── types/                             # TypeScript Ambient & Domain Declarations
│   ├── database.types.ts              # Supabase auto-generated database types
│   ├── product.types.ts               # Product, Variant, Attribute, and Spec interfaces
│   ├── cart.types.ts                  # Cart session, line items, and summary interfaces
│   ├── order.types.ts                 # Order, OrderItem, Shipping, and Payment interfaces
│   └── currency.types.ts              # Supported currency unions, rates, and price tables
│
├── middleware.ts                      # Edge Middleware: Auth, Geo-IP, Admin Guard
└── supabase/                          # Supabase Local Development & Migrations
    ├── config.toml                    # Supabase CLI configuration
    ├── migrations/                    # Versioned SQL migrations (00001_initial_schema.sql)
    └── seed.sql                       # Seed data: Winter collections, products & test admin
```

---

## 5. Security & Authentication Architecture

### 5.1 Defense-in-Depth Security Model

```
[ Incoming Request ]
         │
         ▼
[ Next.js Edge Middleware ] ──────────► Verifies Supabase Auth Cookie / Refresh Token
         │                            ► Extracts Geo-IP headers (country, currency)
         │                            ► Blocks unauthenticated users from /admin/*
         ▼
[ Server Action / Route Handler ] ────► Validates Payload with Zod (Type & bounds check)
         │                            ► Checks Admin Claim for restricted mutations
         │                            ► Rate limiting protection (Prevent brute force)
         ▼
[ Supabase PostgreSQL Layer ] ────────► Row Level Security (RLS) Enforced at DB level
                                      ► Foreign Key & Check Constraints
                                      ► Service-Role used exclusively in trusted worker actions
```

### 5.2 Role-Based Access Control (RBAC)
The platform defines three distinct system roles stored in the `user_profiles` table and reflected in Supabase JWT user metadata:
1. `customer`:
   - Default role assigned upon registration.
   - Can only read active/published products, categories, and reviews.
   - Can only access and modify their own cart, orders, wishlist, and saved addresses.
2. `staff` (Fulfillment & Support):
   - Access to `/admin/orders` and `/admin/inventory`.
   - Permitted to view orders, update fulfillment statuses, assign shipping tracking numbers, and view inventory counts.
   - Denied access to financial revenue metrics, discount creation, and store settings.
3. `admin` / `super_admin`:
   - Full unrestricted access to all admin routes, revenue analytics, product creation/deletion, price overrides, discount rules, and staff management.

### 5.3 Edge Middleware Route Protection Matrix
The Next.js `middleware.ts` runs on the Vercel/Node Edge runtime prior to rendering:
- **Public Routes:** `/`, `/products/*`, `/collections/*`, `/cart`, `/auth/*`, `/pages/*`, `/api/webhooks/*`.
- **Customer Protected Routes:** `/account/*`, `/checkout`. (Redirects to `/auth/login?redirect=/checkout` if unauthenticated).
- **Admin Protected Routes:** `/admin/*`. (Checks if session exists and queries user role; immediately returns HTTP 403 or redirects to `/auth/login` if not an admin).

---

## 6. Stripe Payment Lifecycle & Webhook Architecture

To guarantee 100% financial consistency and prevent inventory overselling, the checkout flow adheres to an idempotent, event-driven pattern:

```
[ Customer Submits Checkout ]
         │
         ▼
[ Server Action: `createCheckoutSession` ]
  1. Validates cart items and shipping address via Zod.
  2. Executes Atomic Inventory Check against PostgreSQL database.
  3. Calculates final localized price, applicable shipping rate, and discounts.
  4. Creates Stripe PaymentIntent with metadata:
     - `order_reference_id`
     - `customer_id`
     - `cart_snapshot` (serialized JSON)
  5. Returns client secret to frontend Stripe Elements.
         │
         ▼
[ Customer Confirms Payment via Card / Apple Pay / Klarna ]
         │
         ▼
[ Stripe Cloud Infrastructure Processes Transaction ]
         │
         ├───► [ Webhook: `payment_intent.succeeded` ] ────────┐
         │                                                     │
         │                                                     ▼
         │                                   [ Next.js Webhook Handler: `/api/webhooks/stripe` ]
         │                                     1. Validates Stripe-Signature header.
         │                                     2. Checks Idempotency Key in `stripe_events` table.
         │                                        (If already processed, returns 200 immediately).
         │                                     3. Begins PostgreSQL Transaction:
         │                                        • Inserts record in `orders` (status: 'paid').
         │                                        • Inserts line items in `order_items`.
         │                                        • Decrements inventory counts in `product_variants`.
         │                                        • Clears customer's shopping cart.
         │                                     4. Dispatches Order Confirmation Email via Resend.
         │                                     5. Returns HTTP 200 OK to Stripe.
         │
         └───► [ Webhook: `payment_intent.payment_failed` ] ───► Logs failure, notifies customer.
```

### 6.1 Concurrency & Inventory Lock Strategy
During flash sales or high-demand winter drops (e.g., Black Friday), multiple customers may attempt to purchase the last remaining item simultaneously. 
- The platform uses **PostgreSQL row-level locking (`SELECT ... FOR UPDATE`)** inside an atomic database stored procedure (`reserve_cart_inventory`) during checkout initiation.
- If inventory is insufficient at the moment of payment creation, the server action rejects the checkout with a user-friendly error specifying which variant became unavailable.

---

## 7. Storage Architecture & Image Asset Pipeline

High-resolution winter apparel photography requires optimized asset handling:
1. **Supabase Storage Buckets:**
   - `product-images`: Public bucket with global CDN caching. Stores original studio and lifestyle shots.
   - `brand-assets`: Public bucket for hero banners, collection imagery, and lookbooks.
   - `invoices`: Private, encrypted bucket for generated PDF receipts, accessible only via temporary signed URLs.
2. **Next.js Image Pipeline:**
   - Standardizes images on modern AVIF and WebP formats.
   - Enforces predefined device width breakpoints (`375px`, `640px`, `768px`, `1024px`, `1280px`, `1920px`).
   - Generates low-quality blur placeholders (LQIP) to eliminate layout shift (CLS < 0.05).
