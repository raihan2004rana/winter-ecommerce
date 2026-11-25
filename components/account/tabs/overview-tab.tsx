"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Heart,
  ShieldCheck,
  Truck,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { CustomerOrder } from "@/lib/auth/types";
import { OrderDetailsModal } from "./order-details-modal";

interface OverviewTabProps {
  onNavigateTab: (tab: string) => void;
  currency: "USD" | "EUR" | "GBP" | "CAD";
  wishlistCount: number;
}

export function OverviewTab({
  onNavigateTab,
  currency,
  wishlistCount,
}: OverviewTabProps) {
  const { user, orders, addresses } = useAuth();
  const [selectedOrder, setSelectedOrder] = React.useState<CustomerOrder | null>(null);

  const activeOrders = orders.filter((o) => o.status === "shipped" || o.status === "processing");
  const latestOrder = orders[0];
  const defaultAddress = addresses.find((a) => a.is_default_shipping) || addresses[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Quick Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active In-Transit Orders */}
        <div className="bg-white border border-[#EAEAEA] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#777]">
            <span className="text-2xs font-mono uppercase tracking-widest">Active Deliveries</span>
            <Truck className="h-4 w-4 text-[#111]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-sans text-2xl font-bold text-[#111]">
              {activeOrders.length}
            </span>
            <span className="text-2xs text-[#16A34A] font-mono uppercase font-semibold">
              {activeOrders.length > 0 ? "In Transit" : "All Arrived"}
            </span>
          </div>
          <p className="text-[0.68rem] text-[#888]">
            DHL Alpine Priority Tracked
          </p>
        </div>

        {/* Metric 2: Lifetime Orders */}
        <div className="bg-white border border-[#EAEAEA] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#777]">
            <span className="text-2xs font-mono uppercase tracking-widest">Total Orders</span>
            <Package className="h-4 w-4 text-[#111]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-sans text-2xl font-bold text-[#111]">
              {orders.length}
            </span>
            <span className="text-2xs text-[#666] font-mono">
              Garments Verified
            </span>
          </div>
          <p className="text-[0.68rem] text-[#888]">
            Lifetime Archival Acquisitions
          </p>
        </div>

        {/* Metric 3: Wishlist Count */}
        <div className="bg-white border border-[#EAEAEA] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#777]">
            <span className="text-2xs font-mono uppercase tracking-widest">Saved Garments</span>
            <Heart className="h-4 w-4 text-[#111]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-sans text-2xl font-bold text-[#111]">
              {wishlistCount}
            </span>
            <span className="text-2xs text-[#666] font-mono">
              In Private Vault
            </span>
          </div>
          <button
            onClick={() => onNavigateTab("wishlist")}
            className="text-[0.68rem] text-black underline underline-offset-2 hover:text-[#555] block"
          >
            Review Saved Garments →
          </button>
        </div>

        {/* Metric 4: Membership Tier */}
        <div className="bg-black text-white p-5 space-y-2">
          <div className="flex items-center justify-between text-white/70">
            <span className="text-2xs font-mono uppercase tracking-widest">Client Tier</span>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-sans text-lg font-bold uppercase tracking-tight">
              {user?.membership_tier || "Alpine Noir Member"}
            </span>
          </div>
          <p className="text-[0.68rem] text-white/70">
            Complimentary Worldwide Courier • Private Allocations
          </p>
        </div>
      </div>

      {/* 2. Most Recent Order Snapshot Banner */}
      {latestOrder && (
        <div className="bg-white border border-[#EAEAEA] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
            <div className="space-y-1">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] text-[#888] block">
                Latest Acquisition Dossier
              </span>
              <h3 className="font-sans text-lg font-bold text-[#111]">
                Order {latestOrder.order_number}
              </h3>
              <p className="text-2xs font-mono text-[#777]">
                Dispatched via {latestOrder.shipping_carrier} • Est. Arrival: {latestOrder.estimated_delivery || "Nov 28"}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase tracking-wider font-mono font-semibold px-3 py-1 bg-[#F2F2F2] text-[#111] border border-[#DDD]">
                {latestOrder.status.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedOrder(latestOrder)}
                className="bg-[#111] hover:bg-black text-white px-4 py-2 text-2xs uppercase tracking-widest font-mono transition-colors"
              >
                Inspect Tracking
              </button>
            </div>
          </div>

          {/* Garments Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 bg-[#FAFBFD] border border-[#EAEAEA] p-3"
              >
                <div className="relative h-18 w-14 bg-[#F6F6F6] border border-[#EAEAEA] shrink-0 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.product_title}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-semibold text-black line-clamp-1">{item.product_title}</h4>
                  <p className="text-2xs font-mono text-[#777]">
                    Size: {item.size} • Color: {item.color_name}
                  </p>
                  <p className="text-2xs font-mono font-medium text-black">
                    {formatCurrency(item.total_price, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Address Snapshot & Security Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Shipping Address */}
        <div className="bg-white border border-[#EAEAEA] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#111]" />
              <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#111]">
                Default Shipping Address
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("addresses")}
              className="text-2xs uppercase font-mono tracking-widest text-[#666] hover:text-black underline"
            >
              Manage
            </button>
          </div>

          {defaultAddress ? (
            <div className="space-y-1 text-xs text-[#555]">
              <p className="font-semibold text-black">{defaultAddress.first_name} {defaultAddress.last_name}</p>
              {defaultAddress.company && <p>{defaultAddress.company}</p>}
              <p>{defaultAddress.address_line1}</p>
              {defaultAddress.address_line2 && <p>{defaultAddress.address_line2}</p>}
              <p>{defaultAddress.city}, {defaultAddress.state_province} {defaultAddress.postal_code}</p>
              <p className="font-mono text-2xs text-[#888] pt-1">{defaultAddress.phone}</p>
            </div>
          ) : (
            <p className="text-xs text-[#888]">No default address configured.</p>
          )}
        </div>

        {/* Security Readiness */}
        <div className="bg-white border border-[#EAEAEA] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
              <h3 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#111]">
                Account Protection
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("security")}
              className="text-2xs uppercase font-mono tracking-widest text-[#666] hover:text-black underline"
            >
              Settings
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-[#555]">
              <span>Email Verification</span>
              <span className="font-mono text-2xs uppercase font-semibold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 border border-[#BBF7D0]">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-[#555]">
              <span>Password Status</span>
              <span className="font-mono text-2xs text-[#777]">Protected • 14 chars</span>
            </div>
            <div className="flex items-center justify-between text-[#555]">
              <span>Session Isolation</span>
              <span className="font-mono text-2xs text-[#16A34A]">Supabase RLS Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        currency={currency}
      />
    </div>
  );
}
