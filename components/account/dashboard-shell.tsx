"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useStore } from "@/lib/store/use-store";
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  Heart,
  Star,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import { OverviewTab } from "./tabs/overview-tab";
import { OrdersTab } from "./tabs/orders-tab";
import { AddressesTab } from "./tabs/addresses-tab";
import { PersonalInfoTab } from "./tabs/personal-info-tab";
import { WishlistTab } from "./tabs/wishlist-tab";
import { ReviewsTab } from "./tabs/reviews-tab";
import { SecurityTab } from "./tabs/security-tab";
import { NewsletterTab } from "./tabs/newsletter-tab";

export function CustomerDashboardShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, orders, reviews, isLoading } = useAuth();
  const { currency, wishlist } = useStore();

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = React.useState(tabParam);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Sync tab state with URL parameter if present
  React.useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    // Push shallow query param
    router.replace(`/account?tab=${tabId}`);
  };

  const navItems = [
    { id: "overview", label: "Account Overview", icon: LayoutDashboard },
    {
      id: "orders",
      label: "Orders & Tracking",
      icon: Package,
      badge: orders.length > 0 ? String(orders.length) : undefined,
    },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "profile", label: "Personal Information", icon: User },
    {
      id: "wishlist",
      label: "Wishlist Vault",
      icon: Heart,
      badge: wishlist.length > 0 ? String(wishlist.length) : undefined,
    },
    {
      id: "reviews",
      label: "My Reviews",
      icon: Star,
      badge: reviews.length > 0 ? String(reviews.length) : undefined,
    },
    { id: "security", label: "Security & Password", icon: ShieldCheck },
    { id: "newsletter", label: "Newsletter & Alerts", icon: Bell },
  ];

  if (isLoading && !user) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="h-6 w-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-2xs font-mono uppercase tracking-widest text-[#777]">
          Verifying Client Session...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Luxury Customer Banner */}
      <div className="bg-white border border-[#EAEAEA] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center space-x-4 sm:space-x-5">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-black shrink-0 bg-[#F6F6F6]">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.first_name || "Client"}
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-serif text-xl font-bold bg-black text-white">
                {user?.first_name?.[0] || "C"}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] text-[#888]">
                Private Client Area
              </span>
              <span className="text-2xs font-mono uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#FAF3E0] text-[#8C6D1F] border border-[#E8DAB2] flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>{user?.membership_tier || "Alpine Noir Member"}</span>
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#111]">
              Welcome back, {user?.first_name || "Julian"} {user?.last_name || "Vallis"}
            </h1>
            <p className="text-xs text-[#666] font-mono">
              {user?.email} • Client since {new Date(user?.created_at || "2026-01-15").getFullYear()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => handleSelectTab("orders")}
            className="border border-[#EAEAEA] hover:border-black bg-white text-[#111] px-4 py-2.5 text-2xs uppercase tracking-widest font-mono transition-colors"
          >
            Track Deliveries
          </button>
          <button
            onClick={() => logout()}
            className="border border-[#EAEAEA] hover:border-[#B91C1C] hover:text-[#B91C1C] text-[#666] px-4 py-2.5 text-2xs uppercase tracking-widest font-mono transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. Main Dashboard Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================
            SIDEBAR NAVIGATION (3 COLS)
        ========================================================== */}
        <aside className="lg:col-span-3">
          {/* Mobile Tab Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-white border border-[#EAEAEA] p-3.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider font-semibold text-black"
            >
              <div className="flex items-center space-x-2">
                <Menu className="h-4 w-4" />
                <span>
                  {navItems.find((n) => n.id === activeTab)?.label || "Menu"}
                </span>
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  mobileMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`bg-white border border-[#EAEAEA] divide-y divide-[#EAEAEA] shadow-xs ${
              mobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="p-4 bg-[#FAFBFD] border-b border-[#EAEAEA]">
              <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] font-semibold block">
                Dashboard Navigation
              </span>
            </div>

            <nav className="p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-sans transition-all text-left ${
                      isActive
                        ? "bg-[#111] text-white font-semibold"
                        : "text-[#444] hover:bg-[#F8F9FA] hover:text-black"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#777]"}`} />
                      <span className="tracking-wide">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-2xs font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white text-black font-bold"
                            : "bg-[#EAEAEA] text-[#555]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Logout button in sidebar */}
            <div className="p-2 pt-2">
              <button
                onClick={() => logout()}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 text-xs text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors text-left font-sans"
              >
                <LogOut className="h-4 w-4" />
                <span className="tracking-wide">Sign Out of Account</span>
              </button>
            </div>
          </div>
        </aside>

        {/* =========================================================
            CONTENT AREA (9 COLS)
        ========================================================== */}
        <section className="lg:col-span-9 min-h-[600px]">
          {activeTab === "overview" && (
            <OverviewTab
              onNavigateTab={handleSelectTab}
              currency={currency}
              wishlistCount={wishlist.length}
            />
          )}

          {activeTab === "orders" && <OrdersTab currency={currency} />}

          {activeTab === "addresses" && <AddressesTab />}

          {activeTab === "profile" && <PersonalInfoTab />}

          {activeTab === "wishlist" && <WishlistTab currency={currency} />}

          {activeTab === "reviews" && <ReviewsTab />}

          {activeTab === "security" && <SecurityTab />}

          {activeTab === "newsletter" && <NewsletterTab />}
        </section>
      </div>
    </div>
  );
}
