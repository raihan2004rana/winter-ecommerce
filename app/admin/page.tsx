"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  RefreshCw,
  Sparkles,
} from "lucide-react";

// Distinct modern solid colors for each day's bar (clean & flat, no gradient/glass)
const BAR_SOLID_COLORS = [
  {
    bg: "bg-[#4F46E5]",
    hover: "hover:bg-[#4338CA]",
    dot: "bg-[#4F46E5]",
  },
  {
    bg: "bg-[#0284C7]",
    hover: "hover:bg-[#0369A1]",
    dot: "bg-[#0284C7]",
  },
  {
    bg: "bg-[#10B981]",
    hover: "hover:bg-[#059669]",
    dot: "bg-[#10B981]",
  },
  {
    bg: "bg-[#F59E0B]",
    hover: "hover:bg-[#D97706]",
    dot: "bg-[#F59E0B]",
  },
  {
    bg: "bg-[#F43F5E]",
    hover: "hover:bg-[#E11D48]",
    dot: "bg-[#F43F5E]",
  },
  {
    bg: "bg-[#8B5CF6]",
    hover: "hover:bg-[#7C3AED]",
    dot: "bg-[#8B5CF6]",
  },
  {
    bg: "bg-[#06B6D4]",
    hover: "hover:bg-[#0891B2]",
    dot: "bg-[#06B6D4]",
  },
];

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "success") {
          setData(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            Aggregating Database Analytics...
          </span>
        </div>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    averageOrderValue = 0,
    growthPercentage = 18.4,
    salesChart = [],
    recentOrders = [],
    bestSellers = [],
    lowStockAlerts = [],
  } = data || {};

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "paid":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* =========================================================================
          TOP PAGE HEADER & REFRESH ACTION
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Storefront Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-sans">
            Real-time sales performance, active order fulfillment, and automated inventory alerts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMetrics}
            className="inline-flex items-center space-x-2 bg-white border border-[#D1D5DB] hover:border-black px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-[#374151] rounded-sm transition-colors shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live DB</span>
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center space-x-1.5 bg-[#111827] hover:bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-xs"
          >
            <span>Manage Catalog</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          LOW STOCK EMERGENCY BANNER (If any products < threshold)
         ========================================================================= */}
      {lowStockAlerts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase font-mono tracking-wider">
                Low Stock Warning: {lowStockAlerts.length} Item(s) Near Depletion
              </h4>
              <p className="text-xs text-amber-800">
                {lowStockAlerts.map((p: any) => `${p.title} (${p.stockCount} left)`).join(" • ")}
              </p>
            </div>
          </div>

          <Link
            href="/admin/inventory"
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-800 text-white text-2xs font-mono uppercase tracking-wider font-semibold rounded-xs hover:bg-amber-900 transition-colors shrink-0"
          >
            <span>Adjust Stock</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* =========================================================================
          KEY PERFORMANCE METRIC CARDS (4 KPIs)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-2xs font-mono uppercase tracking-widest font-semibold text-neutral-400">
              Total Revenue
            </span>
            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1.5 text-2xs font-mono text-emerald-600 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{growthPercentage}% vs previous cycle</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-2xs font-mono uppercase tracking-widest font-semibold text-neutral-400">
              Total Orders
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              {totalOrders}
            </div>
            <div className="text-2xs font-mono text-neutral-500">
              <span>100% verified fulfillment dispatch</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-2xs font-mono uppercase tracking-widest font-semibold text-neutral-400">
              Active Customers
            </span>
            <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              {totalCustomers}
            </div>
            <div className="text-2xs font-mono text-purple-600 font-semibold">
              <span>High-tier Alpine client profiles</span>
            </div>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-6 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-2xs font-mono uppercase tracking-widest font-semibold text-neutral-400">
              Average Order Value
            </span>
            <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              ${averageOrderValue.toFixed(2)}
            </div>
            <div className="text-2xs font-mono text-neutral-500">
              <span>Weighted across outerwear & knits</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MIDDLE ROW: SALES REVENUE CHART & TOP SELLING WINTER GARMENTS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart (8 Columns) */}
        <div className="lg:col-span-8 bg-white p-6 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#111827]">
                Revenue & Velocity Trajectory
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Gross sales volume over recent store operations (USD).
              </p>
            </div>
            <span className="text-2xs font-mono bg-neutral-100 text-neutral-700 px-2 py-1 rounded-xs border border-neutral-200">
              Last 7 Days
            </span>
          </div>

          {/* Multi-Color Solid Bar Chart Visualization */}
          <div className="pt-2">
            <div className="relative h-64 flex items-end justify-between gap-2.5 sm:gap-5 pt-8 pb-2 border-b border-neutral-200">
              {salesChart.map((bar: any, idx: number) => {
                const maxRevenue = Math.max(...salesChart.map((s: any) => s.revenue), 4000);
                const heightPercent = Math.max(12, Math.round((bar.revenue / maxRevenue) * 100));
                const color = BAR_SOLID_COLORS[idx % BAR_SOLID_COLORS.length];
                const isMax = bar.revenue === maxRevenue;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end z-10">
                    {/* Peak Badge */}
                    {isMax && (
                      <div className="absolute -top-7 flex items-center gap-1 bg-[#111827] text-white text-[0.6rem] font-mono uppercase tracking-widest px-2 py-0.5 rounded-xs pointer-events-none">
                        <span className="font-bold">Peak</span>
                      </div>
                    )}

                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-[#111827] text-white text-2xs font-mono py-1.5 px-2.5 rounded-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-20 flex flex-col items-center">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                        <span>${bar.revenue.toLocaleString()}</span>
                      </div>
                      <span className="text-[0.62rem] text-neutral-400">
                        {bar.orders} orders • {bar.date}
                      </span>
                    </div>

                    {/* Pure Solid Color Bar (No gradient, no glass reflection) */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full ${color.bg} ${color.hover} transition-colors duration-150 rounded-t-xs`}
                    />

                    {/* Date Label */}
                    <span className="text-[0.65rem] font-mono text-neutral-600 font-medium mt-2 truncate w-full text-center group-hover:text-black transition-colors">
                      {bar.date}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Color Palette Legend */}
            <div className="pt-3.5 flex flex-wrap items-center justify-between text-2xs font-mono text-neutral-500 gap-2 border-t border-neutral-100 mt-2">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="text-neutral-400 uppercase tracking-widest text-[0.6rem]">Daily:</span>
                {salesChart.map((bar: any, idx: number) => {
                  const color = BAR_SOLID_COLORS[idx % BAR_SOLID_COLORS.length];
                  return (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                      <span className="text-neutral-700 font-semibold">{bar.date}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-xs text-[0.62rem] font-semibold border border-neutral-200">
                  7D Total: ${salesChart.reduce((acc: number, b: any) => acc + (b.revenue || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Selling Products Spotlight (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-6 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#111827]">
                Top Volume Garments
              </h3>
              <Link
                href="/admin/products"
                className="text-2xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3.5">
              {bestSellers.map((product: any) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="relative h-12 w-10 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                    <Image
                      src={product.primaryImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#111827] truncate">
                      {product.title}
                    </p>
                    <p className="text-2xs font-mono text-neutral-500">
                      ${product.price.toFixed(2)} • {product.stockCount} units remaining
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xs font-mono font-bold text-emerald-600 block">
                      ★ {product.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <Link
              href="/admin/inventory"
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-2xs font-mono uppercase tracking-wider font-semibold rounded-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Manage All Inventory</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW: RECENT ORDERS TABLE
         ========================================================================= */}
      <div className="bg-white border border-[#E5E7EB] rounded-sm shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#111827]">
              Recent Customer Transactions
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live order feed with immediate status tracking and item counts.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-neutral-700 hover:text-black font-semibold"
          >
            <span>All Orders ({totalOrders})</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-neutral-500 font-mono text-[0.68rem] uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6">Order Reference</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Total (USD)</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Fulfillment</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-semibold text-black">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-neutral-900 block truncate max-w-[140px]">
                      {order.customerName}
                    </span>
                    <span className="text-2xs text-neutral-500 font-mono block truncate max-w-[140px]">
                      {order.customerEmail}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-neutral-700">
                    {order.items?.length || 1} garment(s)
                  </td>
                  <td className="py-3.5 px-6 font-mono font-semibold text-neutral-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-block text-[0.62rem] font-mono px-2 py-0.5 border rounded-xs uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block text-[0.62rem] font-mono px-2 py-0.5 border rounded-xs uppercase tracking-wider ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-neutral-500 text-2xs font-mono">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-2xs font-mono text-neutral-700 hover:text-black font-semibold uppercase underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
