"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  Upload,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import { Product } from "@/data/products";

function AdminProductsContent() {
  const searchParams = useSearchParams();

  // URL query parameter parsing
  const paramGender = searchParams.get("gender");
  const paramCategory = searchParams.get("category");
  const paramStatus = searchParams.get("status");
  const paramSearch = searchParams.get("search");

  // Determine initial state values
  const initialGender =
    paramGender ||
    (paramCategory === "women"
      ? "women"
      : paramCategory === "men"
      ? "men"
      : "all");
  const initialCategory =
    paramCategory && paramCategory !== "women" && paramCategory !== "men"
      ? paramCategory
      : "all";
  const initialStatus = paramStatus || "all";
  const initialSearch = paramSearch || "";

  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState(initialSearch);
  const [genderFilter, setGenderFilter] = React.useState(initialGender);
  const [categoryFilter, setCategoryFilter] = React.useState(initialCategory);
  const [statusFilter, setStatusFilter] = React.useState(initialStatus);

  // Sync state if URL query params change
  React.useEffect(() => {
    if (paramGender) {
      setGenderFilter(paramGender);
    }
    if (paramCategory) {
      if (paramCategory === "women" || paramCategory === "men") {
        setGenderFilter(paramCategory);
      } else {
        setCategoryFilter(paramCategory);
      }
    }
    if (paramStatus) setStatusFilter(paramStatus);
    if (paramSearch) setSearch(paramSearch);
  }, [paramGender, paramCategory, paramStatus, paramSearch]);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    subtitle: "",
    gender: "unisex" as "women" | "men" | "unisex",
    category: "jackets-coats",
    price: 250,
    compareAtPrice: 0,
    stockCount: 20,
    primaryImage: "",
    galleryImages: [] as string[],
    description: "",
    sizes: "S, M, L, XL",
    colorName: "Obsidian",
    colorHex: "#111111",
  });

  // Image Upload state
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = React.useState<"upload" | "url">("upload");
  const [isDragOver, setIsDragOver] = React.useState(false);
  const primaryFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Delete Confirmation Dialog
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const fetchProducts = React.useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genderFilter !== "all") params.set("gender", genderFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/admin/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setProducts(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, genderFilter, categoryFilter, statusFilter]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Upload handler to /api/admin/upload
  const handleUploadFile = async (file: File, isGallery = false) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      setUploadError(null);

      const bodyData = new FormData();
      bodyData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: bodyData,
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to upload image file");
      }

      if (isGallery) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), data.url],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          primaryImage: data.url,
        }));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setUploadError(null);
    setFormData({
      title: "",
      subtitle: "Winter 26/27 Drop",
      gender: "unisex",
      category: "jackets-coats",
      price: 295,
      compareAtPrice: 350,
      stockCount: 25,
      primaryImage: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800",
      galleryImages: [],
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
    setUploadError(null);
    setFormData({
      title: p.title,
      subtitle: p.subtitle || "",
      gender: p.gender || "unisex",
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      stockCount: p.stockCount,
      primaryImage: p.primaryImage || p.image || "",
      galleryImages: p.galleryImages || [],
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
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Department / Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#D1D5DB] text-xs font-mono py-1.5 px-3 rounded-sm focus:outline-none focus:border-black"
          >
            <option value="all">All Departments</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="unisex">Unisex</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F9FAFB] border border-[#D1D5DB] text-xs font-mono py-1.5 px-3 rounded-sm focus:outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
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
            <option value="published">Active / Published</option>
            <option value="archived">Archived</option>
            <option value="low_stock">Low Stock (≤5)</option>
          </select>

          {(genderFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all" || search) && (
            <button
              onClick={() => {
                setGenderFilter("all");
                setCategoryFilter("all");
                setStatusFilter("all");
                setSearch("");
              }}
              className="text-xs font-mono px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-sm transition-colors border border-neutral-300"
              title="Reset all filters"
            >
              Reset
            </button>
          )}

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

                    <td className="py-3.5 px-6">
                      <div className="flex flex-col space-y-1">
                        <span className="font-mono text-2xs uppercase text-neutral-800 font-medium">
                          {p.categoryLabel || p.category}
                        </span>
                        <div>
                          <span
                            className={`inline-block text-[0.62rem] font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider border ${
                              p.gender === "women"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : p.gender === "men"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200"
                            }`}
                          >
                            {p.gender === "women" ? "Women" : p.gender === "men" ? "Men" : "Unisex"}
                          </span>
                        </div>
                      </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Department / Collection *
                  </label>
                  <select
                    value={formData.gender || "unisex"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "women" | "men" | "unisex",
                      })
                    }
                    className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono"
                  >
                    <option value="unisex">Unisex / All</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-2xs uppercase text-neutral-600 font-semibold">
                    Product Category *
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

              {/* Product Image Management Section */}
              <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                  <div>
                    <label className="font-mono text-2xs uppercase text-neutral-900 font-bold flex items-center space-x-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Garment Editorial Images & Media *</span>
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Upload from local device, drag-and-drop, or paste web image URL
                    </p>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center space-x-1 bg-white p-1 rounded border border-neutral-200 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageInputMode("upload")}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center space-x-1 ${
                        imageInputMode === "upload"
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Device Upload</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode("url")}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center space-x-1 ${
                        imageInputMode === "url"
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Primary Image Preview & Uploader */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  {/* Visual Preview */}
                  <div className="relative aspect-[3/4] bg-neutral-200 rounded-md overflow-hidden border border-neutral-300 group">
                    {formData.primaryImage ? (
                      <>
                        <Image
                          src={formData.primaryImage}
                          alt="Primary Garment Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold">
                          Primary Cover
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => primaryFileInputRef.current?.click()}
                            className="p-1.5 bg-white text-neutral-900 rounded shadow hover:bg-neutral-100 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Replace</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[11px]">No cover selected</span>
                      </div>
                    )}
                  </div>

                  {/* Uploader / URL Input Controls */}
                  <div className="sm:col-span-2 space-y-3">
                    {imageInputMode === "upload" ? (
                      <div>
                        {/* Hidden Native File Input */}
                        <input
                          ref={primaryFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(file, false);
                          }}
                        />

                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                          }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleUploadFile(file, false);
                          }}
                          onClick={() => primaryFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                            isDragOver
                              ? "border-neutral-900 bg-neutral-100"
                              : "border-neutral-300 hover:border-neutral-400 bg-white"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
                              {uploadingImage ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Upload className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 underline underline-offset-2">
                                Click to choose image
                              </span>
                              <span className="text-xs text-neutral-500"> or drag and drop</span>
                            </div>
                            <p className="text-[10px] text-neutral-400">
                              PNG, JPG, WEBP, AVIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-neutral-700">
                          Primary Image URL
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.primaryImage}
                          onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full border border-neutral-300 p-2 text-xs focus:outline-none focus:border-black font-mono bg-white"
                        />
                      </div>
                    )}

                    {/* Quick Winter Editorial Presets */}
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1.5">
                        Quick Winter Presets (1-Click Change):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: "Nordic Parka", url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=800" },
                          { label: "Cocoon Coat", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=800" },
                          { label: "Cashmere Overcoat", url: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&q=85&w=800" },
                          { label: "Thermal Shell", url: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=85&w=800" },
                          { label: "Cable Knit", url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=85&w=800" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setFormData({ ...formData, primaryImage: preset.url })}
                            className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                              formData.primaryImage === preset.url
                                ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Angles */}
                <div className="pt-3 border-t border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs uppercase text-neutral-700 font-semibold">
                      Gallery Angles & Detail Views ({formData.galleryImages?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1 text-xs text-neutral-900 font-semibold hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Angle Photo</span>
                    </button>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadFile(file, true);
                      }}
                    />
                  </div>

                  {formData.galleryImages && formData.galleryImages.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-20 rounded bg-neutral-200 overflow-hidden border border-neutral-300 group"
                        >
                          <Image
                            src={img}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              title="Make Primary Cover"
                              onClick={() => {
                                const oldPrimary = formData.primaryImage;
                                const newGallery = formData.galleryImages.filter((_, i) => i !== idx);
                                if (oldPrimary) newGallery.unshift(oldPrimary);
                                setFormData({
                                  ...formData,
                                  primaryImage: img,
                                  galleryImages: newGallery,
                                });
                              }}
                              className="p-1 bg-white text-neutral-900 rounded hover:bg-neutral-100"
                            >
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            </button>
                            <button
                              type="button"
                              title="Delete Photo"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  galleryImages: formData.galleryImages.filter((_, i) => i !== idx),
                                });
                              }}
                              className="p-1 bg-white text-rose-600 rounded hover:bg-neutral-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-400 italic">
                      No additional angles uploaded. Click &ldquo;Add Angle Photo&rdquo; to add lookbook views.
                    </div>
                  )}
                </div>
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

export default function AdminProductsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 font-mono text-xs text-neutral-400 max-w-[1600px] mx-auto">
          Loading catalog...
        </div>
      }
    >
      <AdminProductsContent />
    </React.Suspense>
  );
}
