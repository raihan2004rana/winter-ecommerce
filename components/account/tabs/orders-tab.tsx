"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { formatCurrency } from "@/lib/utils";
import { CustomerOrder } from "@/lib/auth/types";
import { OrderDetailsModal } from "./order-details-modal";
import {
  Truck,
  ExternalLink,
  Package,
  CheckCircle2,
  Clock,
  Search,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

interface OrdersTabProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
}

const ORDERS_PER_PAGE = 4;

export function OrdersTab({ currency }: OrdersTabProps) {
  const { orders, refreshOrders, confirmOrderReceived } = useAuth();
  const [selectedOrder, setSelectedOrder] = React.useState<CustomerOrder | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [viewMode, setViewMode] = React.useState<"compact" | "detailed">("compact");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Sync latest orders from server on mount
  React.useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const handleConfirmReceived = async (orderNumber: string) => {
    setConfirmingId(orderNumber);
    try {
      const res = await confirmOrderReceived(orderNumber);
      if (res.success) {
        setToastMessage(`✓ Order ${orderNumber} marked as received and completed!`);
        setTimeout(() => setToastMessage(null), 4500);
        if (selectedOrder && selectedOrder.order_number === orderNumber) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: "delivered" } : null));
        }
      }
    } finally {
      setConfirmingId(null);
    }
  };

  // Metrics calculation
  const totalOrdersCount = orders.length;
  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );
  const deliveredOrdersCount = orders.filter((o) => o.status === "delivered").length;
  const totalLifetimeSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);

  // Filter & Search Logic
  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      // 1. Status Filter
      if (statusFilter === "in_progress") {
        if (o.status !== "processing" && o.status !== "shipped" && o.status !== "pending") {
          return false;
        }
      } else if (statusFilter === "shipped") {
        if (o.status !== "shipped") return false;
      } else if (statusFilter === "delivered") {
        if (o.status !== "delivered") return false;
      }

      // 2. Search Query (order number, product title, tracking)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = o.order_number.toLowerCase().includes(q);
        const matchesTracking = o.tracking_number?.toLowerCase().includes(q);
        const matchesItem = o.items.some((it) =>
          it.product_title.toLowerCase().includes(q)
        );
        return matchesNumber || matchesTracking || matchesItem;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = React.useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const activeShipment = activeOrders[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono p-3 rounded shadow-sm flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* 1. Header & Summary Stats Bar */}
      <div className="space-y-4 border-b border-[#EAEAEA] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
              Order History & Logistics
            </h2>
            <p className="text-xs text-[#666]">
              Real-time shipment dossiers, live courier tracking, and handover receipts.
            </p>
          </div>

          <div className="text-2xs font-mono text-[#888]">
            Client Archive: <strong className="text-black">{totalOrdersCount} Total Orders</strong>
          </div>
        </div>

        {/* 4-Stat Strip: Styled like Admin Dashboard with pure white background, crisp icons & black compact text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-1">
          {/* Card 1: Active Shipments */}
          <div className="bg-white p-4 sm:p-5 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-2 hover:border-black/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-wider font-bold text-neutral-900">
                Active Shipments
              </span>
              <div className="h-7 w-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Truck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] flex items-center space-x-2">
                <span>{activeOrders.length}</span>
                <span className="text-xs font-normal text-neutral-500 font-sans">
                  {activeOrders.length === 1 ? "parcel" : "parcels"}
                </span>
                {activeOrders.length > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              <div className="text-3xs font-mono text-neutral-500">
                {activeOrders.length > 0 ? "Awaiting courier handover" : "All shipments delivered"}
              </div>
            </div>
          </div>

          {/* Card 2: Completed & Delivered */}
          <div className="bg-white p-4 sm:p-5 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-2 hover:border-black/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-wider font-bold text-neutral-900">
                Completed & Delivered
              </span>
              <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] flex items-center space-x-2">
                <span>{deliveredOrdersCount}</span>
                <span className="text-xs font-normal text-neutral-500 font-sans">verified</span>
              </div>
              <div className="text-3xs font-mono text-emerald-600 font-medium">
                100% verified fulfillment
              </div>
            </div>
          </div>

          {/* Card 3: Total Order Records */}
          <div className="bg-white p-4 sm:p-5 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-2 hover:border-black/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-wider font-bold text-neutral-900">
                Total Orders
              </span>
              <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] flex items-center space-x-2">
                <span>{totalOrdersCount}</span>
                <span className="text-xs font-normal text-neutral-500 font-sans">records</span>
              </div>
              <div className="text-3xs font-mono text-neutral-500">
                Complete client transaction archive
              </div>
            </div>
          </div>

          {/* Card 4: Lifetime Wardrobe Total */}
          <div className="bg-white p-4 sm:p-5 border border-[#E5E7EB] rounded-sm shadow-2xs space-y-2 hover:border-black/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-wider font-bold text-neutral-900">
                Lifetime Wardrobe Total
              </span>
              <div className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <DollarSign className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] font-mono">
                {formatCurrency(totalLifetimeSpent, currency)}
              </div>
              <div className="text-3xs font-mono text-purple-600 font-medium">
                Cumulative garment spend
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Priority Active Shipment Spotlight: Shows current parcel so user never has to search */}
      {activeShipment && (
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 border border-amber-200 p-4 sm:p-5 rounded-xs space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-amber-900">
                Priority Active Dispatch • Handover Pending
              </span>
            </div>
            <div className="text-2xs font-mono text-amber-800">
              Order: <strong className="text-black">{activeShipment.order_number}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="relative h-14 w-12 bg-white border border-amber-200 rounded overflow-hidden shrink-0">
                {activeShipment.items[0]?.image_url ? (
                  <Image
                    src={activeShipment.items[0].image_url}
                    alt={activeShipment.items[0].product_title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-amber-600 m-auto" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-neutral-900">
                  {activeShipment.items.map((it) => it.product_title).join(", ")}
                </div>
                <div className="text-2xs font-mono text-neutral-600 flex items-center space-x-2">
                  <span>Carrier: <strong>{activeShipment.shipping_carrier}</strong></span>
                  <span>•</span>
                  <span>Tracking: <strong>{activeShipment.tracking_number}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:self-center shrink-0">
              <button
                onClick={() => handleConfirmReceived(activeShipment.order_number)}
                disabled={confirmingId === activeShipment.order_number}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 text-2xs uppercase tracking-widest font-mono font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {confirmingId === activeShipment.order_number ? "Confirming..." : "Confirm Received"}
                </span>
              </button>

              <button
                onClick={() => setSelectedOrder(activeShipment)}
                className="bg-neutral-900 hover:bg-black text-white px-3 py-2 text-2xs uppercase tracking-wider font-mono transition-colors"
              >
                View Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Controls Bar: Filter Pills, Search Box & View Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Filter Pills with Counts */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          {[
            { id: "all", label: `All (${orders.length})` },
            { id: "in_progress", label: `In Progress (${activeOrders.length})` },
            { id: "delivered", label: `Delivered (${deliveredOrdersCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-2xs uppercase font-mono tracking-wider transition-all border ${
                statusFilter === tab.id
                  ? "bg-[#111] text-white border-black font-semibold shadow-xs"
                  : "bg-white text-[#666] border-[#EAEAEA] hover:border-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Tools: Search & Layout Mode */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or item..."
              className="w-full bg-white border border-[#EAEAEA] pl-8 pr-3 py-1.5 text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-2xs text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Compact vs Detailed Toggle */}
          <div className="flex items-center border border-[#EAEAEA] bg-[#FAFBFD] p-0.5 rounded-xs shrink-0">
            <button
              onClick={() => setViewMode("compact")}
              title="Compact Dossier List (Saves vertical space)"
              className={`p-1.5 text-xs transition-colors rounded-2xs ${
                viewMode === "compact"
                  ? "bg-white text-black shadow-xs border border-[#EAEAEA]"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              title="Detailed Card View"
              className={`p-1.5 text-xs transition-colors rounded-2xs ${
                viewMode === "detailed"
                  ? "bg-white text-black shadow-xs border border-[#EAEAEA]"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Orders Content */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] p-12 text-center space-y-3">
          <Package className="h-8 w-8 text-[#999] mx-auto" />
          <h3 className="font-sans text-base font-semibold text-[#111]">No Orders Located</h3>
          <p className="text-xs text-[#666]">
            {searchQuery
              ? `No transactions matched "${searchQuery}". Try a different keyword.`
              : "No transactions match the selected filter criteria."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="inline-block mt-2 px-3 py-1.5 text-2xs font-mono uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "compact" ? (
        /* COMPACT DOSSIER LIST (Elegantly solves profile overflow) */
        <div className="bg-white border border-[#EAEAEA] divide-y divide-[#EAEAEA]">
          {paginatedOrders.map((order) => {
            const isDelivered = order.status === "delivered";

            return (
              <div
                key={order.id}
                className="p-4 sm:p-4.5 hover:bg-[#FAFBFD] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Left: Identifier, Date & Item Thumbnails */}
                <div className="flex items-center space-x-4 min-w-0">
                  {/* Overlapping Garment Thumbnails */}
                  <div className="flex items-center -space-x-2.5 shrink-0 overflow-hidden py-0.5">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative h-11 w-9 border-2 border-white bg-[#F6F6F6] overflow-hidden shadow-xs shrink-0"
                      >
                        <Image
                          src={item.image_url}
                          alt={item.product_title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-11 w-9 border-2 border-white bg-neutral-200 text-neutral-700 flex items-center justify-center text-3xs font-mono font-bold shrink-0">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Order Meta Info */}
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-sans font-bold text-xs sm:text-sm text-[#111]">
                        {order.order_number}
                      </span>
                      <span className="text-3xs font-mono text-[#888]">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-2xs text-[#666] truncate max-w-xs sm:max-w-md font-sans">
                      {order.items.map((it) => `${it.quantity}x ${it.product_title}`).join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Right: Status, Total Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0F0F0]">
                  {/* Status Badge */}
                  {isDelivered ? (
                    <span className="text-3xs uppercase tracking-wider font-mono font-bold px-2 py-0.5 bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ORDER DONE</span>
                    </span>
                  ) : (
                    <span className="text-3xs uppercase tracking-wider font-mono font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>{order.status === "shipped" ? "IN TRANSIT" : "IN PROGRESS"}</span>
                    </span>
                  )}

                  {/* Price */}
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#111] min-w-[70px] text-right">
                    {formatCurrency(order.total_amount, currency)}
                  </span>

                  {/* Fast Action Buttons */}
                  <div className="flex items-center space-x-1.5">
                    {!isDelivered && (
                      <button
                        onClick={() => handleConfirmReceived(order.order_number)}
                        disabled={confirmingId === order.order_number}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1.5 text-3xs uppercase tracking-wider font-mono font-bold transition-colors"
                        title="Click when you have received the parcel"
                      >
                        {confirmingId === order.order_number ? "..." : "Confirm Received"}
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-white hover:bg-neutral-900 hover:text-white text-black border border-[#EAEAEA] px-3 py-1.5 text-2xs uppercase tracking-wider font-mono transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAILED CARD VIEW */
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const isDelivered = order.status === "delivered";

            return (
              <div
                key={order.id}
                className="bg-white border border-[#EAEAEA] p-5 sm:p-6 space-y-4 hover:border-black transition-colors"
              >
                {/* Order Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-2xs font-mono uppercase tracking-widest text-[#888] block">
                        Order Identifier
                      </span>
                      <span className="font-sans font-bold text-sm text-[#111]">
                        {order.order_number}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs font-mono uppercase tracking-widest text-[#888] block">
                        Date Placed
                      </span>
                      <span className="font-mono text-2xs text-[#555]">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs font-mono uppercase tracking-widest text-[#888] block">
                        Total Charged
                      </span>
                      <span className="font-mono font-bold text-sm text-[#111]">
                        {formatCurrency(order.total_amount, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
                    {isDelivered ? (
                      <span className="text-2xs uppercase tracking-wider font-mono font-bold px-2.5 py-1 bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ORDER DONE • DELIVERED</span>
                      </span>
                    ) : (
                      <>
                        <span className="text-2xs uppercase tracking-wider font-mono font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>
                            {order.status === "shipped"
                              ? "IN TRANSIT"
                              : "IN PROGRESS (NOT COMPLETE)"}
                          </span>
                        </span>

                        <button
                          onClick={() => handleConfirmReceived(order.order_number)}
                          disabled={confirmingId === order.order_number}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-2xs uppercase tracking-widest font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {confirmingId === order.order_number
                              ? "Confirming..."
                              : "Confirm Received"}
                          </span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-[#111] hover:bg-black text-white px-4 py-2 text-2xs uppercase tracking-widest font-mono transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 bg-[#FAFBFD] border border-[#EAEAEA] p-3"
                    >
                      <div className="relative h-16 w-12 bg-[#F6F6F6] border border-[#EAEAEA] shrink-0 overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.product_title}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="space-y-0.5 text-xs flex-1">
                        <h4 className="font-semibold text-black line-clamp-1">
                          {item.product_title}
                        </h4>
                        <p className="text-2xs font-mono text-[#777]">
                          Size: {item.size} • Color: {item.color_name} • Qty: {item.quantity}
                        </p>
                        <p className="text-2xs font-mono font-medium text-black">
                          {formatCurrency(item.total_price, currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courier Ticker */}
                <div className="flex items-center justify-between bg-[#F8F9FA] px-4 py-2 text-2xs text-[#666] font-mono border border-[#EAEAEA]">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-3.5 w-3.5 text-[#111]" />
                    <span>Carrier: <strong className="text-black">{order.shipping_carrier}</strong></span>
                    <span>•</span>
                    <span>Tracking: <strong className="text-black">{order.tracking_number}</strong></span>
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-black hover:underline"
                    >
                      <span>Track with DHL</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Luxury Pagination Bar: Keeps profile neat and bounded */}
      {filteredOrders.length > ORDERS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EAEAEA] text-2xs font-mono">
          <div className="text-neutral-500">
            Showing{" "}
            <strong className="text-black">
              {(currentPage - 1) * ORDERS_PER_PAGE + 1}–
              {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)}
            </strong>{" "}
            of <strong className="text-black">{filteredOrders.length}</strong> orders
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-[#EAEAEA] bg-white text-neutral-600 hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center font-mono border transition-colors ${
                    currentPage === pageNum
                      ? "bg-black text-white border-black font-bold"
                      : "bg-white text-neutral-600 border-[#EAEAEA] hover:border-black"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-[#EAEAEA] bg-white text-neutral-600 hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        currency={currency}
        onConfirmReceived={handleConfirmReceived}
      />
    </div>
  );
}
