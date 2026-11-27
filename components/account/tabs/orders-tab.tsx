"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { formatCurrency } from "@/lib/utils";
import { CustomerOrder } from "@/lib/auth/types";
import { OrderDetailsModal } from "./order-details-modal";
import { Truck, ExternalLink, Package, CheckCircle2, Clock } from "lucide-react";

interface OrdersTabProps {
  currency: "USD" | "EUR" | "GBP" | "CAD";
}

export function OrdersTab({ currency }: OrdersTabProps) {
  const { orders, refreshOrders, confirmOrderReceived } = useAuth();
  const [selectedOrder, setSelectedOrder] = React.useState<CustomerOrder | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
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

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => {
          if (statusFilter === "in_progress") {
            return o.status === "processing" || o.status === "shipped";
          }
          return o.status === statusFilter;
        });

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

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-[#111] uppercase">
            Order History & Logistics
          </h2>
          <p className="text-xs text-[#666]">
            Inspect live order statuses, courier dispatches, and delivery confirmations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {[
            { id: "all", label: "All Orders" },
            { id: "in_progress", label: "In Progress" },
            { id: "shipped", label: "In Transit" },
            { id: "delivered", label: "Delivered & Done" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-2xs uppercase font-mono tracking-wider transition-all border ${
                statusFilter === tab.id
                  ? "bg-[#111] text-white border-black font-semibold"
                  : "bg-white text-[#666] border-[#EAEAEA] hover:border-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] p-12 text-center space-y-3">
          <Package className="h-8 w-8 text-[#999] mx-auto" />
          <h3 className="font-sans text-base font-semibold text-[#111]">No Orders Located</h3>
          <p className="text-xs text-[#666]">
            No transactions match the selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.status === "delivered";

            return (
              <div
                key={order.id}
                className="bg-white border border-[#EAEAEA] p-6 space-y-5 hover:border-black transition-colors"
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

                        {/* Customer Confirm Receipt Button */}
                        <button
                          onClick={() => handleConfirmReceived(order.order_number)}
                          disabled={confirmingId === order.order_number}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-2xs uppercase tracking-widest font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                          title="Click when courier hands over the package to you"
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

                {/* Delivery Notice: Shown when order is not yet received */}
                {!isDelivered && (
                  <div className="bg-amber-50/80 border border-amber-200/90 p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Order Status: In Progress.</strong> Package has not been handed over
                        yet. When the delivery courier hands over the package to you, please click{" "}
                        <em className="font-semibold text-black">&quot;Confirm Received&quot;</em> to
                        complete the order.
                      </span>
                    </div>
                    <button
                      onClick={() => handleConfirmReceived(order.order_number)}
                      disabled={confirmingId === order.order_number}
                      className="self-start sm:self-auto shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-2xs font-mono uppercase tracking-wider font-semibold transition-colors rounded-xs shadow-xs"
                    >
                      {confirmingId === order.order_number
                        ? "Updating..."
                        : "I Have Received This Order"}
                    </button>
                  </div>
                )}

                {/* Items in Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center justify-between bg-[#F8F9FA] px-4 py-2.5 text-2xs text-[#666] font-mono border border-[#EAEAEA]">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-3.5 w-3.5 text-[#111]" />
                    <span>
                      Carrier: <strong className="text-black">{order.shipping_carrier}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Tracking: <strong className="text-black">{order.tracking_number}</strong>
                    </span>
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
