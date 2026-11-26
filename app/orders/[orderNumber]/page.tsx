"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WardrobeExactHeader } from "@/components/storefront/wardrobe-exact-header";
import { WardrobeExactFooter } from "@/components/storefront/wardrobe-exact-footer";
import { AdminOrder } from "@/lib/server/admin-store";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Package,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Loader2,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = (params?.orderNumber as string) || "";

  const [order, setOrder] = React.useState<AdminOrder | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pollCount, setPollCount] = React.useState(0);

  const fetchOrder = React.useCallback(async () => {
    if (!orderNumber) return;
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.status === "success" && data.order) {
        setOrder(data.order);
        setError(null);
      } else {
        setError(data.message || "Order not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Polling mechanism: if paymentStatus is pending, poll to confirm payment through verified server webhook
  React.useEffect(() => {
    if (order && order.paymentStatus === "pending" && pollCount < 15) {
      const timer = setTimeout(() => {
        setPollCount((p) => p + 1);
        fetchOrder();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [order, pollCount, fetchOrder]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111] font-sans">
      <WardrobeExactHeader cartCount={0} onOpenCart={() => {}} onOpenSearch={() => {}} />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-black mx-auto" />
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Retrieving verified order record from database...
            </p>
          </div>
        ) : error || !order ? (
          <div className="max-w-md mx-auto text-center py-16 bg-white rounded-lg border border-gray-200 p-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="font-editorial text-2xl font-normal">Order Not Found</h2>
            <p className="text-xs text-gray-500 font-sans">
              Could not retrieve order details for &quot;{orderNumber}&quot;. Please verify the order number.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button className="bg-[#111] hover:bg-black text-white px-6 text-xs font-mono uppercase">
                  Back to Storefront
                </Button>
              </Link>
            </div>
          </div>
        ) : order.paymentStatus === "pending" ? (
          /* Polling Webhook State */
          <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-lg border border-amber-200 shadow-sm p-8 sm:p-12 space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <span className="text-2xs font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full">
                Awaiting Webhook Synchronization
              </span>
              <h1 className="font-editorial text-3xl font-normal text-black">
                Confirming Stripe Webhook Payment...
              </h1>
              <p className="text-xs text-gray-600 font-sans max-w-md mx-auto leading-relaxed">
                Order <strong className="font-mono">{order.orderNumber}</strong> has been registered. We are awaiting the verified server-side Stripe webhook event before confirming your order.
              </p>
            </div>
            <div className="pt-3">
              <Button
                variant="outline"
                onClick={fetchOrder}
                className="text-xs font-mono uppercase tracking-wider"
              >
                Refresh Status
              </Button>
            </div>
          </div>
        ) : order.paymentStatus === "failed" ? (
          /* Failed Payment View */
          <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-lg border border-rose-200 shadow-sm p-8 sm:p-12 space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-2xs font-mono font-bold uppercase tracking-widest text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                Payment Authorization Declined
              </span>
              <h1 className="font-editorial text-3xl font-normal text-black">
                Unable to Process Payment
              </h1>
              <p className="text-xs text-rose-800 font-sans max-w-md mx-auto leading-relaxed">
                {order.failureReason || "Your card authorization was declined by the payment provider."}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-3">
              <Link href="/checkout">
                <Button className="bg-[#111] hover:bg-black text-white px-6 text-xs font-mono uppercase">
                  Retry Checkout
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Verified Succeeded Order Confirmation */
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Banner */}
            <div className="bg-white rounded-lg border border-emerald-200 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Verified Webhook Payment Confirmed
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-black">
                    Thank you, {order.customerName.split(" ")[0]}!
                  </h1>
                  <p className="text-xs text-gray-600 font-sans">
                    A verified invoice and shipping confirmation has been dispatched to{" "}
                    <strong className="text-black">{order.customerEmail}</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-left md:text-right shrink-0 space-y-1">
                <div className="text-2xs uppercase tracking-wider font-mono text-gray-500">Order Reference</div>
                <div className="font-mono text-lg font-bold text-black">{order.orderNumber}</div>
                {order.trackingNumber && (
                  <div className="text-2xs font-mono text-emerald-700 flex items-center md:justify-end gap-1">
                    <Truck className="w-3 h-3" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2-Column Order Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Items and Fulfillment Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h2 className="font-editorial text-xl font-normal text-black">Purchased Items</h2>
                    <span className="text-xs font-mono text-gray-500">
                      {order.items.length} {order.items.length === 1 ? "line item" : "line items"}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-4 flex gap-4 items-center">
                        <div className="relative w-16 h-20 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover object-center"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-editorial text-base font-normal text-black truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-2xs font-mono text-gray-500 pt-0.5">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Color: {item.color}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="font-mono text-sm font-semibold text-black shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics & Delivery Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                      <span>Shipping Destination</span>
                    </div>
                    <div className="text-xs text-gray-800 font-sans leading-relaxed">
                      <div className="font-semibold text-black">{order.customerName}</div>
                      <div>{order.shippingAddress.street}</div>
                      {order.shippingAddress.apartment && <div>{order.shippingAddress.apartment}</div>}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </div>
                      <div className="font-semibold">{order.shippingAddress.country}</div>
                      {order.shippingAddress.phone && (
                        <div className="text-gray-500 pt-1 font-mono">{order.shippingAddress.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 uppercase tracking-wider">
                      <Truck className="w-3.5 h-3.5 text-black" />
                      <span>Delivery Method</span>
                    </div>
                    <div className="text-xs text-gray-800 font-sans leading-relaxed">
                      <div className="font-semibold text-black">
                        {order.shippingMethod === "express" ? "Alpine Express Air Courier" : "Standard International Delivery"}
                      </div>
                      <div className="text-gray-500">
                        {order.shippingMethod === "express" ? "2–3 business days priority dispatch" : "5–7 business days global transit"}
                      </div>
                      <div className="pt-2 text-emerald-700 font-mono text-2xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Insured & Carbon Neutral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Financial Breakdown & Next Steps */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h2 className="font-editorial text-xl font-normal text-black">Receipt Summary</h2>
                    <span className="text-2xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PAID
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Items Subtotal</span>
                      <span className="font-mono text-black">
                        ${order.pricingBreakdown?.subtotal ? order.pricingBreakdown.subtotal.toFixed(2) : order.total.toFixed(2)}
                      </span>
                    </div>

                    {order.pricingBreakdown?.discountAmount ? (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({order.couponCode || "Coupon"})</span>
                        <span className="font-mono">-${order.pricingBreakdown.discountAmount.toFixed(2)}</span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Rate</span>
                      <span className="font-mono text-black">
                        {order.pricingBreakdown?.shippingFee === 0 ? "FREE" : `$${(order.pricingBreakdown?.shippingFee || 0).toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Duties & VAT</span>
                      <span className="font-mono text-black">
                        ${(order.pricingBreakdown?.taxAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 text-black">
                      <span className="font-editorial text-lg font-semibold">Total Paid</span>
                      <span className="font-mono text-xl font-bold">${order.total.toFixed(2)} {order.currency}</span>
                    </div>
                  </div>

                  {order.stripePaymentIntentId && (
                    <div className="pt-2 border-t border-gray-100 text-2xs font-mono text-gray-400 flex items-center justify-between">
                      <span>Stripe Payment Intent:</span>
                      <span className="truncate max-w-[160px] text-gray-600">{order.stripePaymentIntentId}</span>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <Link href="/products" className="block w-full">
                      <Button className="w-full bg-[#111] hover:bg-black text-white h-11 rounded-full text-xs font-mono uppercase tracking-wider">
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>

                    <Link href="/admin/orders" className="block w-full">
                      <Button variant="outline" className="w-full text-xs font-mono uppercase tracking-wider h-11 rounded-full">
                        <span>View in Admin Dashboard</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <WardrobeExactFooter />
    </div>
  );
}
