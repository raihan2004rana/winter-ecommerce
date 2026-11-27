"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Globe,
  Truck,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useInternationalStore } from "@/lib/international/i18n";
import { getCountryConfig } from "@/lib/international/countries";
import { InternationalSelectorModal } from "./international-selector-modal";
import { InternationalShippingModal } from "./international-shipping-modal";
import { useFlyToCart } from "./fly-to-cart-provider";

interface WardrobeExactHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

interface CategoryItem {
  name: string;
  slug: string;
  description: string;
  image: string;
  link: string;
  badge?: string;
}

interface JournalItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

const DEFAULT_WOMEN_CATEGORIES: CategoryItem[] = [
  {
    name: "Jackets & Down Coats",
    slug: "jackets-coats",
    description: "Sub-zero expedition down parkas & tailored wool coats",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=600",
    link: "/collections/women?category=jackets-coats",
    badge: "5 Pieces",
  },
  {
    name: "Sweaters & Knitwear",
    slug: "sweaters-hoodies",
    description: "Heavyweight 450 GSM Merino wool & seamless cashmere",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600",
    link: "/collections/women?category=sweaters-hoodies",
    badge: "4 Pieces",
  },
  {
    name: "Boots & Accessories",
    slug: "boots-accessories",
    description: "Shearling-lined alpine boots, cashmere beanies & scarves",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    link: "/collections/women?category=boots-accessories",
    badge: "3 Pieces",
  },
  {
    name: "Winter Essentials",
    slug: "winter-essentials",
    description: "Curated metropolitan silhouettes designed for extreme cold",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    link: "/collections/women",
    badge: "Curated",
  },
];

const DEFAULT_MEN_CATEGORIES: CategoryItem[] = [
  {
    name: "Expedition Parkas & Shells",
    slug: "jackets-coats",
    description: "800 Fill Power down parkas & 3-layer GORE hard shells",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600",
    link: "/collections/men?category=jackets-coats",
    badge: "5 Pieces",
  },
  {
    name: "Merino Knits & Fleece",
    slug: "sweaters-hoodies",
    description: "Heavyweight cable knits & Polartec thermal hoodies",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=80&w=600",
    link: "/collections/men?category=sweaters-hoodies",
    badge: "4 Pieces",
  },
  {
    name: "Alpine Boots & Gloves",
    slug: "boots-accessories",
    description: "Vibram Arctic Grip trekking boots & PrimaLoft gloves",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=600",
    link: "/collections/men?category=boots-accessories",
    badge: "3 Pieces",
  },
  {
    name: "Technical Alpine Systems",
    slug: "alpine-layering",
    description: "Rugged performance layering engineered for sub-zero climates",
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=600",
    link: "/collections/men",
    badge: "Technical",
  },
];

const DEFAULT_JOURNAL_STORIES: JournalItem[] = [
  {
    id: "art-1",
    slug: "building-a-quiet-winter-wardrobe",
    image: "/images/wardrobe/AFa3pXi6rgIjU1cTtgBzlijk5o.jpg",
    category: "Style guide",
    readTime: "6 min read",
    title: "Building a quiet winter wardrobe",
    excerpt: "Fewer pieces, warmer layers, and coats that do more than one job.",
  },
  {
    id: "art-2",
    slug: "layering-denim-for-transitional-weather",
    image: "/images/wardrobe/layer-denim.jpg",
    category: "How to wear",
    readTime: "4 min read",
    title: "Layering denim for transitional weather",
    excerpt: "How to wear denim jackets and jeans when mornings are cold and afternoons warm up.",
  },
  {
    id: "art-3",
    slug: "what-people-actually-wear-on-busy-days",
    image: "/images/wardrobe/C9YOETuP6DWDsoWsKpvONxkKE.jpg",
    category: "Lifestyle",
    readTime: "5 min read",
    title: "What people actually wear on busy days",
    excerpt: "Real outfits for real schedules. Comfortable, simple, and put together.",
  },
];

// Module-level in-memory cache to make header load 0ms on route transitions
let cachedHeaderJournal: JournalItem[] | null = null;
let cachedHeaderWomenCategories: CategoryItem[] | null = null;
let cachedHeaderMenCategories: CategoryItem[] | null = null;
let cachedHeaderWomenFeatured: { image: string; title: string; description: string } | null = null;
let cachedHeaderMenFeatured: { image: string; title: string; description: string } | null = null;
let lastHeaderCategoriesFetch = 0;

