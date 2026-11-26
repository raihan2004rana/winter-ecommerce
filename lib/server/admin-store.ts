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
      name: "Jackets & Coats",
      slug: "jackets-coats",
      description: "Down parkas, high-altitude shells and tailored winter coats.",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      productCount: 5,
    },
    {
      id: "cat-2",
      name: "Sweaters & Hoodies",
      slug: "sweaters-hoodies",
      description: "Merino wool cable-knits, cashmere turtlenecks and Polartec fleece.",
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=85&w=600",
      productCount: 4,
    },
    {
      id: "cat-3",
      name: "Boots & Accessories",
      slug: "boots-accessories",
      description: "Vibram Arctic Grip trekking boots, cashmere beanies and gloves.",
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=85&w=600",
      productCount: 3,
    },
    {
      id: "cat-4",
      name: "Women Collection",
      slug: "women",
      description: "Curated winter silhouettes designed for colder metropolitan days.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=600",
      productCount: 6,
    },
    {
      id: "cat-5",
      name: "Men Collection",
      slug: "men",
      description: "Technical alpine insulation and rugged performance layering.",
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=600",
      productCount: 6,
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

  createCategory(data: Partial<AdminCategory>, actor: { name: string; email: string }) {
    const state = loadState();
    const newCat: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: data.name || "New Winter Category",
      slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `category-${Date.now()}`,
      description: data.description || "Collection of archival pieces.",
      image: data.image || "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      productCount: 0,
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
};
