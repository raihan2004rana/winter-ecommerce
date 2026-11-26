import fs from "fs";
import path from "path";
import { PRODUCTS_CATALOG, Product } from "@/data/products";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  gender?: "all" | "women" | "men";
  featured?: boolean;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  currency: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded" | "failed";
  fulfillmentStatus: "unfulfilled" | "fulfilled" | "partial";
  items: Array<{
    id: string;
    title: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName?: string;
    lastName?: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  pricingBreakdown?: {
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    taxAmount: number;
    total: number;
  };
  shippingMethod?: "standard" | "express";
  couponCode?: string;
  stripePaymentIntentId?: string;
  idempotencyKey?: string;
  failureReason?: string;
  refundedAmount?: number;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "vip" | "inactive";
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  productId: string;
  productTitle: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "super_admin" | "admin" | "catalog_manager" | "order_specialist" | "support_agent";
  lastActive: string;
  status: "active" | "inactive";
}

export interface AdminAuditLog {
  id: string;
  actorName: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export interface AdminCampaign {
  id: string;
  title: string;
  slug: string;
  type: "banner" | "promo" | "announcement" | "flash_sale" | "popup";
  placement: "hero" | "announcement_bar" | "promo_section" | "category_header" | "product_page";
  desktopImage: string;
  mobileImage?: string;
  headline: string;
  subheadline?: string;
  badgeText?: string;
  ctaText: string;
  destinationUrl: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  isActive: boolean;
  impressions: number;
  clicks: number;
  discountRule?: {
    type: "percentage" | "fixed_amount" | "free_shipping";
    value: number;
    minPurchase?: number;
    couponCode?: string;
    targetCategory?: string;
    targetProductId?: string;
  };
  countdownTimer?: {
    enabled: boolean;
    targetDate: string; // ISO String
  };
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSettings {
  storeName: string;
  storeDomain: string;
  defaultCurrency: "USD" | "EUR" | "GBP" | "CAD";
  supportEmail: string;
  orderNotificationEmail: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  lowStockThreshold: number;
  maintenanceMode: boolean;
}

export interface AdminTaxRule {
  id: string;
  countryCode: string;
  countryName: string;
  taxType: "vat" | "gst" | "sales_tax" | "custom";
  rate: number; // Decimal (e.g. 0.20 for 20%)
  isInclusive: boolean;
  isActive: boolean;
}

export interface AdminShippingZone {
  id: string;
  name: string;
  countries: string[]; // ISO-2 codes
  standardFee: number; // in USD
  expressFee: number; // in USD
  freeShippingThreshold: number; // in USD
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isActive: boolean;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  caption?: string;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
}

export interface InstagramConfig {
  handle: string;
  profileUrl: string;
  accessToken?: string;
  autoSync: boolean;
  posts: InstagramPost[];
}

export interface AdminPartner {
  id: string;
  name: string;
  logoUrl?: string;
  logoSvg?: string;
  websiteUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminJournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  readTime: string;
  image: string;
  author?: string;
  publishedAt: string;
  isPublished: boolean;
  order: number;
}

interface AdminState {
  products: (Product & { isArchived?: boolean; isPublished?: boolean })[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  coupons: AdminCoupon[];
  reviews: AdminReview[];
  staff: AdminStaff[];
  campaigns: AdminCampaign[];
  auditLogs: AdminAuditLog[];
  settings: AdminSettings;
  taxRules: AdminTaxRule[];
  shippingZones: AdminShippingZone[];
  instagramConfig?: InstagramConfig;
  partners?: AdminPartner[];
  journalArticles?: AdminJournalArticle[];
}

const STATE_FILE = path.join(process.cwd(), "data", "admin-state.json");

// Helper to seed initial high-fidelity data
function getInitialState(): AdminState {
  const initialProducts = PRODUCTS_CATALOG.map((p) => ({
    ...p,
    isPublished: true,
    isArchived: false,
  }));

  const initialCategories: AdminCategory[] = [
    {
      id: "cat-1",
      name: "Jackets & Down Coats",
      slug: "jackets-coats",
      description: "Down parkas, high-altitude shells and tailored winter coats.",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      productCount: 5,
      gender: "all",
      featured: true,
    },
    {
      id: "cat-2",
      name: "Sweaters & Knitwear",
      slug: "sweaters-hoodies",
      description: "Merino wool cable-knits, cashmere turtlenecks and Polartec fleece.",
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=85&w=600",
      productCount: 4,
      gender: "all",
      featured: true,
    },
    {
      id: "cat-3",
      name: "Boots & Accessories",
      slug: "boots-accessories",
      description: "Vibram Arctic Grip trekking boots, cashmere beanies and gloves.",
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=85&w=600",
      productCount: 3,
      gender: "all",
      featured: true,
    },
    {
      id: "cat-4",
      name: "Women Winter Collection",
      slug: "women",
      description: "Curated winter silhouettes designed for colder metropolitan days.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=600",
      productCount: 6,
      gender: "women",
      featured: true,
    },
    {
      id: "cat-5",
      name: "Men Technical Collection",
      slug: "men",
      description: "Technical alpine insulation and rugged performance layering.",
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=600",
      productCount: 6,
      gender: "men",
      featured: true,
    },
    {
      id: "cat-6",
      name: "Thermal Layering & Scarves",
      slug: "women-layering",
      description: "Seamless cashmere thermal turtlenecks and brushed alpine scarves.",
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=85&w=600",
      productCount: 4,
      gender: "women",
    },
    {
      id: "cat-7",
      name: "Sub-Zero Alpine Systems",
      slug: "men-alpine",
      description: "Extreme Arctic parkas, 3-layer GORE alpine shells and trekking gear.",
      image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=85&w=600",
      productCount: 5,
      gender: "men",
    },
  ];

  const initialOrders: AdminOrder[] = [
    {
      id: "ord-901",
      orderNumber: "MON-2026-8941",
      customerName: "Julian Vance",
      customerEmail: "julian.vance@geneva-capital.ch",
      total: 1030.0,
      currency: "USD",
      status: "delivered",
      paymentStatus: "paid",
      fulfillmentStatus: "fulfilled",
      items: [
        {
          id: "prod-001",
          title: "Nordic Expedition Down Parka",
          price: 685.0,
          size: "L",
          color: "Obsidian Slate",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=300",
        },
        {
          id: "prod-005",
          title: "Heavyweight Merino Cable Knit Sweater",
          price: 345.0,
          size: "L",
          color: "Bone White",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=85&w=300",
        },
      ],
      shippingAddress: {
        street: "Rue du Rhône 42",
        city: "Geneva",
        state: "GE",
        postalCode: "1204",
        country: "Switzerland",
      },
      trackingNumber: "DHL-CH-882941019",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
    {
      id: "ord-902",
      orderNumber: "MON-2026-8942",
      customerName: "Elena Rostova",
      customerEmail: "elena.rostova@lifestyle.no",
      total: 794.0,
      currency: "USD",
      status: "processing",
      paymentStatus: "paid",
      fulfillmentStatus: "partial",
      items: [
        {
          id: "prod-002",
          title: "Belted Longline Down Cocoon Coat",
          price: 549.0,
          size: "M",
          color: "Glacial Frost",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=300",
        },
        {
          id: "prod-004",
          title: "Thermal Insulated Shell Coat",
          price: 249.0,
          size: "S",
          color: "Glacial Mint",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=300",
        },
      ],
      shippingAddress: {
        street: "Karl Johans gate 14",
        city: "Oslo",
        state: "Oslo",
        postalCode: "0154",
        country: "Norway",
      },
      trackingNumber: "DHL-NO-99120451",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
    },
    {
      id: "ord-903",
      orderNumber: "MON-2026-8943",
      customerName: "Maximilian Richter",
      customerEmail: "m.richter@alpinhaus.at",
      total: 890.0,
      currency: "USD",
      status: "shipped",
      paymentStatus: "paid",
      fulfillmentStatus: "fulfilled",
      items: [
        {
          id: "prod-003",
          title: "Tailored Double-Faced Cashmere Overcoat",
          price: 890.0,
          size: "XL",
          color: "Charcoal Slate",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=85&w=300",
        },
      ],
      shippingAddress: {
        street: "Maria-Theresien-Straße 31",
        city: "Innsbruck",
        state: "Tirol",
        postalCode: "6020",
        country: "Austria",
      },
      trackingNumber: "DHL-AT-44109823",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
    },
    {
      id: "ord-904",
      orderNumber: "MON-2026-8944",
      customerName: "Sophia Lindqvist",
      customerEmail: "sophia.lindqvist@stockholm-nord.se",
      total: 480.0,
      currency: "USD",
      status: "paid",
      paymentStatus: "paid",
      fulfillmentStatus: "unfulfilled",
      items: [
        {
          id: "prod-006",
          title: "Seamless Cashmere Thermal Turtleneck",
          price: 295.0,
          size: "S",
          color: "Alabaster",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=85&w=300",
        },
        {
          id: "prod-009",
          title: "Thistle-Brushed Pure Cashmere Scarf",
          price: 185.0,
          size: "OS",
          color: "Heather Gray",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=85&w=300",
        },
      ],
      shippingAddress: {
        street: "Strandvägen 18",
        city: "Stockholm",
        state: "Stockholm",
        postalCode: "114 51",
        country: "Sweden",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    },
    {
      id: "ord-905",
      orderNumber: "MON-2026-8945",
      customerName: "Henri de Montmirail",
      customerEmail: "henri@chamonix-alp.fr",
      total: 495.0,
      currency: "USD",
      status: "pending",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      items: [
        {
          id: "prod-008",
          title: "Alpine Shearling Lined Trekking Boot",
          price: 495.0,
          size: "43",
          color: "Espresso",
          quantity: 1,
          image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=85&w=300",
        },
      ],
      shippingAddress: {
        street: "Avenue Michel Croz 8",
        city: "Chamonix",
        state: "Haute-Savoie",
        postalCode: "74400",
        country: "France",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    },
  ];

  const initialCustomers: AdminCustomer[] = [
    {
      id: "cust-1",
      name: "Julian Vance",
      email: "julian.vance@geneva-capital.ch",
      phone: "+41 22 819 4022",
      city: "Geneva",
      country: "Switzerland",
      totalOrders: 6,
      totalSpent: 4890.0,
      joinedAt: "2025-10-12",
      status: "vip",
    },
    {
      id: "cust-2",
      name: "Elena Rostova",
      email: "elena.rostova@lifestyle.no",
      phone: "+47 21 04 88 12",
      city: "Oslo",
      country: "Norway",
      totalOrders: 3,
      totalSpent: 2150.0,
      joinedAt: "2025-11-04",
      status: "active",
    },
    {
      id: "cust-3",
      name: "Maximilian Richter",
      email: "m.richter@alpinhaus.at",
      phone: "+43 512 89201",
      city: "Innsbruck",
      country: "Austria",
      totalOrders: 4,
      totalSpent: 3410.0,
      joinedAt: "2025-08-20",
      status: "vip",
    },
    {
      id: "cust-4",
      name: "Sophia Lindqvist",
      email: "sophia.lindqvist@stockholm-nord.se",
      phone: "+46 8 440 29 10",
      city: "Stockholm",
      country: "Sweden",
      totalOrders: 2,
      totalSpent: 960.0,
      joinedAt: "2026-01-15",
      status: "active",
    },
    {
      id: "cust-5",
      name: "Henri de Montmirail",
      email: "henri@chamonix-alp.fr",
      phone: "+33 4 50 53 11 02",
      city: "Chamonix",
      country: "France",
      totalOrders: 1,
      totalSpent: 495.0,
      joinedAt: "2026-02-01",
      status: "active",
    },
  ];

  const initialCoupons: AdminCoupon[] = [
    {
      id: "coup-1",
      code: "WINTER10",
      discountType: "percentage",
      value: 10,
      minOrderValue: 200,
      usageLimit: 500,
      usedCount: 142,
      expiresAt: "2026-12-31",
      isActive: true,
    },
    {
      id: "coup-2",
      code: "VIPALPINE20",
      discountType: "percentage",
      value: 20,
      minOrderValue: 500,
      usageLimit: 100,
      usedCount: 38,
      expiresAt: "2026-12-15",
      isActive: true,
    },
    {
      id: "coup-3",
      code: "FREESHIP",
      discountType: "free_shipping",
      value: 0,
      minOrderValue: 150,
      usageLimit: 1000,
      usedCount: 429,
      expiresAt: "2026-11-30",
      isActive: true,
    },
    {
      id: "coup-4",
      code: "BLACKFRIDAY50",
      discountType: "fixed_amount",
      value: 50,
      minOrderValue: 300,
      usageLimit: 250,
      usedCount: 250,
      expiresAt: "2026-11-28",
      isActive: false, // Expired/Maxed
    },
  ];

  const initialReviews: AdminReview[] = [
    {
      id: "rev-1",
      productId: "prod-001",
      productTitle: "Nordic Expedition Down Parka",
      author: "Lars V.",
      email: "lars.v@tromso-exp.no",
      rating: 5,
      title: "Sub-zero perfection in Northern Norway",
      comment: "Tested this in -24°C in Tromsø. The down loft is extraordinary and the high collar blocks arctic wind completely.",
      status: "approved",
      createdAt: "2026-02-14",
    },
    {
      id: "rev-2",
      productId: "prod-005",
      productTitle: "Heavyweight Merino Cable Knit Sweater",
      author: "Celine B.",
      email: "celine@zermatt-luxury.ch",
      rating: 5,
      title: "Remarkable density and softness",
      comment: "Warmth without itchiness. The cable knit geometry looks even better in person than the studio lookbook.",
      status: "approved",
      createdAt: "2026-02-12",
    },
    {
      id: "rev-3",
      productId: "prod-008",
      productTitle: "Alpine Shearling Lined Trekking Boot",
      author: "Matthias K.",
      email: "matthias.k@kitzbuehel.at",
      rating: 4,
      title: "Vibram grip is outstanding, snug fit",
      comment: "Great traction on black ice. Recommending half size up if wearing thick thermal socks.",
      status: "approved",
      createdAt: "2026-02-10",
    },
    {
      id: "rev-4",
      productId: "prod-004",
      productTitle: "Thermal Insulated Shell Coat",
      author: "Claire D.",
      email: "claire.d@montreal.ca",
      rating: 5,
      title: "Immaculate tailoring and windproof",
      comment: "Wore this in a heavy blizzard. Not a single drop of moisture seeped through.",
      status: "pending",
      createdAt: "2026-02-24",
    },
  ];

  const initialStaff: AdminStaff[] = [
    {
      id: "staff-1",
      name: "Raihan Rana",
      email: "admin@winter-fashion.com",
      role: "super_admin",
      lastActive: "Just now",
      status: "active",
    },
    {
      id: "staff-2",
      name: "Camilla Lind",
      email: "camilla.lind@winter-fashion.com",
      role: "catalog_manager",
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: "staff-3",
      name: "Erik Thorne",
      email: "erik.thorne@winter-fashion.com",
      role: "order_specialist",
      lastActive: "35 minutes ago",
      status: "active",
    },
    {
      id: "staff-4",
      name: "Nora Althaus",
      email: "nora.althaus@winter-fashion.com",
      role: "support_agent",
      lastActive: "1 day ago",
      status: "active",
    },
  ];

  const initialAuditLogs: AdminAuditLog[] = [
    {
      id: "log-1",
      actorName: "Raihan Rana",
      actorEmail: "admin@winter-fashion.com",
      action: "System Initialization",
      entity: "Platform",
      entityId: "SYSTEM",
      details: "Database schema verified with 22 PostgreSQL tables and RLS security.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "log-2",
      actorName: "Camilla Lind",
      actorEmail: "camilla.lind@winter-fashion.com",
      action: "Product Price Updated",
      entity: "Product",
      entityId: "prod-001",
      details: "Updated Nordic Expedition Down Parka compareAtPrice to $795.00.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "log-3",
      actorName: "Erik Thorne",
      actorEmail: "erik.thorne@winter-fashion.com",
      action: "Order Dispatched",
      entity: "Order",
      entityId: "ord-901",
      details: "Dispatched order via DHL Express with tracking DHL-CH-882941019.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: "log-4",
      actorName: "Raihan Rana",
      actorEmail: "admin@winter-fashion.com",
      action: "Coupon Created",
      entity: "Coupon",
      entityId: "coup-1",
      details: "Created active 10% discount coupon code WINTER10 with $200 min spend.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];

  const initialSettings: AdminSettings = {
    storeName: "Cold Horizon — Archival Winter Luxury",
    storeDomain: "coldhorizon-fashion.com",
    defaultCurrency: "USD",
    supportEmail: "concierge@coldhorizon-fashion.com",
    orderNotificationEmail: "orders@coldhorizon-fashion.com",
    standardShippingFee: 25.0,
    freeShippingThreshold: 50.0,
    taxRate: 8.5,
    lowStockThreshold: 5,
    maintenanceMode: false,
  };

  const initialCampaigns: AdminCampaign[] = [
    {
      id: "camp-001",
      title: "Hero Winter 26/27 Drop - Designed for Colder Days",
      slug: "colder-days-hero",
      type: "banner",
      placement: "hero",
      desktopImage: "/images/wardrobe/super-hero.jpg",
      mobileImage: "/images/wardrobe/super-hero.jpg",
      headline: "Designed for colder days",
      subheadline: "Our winter pieces focus on comfort, form, and quiet confidence. Easy to wear. Easy to keep.",
      badgeText: "NEW DROP",
      ctaText: "Shop the Collection",
      destinationUrl: "/products",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
      isActive: true,
      impressions: 4892,
      clicks: 814,
      priority: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "camp-002",
      title: "Top Announcement Bar - Global Express Transit & 25% Off",
      slug: "free-shipping-announcement",
      type: "announcement",
      placement: "announcement_bar",
      desktopImage: "",
      headline: "Complimentary Worldwide Express Transit on Orders Over $200",
      subheadline: "Enter Code ARCTIC25 at checkout for 25% off",
      badgeText: "LIMITED TIME",
      ctaText: "Claim 25% Off",
      destinationUrl: "/products",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      isActive: true,
      impressions: 12450,
      clicks: 1620,
      discountRule: {
        type: "percentage",
        value: 25,
        minPurchase: 200,
        couponCode: "ARCTIC25",
      },
      priority: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "camp-003",
      title: "Black Friday Sub-Zero Outerwear Flash Sale",
      slug: "black-friday-flash-sale",
      type: "flash_sale",
      placement: "promo_section",
      desktopImage: "/images/wardrobe/black-friday.jpg",
      mobileImage: "/images/wardrobe/black-friday.jpg",
      headline: "Black Friday deals are live",
      subheadline: "Premium down coats, thermal shells, and cashmere tailoring up to 40% off for 48 hours.",
      badgeText: "FLASH SALE",
      ctaText: "Shop Flash Deals",
      destinationUrl: "/products",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
      isActive: true,
      impressions: 6180,
      clicks: 1240,
      countdownTimer: {
        enabled: true,
        targetDate: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
      },
      discountRule: {
        type: "percentage",
        value: 40,
        minPurchase: 150,
      },
      priority: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "camp-004",
      title: "Category Split Feature - Women & Men Winter Cut",
      slug: "category-split-promo",
      type: "promo",
      placement: "category_header",
      desktopImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800",
      headline: "Curated Cold-Weather Silhouettes",
      subheadline: "Tailored down parkas, heavyweight knits, and architectural alpine layering.",
      badgeText: "2026/27 EDITION",
      ctaText: "Explore Departments",
      destinationUrl: "/products",
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
      isActive: true,
      impressions: 3410,
      clicks: 495,
      priority: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const initialTaxRules: AdminTaxRule[] = [
    { id: "tax-us", countryCode: "US", countryName: "United States", taxType: "sales_tax", rate: 0.085, isInclusive: false, isActive: true },
    { id: "tax-gb", countryCode: "GB", countryName: "United Kingdom", taxType: "vat", rate: 0.20, isInclusive: true, isActive: true },
    { id: "tax-ch", countryCode: "CH", countryName: "Switzerland", taxType: "vat", rate: 0.081, isInclusive: true, isActive: true },
    { id: "tax-de", countryCode: "DE", countryName: "Germany", taxType: "vat", rate: 0.19, isInclusive: true, isActive: true },
    { id: "tax-fr", countryCode: "FR", countryName: "France", taxType: "vat", rate: 0.20, isInclusive: true, isActive: true },
    { id: "tax-nl", countryCode: "NL", countryName: "Netherlands", taxType: "vat", rate: 0.21, isInclusive: true, isActive: true },
    { id: "tax-ca", countryCode: "CA", countryName: "Canada", taxType: "gst", rate: 0.13, isInclusive: false, isActive: true },
    { id: "tax-au", countryCode: "AU", countryName: "Australia", taxType: "gst", rate: 0.10, isInclusive: true, isActive: true },
    { id: "tax-jp", countryCode: "JP", countryName: "Japan", taxType: "gst", rate: 0.10, isInclusive: true, isActive: true },
    { id: "tax-se", countryCode: "SE", countryName: "Sweden", taxType: "vat", rate: 0.25, isInclusive: true, isActive: true },
    { id: "tax-no", countryCode: "NO", countryName: "Norway", taxType: "vat", rate: 0.25, isInclusive: true, isActive: true },
  ];

  const initialShippingZones: AdminShippingZone[] = [
    {
      id: "zone-domestic",
      name: "Domestic United States",
      countries: ["US"],
      standardFee: 15.0,
      expressFee: 35.0,
      freeShippingThreshold: 200.0,
      estimatedDaysMin: 3,
      estimatedDaysMax: 5,
      isActive: true,
    },
    {
      id: "zone-europe-west",
      name: "Western Europe & Switzerland",
      countries: ["GB", "CH", "DE", "FR", "NL", "IT", "ES", "BE", "AT", "IE"],
      standardFee: 25.0,
      expressFee: 45.0,
      freeShippingThreshold: 200.0,
      estimatedDaysMin: 4,
      estimatedDaysMax: 6,
      isActive: true,
    },
    {
      id: "zone-nordic",
      name: "Nordics & Scandinavia",
      countries: ["SE", "NO", "DK", "FI", "IS"],
      standardFee: 28.0,
      expressFee: 50.0,
      freeShippingThreshold: 220.0,
      estimatedDaysMin: 4,
      estimatedDaysMax: 7,
      isActive: true,
    },
    {
      id: "zone-north-america",
      name: "Canada & Trans-Border",
      countries: ["CA"],
      standardFee: 20.0,
      expressFee: 40.0,
      freeShippingThreshold: 200.0,
      estimatedDaysMin: 3,
      estimatedDaysMax: 5,
      isActive: true,
    },
    {
      id: "zone-asia-pacific",
      name: "Asia-Pacific Region",
      countries: ["AU", "JP", "SG", "NZ", "KR", "HK"],
      standardFee: 35.0,
      expressFee: 55.0,
      freeShippingThreshold: 250.0,
      estimatedDaysMin: 5,
      estimatedDaysMax: 8,
      isActive: true,
    },
    {
      id: "zone-row",
      name: "Global Rest of World",
      countries: [],
      standardFee: 40.0,
      expressFee: 65.0,
      freeShippingThreshold: 300.0,
      estimatedDaysMin: 7,
      estimatedDaysMax: 12,
      isActive: true,
    },
  ];

  const initialInstagramConfig: InstagramConfig = {
    handle: "kora.winter",
    profileUrl: "https://instagram.com/kora.winter",
    accessToken: "",
    autoSync: false,
    posts: [
      {
        id: "ig-001",
        imageUrl: "/images/wardrobe/bZjYMI83pPwIDnCh0nG79sedo.jpg",
        permalink: "https://instagram.com/kora.winter",
        caption: "Sub-Zero Expedition Parka field testing in Tromsø, Norway. 850 fill goose down with Toray waterproof membrane.",
        likesCount: 1420,
        commentsCount: 84,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: "ig-002",
        imageUrl: "/images/wardrobe/uSP5ea5zqNJXxT5jmPWYTI3wZMc.jpg",
        permalink: "https://instagram.com/kora.winter",
        caption: "Layering essentials. Heavyweight Merino knitwear designed for arctic sub-zero comfort.",
        likesCount: 2190,
        commentsCount: 132,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      },
      {
        id: "ig-003",
        imageUrl: "/images/wardrobe/lIT6XTSJ7w7ldhyW6UnppvsA.jpg",
        permalink: "https://instagram.com/kora.winter",
        caption: "Quiet confidence. Cashmere overcoat in natural alpine lighting.",
        likesCount: 3840,
        commentsCount: 215,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      },
      {
        id: "ig-004",
        imageUrl: "/images/wardrobe/VHE2QuCOl6cE6GR0KXglRilpug.jpg",
        permalink: "https://instagram.com/kora.winter",
        caption: "Heavy gauge turtleneck with cold weather protection accessories.",
        likesCount: 1850,
        commentsCount: 96,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      },
    ],
  };

  const initialPartners: AdminPartner[] = [
    {
      id: "part-001",
      name: "The North Face",
      websiteUrl: "https://www.thenorthface.com",
      order: 1,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 155 36" fill="currentColor" className="h-7 w-auto"><text x="0" y="10" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">THE</text><text x="0" y="21" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">NORTH</text><text x="0" y="32" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">FACE</text><g transform="translate(62, 0)"><path d="M28 32c10 0 18-8 18-18h-4.5c0 7.5-6 13.5-13.5 13.5V32z" /><path d="M35 32c13.5 0 24.5-11 24.5-24.5H55C55 18 46 27.5 35 27.5V32z" /><path d="M42 32c17 0 31-14 31-31H68C68 14 56.5 27.5 42 27.5V32z" /></g></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-002",
      name: "Arc'teryx",
      websiteUrl: "https://arcteryx.com",
      order: 2,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 170 36" fill="currentColor" className="h-7 w-auto"><g transform="translate(0, 0)"><path d="M18 4c-1.5 2.5-4 4-7 4.5 2 .8 4.2.8 6.2 0-1.8 2.2-4.5 3.5-7.5 3.8 2.5.4 5.2 0 7.5-1.2-1.5 2.8-4.2 4.8-7.5 5.5 2.8.1 5.5-.8 7.8-2.5-1 3.2-3.5 5.8-6.8 7 3-.2 5.8-1.5 8-3.5-.5 3.5-2.5 6.5-5.5 8.2 3.2-.5 6-2.2 8-4.8 0 3.8-1.8 7.2-4.5 9.2 3.5-.8 6.5-3 8.5-6.2.5 4-1 8-3.5 10.5 3.5-1.2 6.5-4 8.2-7.5 1 4-.2 8.2-2.5 11 3.5-1.5 6.2-4.8 7.8-8.5.5 2 1.5 4 3 5-1-2.5-1.2-5.5-.5-8 1.5 2.5 4 4.5 7 5.5-2-2-3-5-2.8-8 2 2 5 3.5 8 3.8-2.5-1.8-3.8-4.8-3.5-7.8 2.2 1.5 5 2.2 7.8 2-2.5-2-3.8-5-3.5-8 2.5 1 5.2 1.2 7.8.5-2.8-1.8-4.2-5-3.8-8.2 2.8.5 5.5 0 8-1.5-2.8-1.5-4.5-4.5-4.5-7.8 2.8 0 5.5-.8 7.8-2.2-2.5-1.2-4.5-3.8-4.8-6.8 2.8-.5 5.2-1.8 7-3.8-2.2-.8-4.2-2.5-5-5 2.5-.8 4.8-2.2 6.2-4.2" transform="scale(0.5) translate(4, 4)" /><text x="44" y="24" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="4.5">ARC'TERYX</text></g></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-003",
      name: "Nike",
      websiteUrl: "https://www.nike.com",
      order: 3,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 95 34" fill="currentColor" className="h-6.5 w-auto"><path d="M92.7 5.4c-12.7 7.7-27.4 14.8-40.8 19.8-9.4 3.5-17.7 5.3-24.3 5.3-8.8 0-14.7-3.7-17-10.6-2.5-7.5.8-14.5 8.9-19 6.2-3.5 14.7-4.3 22.8-2.2 1.5.4 1.2 2.5-.4 2.6-9.1.5-16.8 3.1-20.9 7.3-3.6 3.7-4.4 7.6-2.2 11.2 2.6 4.3 8.3 6.1 15.7 5 6.6-1 14.6-4.5 23-9.5 13.5-8 26.6-17.5 34.6-22.3 2-1.2 4-.8 3.5 1.4-.7 3.3-1.9 7.3-2.9 11z" /></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-004",
      name: "Patagonia",
      websiteUrl: "https://www.patagonia.com",
      order: 4,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 160 36" fill="currentColor" className="h-7 w-auto"><path d="M4 16 L12 6 L20 14 L28 4 L38 16 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><path d="M12 6 L16 11 L24 11" stroke="currentColor" strokeWidth="1.5" /><text x="44" y="24" fontSize="20" fontWeight="700" fontFamily="'Georgia', serif" fontStyle="italic" letterSpacing="0.5">patagonia</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-005",
      name: "Moncler",
      websiteUrl: "https://www.moncler.com",
      order: 5,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 150 36" fill="currentColor" className="h-7.5 w-auto"><g transform="translate(2, 2)"><path d="M16 2c-4 5-8 12-8 19 0 7 4 11 8 11s8-4 8-11c0-7-4-14-8-19z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 10c-1.5 2-3 5-3 8 0 3 1.5 5 3 5s3-2 3-5c0-3-1.5-6-3-8z" fill="currentColor" /><path d="M16 4 L14 8 L18 8 Z" fill="currentColor" /></g><text x="42" y="24" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="4">MONCLER</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-006",
      name: "Canada Goose",
      websiteUrl: "https://www.canadagoose.com",
      order: 6,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 165 36" fill="currentColor" className="h-7.5 w-auto"><g transform="translate(4, 3)"><circle cx="15" cy="15" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" /><polygon points="15,6 17,15 15,24 13,15" fill="currentColor" /></g><text x="44" y="17" fontSize="10.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3">CANADA</text><text x="44" y="30" fontSize="10.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3">GOOSE®</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-007",
      name: "Stone Island",
      websiteUrl: "https://www.stoneisland.com",
      order: 7,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 160 36" fill="currentColor" className="h-7.5 w-auto"><g transform="translate(4, 3)"><circle cx="15" cy="15" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" strokeWidth="1" /><polygon points="15,4 17,13 26,15 17,17 15,26 13,17 4,15 13,13" fill="currentColor" /><circle cx="15" cy="15" r="2.5" fill="#FFF" /></g><text x="44" y="17" fontSize="10.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="2">STONE</text><text x="44" y="30" fontSize="10.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="2">ISLAND</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-008",
      name: "GORE-TEX",
      websiteUrl: "https://www.gore-tex.com",
      order: 8,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 150 36" fill="currentColor" className="h-7 w-auto"><g transform="translate(4, 3)"><polygon points="15,2 28,15 15,28 2,15" fill="none" stroke="currentColor" strokeWidth="2.5" /><polygon points="15,8 22,15 15,22 8,15" fill="currentColor" /></g><text x="40" y="24" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3">GORE-TEX</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-009",
      name: "Salomon",
      websiteUrl: "https://www.salomon.com",
      order: 9,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 155 36" fill="currentColor" className="h-6.5 w-auto"><g transform="translate(2, 4)"><path d="M4 18c0-6 4-10 10-10h4v6h-4c-2 0-4 1-4 4s2 4 4 4h4c6 0 10 4 10 10s-4 10-10 10H4v-6h10c2 0 4-1 4-4s-2-4-4-4H8c-4 0-4-4-4-4z" transform="scale(0.65)" /></g><text x="34" y="24" fontSize="17" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3.5">SALOMON</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-010",
      name: "Vibram",
      websiteUrl: "https://www.vibram.com",
      order: 10,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 130 36" fill="currentColor" className="h-7 w-auto"><polygon points="8,3 122,3 114,33 0,33" fill="none" stroke="currentColor" strokeWidth="2.5" /><text x="61" y="23" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3">vibram</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-011",
      name: "Adidas",
      websiteUrl: "https://www.adidas.com",
      order: 11,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 130 36" fill="currentColor" className="h-7 w-auto"><g transform="translate(4, 5)"><polygon points="0,20 6,20 12,12 6,12" /><polygon points="8,20 14,20 22,7 16,7" /><polygon points="16,20 22,20 32,2 26,2" /></g><text x="46" y="24" fontSize="17" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">adidas</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-012",
      name: "Prada",
      websiteUrl: "https://www.prada.com",
      order: 12,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 135 36" fill="currentColor" className="h-7 w-auto"><polygon points="4,4 131,4 67.5,33" fill="none" stroke="currentColor" strokeWidth="2.5" /><text x="67.5" y="19" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="'Times New Roman', serif" letterSpacing="4">PRADA</text><text x="67.5" y="28" textAnchor="middle" fontSize="6.5" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="2">MILANO</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-013",
      name: "Oakley",
      websiteUrl: "https://www.oakley.com",
      order: 13,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 135 36" fill="currentColor" className="h-7 w-auto"><ellipse cx="18" cy="18" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="3" /><ellipse cx="18" cy="18" rx="8" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><text x="44" y="24" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="3">OAKLEY</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "part-014",
      name: "Carhartt",
      websiteUrl: "https://www.carhartt-wip.com",
      order: 14,
      isActive: true,
      logoSvg: `<svg viewBox="0 0 150 36" fill="currentColor" className="h-7 w-auto"><g transform="translate(2, 3)"><path d="M15 4c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12h-6c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c2 0 3.8 1 4.9 2.5l4.7-3.7C22.4 6 18.9 4 15 4z" /><path d="M15 13c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" /></g><text x="42" y="23" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="1.5">carhartt</text></svg>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const initialJournalArticles: AdminJournalArticle[] = [
    {
      id: "art-1",
      slug: "building-a-quiet-winter-wardrobe",
      image: "/images/wardrobe/AFa3pXi6rgIjU1cTtgBzlijk5o.jpg",
      category: "Style guide",
      readTime: "6 min read",
      title: "Building a quiet winter wardrobe",
      excerpt: "Fewer pieces, warmer layers, and coats that do more than one job.",
      content: `Winter morning dressing should never feel like a high-friction negotiation with your closet. When temperatures plunge below freezing, the instinct is often to throw on excessive bulk—layer upon layer until silhouettes disappear and natural mobility is compromised.

The philosophy of a quiet winter wardrobe is radically simple: invest in fewer, exceptional garments that handle thermal regulation naturally. A 450 GSM pure Merino cable knit creates an insulating microclimate around your core, while an 800 Fill Power down parka shields against biting winds without burdensome weight.

### The Foundation of Cold-Weather Layering

1. **Base Layer:** Fine-spun thermal turtlenecks or technical merino tees that pull moisture away from the skin while retaining body heat.
2. **Thermal Mid-Layer:** Unbrushed Mongolian cashmere or high-pile fleece that traps warm air in microscopic pockets.
3. **Weatherproof Outer Shell:** Tailored down cocoon coats or 3-layer GORE-grade alpine hard shells that repel freezing rain and mountain snow.

When every piece in your rotation is cut to exacting proportions and neutral monochromatic palettes, getting dressed becomes an effortless, confident daily ritual.`,
      author: "Elena Rostova",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      isPublished: true,
      order: 1,
    },
    {
      id: "art-2",
      slug: "layering-denim-for-transitional-weather",
      image: "/images/wardrobe/layer-denim.jpg",
      category: "How to wear",
      readTime: "4 min read",
      title: "Layering denim for transitional weather",
      excerpt: "How to wear denim jackets and jeans when mornings are cold and afternoons warm up.",
      content: `Transitional seasonal weather is notorious for steep temperature swings: crisp 35°F mornings that warm up to 60°F by mid-afternoon. Denim is the ultimate transitional textile—heavy enough to block the wind, yet breathable enough for all-day city movement.

### The Double-Denim Rule for Winter

Pairing a raw selvedge jacket over a ribbed merino turtleneck breaks the monotony of traditional winter wools. To prevent feeling stiff, look for 13.5 oz Japanese or Italian denim that has been pre-washed or blended with 1% elastane for unrestricted alpine range of motion.

Add a shearling-lined collar or throw an unlined cashmere overcoat on top, and you have an architectural look that seamlessly transitions from brisk outdoor strolls to heated gallery interiors.`,
      author: "Julian Vance",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      isPublished: true,
      order: 2,
    },
    {
      id: "art-3",
      slug: "what-people-actually-wear-on-busy-days",
      image: "/images/wardrobe/C9YOETuP6DWDsoWsKpvONxkKE.jpg",
      category: "Lifestyle",
      readTime: "5 min read",
      title: "What people actually wear on busy days",
      excerpt: "Real outfits for real schedules. Comfortable, simple, and put together.",
      content: `Real life doesn't happen on a catwalk. Between early-morning commutes, airport security lines, client meetings, and evening dinners, what people really need is functional elegance.

Garments that don't wrinkle in luggage, coats with fleece-lined handwarmer pockets, and boots engineered with Vibram Arctic Grip that prevent slipping on black ice.

### Key Pieces for High-Motion Days

- **The Cocoon Coat:** Roomy enough to slip over thick tailoring without shoulder pinch or fabric bunching.
- **The Seamless Cashmere Knit:** Lightweight, pill-resistant, and breathable under intense office heating.
- **Waterproof Trekking Boots:** Refined enough for metropolitan streets, rugged enough for unexpected snowdrifts.`,
      author: "Søren Lindqvist",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      isPublished: true,
      order: 3,
    },
    {
      id: "art-4",
      slug: "sub-zero-thermal-craft-and-mongolian-cashmere",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=800",
      category: "Material craft",
      readTime: "7 min read",
      title: "Sub-zero thermal craft & Mongolian cashmere",
      excerpt: "The science of 450 GSM pure wool knits engineered for alpine temperature drops.",
      content: `High in the Altai Mountains of Mongolia, winter temperatures consistently fall below -40°C. In response to this extreme habitat, the native Capra hircus goats develop a dense, remarkably fine underfleece beneath their coarse outer hair.

Each fiber measures between 14 and 16 microns in diameter—almost six times finer than human hair. When spun into dense 4-ply and 8-ply yarns, this fiber creates millions of microscopic air pockets that trap body heat far more efficiently than standard sheep's wool.

### Crafting 450 GSM Knitwear

Standard commercial knitwear typically weighs between 200 and 280 grams per square meter. At WARDROBE, our heavyweight sweaters are woven at 450 GSM, resulting in garments that drape with substantial presence and resist the biting winds of northern winters without requiring artificial synthetic blends.`,
      author: "Astrid Lind",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      isPublished: true,
      order: 4,
    },
  ];

  return {
    products: initialProducts,
    categories: initialCategories,
    orders: initialOrders,
    customers: initialCustomers,
    coupons: initialCoupons,
    reviews: initialReviews,
    staff: initialStaff,
    campaigns: initialCampaigns,
    auditLogs: initialAuditLogs,
    settings: initialSettings,
    taxRules: initialTaxRules,
    shippingZones: initialShippingZones,
    instagramConfig: initialInstagramConfig,
    partners: initialPartners,
    journalArticles: initialJournalArticles,
  };
}

// In-Memory cache with Disk Synchronization
let memoryState: AdminState | null = null;

function loadState(): AdminState {
  if (memoryState) return memoryState;

  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, "utf-8");
      memoryState = JSON.parse(data);
      if (!memoryState!.campaigns || memoryState!.campaigns.length === 0) {
        memoryState!.campaigns = getInitialState().campaigns;
        saveState(memoryState!);
      }
      if (!memoryState!.taxRules || memoryState!.taxRules.length === 0) {
        memoryState!.taxRules = getInitialState().taxRules;
        saveState(memoryState!);
      }
      if (!memoryState!.shippingZones || memoryState!.shippingZones.length === 0) {
        memoryState!.shippingZones = getInitialState().shippingZones;
        saveState(memoryState!);
      }
      if (!memoryState!.instagramConfig || !memoryState!.instagramConfig.posts) {
        memoryState!.instagramConfig = getInitialState().instagramConfig;
        saveState(memoryState!);
      }
      if (!memoryState!.partners || memoryState!.partners.length === 0) {
        memoryState!.partners = getInitialState().partners;
        saveState(memoryState!);
      }
      if (!memoryState!.journalArticles || memoryState!.journalArticles.length === 0) {
        memoryState!.journalArticles = getInitialState().journalArticles;
        saveState(memoryState!);
      }
      // Ensure existing categories have gender tags
      if (memoryState!.categories) {
        let changed = false;
        memoryState!.categories.forEach((cat) => {
          if (!cat.gender) {
            if (cat.slug.includes("women")) cat.gender = "women";
            else if (cat.slug.includes("men")) cat.gender = "men";
            else cat.gender = "all";
            changed = true;
          }
        });
        if (changed) saveState(memoryState!);
      }
      return memoryState!;
    }
  } catch (err) {
    console.error("Failed to read admin state from disk, using initial state:", err);
  }

  memoryState = getInitialState();
  saveState(memoryState);
  return memoryState;
}

function syncToProductsCatalog(products: Product[]): void {
  try {
    const catalogFile = path.join(process.cwd(), "data", "products.ts");
    if (!fs.existsSync(catalogFile)) return;
    let catalogTs = fs.readFileSync(catalogFile, "utf-8");

    products.forEach((p) => {
      if (p.primaryImage) {
        const primaryRegex = new RegExp('(id:\\s*"' + p.id + '"[\\s\\S]*?primaryImage:\\s*)"[^"]+"', "m");
        if (primaryRegex.test(catalogTs)) {
          catalogTs = catalogTs.replace(primaryRegex, '$1"' + p.primaryImage + '"');
        }
      }
      if (p.galleryImages && p.galleryImages.length > 0) {
        const secRegex = new RegExp('(id:\\s*"' + p.id + '"[\\s\\S]*?secondaryImage:\\s*)"[^"]+"', "m");
        if (secRegex.test(catalogTs)) {
          catalogTs = catalogTs.replace(secRegex, '$1"' + p.galleryImages[0] + '"');
        }
        const galleryBlock = 'galleryImages: [\n' + p.galleryImages.map((img) => `      "${img}",`).join("\n") + "\n    ]";
        const galRegex = new RegExp('(id:\\s*"' + p.id + '"[\\s\\S]*?)galleryImages:\\s*\\[[^\\]]*\\]', "m");
        if (galRegex.test(catalogTs)) {
          catalogTs = catalogTs.replace(galRegex, "$1" + galleryBlock);
        }
      }
    });

    fs.writeFileSync(catalogFile, catalogTs, "utf-8");
  } catch (err) {
    console.error("Failed to sync to products.ts:", err);
  }
}

function saveState(state: AdminState): void {
  try {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
    syncToProductsCatalog(state.products);
  } catch (err) {
    console.error("Failed to save admin state to disk:", err);
  }
}

// ==============================================================================
// PUBLIC ADMIN STORE METHODS
// ==============================================================================

export const AdminStore = {
  // 1. Overview Analytics
  getOverviewMetrics() {
    const state = loadState();
    const totalOrders = state.orders.length;
    const totalRevenue = state.orders.reduce((acc, o) => acc + (o.paymentStatus === "paid" ? o.total : 0), 0);
    const totalCustomers = state.customers.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Daily Sales Series (last 7 days)
    const salesChart = [
      { date: "Feb 20", revenue: 1420, orders: 2 },
      { date: "Feb 21", revenue: 2150, orders: 3 },
      { date: "Feb 22", revenue: 1890, orders: 2 },
      { date: "Feb 23", revenue: 3100, orders: 4 },
      { date: "Feb 24", revenue: 2650, orders: 3 },
      { date: "Feb 25", revenue: 3420, orders: 4 },
      { date: "Feb 26", revenue: totalRevenue, orders: totalOrders },
    ];

    // Low stock products (< threshold)
    const lowStockAlerts = state.products.filter(
      (p) => p.stockCount <= state.settings.lowStockThreshold && !p.isArchived
    );

    // Best-selling products
    const bestSellers = state.products
      .filter((p) => p.isBestSeller || p.rating >= 4.9)
      .slice(0, 5);

    // Recent 5 orders
    const recentOrders = [...state.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      growthPercentage: 18.4,
      salesChart,
      recentOrders,
      bestSellers,
      lowStockAlerts,
      settings: state.settings,
    };
  },

  // 2. Products
  getProducts(query?: { search?: string; category?: string; status?: string }) {
    const state = loadState();
    let result = [...state.products];

    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      );
    }

    if (query?.category && query.category !== "all") {
      result = result.filter((p) => p.category === query.category || p.categoryLabel === query.category);
    }

    if (query?.status) {
      if (query.status === "published") result = result.filter((p) => p.isPublished && !p.isArchived);
      if (query.status === "archived") result = result.filter((p) => p.isArchived);
      if (query.status === "low_stock") result = result.filter((p) => p.stockCount <= state.settings.lowStockThreshold);
    }

    return result;
  },

  getProductById(id: string) {
    const state = loadState();
    return state.products.find((p) => p.id === id);
  },

  createProduct(data: Partial<Product>, actor: { name: string; email: string }) {
    const state = loadState();
    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const newProduct: Product & { isArchived: boolean; isPublished: boolean } = {
      id: newId,
      slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `winter-${newId}`,
      title: data.title || "Untitled Winter Garment",
      subtitle: data.subtitle || "Cold Horizon Archival Collection",
      description: data.description || "Master-tailored cold weather piece with premium insulation.",
      gender: data.gender || "unisex",
      category: data.category || "jackets-coats",
      categoryLabel: data.categoryLabel || "Jackets & Coats",
      price: data.price || 250,
      compareAtPrice: data.compareAtPrice,
      currency: "USD",
      primaryImage: data.primaryImage || "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800",
      galleryImages: data.galleryImages || [
        "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800",
      ],
      materials: data.materials || ["100% Technical Polyamide", "850 Fill Goose Down"],
      careInstructions: data.careInstructions || "Specialist dry clean only",
      fitType: data.fitType || "Regular Fit",
      colorways: data.colorways || [{ name: "Obsidian", hex: "#111" }],
      sizes: data.sizes || ["S", "M", "L", "XL"],
      stockCount: data.stockCount ?? 20,
      rating: 5.0,
      reviewCount: 0,
      isPublished: true,
      isArchived: false,
    };

    state.products.unshift(newProduct);

    // Audit log
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Product Created",
      entity: "Product",
      entityId: newProduct.id,
      details: `Created new product "${newProduct.title}" with initial stock of ${newProduct.stockCount}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product & { isArchived?: boolean; isPublished?: boolean }>, actor: { name: string; email: string }) {
    const state = loadState();
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const previous = state.products[idx];
    state.products[idx] = { ...previous, ...updates };
    if (updates.galleryImages !== undefined) {
      state.products[idx].secondaryImage = updates.galleryImages[0] || "";
    }

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Product Updated",
      entity: "Product",
      entityId: id,
      details: `Updated product "${state.products[idx].title}". Fields changed: ${Object.keys(updates).join(", ")}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return state.products[idx];
  },

  deleteProduct(id: string, actor: { name: string; email: string }) {
    const state = loadState();
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    const deletedTitle = state.products[idx].title;
    state.products.splice(idx, 1);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Product Deleted",
      entity: "Product",
      entityId: id,
      details: `Permanently removed product "${deletedTitle}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return true;
  },

  // 3. Categories
  getCategories() {
    return loadState().categories;
  },

  getCategoryById(id: string): AdminCategory | undefined {
    const state = loadState();
    return state.categories.find((c) => c.id === id || c.slug === id);
  },

  createCategory(data: Partial<AdminCategory>, actor: { name: string; email: string }) {
    const state = loadState();
    const newCat: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: data.name || "New Winter Category",
      slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `category-${Date.now()}`,
      description: data.description || "Collection of archival pieces.",
      image: data.image || "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      productCount: 0,
      gender: data.gender || "all",
      featured: data.featured ?? false,
    };
    state.categories.push(newCat);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Category Created",
      entity: "Category",
      entityId: newCat.id,
      details: `Created new category "${newCat.name}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return newCat;
  },

  updateCategory(
    id: string,
    data: Partial<AdminCategory>,
    actor?: { name: string; email: string }
  ): AdminCategory | null {
    const state = loadState();
    const index = state.categories.findIndex((c) => c.id === id || c.slug === id);
    if (index === -1) return null;

    const existing = state.categories[index];
    const updated: AdminCategory = {
      ...existing,
      ...data,
      id: existing.id,
    };
    state.categories[index] = updated;

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Category Updated",
        entity: "Category",
        entityId: id,
        details: `Updated category "${updated.name}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return updated;
  },

  deleteCategory(
    id: string,
    actor?: { name: string; email: string }
  ): boolean {
    const state = loadState();
    const index = state.categories.findIndex((c) => c.id === id || c.slug === id);
    if (index === -1) return false;

    const removed = state.categories.splice(index, 1)[0];
    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Category Deleted",
        entity: "Category",
        entityId: id,
        details: `Deleted category "${removed.name}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return true;
  },

  // 4. Inventory Adjustments
  adjustInventory(productId: string, adjustment: { delta: number; reason: string }, actor: { name: string; email: string }) {
    const state = loadState();
    const product = state.products.find((p) => p.id === productId);
    if (!product) return null;

    const oldStock = product.stockCount;
    product.stockCount = Math.max(0, product.stockCount + adjustment.delta);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Inventory Adjusted",
      entity: "Inventory",
      entityId: productId,
      details: `Adjusted stock for "${product.title}" by ${adjustment.delta > 0 ? "+" : ""}${adjustment.delta} (from ${oldStock} to ${product.stockCount}). Reason: ${adjustment.reason}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return product;
  },

  // 5. Orders
  getOrders(query?: { search?: string; status?: string }) {
    const state = loadState();
    let result = [...state.orders];

    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    if (query?.status && query.status !== "all") {
      result = result.filter((o) => o.status === query.status);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  updateOrderStatus(orderId: string, status: AdminOrder["status"], actor: { name: string; email: string }) {
    const state = loadState();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = status;
    if (status === "delivered") order.fulfillmentStatus = "fulfilled";
    if (status === "shipped") order.fulfillmentStatus = "fulfilled";

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Order Status Changed",
      entity: "Order",
      entityId: order.orderNumber,
      details: `Changed order ${order.orderNumber} status from "${oldStatus}" to "${status}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return order;
  },

  getOrderById(orderId: string) {
    const state = loadState();
    return state.orders.find((o) => o.id === orderId) || null;
  },

  getOrderByNumber(orderNumber: string) {
    const state = loadState();
    return state.orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) || null;
  },

  getOrderByPaymentIntent(paymentIntentId: string) {
    const state = loadState();
    return state.orders.find((o) => o.stripePaymentIntentId === paymentIntentId) || null;
  },

  // Authoritative server-side cart & financial recalculation
  validateAndCalculateCart(params: {
    items: Array<{
      productId?: string;
      productSlug?: string;
      size: string;
      color: string;
      quantity: number;
    }>;
    couponCode?: string;
    shippingCountry?: string;
    shippingMethod?: "standard" | "express";
  }) {
    const state = loadState();
    const settings = state.settings || {
      standardShippingFee: 25,
      freeShippingThreshold: 200,
      taxRate: 0.08,
    };

    const validatedItems: Array<{
      id: string;
      slug: string;
      title: string;
      price: number;
      size: string;
      color: string;
      quantity: number;
      image: string;
      availableStock: number;
      lineTotal: number;
    }> = [];

    const errors: string[] = [];
    let subtotal = 0;

    for (const item of params.items) {
      const product = state.products.find(
        (p) => (item.productId && p.id === item.productId) || (item.productSlug && p.slug === item.productSlug)
      );

      if (!product) {
        errors.push(`Product "${item.productId || item.productSlug}" not found or no longer available.`);
        continue;
      }

      if (product.isArchived) {
        errors.push(`"${product.title}" is archived and cannot be ordered.`);
        continue;
      }

      if (product.stockCount < item.quantity) {
        errors.push(
          `Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.stockCount}.`
        );
      }

      // Authoritative unit price from database (never trusting browser)
      const authoritativePrice = product.price;
      const lineTotal = authoritativePrice * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: authoritativePrice,
        size: item.size || "M",
        color: item.color || "Standard",
        quantity: item.quantity,
        image: product.primaryImage || (product as any).image || "",
        availableStock: product.stockCount,
        lineTotal,
      });
    }

    // Coupon calculation
    let discountAmount = 0;
    let appliedCoupon: AdminCoupon | null = null;
    let couponError: string | null = null;

    if (params.couponCode) {
      const cleanedCode = params.couponCode.trim().toUpperCase();
      const coupon = state.coupons.find((c) => c.code.toUpperCase() === cleanedCode);

      if (!coupon) {
        couponError = `Coupon code "${cleanedCode}" is invalid.`;
      } else if (!coupon.isActive) {
        couponError = `Coupon code "${cleanedCode}" is deactivated.`;
      } else if (new Date(coupon.expiresAt).getTime() < new Date().setHours(0, 0, 0, 0)) {
        couponError = `Coupon code "${cleanedCode}" expired on ${coupon.expiresAt}.`;
      } else if (coupon.usedCount >= coupon.usageLimit) {
        couponError = `Coupon code "${cleanedCode}" has reached its maximum usage limit.`;
      } else if (subtotal < coupon.minOrderValue) {
        couponError = `Coupon "${cleanedCode}" requires a minimum order value of $${coupon.minOrderValue.toFixed(2)}.`;
      } else {
        appliedCoupon = coupon;
        if (coupon.discountType === "percentage") {
          discountAmount = Math.round(((subtotal * coupon.value) / 100) * 100) / 100;
        } else if (coupon.discountType === "fixed_amount") {
          discountAmount = Math.min(subtotal, coupon.value);
        } else if (coupon.discountType === "free_shipping") {
          discountAmount = 0; // Handled in shipping fee below
        }
      }
    }

    // 1. Configurable International Shipping Zone (Never hardcoded)
    const country = (params.shippingCountry || "US").toUpperCase();
    const matchedZone =
      state.shippingZones?.find((z) => z.countries.includes(country) && z.isActive) ||
      state.shippingZones?.find((z) => z.id === "zone-row" || z.name.toLowerCase().includes("rest of world"));

    const freeThreshold = matchedZone ? matchedZone.freeShippingThreshold : (settings.freeShippingThreshold || 200);
    const isFreeShipping = subtotal >= freeThreshold || appliedCoupon?.discountType === "free_shipping";

    const shippingMethod = params.shippingMethod || "standard";
    let shippingFee = 0;
    if (shippingMethod === "express") {
      shippingFee = matchedZone ? matchedZone.expressFee : 45;
    } else {
      shippingFee = isFreeShipping ? 0 : (matchedZone ? matchedZone.standardFee : (settings.standardShippingFee || 25));
    }

    // 2. Configurable International Tax Rules (Never hardcoded)
    const matchedTaxRule = state.taxRules?.find((r) => r.countryCode.toUpperCase() === country && r.isActive);
    let taxRate = 0.085;
    let isInclusive = false;
    let taxType = "sales_tax";

    if (matchedTaxRule) {
      taxRate = matchedTaxRule.rate > 1 ? matchedTaxRule.rate / 100 : matchedTaxRule.rate;
      isInclusive = matchedTaxRule.isInclusive;
      taxType = matchedTaxRule.taxType;
    } else {
      taxRate = settings.taxRate > 1 ? settings.taxRate / 100 : (settings.taxRate || 0.085);
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
    const total = Math.round((taxableAmount + shippingFee + taxAmount) * 100) / 100;

    return {
      isValid: errors.length === 0,
      errors,
      couponError,
      items: validatedItems,
      pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        shippingFee: Math.round(shippingFee * 100) / 100,
        taxAmount,
        taxRate,
        taxType,
        isTaxInclusive: isInclusive,
        total,
        currency: settings.defaultCurrency || "USD",
        shippingZoneName: matchedZone?.name || "Standard International Zone",
      },
      appliedCoupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            discountType: appliedCoupon.discountType,
            value: appliedCoupon.value,
          }
        : null,
      freeShippingThreshold: freeThreshold,
      remainingForFreeShipping: Math.max(0, freeThreshold - subtotal),
    };
  },

  // Create pending order prior to payment
  createPendingOrder(orderData: {
    customerName: string;
    customerEmail: string;
    items: AdminOrder["items"];
    shippingAddress: AdminOrder["shippingAddress"];
    billingAddress?: AdminOrder["billingAddress"];
    pricingBreakdown: NonNullable<AdminOrder["pricingBreakdown"]>;
    shippingMethod: "standard" | "express";
    couponCode?: string;
    stripePaymentIntentId?: string;
    idempotencyKey?: string;
    currency?: string;
  }) {
    const state = loadState();

    // Idempotency check: if order with this idempotencyKey or paymentIntentId exists, return it
    if (orderData.idempotencyKey) {
      const existing = state.orders.find((o) => o.idempotencyKey === orderData.idempotencyKey);
      if (existing) return existing;
    }
    if (orderData.stripePaymentIntentId) {
      const existing = state.orders.find((o) => o.stripePaymentIntentId === orderData.stripePaymentIntentId);
      if (existing) return existing;
    }

    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MON-${year}-${randomHex}`;

    const newOrder: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      total: orderData.pricingBreakdown.total,
      currency: orderData.currency || "USD",
      status: "pending",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      pricingBreakdown: orderData.pricingBreakdown,
      shippingMethod: orderData.shippingMethod,
      couponCode: orderData.couponCode,
      stripePaymentIntentId: orderData.stripePaymentIntentId,
      idempotencyKey: orderData.idempotencyKey,
      trackingNumber: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.orders.unshift(newOrder);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: "Checkout System",
      actorEmail: orderData.customerEmail,
      action: "Order Created (Pending)",
      entity: "Order",
      entityId: newOrder.orderNumber,
      details: `Created pending order ${newOrder.orderNumber} for ${orderData.customerName} ($${newOrder.total}).`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return newOrder;
  },

  // Mark order paid via verified Stripe Webhook event
  markOrderAsPaid(
    identifier: string,
    stripeDetails?: { paymentIntentId?: string; receiptEmail?: string }
  ) {
    const state = loadState();
    const order = state.orders.find(
      (o) =>
        o.id === identifier ||
        o.orderNumber.toUpperCase() === identifier.toUpperCase() ||
        (stripeDetails?.paymentIntentId && o.stripePaymentIntentId === stripeDetails.paymentIntentId)
    );

    if (!order) return null;

    // Idempotency: if already paid, do not double-deduct inventory
    if (order.paymentStatus === "paid") {
      return order;
    }

    order.paymentStatus = "paid";
    order.status = "processing";
    order.updatedAt = new Date().toISOString();
    if (stripeDetails?.paymentIntentId) {
      order.stripePaymentIntentId = stripeDetails.paymentIntentId;
    }

    // Atomically decrement stock for each item in the order
    for (const orderItem of order.items) {
      const product = state.products.find((p) => p.id === orderItem.id);
      if (product) {
        product.stockCount = Math.max(0, product.stockCount - orderItem.quantity);
      }
    }

    // Synchronize customer profile
    let customer = state.customers.find((c) => c.email.toLowerCase() === order.customerEmail.toLowerCase());
    if (customer) {
      customer.totalOrders += 1;
      customer.totalSpent += order.total;
    } else {
      // Create new customer record from checkout
      const newCustomer: AdminCustomer = {
        id: `cust-${Date.now()}`,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.shippingAddress.phone || "+1 (555) 000-0000",
        city: order.shippingAddress.city,
        country: order.shippingAddress.country,
        totalOrders: 1,
        totalSpent: order.total,
        joinedAt: new Date().toISOString().split("T")[0],
        status: order.total > 1000 ? "vip" : "active",
      };
      state.customers.unshift(newCustomer);
    }

    // Increment coupon used count if coupon was used
    if (order.couponCode) {
      const coupon = state.coupons.find((c) => c.code.toUpperCase() === order.couponCode?.toUpperCase());
      if (coupon) {
        coupon.usedCount += 1;
      }
    }

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: "Stripe Webhook",
      actorEmail: "webhook@stripe.com",
      action: "Payment Verified via Webhook",
      entity: "Order",
      entityId: order.orderNumber,
      details: `Stripe webhook confirmed payment for order ${order.orderNumber} ($${order.total}). Inventory decremented.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return order;
  },

  // Mark payment failed via Stripe Webhook event
  markOrderPaymentFailed(identifier: string, reason: string) {
    const state = loadState();
    const order = state.orders.find(
      (o) =>
        o.id === identifier ||
        o.orderNumber.toUpperCase() === identifier.toUpperCase() ||
        o.stripePaymentIntentId === identifier
    );

    if (!order) return null;

    order.paymentStatus = "failed";
    order.status = "cancelled";
    order.failureReason = reason;
    order.updatedAt = new Date().toISOString();

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: "Stripe Webhook",
      actorEmail: "webhook@stripe.com",
      action: "Payment Failed",
      entity: "Order",
      entityId: order.orderNumber,
      details: `Payment failed for order ${order.orderNumber}. Reason: ${reason}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return order;
  },

  // Refund order and restore inventory
  processRefund(
    orderId: string,
    amount: number,
    reason: string,
    actor: { name: string; email: string }
  ) {
    const state = loadState();
    const order = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.paymentStatus = "refunded";
    order.status = "cancelled";
    order.refundedAmount = (order.refundedAmount || 0) + amount;
    order.updatedAt = new Date().toISOString();

    // Restock products
    for (const orderItem of order.items) {
      const product = state.products.find((p) => p.id === orderItem.id);
      if (product) {
        product.stockCount += orderItem.quantity;
      }
    }

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Order Refunded",
      entity: "Order",
      entityId: order.orderNumber,
      details: `Refunded $${amount.toFixed(2)} for order ${order.orderNumber}. Reason: ${reason}. Restocked items.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return order;
  },

  // 6. Customers
  getCustomers(search?: string) {
    const state = loadState();
    if (!search) return state.customers;
    const q = search.toLowerCase();
    return state.customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)
    );
  },

  // 7. Coupons
  getCoupons() {
    return loadState().coupons;
  },

  createCoupon(data: Partial<AdminCoupon>, actor: { name: string; email: string }) {
    const state = loadState();
    const newCoupon: AdminCoupon = {
      id: `coup-${Date.now()}`,
      code: (data.code || "WINTERDISCOUNT").toUpperCase().trim(),
      discountType: data.discountType || "percentage",
      value: data.value || 10,
      minOrderValue: data.minOrderValue || 0,
      usageLimit: data.usageLimit || 100,
      usedCount: 0,
      expiresAt: data.expiresAt || "2026-12-31",
      isActive: true,
    };
    state.coupons.unshift(newCoupon);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Coupon Created",
      entity: "Coupon",
      entityId: newCoupon.code,
      details: `Created coupon ${newCoupon.code} with ${newCoupon.value}${newCoupon.discountType === "percentage" ? "%" : "$"} discount.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return newCoupon;
  },

  toggleCoupon(id: string, actor: { name: string; email: string }) {
    const state = loadState();
    const coupon = state.coupons.find((c) => c.id === id);
    if (!coupon) return null;
    coupon.isActive = !coupon.isActive;

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Coupon Toggled",
      entity: "Coupon",
      entityId: coupon.code,
      details: `${coupon.isActive ? "Activated" : "Deactivated"} coupon ${coupon.code}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return coupon;
  },

  // 8. Reviews
  getReviews(status?: string) {
    const state = loadState();
    if (!status || status === "all") return state.reviews;
    return state.reviews.filter((r) => r.status === status);
  },

  moderateReview(reviewId: string, status: AdminReview["status"], actor: { name: string; email: string }) {
    const state = loadState();
    const review = state.reviews.find((r) => r.id === reviewId);
    if (!review) return null;
    review.status = status;

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Review Moderated",
      entity: "Review",
      entityId: reviewId,
      details: `Review by ${review.author} for "${review.productTitle}" was marked as "${status}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return review;
  },

  // 9. Staff & RBAC
  getStaff() {
    return loadState().staff;
  },

  updateStaffRole(staffId: string, role: AdminStaff["role"], actor: { name: string; email: string }) {
    const state = loadState();
    const member = state.staff.find((s) => s.id === staffId);
    if (!member) return null;
    const oldRole = member.role;
    member.role = role;

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Staff Role Changed",
      entity: "Staff",
      entityId: member.email,
      details: `Changed role of ${member.name} (${member.email}) from "${oldRole}" to "${role}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return member;
  },

  // 10. Settings
  getSettings() {
    return loadState().settings;
  },

  updateSettings(updates: Partial<AdminSettings>, actor: { name: string; email: string }) {
    const state = loadState();
    state.settings = { ...state.settings, ...updates };

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Settings Updated",
      entity: "Settings",
      entityId: "STORE_CONFIG",
      details: `Updated store configuration. Fields: ${Object.keys(updates).join(", ")}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return state.settings;
  },

  // 11. Marketing & Campaign Management
  getCampaigns(query?: {
    placement?: string;
    type?: string;
    status?: "all" | "active" | "scheduled" | "expired";
    visitorTimezone?: string;
  }) {
    const state = loadState();
    let campaigns = [...(state.campaigns || [])];
    const now = new Date();

    if (query?.placement && query.placement !== "all") {
      campaigns = campaigns.filter((c) => c.placement === query.placement);
    }

    if (query?.type && query.type !== "all") {
      campaigns = campaigns.filter((c) => c.type === query.type);
    }

    if (query?.status && query.status !== "all") {
      if (query.status === "active") {
        campaigns = campaigns.filter(
          (c) => c.isActive && now >= new Date(c.startDate) && now <= new Date(c.endDate)
        );
      } else if (query.status === "scheduled") {
        campaigns = campaigns.filter((c) => now < new Date(c.startDate));
      } else if (query.status === "expired") {
        campaigns = campaigns.filter((c) => now > new Date(c.endDate));
      }
    }

    // Sort by priority ascending, then createdAt descending
    return campaigns.sort((a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getCampaignById(id: string) {
    const state = loadState();
    return (state.campaigns || []).find((c) => c.id === id) || null;
  },

  createCampaign(data: Partial<AdminCampaign>, actor: { name: string; email: string }) {
    const state = loadState();
    const now = new Date();
    const newCampaign: AdminCampaign = {
      id: `camp-${Date.now()}`,
      title: data.title || "Untitled Campaign",
      slug: (data.title || "campaign").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      type: data.type || "banner",
      placement: data.placement || "hero",
      desktopImage: data.desktopImage || "/images/wardrobe/super-hero.jpg",
      mobileImage: data.mobileImage || data.desktopImage || "/images/wardrobe/super-hero.jpg",
      headline: data.headline || "",
      subheadline: data.subheadline || "",
      badgeText: data.badgeText || "",
      ctaText: data.ctaText || "Shop Now",
      destinationUrl: data.destinationUrl || "/products",
      startDate: data.startDate || now.toISOString(),
      endDate: data.endDate || new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      isActive: data.isActive ?? true,
      impressions: 0,
      clicks: 0,
      discountRule: data.discountRule,
      countdownTimer: data.countdownTimer,
      priority: data.priority ?? 1,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    if (!state.campaigns) state.campaigns = [];
    state.campaigns.unshift(newCampaign);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Campaign Created",
      entity: "Campaign",
      entityId: newCampaign.id,
      details: `Launched campaign "${newCampaign.title}" in placement ${newCampaign.placement}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return newCampaign;
  },

  updateCampaign(id: string, updates: Partial<AdminCampaign>, actor: { name: string; email: string }) {
    const state = loadState();
    if (!state.campaigns) state.campaigns = [];
    const idx = state.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const previous = state.campaigns[idx];
    state.campaigns[idx] = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Campaign Updated",
      entity: "Campaign",
      entityId: id,
      details: `Updated campaign "${state.campaigns[idx].title}". Fields changed: ${Object.keys(updates).join(", ")}.`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return state.campaigns[idx];
  },

  deleteCampaign(id: string, actor: { name: string; email: string }) {
    const state = loadState();
    if (!state.campaigns) state.campaigns = [];
    const idx = state.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    const deleted = state.campaigns[idx];
    state.campaigns.splice(idx, 1);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Campaign Deleted",
      entity: "Campaign",
      entityId: id,
      details: `Permanently removed marketing campaign "${deleted.title}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return true;
  },

  recordCampaignEvent(id: string, event: "impression" | "click") {
    const state = loadState();
    if (!state.campaigns) state.campaigns = [];
    const campaign = state.campaigns.find((c) => c.id === id);
    if (!campaign) return null;

    if (event === "impression") {
      campaign.impressions = (campaign.impressions || 0) + 1;
    } else if (event === "click") {
      campaign.clicks = (campaign.clicks || 0) + 1;
    }

    saveState(state);
    return {
      id: campaign.id,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
    };
  },

  // 12. Audit Logs
  getAuditLogs() {
    return loadState().auditLogs;
  },

  // 13. International Configuration (Taxes & Shipping Zones)
  getTaxRules() {
    return loadState().taxRules || [];
  },

  updateTaxRule(
    countryCode: string,
    updates: Partial<AdminTaxRule>,
    actor: { name: string; email: string }
  ) {
    const state = loadState();
    if (!state.taxRules) state.taxRules = [];
    const ruleIndex = state.taxRules.findIndex(
      (r) => r.countryCode.toUpperCase() === countryCode.toUpperCase()
    );

    if (ruleIndex > -1) {
      state.taxRules[ruleIndex] = { ...state.taxRules[ruleIndex], ...updates };
    } else {
      state.taxRules.push({
        id: `tax-${countryCode.toLowerCase()}`,
        countryCode: countryCode.toUpperCase(),
        countryName: updates.countryName || countryCode,
        taxType: updates.taxType || "vat",
        rate: updates.rate ?? 0.20,
        isInclusive: updates.isInclusive ?? true,
        isActive: updates.isActive ?? true,
      });
    }

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Tax Rule Updated",
      entity: "International",
      entityId: countryCode,
      details: `Updated tax rule for ${countryCode} (rate: ${updates.rate ?? "same"}).`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return state.taxRules.find((r) => r.countryCode.toUpperCase() === countryCode.toUpperCase());
  },

  getShippingZones() {
    return loadState().shippingZones || [];
  },

  updateShippingZone(
    zoneId: string,
    updates: Partial<AdminShippingZone>,
    actor: { name: string; email: string }
  ) {
    const state = loadState();
    if (!state.shippingZones) state.shippingZones = [];
    const zone = state.shippingZones.find((z) => z.id === zoneId);
    if (!zone) return null;

    Object.assign(zone, updates);

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actorName: actor.name,
      actorEmail: actor.email,
      action: "Shipping Zone Updated",
      entity: "International",
      entityId: zoneId,
      details: `Updated shipping zone "${zone.name}".`,
      createdAt: new Date().toISOString(),
    });

    saveState(state);
    return zone;
  },

  // 14. Instagram Feed & Social Media Integration
  getInstagramConfig(): InstagramConfig {
    const state = loadState();
    return state.instagramConfig || {
      handle: "kora.winter",
      profileUrl: "https://instagram.com/kora.winter",
      accessToken: "",
      autoSync: false,
      posts: [],
    };
  },

  updateInstagramConfig(
    updates: Partial<InstagramConfig>,
    actor?: { name: string; email: string }
  ): InstagramConfig {
    const state = loadState();
    if (!state.instagramConfig) {
      state.instagramConfig = {
        handle: "kora.winter",
        profileUrl: "https://instagram.com/kora.winter",
        accessToken: "",
        autoSync: false,
        posts: [],
      };
    }

    state.instagramConfig = { ...state.instagramConfig, ...updates };

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Instagram Config Updated",
        entity: "Marketing",
        entityId: "instagram",
        details: `Updated Instagram account handle to "${updates.handle || state.instagramConfig.handle}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return state.instagramConfig;
  },

  addInstagramPost(
    post: Omit<InstagramPost, "id">,
    actor?: { name: string; email: string }
  ): InstagramConfig {
    const state = loadState();
    if (!state.instagramConfig) {
      state.instagramConfig = {
        handle: "kora.winter",
        profileUrl: "https://instagram.com/kora.winter",
        accessToken: "",
        autoSync: false,
        posts: [],
      };
    }

    const newPost: InstagramPost = {
      ...post,
      id: `ig-${Date.now()}`,
      timestamp: post.timestamp || new Date().toISOString(),
      likesCount: post.likesCount ?? Math.floor(Math.random() * 2000 + 800),
      commentsCount: post.commentsCount ?? Math.floor(Math.random() * 150 + 20),
    };

    state.instagramConfig.posts.unshift(newPost);

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Instagram Post Added",
        entity: "Marketing",
        entityId: newPost.id,
        details: `Added new Instagram look with permalink "${newPost.permalink}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return state.instagramConfig;
  },

  deleteInstagramPost(
    postId: string,
    actor?: { name: string; email: string }
  ): InstagramConfig {
    const state = loadState();
    if (!state.instagramConfig) {
      state.instagramConfig = {
        handle: "kora.winter",
        profileUrl: "https://instagram.com/kora.winter",
        accessToken: "",
        autoSync: false,
        posts: [],
      };
    }

    state.instagramConfig.posts = state.instagramConfig.posts.filter((p) => p.id !== postId);

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Instagram Post Removed",
        entity: "Marketing",
        entityId: postId,
        details: `Removed Instagram post ID "${postId}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return state.instagramConfig;
  },

  getPartners(onlyActive = false): AdminPartner[] {
    const state = loadState();
    if (!state.partners || state.partners.length === 0) {
      state.partners = getInitialState().partners || [];
      saveState(state);
    }
    const list = onlyActive ? state.partners.filter((p) => p.isActive) : [...state.partners];
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  getPartnerById(id: string): AdminPartner | undefined {
    const state = loadState();
    return state.partners?.find((p) => p.id === id);
  },

  createPartner(
    data: Omit<AdminPartner, "id" | "createdAt" | "updatedAt">,
    actor?: { name: string; email: string }
  ): AdminPartner {
    const state = loadState();
    if (!state.partners) {
      state.partners = getInitialState().partners || [];
    }

    const now = new Date().toISOString();
    const newPartner: AdminPartner = {
      ...data,
      id: `part-${Date.now()}`,
      order: data.order ?? state.partners.length + 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: now,
      updatedAt: now,
    };

    state.partners.push(newPartner);

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Partner Brand Created",
        entity: "Brand Partners",
        entityId: newPartner.id,
        details: `Created partner brand "${newPartner.name}".`,
        createdAt: now,
      });
    }

    saveState(state);
    return newPartner;
  },

  updatePartner(
    id: string,
    updates: Partial<AdminPartner>,
    actor?: { name: string; email: string }
  ): AdminPartner | null {
    const state = loadState();
    if (!state.partners) {
      state.partners = getInitialState().partners || [];
    }

    const index = state.partners.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = state.partners[index];
    const updated: AdminPartner = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    state.partners[index] = updated;

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Partner Brand Updated",
        entity: "Brand Partners",
        entityId: id,
        details: `Updated partner brand "${updated.name}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return updated;
  },

  deletePartner(
    id: string,
    actor?: { name: string; email: string }
  ): boolean {
    const state = loadState();
    if (!state.partners) return false;

    const index = state.partners.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const removed = state.partners.splice(index, 1)[0];

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Partner Brand Deleted",
        entity: "Brand Partners",
        entityId: id,
        details: `Removed partner brand "${removed.name}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return true;
  },

  resetDefaultPartners(
    actor?: { name: string; email: string }
  ): AdminPartner[] {
    const state = loadState();
    const defaults = getInitialState().partners || [];
    state.partners = [...defaults];

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Partners Reset To Defaults",
        entity: "Brand Partners",
        entityId: "all",
        details: `Reset partner logos to the 14 default brand presets.`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return state.partners;
  },

  // 17. Journal & Editorial Stories
  getJournalArticles(onlyPublished = false): AdminJournalArticle[] {
    const state = loadState();
    if (!state.journalArticles || state.journalArticles.length === 0) {
      state.journalArticles = getInitialState().journalArticles || [];
      saveState(state);
    }
    const list = onlyPublished
      ? state.journalArticles.filter((a) => a.isPublished)
      : [...state.journalArticles];
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  getJournalArticleById(id: string): AdminJournalArticle | undefined {
    const state = loadState();
    return state.journalArticles?.find((a) => a.id === id);
  },

  getJournalArticleBySlug(slug: string): AdminJournalArticle | undefined {
    const state = loadState();
    return state.journalArticles?.find((a) => a.slug === slug);
  },

  createJournalArticle(
    data: Partial<AdminJournalArticle>,
    actor?: { name: string; email: string }
  ): AdminJournalArticle {
    const state = loadState();
    if (!state.journalArticles) state.journalArticles = [];

    const title = data.title?.trim() || "Untitled Journal Story";
    const slug =
      data.slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newArticle: AdminJournalArticle = {
      id: `art-${Date.now()}`,
      slug,
      title,
      excerpt:
        data.excerpt?.trim() ||
        "Archival notes and styling direction for sub-zero climates.",
      content: data.content || "",
      category: data.category?.trim() || "Style guide",
      readTime: data.readTime?.trim() || "5 min read",
      image:
        data.image?.trim() || "/images/wardrobe/AFa3pXi6rgIjU1cTtgBzlijk5o.jpg",
      author: data.author?.trim() || actor?.name || "WARDROBE Editorial",
      publishedAt: data.publishedAt || new Date().toISOString(),
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      order: data.order ?? state.journalArticles.length + 1,
    };

    state.journalArticles.push(newArticle);

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Journal Article Created",
        entity: "Journal",
        entityId: newArticle.id,
        details: `Created new journal story "${newArticle.title}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return newArticle;
  },

  updateJournalArticle(
    id: string,
    data: Partial<AdminJournalArticle>,
    actor?: { name: string; email: string }
  ): AdminJournalArticle | null {
    const state = loadState();
    if (!state.journalArticles) state.journalArticles = [];

    const index = state.journalArticles.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = state.journalArticles[index];
    const updated: AdminJournalArticle = {
      ...existing,
      ...data,
      id: existing.id,
    };
    state.journalArticles[index] = updated;

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Journal Article Updated",
        entity: "Journal",
        entityId: id,
        details: `Updated journal story "${updated.title}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return updated;
  },

  deleteJournalArticle(
    id: string,
    actor?: { name: string; email: string }
  ): boolean {
    const state = loadState();
    if (!state.journalArticles) return false;

    const index = state.journalArticles.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const removed = state.journalArticles.splice(index, 1)[0];

    if (actor) {
      state.auditLogs.unshift({
        id: `log-${Date.now()}`,
        actorName: actor.name,
        actorEmail: actor.email,
        action: "Journal Article Deleted",
        entity: "Journal",
        entityId: id,
        details: `Deleted journal story "${removed.title}".`,
        createdAt: new Date().toISOString(),
      });
    }

    saveState(state);
    return true;
  },
};