export function WardrobeExactHeader({
  cartCount,
  onOpenCart,
  onOpenSearch,
}: WardrobeExactHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isIntlOpen, setIsIntlOpen] = React.useState(false);
  const [isShippingOpen, setIsShippingOpen] = React.useState(false);

  // Active mega menu state: "women" | "men" | "journal" | null
  const [activeMenu, setActiveMenu] = React.useState<"women" | "men" | "journal" | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Dynamic journal stories with in-memory cache initialization
  const [journalStories, setJournalStories] = React.useState<JournalItem[]>(
    () => cachedHeaderJournal || DEFAULT_JOURNAL_STORIES
  );

  // Dynamic mega menu categories from Admin with in-memory cache initialization
  const [womenCategories, setWomenCategories] = React.useState<CategoryItem[]>(
    () => cachedHeaderWomenCategories || DEFAULT_WOMEN_CATEGORIES
  );
  const [menCategories, setMenCategories] = React.useState<CategoryItem[]>(
    () => cachedHeaderMenCategories || DEFAULT_MEN_CATEGORIES
  );
  const [womenFeatured, setWomenFeatured] = React.useState(
    () =>
      cachedHeaderWomenFeatured || {
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        title: "The Sub-Zero Metropolitan Silhouette",
        description: "Pure Mongolian cashmere turtlenecks, belted cocoon down coats, and arctic Vibram footwear.",
      }
  );
  const [menFeatured, setMenFeatured] = React.useState(
    () =>
      cachedHeaderMenFeatured || {
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800",
        title: "Nordic Expedition Down & Alpine Shells",
        description: "800 Fill Power goose down parkas, 3-layer waterproof hard shells, and heavy cable knits.",
      }
  );

  const { country, currency, language, t } = useInternationalStore();
  const currentConfig = getCountryConfig(country);
  const { isCartBouncing } = useFlyToCart();

  // Load live journal articles from server
  React.useEffect(() => {
    if (!cachedHeaderJournal) {
      fetch("/api/journal")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.articles && data.articles.length > 0) {
            const articles = data.articles.slice(0, 4);
            cachedHeaderJournal = articles;
            setJournalStories(articles);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Load live categories from server with throttling & module-level caching
  const loadCategories = React.useCallback((force: boolean = false) => {
    const now = Date.now();
    if (!force && cachedHeaderWomenCategories && now - lastHeaderCategoriesFetch < 30000) {
      return;
    }
    fetch(`/api/categories?t=${now}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.status === "success" && Array.isArray(resData.data)) {
          lastHeaderCategoriesFetch = Date.now();
          const list: any[] = resData.data;

          // Women subcategories
          const womenSpecific = list.filter((c) => c.gender === "women" && c.slug !== "women");
          if (womenSpecific.length > 0) {
            const mappedWomen = womenSpecific.slice(0, 4).map((c) => ({
              name: c.name,
              slug: c.slug,
              description: c.description,
              image: c.image || c.imageUrl,
              link:
                c.link ||
                (c.slug.includes("jacket")
                  ? "/collections/women?category=jackets-coats"
                  : c.slug.includes("knit") || c.slug.includes("sweater")
                  ? "/collections/women?category=sweaters-hoodies"
                  : c.slug.includes("boot")
                  ? "/collections/women?category=boots-accessories"
                  : "/collections/women"),
              badge: c.badge || (c.productCount ? `${c.productCount} Pieces` : undefined),
            }));
            cachedHeaderWomenCategories = mappedWomen;
            setWomenCategories(mappedWomen);
          }

          // Women main / featured card
          const womenMain = list.find((c) => c.slug === "women");
          if (womenMain && womenMain.image) {
            const feat = {
              image: womenMain.image || womenMain.imageUrl,
              title: womenMain.name || "The Sub-Zero Metropolitan Silhouette",
              description:
                womenMain.description ||
                "Pure Mongolian cashmere turtlenecks, belted cocoon down coats, and arctic Vibram footwear.",
            };
            cachedHeaderWomenFeatured = feat;
            setWomenFeatured(feat);
          }

          // Men subcategories
          const menSpecific = list.filter((c) => c.gender === "men" && c.slug !== "men");
          if (menSpecific.length > 0) {
            const mappedMen = menSpecific.slice(0, 4).map((c) => ({
              name: c.name,
              slug: c.slug,
              description: c.description,
              image: c.image || c.imageUrl,
              link:
                c.link ||
                (c.slug.includes("jacket") || c.slug.includes("parka")
                  ? "/collections/men?category=jackets-coats"
                  : c.slug.includes("fleece") || c.slug.includes("knit")
                  ? "/collections/men?category=sweaters-hoodies"
                  : c.slug.includes("boot")
                  ? "/collections/men?category=boots-accessories"
                  : "/collections/men"),
              badge: c.badge || (c.productCount ? `${c.productCount} Pieces` : undefined),
            }));
            cachedHeaderMenCategories = mappedMen;
            setMenCategories(mappedMen);
          }

          // Men main / featured card
          const menMain = list.find((c) => c.slug === "men");
          if (menMain && menMain.image) {
            const feat = {
              image: menMain.image || menMain.imageUrl,
              title: menMain.name || "Nordic Expedition Down & Alpine Shells",
              description:
                menMain.description ||
                "800 Fill Power goose down parkas, 3-layer waterproof hard shells, and heavy cable knits.",
            };
            cachedHeaderMenFeatured = feat;
            setMenFeatured(feat);
          }
        }
      })
      .catch((err) => console.error("Failed to load header categories:", err));
  }, []);

  React.useEffect(() => {
    loadCategories(false);
  }, [loadCategories]);

  const handleMouseEnter = (menu: "women" | "men" | "journal") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
    if (menu === "women" || menu === "men") {
      loadCategories(false);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#EFEFEF] transition-all"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 h-16 flex items-center justify-between">
          {/* Left: Brand Logo WARDROBE (Aligned exactly with container left edge) */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden mr-4 p-1 text-[#111]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="inline-block" onClick={closeMenu}>
              <span className="font-sans text-lg sm:text-xl font-bold tracking-[0.14em] text-[#111] uppercase">
                MAULI FASHION
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links with Mega Menu Hover Triggers */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-sans font-medium text-[#222]">
            {/* Women Link */}
            <div
              className="relative py-5"
              onMouseEnter={() => handleMouseEnter("women")}
            >
              <Link
                href="/collections/women"
                prefetch={true}
                onClick={closeMenu}
                className={`hover:text-black tracking-wide transition-colors py-2 flex items-center space-x-1 ${
                  activeMenu === "women" ? "text-black font-semibold" : "text-[#333]"
                }`}
              >
                <span>{t("nav.women")}</span>
              </Link>
            </div>

            {/* Men Link */}
            <div
              className="relative py-5"
              onMouseEnter={() => handleMouseEnter("men")}
            >
              <Link
                href="/collections/men"
                prefetch={true}
                onClick={closeMenu}
                className={`hover:text-black tracking-wide transition-colors py-2 flex items-center space-x-1 ${
                  activeMenu === "men" ? "text-black font-semibold" : "text-[#333]"
                }`}
              >
                <span>{t("nav.men")}</span>
              </Link>
            </div>

            {/* Journal Link */}
            <div
              className="relative py-5"
              onMouseEnter={() => handleMouseEnter("journal")}
            >
              <Link
                href="/journal"
                prefetch={true}
                onClick={closeMenu}
                className={`hover:text-black tracking-wide transition-colors py-2 flex items-center space-x-1 ${
                  activeMenu === "journal" ? "text-black font-semibold" : "text-[#333]"
                }`}
              >
                <span>{t("nav.journal")}</span>
              </Link>
            </div>

            {/* Shopping Bag Clickable Trigger (Opens Cart Drawer) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                onOpenCart();
              }}
              className="hover:text-black tracking-wide transition-colors py-2 text-xs font-medium text-[#222]"
            >
              {t("nav.shoppingBag")}
            </button>

            {/* DDP Shipping Policy Modal Link */}
            <button
              onClick={() => {
                closeMenu();
                setIsShippingOpen(true);
              }}
              className="hover:text-black tracking-wide transition-colors text-xs font-medium text-emerald-700 flex items-center gap-1 py-2"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>DDP Shipping</span>
            </button>
          </nav>

          {/* Right: Country/Currency Selector, Search, Account, Cart Pill */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* International Selector Trigger */}
            <button
              onClick={() => {
                closeMenu();
                setIsIntlOpen(true);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              title="Change Country, Currency & Language"
            >
              <span className="text-sm shrink-0">{currentConfig.flag}</span>
              <span className="font-semibold text-black">{currency}</span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline uppercase text-gray-500">{language}</span>
            </button>

            {/* Search Icon */}
            <button
              onClick={() => {
                closeMenu();
                onOpenSearch();
              }}
              className="p-1.5 text-[#222] hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Account Icon */}
            <Link
              href="/account"
              onClick={closeMenu}
              className="p-1.5 text-[#222] hover:text-black transition-colors"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Black Pill: Cart (Count) */}
            <button
              id="storefront-cart-button"
              onClick={() => {
                closeMenu();
                onOpenCart();
              }}
              className={`bg-[#111111] hover:bg-black text-white px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight flex items-center space-x-1.5 transition-all shadow-xs ${
                isCartBouncing
                  ? "animate-cart-bounce ring-2 ring-emerald-500 bg-black"
                  : "hover:scale-104"
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Cart ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MEGA MENU DROPDOWN PANEL
        ========================================================================= */}
        {activeMenu && (
          <div
            className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-[#EAEAEA] shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-8">
              {/* -------------------- WOMEN MEGA MENU -------------------- */}
              {activeMenu === "women" && (
                <div className="grid grid-cols-12 gap-8">
                  {/* Left 8 Cols: 4 Category Cards with Photos */}
                  <div className="col-span-8">
                    <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-100">
                      <div>
                        <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400">
                          Departments
                        </span>
                        <h3 className="text-lg font-editorial font-normal text-neutral-900 mt-0.5">
                          Women&apos;s Winter Collection
                        </h3>
                      </div>
                      <Link
                        href="/collections/women"
                        prefetch={true}
                        onClick={closeMenu}
                        className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black flex items-center space-x-1 transition-colors"
                      >
                        <span>View All Women</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {womenCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.link}
                          prefetch={true}
                          onClick={closeMenu}
                          className="group block"
                        >
                          <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-neutral-100 mb-2.5">
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              unoptimized
                              sizes="200px"
                              className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            {cat.badge && (
                              <div className="absolute top-2 left-2">
                                <span className="text-2xs font-mono bg-white/90 backdrop-blur-sm text-neutral-800 px-1.5 py-0.5 rounded shadow-xs">
                                  {cat.badge}
                                </span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 line-clamp-2">
                            {cat.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right 4 Cols: Featured Editorial Lookbook Card */}
                  <div className="col-span-4 pl-4 border-l border-neutral-100 flex flex-col justify-between">
                    <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-neutral-100 mb-4 group">
                      <Image
                        src={womenFeatured.image}
                        alt="Women Lookbook"
                        fill
                        unoptimized
                        sizes="400px"
                        className="object-cover group-hover:scale-104 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-2xs font-mono uppercase tracking-widest text-emerald-300">
                          Lookbook Editorial
                        </span>
                        <h4 className="text-sm font-editorial font-normal mt-0.5 leading-snug">
                          {womenFeatured.title}
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {womenFeatured.description}
                      </p>
                      <Link
                        href="/collections/women"
                        onClick={closeMenu}
                        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider font-semibold text-neutral-900 hover:text-neutral-600 transition-colors pt-1"
                      >
                        <span>Explore Curated Looks</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- MEN MEGA MENU -------------------- */}
              {activeMenu === "men" && (
                <div className="grid grid-cols-12 gap-8">
                  {/* Left 8 Cols: 4 Category Cards with Photos */}
                  <div className="col-span-8">
                    <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-100">
                      <div>
                        <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400">
                          Departments
                        </span>
                        <h3 className="text-lg font-editorial font-normal text-neutral-900 mt-0.5">
                          Men&apos;s Technical Winter Collection
                        </h3>
                      </div>
                      <Link
                        href="/collections/men"
                        prefetch={true}
                        onClick={closeMenu}
                        className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black flex items-center space-x-1 transition-colors"
                      >
                        <span>View All Men</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {menCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.link}
                          prefetch={true}
                          onClick={closeMenu}
                          className="group block"
                        >
                          <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-neutral-100 mb-2.5">
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              unoptimized
                              sizes="200px"
                              className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            {cat.badge && (
                              <div className="absolute top-2 left-2">
                                <span className="text-2xs font-mono bg-white/90 backdrop-blur-sm text-neutral-800 px-1.5 py-0.5 rounded shadow-xs">
                                  {cat.badge}
                                </span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 line-clamp-2">
                            {cat.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right 4 Cols: Featured Editorial Card */}
                  <div className="col-span-4 pl-4 border-l border-neutral-100 flex flex-col justify-between">
                    <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-neutral-100 mb-4 group">
                      <Image
                        src={menFeatured.image}
                        alt="Men Lookbook"
                        fill
                        unoptimized
                        sizes="400px"
                        className="object-cover group-hover:scale-104 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-2xs font-mono uppercase tracking-widest text-sky-300">
                          Tested At -30°C
                        </span>
                        <h4 className="text-sm font-editorial font-normal mt-0.5 leading-snug">
                          {menFeatured.title}
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {menFeatured.description}
                      </p>
                      <Link
                        href="/collections/men"
                        onClick={closeMenu}
                        className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider font-semibold text-neutral-900 hover:text-neutral-600 transition-colors pt-1"
                      >
                        <span>Shop Men&apos;s Outerwear</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- JOURNAL MEGA MENU -------------------- */}
              {activeMenu === "journal" && (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-100">
                    <div>
                      <span className="text-2xs font-mono uppercase tracking-widest text-neutral-400">
                        Editorial Stories & Guides
                      </span>
                      <h3 className="text-lg font-editorial font-normal text-neutral-900 mt-0.5">
                        The MAULI FASHION Journal
                      </h3>
                    </div>
                    <Link
                      href="/journal"
                      prefetch={true}
                      onClick={closeMenu}
                      className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black flex items-center space-x-1 transition-colors"
                    >
                      <span>View All Articles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    {journalStories.map((story) => (
                      <Link
                        key={story.id}
                        href={`/journal/${story.slug}`}
                        prefetch={true}
                        onClick={closeMenu}
                        className="group flex flex-col space-y-2.5"
                      >
                        <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-neutral-100">
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            unoptimized
                            sizes="280px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        </div>

                        <div className="flex items-center space-x-2 text-2xs font-mono uppercase tracking-wider text-neutral-500">
                          <span className="font-semibold text-neutral-800">{story.category}</span>
                          <span>•</span>
                          <span>{story.readTime}</span>
                        </div>

                        <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors leading-snug line-clamp-2">
                          {story.title}
                        </h4>

                        <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
                          {story.excerpt}
                        </p>

                        <div className="pt-1">
                          <span className="inline-flex items-center space-x-1 text-2xs font-mono uppercase tracking-wider font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
                            <span>Read Story</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#EEE] bg-white px-6 py-4 space-y-3 font-sans text-sm">
            <Link
              href="/collections/women"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-[#222] font-medium"
            >
              {t("nav.women")}
            </Link>
            <Link
              href="/collections/men"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-[#222] font-medium"
            >
              {t("nav.men")}
            </Link>
            <Link
              href="/journal"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-[#222] font-medium"
            >
              {t("nav.journal")}
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenCart();
              }}
              className="block w-full text-left py-1.5 text-[#222] font-medium"
            >
              {t("nav.shoppingBag")} ({cartCount})
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                setIsShippingOpen(true);
              }}
              className="block py-1.5 text-emerald-700 font-medium text-left"
            >
              DDP International Shipping Policy
            </button>
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsIntlOpen(true);
                }}
                className="w-full text-left py-2 text-xs font-mono text-gray-700 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Regional Settings ({currentConfig.name} • {currency})</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <InternationalSelectorModal
        isOpen={isIntlOpen}
        onClose={() => setIsIntlOpen(false)}
      />
      <InternationalShippingModal
        isOpen={isShippingOpen}
        onClose={() => setIsShippingOpen(false)}
      />
    </>
  );
}
