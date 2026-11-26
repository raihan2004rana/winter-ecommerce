"use client";

import * as React from "react";
import {
  Tag,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Percent,
  DollarSign,
  Truck,
  Power,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AdminCoupon } from "@/lib/server/admin-store";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<AdminCoupon[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // New coupon form
  const [formData, setFormData] = React.useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed_amount" | "free_shipping",
    value: 15,
    minOrderValue: 100,
    usageLimit: 50,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
  });

  const fetchCoupons = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data && data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggle = async (id: string, code: string) => {
    try {
      setTogglingId(id);
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to toggle coupon");
      }

      await fetchCoupons();
      setSuccessToast(`Updated status for voucher code "${code}"`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    try {
      setSaving(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase().trim(),
          isActive: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create coupon");
      }

      await fetchCoupons();
      setIsModalOpen(false);
      setSuccessToast(`Coupon "${formData.code.toUpperCase()}" launched successfully!`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create coupon";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((acc, c) => acc + c.usedCount, 0);

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
              Coupons & Discount Rules
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {coupons.length} Active Rules
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Configure promotional codes, percentage deductions, and seasonal campaign incentives.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Discount Codes
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{coupons.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Configured promotions</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Active Campaign Codes
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Currently redeemable</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-sky-700 uppercase tracking-wider">
            Total Redemptions
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1">{totalUses}</div>
          <div className="text-[11px] text-sky-600 mt-1">Times used at checkout</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Avg Discount Value
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">20%</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across active vouchers</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>
        <div className="text-xs text-neutral-500 font-mono">
          Showing {filteredCoupons.length} codes
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Type</th>
                <th className="py-3.5 px-4">Reward Amount</th>
                <th className="py-3.5 px-4">Min Spend</th>
                <th className="py-3.5 px-4">Redemptions</th>
                <th className="py-3.5 px-4">Expiration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    <span>Loading coupon ledger...</span>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <Tag className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <span>No coupon codes found matching your criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = new Date(coupon.expiresAt) < new Date();

                  return (
                    <tr key={coupon.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-neutral-900 tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy code"
                            className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        {coupon.discountType === "percentage" ? (
                          <span className="inline-flex items-center space-x-1 text-neutral-700 font-medium">
                            <Percent className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Percentage Off</span>
                          </span>
                        ) : coupon.discountType === "fixed_amount" ? (
                          <span className="inline-flex items-center space-x-1 text-neutral-700 font-medium">
                            <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Fixed Reduction</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-neutral-700 font-medium">
                            <Truck className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Free Shipping</span>
                          </span>
                        )}
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.value}% OFF`
                          : coupon.discountType === "fixed_amount"
                          ? `$${coupon.value.toFixed(2)} OFF`
                          : "100% Shipping Free"}
                      </td>

                      {/* Min Order */}
                      <td className="py-3.5 px-4 font-mono text-neutral-600">
                        ${coupon.minOrderValue}
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold text-neutral-900">{coupon.usedCount}</span>
                            <span className="text-neutral-400">/ {coupon.usageLimit} max</span>
                          </div>
                          <div className="w-24 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-neutral-800 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (coupon.usedCount / coupon.usageLimit) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Expiration */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className={isExpired ? "text-rose-600 font-bold" : "text-neutral-600"}>
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                        {isExpired && (
                          <span className="block text-[10px] text-rose-500 uppercase font-semibold">
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4">
                        {coupon.isActive ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200">
                            <span>PAUSED</span>
                          </span>
                        )}
                      </td>

                      {/* Action Toggle */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggle(coupon.id, coupon.code)}
                          disabled={togglingId === coupon.id}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors border ${
                            coupon.isActive
                              ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {togglingId === coupon.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Power className="w-3 h-3" />
                          )}
                          <span>{coupon.isActive ? "Pause" : "Activate"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Launch New Coupon Code</h3>
                  <p className="text-[11px] text-neutral-500">
                    Define discount logic and checkout restrictions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ARCTIC25"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                  }
                  className="w-full px-3 py-2 text-sm font-mono font-bold tracking-wider uppercase bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountType: e.target.value as "percentage" | "fixed_amount" | "free_shipping",
                      }))
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Value {formData.discountType === "percentage" ? "(%)" : "($)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, value: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Min Order Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minOrderValue: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usageLimit: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiresAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Deploying..." : "Launch Coupon"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
