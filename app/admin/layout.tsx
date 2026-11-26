"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Star,
  ShieldCheck,
  Settings,
  History,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Megaphone,
  Award,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/inventory", label: "Inventory & Variants", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: "5" },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons & Discounts", icon: Tag },
  { href: "/admin/campaigns", label: "Marketing & Ads", icon: Megaphone, badge: "Live" },
  { href: "/admin/partners", label: "Brand Partners", icon: Award },
  { href: "/admin/reviews", label: "Reviews Moderation", icon: Star, badge: "1" },
  { href: "/admin/staff", label: "Staff & Permissions", icon: ShieldCheck },
  { href: "/admin/settings", label: "Store Configuration", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [adminUser, setAdminUser] = React.useState<{
    name: string;
    email: string;
    role: string;
  }>({
    name: "Raihan Rana",
    email: "admin@winter-fashion.com",
    role: "super_admin",
  });

  // Skip layout on login page
  const isLoginPage = pathname === "/admin/login";

  React.useEffect(() => {
    // Read session from me endpoint or cookie
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.session) {
          setAdminUser(data.session);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const roleDisplayNames: Record<string, { label: string; color: string }> = {
    super_admin: { label: "Super Admin", color: "bg-purple-950 text-purple-300 border-purple-800" },
    admin: { label: "Administrator", color: "bg-sky-950 text-sky-300 border-sky-800" },
    catalog_manager: { label: "Catalog Manager", color: "bg-amber-950 text-amber-300 border-amber-800" },
    order_specialist: { label: "Order Specialist", color: "bg-emerald-950 text-emerald-300 border-emerald-800" },
    support_agent: { label: "Support Agent", color: "bg-neutral-800 text-neutral-300 border-neutral-700" },
  };

  const currentRoleInfo = roleDisplayNames[adminUser.role] || {
    label: adminUser.role,
    color: "bg-neutral-800 text-neutral-300 border-neutral-700",
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex font-sans antialiased">
      {/* =========================================================================
          LEFT SIDEBAR NAVIGATION (Dense Architectural Theme)
         ========================================================================= */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#121418] text-[#D1D5DB] border-r border-[#22262E] flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#22262E]">
            <Link href="/admin" className="flex items-center space-x-2.5">
              <div className="h-7 w-7 bg-white text-black flex items-center justify-center font-bold text-xs">
                CH
              </div>
              <div>
                <span className="font-sans font-bold tracking-[0.16em] text-white text-sm uppercase block leading-none">
                  COLD HORIZON
                </span>
                <span className="text-[0.62rem] font-mono text-neutral-400 uppercase tracking-widest block mt-0.5">
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
            <div className="px-3 py-1.5 text-[0.62rem] font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
              Management Suite
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-sm transition-all duration-150 ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "text-neutral-400 hover:text-white hover:bg-[#1A1D24]"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-neutral-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[0.62rem] font-mono px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Storefront Link */}
        <div className="p-4 border-t border-[#22262E] space-y-3 bg-[#0D0E11]">
          {/* Active Admin Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-neutral-800 text-white font-mono text-xs flex items-center justify-center font-bold shrink-0 border border-neutral-700">
                {adminUser.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {adminUser.name}
                </p>
                <span
                  className={`inline-block text-[0.6rem] font-mono px-1.5 py-0.2 border rounded-xs uppercase tracking-wider ${currentRoleInfo.color}`}
                >
                  {currentRoleInfo.label}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
              title="Terminate Admin Session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Quick link to storefront */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#1A1D24] hover:bg-[#22262E] text-neutral-300 hover:text-white text-2xs font-mono uppercase tracking-wider rounded-sm border border-neutral-700/60 transition-colors"
          >
            <span>Visit Live Store</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA & TOPBAR
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#374151] hover:text-black"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center space-x-2 text-xs text-[#6B7280]">
              <span className="font-mono uppercase tracking-wider">Admin</span>
              <span>/</span>
              <span className="font-semibold text-[#111827] capitalize">
                {pathname.replace("/admin", "").replace("/", "") || "Overview"}
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center space-x-4">
            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-2xs font-mono rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Connected • PostgreSQL</span>
            </div>

            {/* Live Role Switcher Helper */}
            <div className="hidden md:flex items-center space-x-1 text-xs">
              <span className="text-2xs font-mono text-neutral-400">Simulate:</span>
              <select
                value={adminUser.role}
                onChange={async (e) => {
                  const newRole = e.target.value as any;
                  await fetch("/api/admin/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: adminUser.email, role: newRole }),
                  });
                  setAdminUser((prev) => ({ ...prev, role: newRole }));
                  router.refresh();
                }}
                className="bg-[#F3F4F6] border border-[#D1D5DB] text-xs font-mono py-1 px-2 rounded-sm focus:outline-none focus:border-black"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Administrator</option>
                <option value="catalog_manager">Catalog Manager</option>
                <option value="order_specialist">Order Specialist</option>
                <option value="support_agent">Support Agent</option>
              </select>
            </div>
          </div>
        </header>

        {/* Page Body Viewport */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
