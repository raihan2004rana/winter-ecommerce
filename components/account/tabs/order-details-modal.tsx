"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomerOrder } from "@/lib/auth/types";
import { formatCurrency } from "@/lib/utils";
import { X, Package, Truck, CheckCircle2, Clock, ExternalLink, ShieldCheck } from "lucide-react";

interface OrderDetailsModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
  currency: "USD" | "EUR" | "GBP" | "CAD";
  onConfirmReceived?: (orderNumber: string) => Promise<void>;
}

export function OrderDetailsModal({
  order,
  onClose,
  currency,
  onConfirmReceived,
}: OrderDetailsModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  if (!order) return null;

  const isDelivered = order.status === "delivered";

  const handleConfirm = async () => {
    if (!onConfirmReceived) return;
    setIsSubmitting(true);
    try {
      await onConfirmReceived(order.order_number);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-[#EAEAEA] w-full max-w-3xl my-8 overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-[#FAFBFD] border-b border-[#EAEAEA] p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xs font-mono uppercase tracking-[0.2em] text-[#888]">
                Order Dossier
              </span>
              <span className="text-2xs uppercase tracking-wider font-semibold px-2 py-0.5 bg-black text-white font-mono">
                {order.status.toUpperCase()}
              </span>
            </div>
            <h2 className="font-sans text-xl font-bold tracking-tight text-[#111]">
              {order.order_number}
            </h2>
            <p className="text-2xs text-[#777] font-mono">
              Placed on {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 border border-[#EAEAEA] hover:border-black text-[#555] hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Tracking Milestone Timeline */}
          <div className="bg-[#FAFBFD] border border-[#EAEAEA] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-[#111]" />
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#111]">
                  {order.shipping_carrier}
                </span>
              </div>
              <span className="text-2xs font-mono text-[#666]">
                Tracking: <strong className="text-black">{order.tracking_number}</strong>
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[0.65rem] font-mono ${
                        step.completed
                          ? "bg-black text-white"
                          : "bg-[#EAEAEA] text-[#777]"
                      }`}
                    >
                      {step.completed ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-2xs font-medium uppercase tracking-wider ${
                        step.completed ? "text-black" : "text-[#888]"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-[#666] leading-tight pl-7">
                    {step.description}
                  </p>
                  <p className="text-[0.62rem] text-[#999] font-mono pl-7">
                    {step.date}
                  </p>
                </div>
              ))}
            </div>

            {order.tracking_url && (
              <div className="pt-2 text-right">
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-2xs uppercase font-mono tracking-widest text-black hover:underline"
                >
                  <span>Track Live with DHL</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Delivery Handover & Confirmation Card */}
          <div
            className={`p-4 sm:p-5 border transition-all ${
              isDelivered
                ? "bg-[#F0FDF4] border-[#BBF7D0]"
                : "bg-amber-50/70 border-amber-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                {isDelivered ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-2xs font-mono uppercase tracking-widest font-bold ${
                        isDelivered ? "text-emerald-800" : "text-amber-900"
                      }`}
                    >
                      {isDelivered
                        ? "Delivery Verified & Complete"
                        : "Handover Pending • In Progress"}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isDelivered ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isDelivered ? "text-emerald-700" : "text-amber-800"
                    }`}
                  >
                    {isDelivered
                      ? "The delivery courier has handed over this parcel, and delivery receipt has been confirmed. Order is marked DELIVERED across your client dossier and store operations."
                      : "The package is dispatched or in transit. Once the delivery agent arrives and hands over the parcel to you in person, please click 'I Have Received This Order' below to mark it completed."}
                  </p>
                </div>
              </div>

              {!isDelivered && onConfirmReceived && (
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-2xs uppercase tracking-widest font-mono font-bold transition-colors flex items-center justify-center space-x-2 shrink-0 shadow-xs disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {isSubmitting ? "Confirming..." : "I Have Received This Order"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Garments Breakdown */}
          <div className="space-y-3">
            <h3 className="text-2xs uppercase font-mono tracking-[0.2em] text-[#888]">
              Purchased Garments ({order.items.length})
            </h3>
            <div className="divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-16 bg-[#F6F6F6] border border-[#EAEAEA] overflow-hidden shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.product_title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/products/${item.product_slug}`}
                        className="text-xs font-semibold text-[#111] hover:underline"
                      >
                        {item.product_title}
                      </Link>
                      <div className="flex items-center space-x-3 text-2xs font-mono text-[#666]">
                        <span>Size: <strong className="text-black">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-black">{item.color_name}</strong></span>
                        <span>•</span>
                        <span>Qty: <strong className="text-black">{item.quantity}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[#111]">
                      {formatCurrency(item.total_price, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Financial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Delivery Destination */}
            <div className="bg-[#FAFBFD] border border-[#EAEAEA] p-4 space-y-1.5 text-xs">
              <span className="text-2xs uppercase font-mono tracking-widest text-[#888] block">
                Shipping Destination
              </span>
              <p className="font-semibold text-black">{order.shipping_address.name}</p>
              <p className="text-[#666]">{order.shipping_address.line1}</p>
              <p className="text-[#666]">
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
              <p className="text-[#666]">{order.shipping_address.country}</p>
              <p className="text-[#888] font-mono text-2xs pt-1">{order.shipping_address.phone}</p>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#FAFBFD] border border-[#EAEAEA] p-4 space-y-2 text-xs">
              <span className="text-2xs uppercase font-mono tracking-widest text-[#888] block">
                Settlement Summary
              </span>
              <div className="space-y-1 text-2xs font-mono">
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal_amount, currency)}</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Express Climate-Neutral Shipping</span>
                  <span className="text-[#16A34A] uppercase font-semibold">Free</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-[#16A34A]">
                    <span>VIP Member Discount</span>
                    <span>-{formatCurrency(order.discount_amount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#666]">
                  <span>Estimated Sales Tax</span>
                  <span>{formatCurrency(order.tax_amount, currency)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-black border-t border-[#EAEAEA] pt-2 mt-1">
                  <span>Total Charged</span>
                  <span>{formatCurrency(order.total_amount, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAFBFD] border-t border-[#EAEAEA] p-4 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-2xs text-[#777]">
            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
            <span>Encrypted Stripe Authorization • Lifetime Alpine Warranty</span>
          </div>

          <button
            onClick={onClose}
            className="bg-black hover:bg-[#222] text-white px-6 py-2 text-2xs uppercase tracking-widest font-mono transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
