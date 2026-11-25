# Winter Fashion & Lifestyle International E-Commerce Platform

A production-oriented, high-performance international e-commerce platform engineered for luxury winter apparel, technical cold-weather outerwear, and lifestyle collections. Designed to serve global markets across the USA, UK, Canada, Germany, France, Netherlands, and Nordic countries.

---

## 🌟 Architecture & Engineering Highlights

- **Framework:** Next.js 15+ (App Router, React Server Components & Server Actions)
- **Language:** TypeScript 5.x (Strict Type Safety)
- **Styling:** Tailwind CSS with custom **Nordic Alpine Luxury** design system tokens
- **UI Components:** Radix UI / Shadcn UI accessible primitives
- **Database:** PostgreSQL 15+ hosted on Supabase (20 normalized relational tables)
- **Data Security:** Complete Row Level Security (RLS) & Role-Based Access Control (RBAC)
- **Authentication:** Supabase SSR Auth with cookie session synchronization
- **Asset Storage:** Supabase S3-compatible cloud storage with CDN distribution
- **Payments:** Stripe (PaymentIntents, Stripe Elements, Apple Pay, Google Pay, Klarna, iDEAL)
- **Email:** Resend + React Email for transactional purchase and fulfillment notifications
- **Internationalization:** Multi-currency matrix (USD, EUR, GBP, CAD), Geo-IP routing, localized tax handling

---

## 📚 Master Architecture & Engineering Documentation

The platform has been planned by senior software architects and product engineers. Explore the technical documentation below:

| Document | Purpose |
| :--- | :--- |
| 📋 [**PROJECT_PLAN.md**](./PROJECT_PLAN.md) | Business requirements, international market strategy, winter apparel taxonomy, functional and non-functional specifications. |
| 🏛️ [**ARCHITECTURE.md**](./ARCHITECTURE.md) | High-level system architecture, technology justifications, Nordic design system tokens, full Next.js folder structure, and security model. |
| 🗄️ [**DATABASE_SCHEMA.md**](./DATABASE_SCHEMA.md) | Complete PostgreSQL 15+ schema, ER diagram, 20 tables, custom enums, stored procedures, triggers, and Row Level Security policies. |
| 🔌 [**API_DOCUMENTATION.md**](./API_DOCUMENTATION.md) | Next.js Server Actions, REST route handlers, Stripe webhook idempotency pipeline, and Zod validation schemas. |
| 🗺️ [**DEVELOPMENT_ROADMAP.md**](./DEVELOPMENT_ROADMAP.md) | Phased 6-stage engineering implementation roadmap, exit benchmarks, risk mitigation matrix, and deployment guide. |

---

## ❄️ Specialized Winter Apparel Capabilities

- **Faceted Technical Filtering:** Filter parkas, coats, and layers by Temperature Comfort Ratings (`-30°C to 10°C`), Waterproofing Hydrostatic Head (`10,000mm` to `20,000mm+ Gore-Tex Grade`), and Fill Power (`650` to `850+ Down`).
- **Interactive Winter Fit & Size Advisor:** Dynamic modal offering metric (cm/kg) and imperial (in/lbs) conversion with garment layering allowances.
- **Multi-Currency Pricing Matrix:** Fixed localized regional pricing for USD, GBP, EUR, and CAD with automatic ECB exchange rate fallbacks.
- **Race-Condition Safe Checkout:** Atomic PostgreSQL row locking (`SELECT FOR UPDATE`) prevents inventory overselling during high-volume seasonal drops.
- **Merchant Operations Dashboard:** Executive revenue metrics, multi-variant SKU generator, stock adjustment audit logs, order tracking assignment, and one-click Stripe refunds.

---

## 🚀 Development Roadmap Overview

- **Phase 1:** Foundation, Infrastructure, DB Schema & Design Tokens *(Next Up)*
- **Phase 2:** Storefront Catalog, Faceted Filters & Technical PDP
- **Phase 3:** Multi-Currency Bag, Checkout & Stripe Webhook Pipeline
- **Phase 4:** Customer Account Portal & Order History
- **Phase 5:** Merchant Admin Console & Fulfillment Operations
- **Phase 6:** Performance Hardening, Security Audits & Production Go-Live

---

## 📄 License

Proprietary — All rights reserved.
