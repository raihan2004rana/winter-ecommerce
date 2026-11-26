"use client";

import * as React from "react";
import Image from "next/image";
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  X,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  History,
} from "lucide-react";
import { Product } from "@/data/products";

interface InventoryItem extends Product {
  isPublished?: boolean;
  isArchived?: boolean;
}

export default function AdminInventoryPage() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterMode, setFilterMode] = React.useState<"all" | "low_stock" | "out_of_stock">("all");
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Modal adjustment state
  const [adjustingProduct, setAdjustingProduct] = React.useState<InventoryItem | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = React.useState<number>(10);
  const [adjustmentMode, setAdjustmentMode] = React.useState<"add" | "subtract">("add");
  const [adjustmentReason, setAdjustmentReason] = React.useState<string>("Restock Shipment");
  const [savingAdjustment, setSavingAdjustment] = React.useState(false);
  const [adjustmentError, setAdjustmentError] = React.useState<string | null>(null);

  const fetchInventory = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data && data.inventory) {
        setItems(data.inventory);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    const finalDelta = adjustmentMode === "add" ? Math.abs(adjustmentDelta) : -Math.abs(adjustmentDelta);
    if (finalDelta === 0) return;

    try {
      setSavingAdjustment(true);
      setAdjustmentError(null);

      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: adjustingProduct.id,
          delta: finalDelta,
          reason: adjustmentReason,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to adjust inventory");
      }

      await fetchInventory();
      setSuccessToast(
        `Updated stock for ${adjustingProduct.title}: ${finalDelta > 0 ? `+${finalDelta}` : finalDelta} units (${adjustmentReason})`
      );
      setTimeout(() => setSuccessToast(null), 4000);
      setAdjustingProduct(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to adjust inventory";
      setAdjustmentError(message);
    } finally {
      setSavingAdjustment(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === "low_stock") {
      return item.stockCount > 0 && item.stockCount <= 10;
    }
    if (filterMode === "out_of_stock") {
      return item.stockCount === 0;
    }
    return true;
  });

  const lowStockCount = items.filter((i) => i.stockCount > 0 && i.stockCount <= 10).length;
  const outOfStockCount = items.filter((i) => i.stockCount === 0).length;
  const totalStockUnits = items.reduce((acc, i) => acc + i.stockCount, 0);

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
              Inventory & Variant Management
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {totalStockUnits} Units In Stock
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Monitor real-time inventory thresholds, winter garment sizing, and SKU allocations.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Inventory Units
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{totalStockUnits}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across {items.length} garments</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Healthy Stock
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {items.filter((i) => i.stockCount > 10).length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Stock count &gt; 10 units</div>
        </div>

        <div
          onClick={() => setFilterMode("low_stock")}
          className={`bg-white p-5 rounded-lg border shadow-sm cursor-pointer transition-all ${
            filterMode === "low_stock"
              ? "border-amber-500 ring-1 ring-amber-500 bg-amber-50/20"
              : "border-neutral-200 hover:border-amber-300"
          }`}
        >
          <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center justify-between">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{lowStockCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">Under 10 units remaining</div>
        </div>

        <div
          onClick={() => setFilterMode("out_of_stock")}
          className={`bg-white p-5 rounded-lg border shadow-sm cursor-pointer transition-all ${
            filterMode === "out_of_stock"
              ? "border-rose-500 ring-1 ring-rose-500 bg-rose-50/20"
              : "border-neutral-200 hover:border-rose-300"
          }`}
        >
          <div className="text-xs font-medium text-rose-700 uppercase tracking-wider flex items-center justify-between">
            <span>Out of Stock</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{outOfStockCount}</div>
          <div className="text-[11px] text-rose-600 mt-1">Needs urgent replenishment</div>
        </div>
      </div>

      {/* Controls & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Filter */}
        <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-lg w-fit border border-neutral-200 text-xs">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterMode === "all"
                ? "bg-white text-neutral-900 shadow-sm font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            All Stock ({items.length})
          </button>
          <button
            onClick={() => setFilterMode("low_stock")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterMode === "low_stock"
                ? "bg-white text-amber-800 shadow-sm font-semibold"
                : "text-neutral-500 hover:text-amber-800"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterMode("out_of_stock")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterMode === "out_of_stock"
                ? "bg-white text-rose-800 shadow-sm font-semibold"
                : "text-neutral-500 hover:text-rose-800"
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search SKU or garment name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>
      </div>

      {/* Inventory & Variants Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Garment & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Sizing Matrix</th>
                <th className="py-3.5 px-4">Colorway Options</th>
                <th className="py-3.5 px-4">Available Units</th>
                <th className="py-3.5 px-4">Stock Health</th>
                <th className="py-3.5 px-4 text-right">Adjustment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    <span>Querying inventory ledger...</span>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <span>No inventory records match the selected filter.</span>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.stockCount > 0 && item.stockCount <= 10;
                  const isOut = item.stockCount === 0;

                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-11 h-13 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                            <Image
                              src={item.primaryImage || item.galleryImages?.[0] || ""}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 line-clamp-1 max-w-[200px]">
                              {item.title}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-400">
                              SKU: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 capitalize text-neutral-600 font-medium">
                        {item.category.replace("-", " ")}
                      </td>

                      {/* Sizing Variants */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {item.sizes.map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 text-neutral-700 rounded border border-neutral-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Colors */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {(item.colorways || []).map((c) => (
                            <span
                              key={c.name}
                              className="px-2 py-0.5 text-[10px] bg-neutral-50 text-neutral-600 rounded border border-neutral-200"
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-sm text-neutral-900">
                          {item.stockCount}
                        </span>
                        <span className="text-[11px] text-neutral-400 ml-1">units</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            <span>OUT OF STOCK</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>LOW STOCK ({item.stockCount})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            <span>OPTIMAL</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setAdjustingProduct(item);
                            setAdjustmentDelta(10);
                            setAdjustmentMode("add");
                            setAdjustmentReason("Restock Shipment");
                            setAdjustmentError(null);
                          }}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>Adjust Stock</span>
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

      {/* Stock Adjustment Drawer / Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Inventory Stock Adjustment</h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    SKU: {adjustingProduct.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-5">
              {adjustmentError && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adjustmentError}</span>
                </div>
              )}

              {/* Product preview */}
              <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="relative w-12 h-14 rounded overflow-hidden shrink-0 border border-neutral-200">
                  <Image
                    src={adjustingProduct.primaryImage || adjustingProduct.galleryImages?.[0] || ""}
                    alt={adjustingProduct.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-xs text-neutral-900 line-clamp-1">
                    {adjustingProduct.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Current stock level:{" "}
                    <span className="font-bold text-neutral-900 font-mono">
                      {adjustingProduct.stockCount} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Add vs Subtract Toggle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Adjustment Operation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentMode("add")}
                    className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 border transition-all ${
                      adjustmentMode === "add"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500"
                        : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stock (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentMode("subtract")}
                    className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 border transition-all ${
                      adjustmentMode === "subtract"
                        ? "bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500"
                        : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Reduce Stock (-)</span>
                  </button>
                </div>
              </div>

              {/* Units to adjust */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Quantity Units
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    required
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Reason / Audit Memo *
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Restock Shipment">Restock Shipment (Supplier Intake)</option>
                  <option value="Customer Return">Customer Return (Restocked to Ledger)</option>
                  <option value="Inventory Count Audit">Inventory Count Audit (Physical Sync)</option>
                  <option value="Damaged / Written-off">Damaged / Defective Stock Write-off</option>
                  <option value="Storefront Display Transfer">Storefront Display Transfer</option>
                </select>
              </div>

              {/* New Projected Total */}
              <div className="p-3 bg-neutral-100 rounded-md flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Projected Final Stock:</span>
                <span className="font-bold text-neutral-900 text-sm">
                  {Math.max(
                    0,
                    adjustingProduct.stockCount +
                      (adjustmentMode === "add" ? adjustmentDelta : -adjustmentDelta)
                  )}{" "}
                  units
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdjustment}
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
                >
                  {savingAdjustment && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{savingAdjustment ? "Recording..." : "Record Adjustment"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
