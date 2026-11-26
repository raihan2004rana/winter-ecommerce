"use client";

import * as React from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  RotateCcw,
  X,
  ExternalLink,
  ChevronRight,
  Package,
  MapPin,
  Mail,
  Calendar,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AdminOrder } from "@/lib/server/admin-store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const [isRefunding, setIsRefunding] = React.useState(false);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (statusFilter !== "all") queryParams.set("status", statusFilter);

      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      const data = await res.json();
      const list = data?.orders || data?.data || [];
      if (Array.isArray(list)) {
        setOrders(list);
        if (selectedOrder) {
          const fresh = list.find((o: AdminOrder) => o.id === selectedOrder.id);
          if (fresh) setSelectedOrder(fresh);
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrder["status"]) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update order status");
      }

      await fetchOrders();
      setSuccessToast(`Order status updated to "${newStatus.toUpperCase()}"`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleProcessRefund = async (orderId: string, amount: number) => {
    if (!confirm(`Are you sure you want to refund $${amount.toFixed(2)} for this order? Inventory will be automatically restored.`)) {
      return;
    }

    try {
      setIsRefunding(true);
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          reason: "Administrator initiated refund via dashboard.",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to process refund");
      }

      await fetchOrders();
      setSuccessToast(`Successfully refunded $${amount.toFixed(2)}. Inventory restored.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(`Refund Error: ${err.message}`);
    } finally {
      setIsRefunding(false);
    }
  };

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span className="uppercase">Delivered</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Truck className="w-3 h-3" />
            <span className="uppercase">Shipped</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span className="uppercase">Processing</span>
          </span>
        );
      case "paid":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CreditCard className="w-3 h-3" />
            <span className="uppercase">Paid</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <RotateCcw className="w-3 h-3" />
            <span className="uppercase">Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <Clock className="w-3 h-3" />
            <span className="uppercase">Pending</span>
          </span>
        );
    }
  };

  const totalVolume = orders.reduce((acc, o) => acc + (o.status !== "cancelled" ? o.total : 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Orders & Fulfillment
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {orders.length} Total Records
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Fulfill winter outerwear orders, process logistics dispatches, and track payments.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Orders Logged
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{orders.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Real-time database store</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Net Revenue Recorded
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            ${totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Active (non-cancelled) volume</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-amber-700 uppercase tracking-wider">
            Processing & Dispatch
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {orders.filter((o) => o.status === "processing" || o.status === "paid").length}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Awaiting shipping labels</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-sky-700 uppercase tracking-wider">
            Fulfilled & Delivered
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            {orders.filter((o) => o.status === "delivered" || o.status === "shipped").length}
          </div>
          <div className="text-[11px] text-sky-600 mt-1">Completed shipments</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
          {[
            { id: "all", label: "All Orders" },
            { id: "processing", label: "Processing" },
            { id: "paid", label: "Paid" },
            { id: "shipped", label: "Shipped" },
            { id: "delivered", label: "Delivered" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === tab.id
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order #, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Order Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    <span>Loading order records...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <span>No orders found matching criteria.</span>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-neutral-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Order Number */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-neutral-900 group-hover:text-black">
                          {order.orderNumber}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{order.customerName}</div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                          {order.customerEmail}
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center -space-x-2 overflow-hidden">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative w-8 h-8 rounded-full border-2 border-white bg-neutral-100 overflow-hidden shadow-xs"
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 text-neutral-700 flex items-center justify-center text-[10px] font-bold">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                        ${order.total.toFixed(2)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 capitalize">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Fulfillment */}
                      <td className="py-3.5 px-4 capitalize">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                            order.fulfillmentStatus === "fulfilled"
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : order.fulfillmentStatus === "partial"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                          }`}
                        >
                          {order.fulfillmentStatus}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-neutral-600 group-hover:text-black">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Inspection Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Topbar */}
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm text-neutral-900">
                    {selectedOrder.orderNumber}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  ID: {selectedOrder.id} • Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order Status Controller */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Update Fulfillment & Order Status
                </label>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedOrder.status}
                    disabled={updatingStatus}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value as AdminOrder["status"])
                    }
                    className="flex-1 px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="paid">Payment Captured (Paid)</option>
                    <option value="processing">Processing in Warehouse</option>
                    <option value="shipped">Dispatched (Shipped with Courier)</option>
                    <option value="delivered">Delivered to Customer</option>
                    <option value="cancelled">Cancelled & Refunded</option>
                  </select>
                  {updatingStatus && <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />}
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="mt-2.5 text-xs font-mono text-neutral-600 flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Tracking: {selectedOrder.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  Purchased Items ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center space-x-3 bg-white">
                      <div className="relative w-12 h-14 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-neutral-900 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center space-x-2">
                          <span className="font-mono bg-neutral-100 px-1.5 py-0.2 rounded border border-neutral-200">
                            Size: {item.size}
                          </span>
                          <span>•</span>
                          <span>{item.color}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-neutral-200 bg-white">
                  <h5 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Customer Details</span>
                  </h5>
                  <div className="text-xs font-semibold text-neutral-900">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-xs text-neutral-500 truncate mt-0.5">
                    {selectedOrder.customerEmail}
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-neutral-200 bg-white">
                  <h5 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Shipping Address</span>
                  </h5>
                  <div className="text-xs text-neutral-800 leading-relaxed">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    <div>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </div>
                    <div className="font-medium text-neutral-900">
                      {selectedOrder.shippingAddress.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                  <span className="font-semibold text-neutral-800">Payment Status</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedOrder.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedOrder.paymentStatus === "refunded"
                        ? "bg-purple-100 text-purple-800"
                        : selectedOrder.paymentStatus === "failed"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>

                {selectedOrder.stripePaymentIntentId && (
                  <div className="flex justify-between text-neutral-600 font-mono text-[11px]">
                    <span>Stripe Intent</span>
                    <span className="truncate max-w-[200px] text-neutral-800">{selectedOrder.stripePaymentIntentId}</span>
                  </div>
                )}

                {selectedOrder.failureReason && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px]">
                    <strong>Failure Reason:</strong> {selectedOrder.failureReason}
                  </div>
                )}

                {selectedOrder.refundedAmount ? (
                  <div className="flex justify-between text-purple-700 font-medium">
                    <span>Refunded Amount</span>
                    <span className="font-mono">-${selectedOrder.refundedAmount.toFixed(2)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono">
                    ${selectedOrder.pricingBreakdown?.subtotal ? selectedOrder.pricingBreakdown.subtotal.toFixed(2) : (selectedOrder.total * 0.9).toFixed(2)}
                  </span>
                </div>

                {selectedOrder.pricingBreakdown?.discountAmount ? (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({selectedOrder.couponCode || "Coupon"})</span>
                    <span className="font-mono">-${selectedOrder.pricingBreakdown.discountAmount.toFixed(2)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping ({selectedOrder.shippingMethod || "Standard"})</span>
                  <span className="font-mono">
                    {selectedOrder.pricingBreakdown?.shippingFee === 0 ? "FREE" : `$${(selectedOrder.pricingBreakdown?.shippingFee || 0).toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Taxes & Duties</span>
                  <span className="font-mono">
                    ${selectedOrder.pricingBreakdown?.taxAmount ? selectedOrder.pricingBreakdown.taxAmount.toFixed(2) : (selectedOrder.total * 0.08).toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-base">
                    ${selectedOrder.total.toFixed(2)} {selectedOrder.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              {selectedOrder.paymentStatus === "paid" ? (
                <button
                  disabled={isRefunding}
                  onClick={() => handleProcessRefund(selectedOrder.id, selectedOrder.total)}
                  className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isRefunding ? "Processing..." : "Refund Order"}</span>
                </button>
              ) : (
                <span className="text-[11px] text-neutral-400 font-mono">
                  {selectedOrder.paymentStatus === "refunded" ? "Order Refunded & Restocked" : "Awaiting Verification"}
                </span>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
