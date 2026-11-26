"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Archive,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Product } from "@/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    subtitle: "",
    category: "jackets-coats",
    price: 250,
    compareAtPrice: 0,
    stockCount: 20,
    primaryImage: "",
    description: "",
    sizes: "S, M, L, XL",
    colorName: "Obsidian",
    colorHex: "#111111",
  });

  // Delete Confirmation Dialog
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/admin/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setProducts(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      subtitle: "Winter 26/27 Drop",
      category: "jackets-coats",
      price: 295,
      compareAtPrice: 350,
      stockCount: 25,
      primaryImage: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800",
      description: "Premium winter insulation tailored with goose down and weather-resistant shell.",
      sizes: "S, M, L, XL",
      colorName: "Obsidian",
      colorHex: "#111111",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      subtitle: p.subtitle || "",
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      stockCount: p.stockCount,
      primaryImage: p.primaryImage,
      description: p.description || "",
      sizes: p.sizes ? p.sizes.join(", ") : "S, M, L, XL",
      colorName: p.colorways?.[0]?.name || "Standard",
      colorHex: p.colorways?.[0]?.hex || "#111111",
    });
    setIsModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = {
      ...formData,
      sizes: sizesArray,
      colorways: [{ name: formData.colorName, hex: formData.colorHex }],
      compareAtPrice: formData.compareAtPrice > 0 ? formData.compareAtPrice : undefined,
    };

    if (editingProduct) {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingProduct.id, ...payload }),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setIsModalOpen(false);
    fetchProducts();
  };

  // Toggle Publish
  const handleTogglePublish = async (p: any) => {
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, isPublished: !p.isPublished }),
    });
    fetchProducts();
  };

  // Toggle Archive
  const handleToggleArchive = async (p: any) => {
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, isArchived: !p.isArchived }),
    });
    fetchProducts();
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/admin/products?id=${deletingId}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    fetchProducts();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Product Inventory Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Create, publish, edit prices, manage variants, and archive winter apparel pieces.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-[#111827] hover:bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E5E7EB] rounded-sm shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full bg-[#F9FAFB] border border-[#D1D5DB] pl-9 pr-4 py-1.5 text-xs text-[#111] placeholder:text-neutral-400 focus:outline-none focus:border-black rounded-sm"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#D1D5DB] text-xs font-mono py-1.5 px-3 rounded-sm focus:outline-none focus:border-black"
          >
            <option value="all">All Departments</option>
            <option value="jackets-coats">Jackets & Coats</option>
            <option value="sweaters-hoodies">Sweaters & Hoodies</option>
            <option value="boots-accessories">Boots & Accessories</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#D1D5DB] text-xs font-mono py-1.5 px-3 rounded-sm focus:outline-none focus:border-black"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
            <option value="low_stock">Low Stock (≤5)</option>
          </select>

          <button
            onClick={fetchProducts}
            className="p-1.5 text-neutral-500 hover:text-black border border-[#D1D5DB] bg-[#F9FAFB] rounded-sm"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-sm shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-neutral-500 font-mono text-[0.68rem] uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Variants / Sizes</th>
                <th className="py-3 px-6">Stock</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-mono text-xs">
                    No winter products found matching query.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-12 w-10 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                          <Image
                            src={p.primaryImage}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-neutral-900 block truncate max-w-[200px]">
                            {p.title}
                          </span>
                          <span className="text-2xs text-neutral-400 font-mono block">
                            SKU: {p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6 font-mono text-2xs uppercase text-neutral-600">
                      {p.categoryLabel || p.category}
                    </td>

                    <td className="py-3.5 px-6 font-mono font-semibold text-neutral-900">
                      ${p.price.toFixed(2)}
                      {p.compareAtPrice && (
                        <span className="block text-2xs text-neutral-400 line-through font-normal">
                          ${p.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {p.sizes?.map((s: string) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 text-[0.62rem] font-mono border border-neutral-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-6 font-mono">
                      <span
                        className={`font-semibold ${
                          p.stockCount <= 5 ? "text-amber-600" : "text-emerald-700"
                        }`}
                      >
                        {p.stockCount} units
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      {p.isArchived ? (
                        <span className="inline-block text-[0.62rem] font-mono px-2 py-0.5 border rounded-xs uppercase tracking-wider bg-neutral-100 text-neutral-600 border-neutral-300">
                          Archived
                        </span>
                      ) : p.isPublished ? (
                        <span className="inline-block text-[0.62rem] font-mono px-2 py-0.5 border rounded-xs uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block text-[0.62rem] font-mono px-2 py-0.5 border rounded-xs uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center space-x-1">
                        {/* Publish/Unpublish */}
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className="p-1.5 text-neutral-500 hover:text-black rounded-xs"
                          title={p.isPublished ? "Unpublish" : "Publish"}
                        >
                          {p.isPublished ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>

                        {/* Archive */}
                        <button
                          onClick={() => handleToggleArchive(p)}
                          className="p-1.5 text-neutral-500 hover:text-amber-700 rounded-xs"
                          title={p.isArchived ? "Unarchive" : "Archive"}
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-neutral-500 hover:text-blue-700 rounded-xs"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeletingId(p.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-xs"
                          title="Delete Permanently"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          CREATE / EDIT PRODUCT MODAL
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-neutral-900 font-sans">
                {editingProduct ? "Edit Winter Garment" : "Create New Winter Garment"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Garment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Glacier Down Parka"
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Department Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                  >
                    <option value="jackets-coats">Jackets & Coats</option>
                    <option value="sweaters-hoodies">Sweaters & Hoodies</option>
                    <option value="boots-accessories">Boots & Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Compare-At Price
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.primaryImage}
                  onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Available Sizes (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Primary Colorway Name
                  </label>
                  <input
                    type="text"
                    value={formData.colorName}
                    onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                    placeholder="e.g. Glacial White"
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                  Garment Description & Insulation
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-mono uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111] hover:bg-black text-white text-xs font-mono uppercase tracking-wider font-semibold"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION DIALOG
         ========================================================================= */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md border border-neutral-300 shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-neutral-900">
                Confirm Permanent Deletion
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete this garment? This action will remove it from the catalog and log an administrative audit event.
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-mono uppercase tracking-wider hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider font-semibold"
              >
                Delete Garment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
