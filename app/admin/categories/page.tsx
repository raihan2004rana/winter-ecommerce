"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Package,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  Edit2,
  Trash2,
  Upload,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  gender?: "all" | "women" | "men";
  featured?: boolean;
  link?: string;
  badge?: string;
}

function getProductsLink(cat: Category): string {
  if (cat.slug === "women") return "/admin/products?gender=women";
  if (cat.slug === "men") return "/admin/products?gender=men";
  if (cat.slug.startsWith("women-")) {
    if (cat.slug.includes("jacket")) return "/admin/products?gender=women&category=jackets-coats";
    if (cat.slug.includes("knit") || cat.slug.includes("sweater")) return "/admin/products?gender=women&category=sweaters-hoodies";
    if (cat.slug.includes("boot") || cat.slug.includes("access")) return "/admin/products?gender=women&category=boots-accessories";
    return "/admin/products?gender=women";
  }
  if (cat.slug.startsWith("men-")) {
    if (cat.slug.includes("parka") || cat.slug.includes("jacket")) return "/admin/products?gender=men&category=jackets-coats";
    if (cat.slug.includes("fleece") || cat.slug.includes("knit") || cat.slug.includes("sweater")) return "/admin/products?gender=men&category=sweaters-hoodies";
    if (cat.slug.includes("boot") || cat.slug.includes("access")) return "/admin/products?gender=men&category=boots-accessories";
    return "/admin/products?gender=men";
  }
  if (cat.gender === "women") return `/admin/products?gender=women&category=${cat.slug}`;
  if (cat.gender === "men") return `/admin/products?gender=men&category=${cat.slug}`;
  return `/admin/products?category=${cat.slug}`;
}

function ImageUploadField({
  label,
  value,
  onChange,
  folder = "categories",
  helperText = "Upload directly from your device or paste a public web image URL",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helperText?: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      if (data && data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image from device.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[11px] text-neutral-400">Device Upload or Web URL</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="/images/wardrobe/... or https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-md border border-neutral-300 transition-colors shrink-0 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload From Device</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-neutral-400">{helperText}</p>

      {value && (
        <div className="relative h-28 w-full rounded-md overflow-hidden border border-neutral-200 bg-neutral-50 group">
          <Image
            src={value}
            alt="Uploaded Preview"
            fill
            unoptimized
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors opacity-90 group-hover:opacity-100"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

let cachedCategories: Category[] = [];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>(cachedCategories);
  const [loading, setLoading] = React.useState(cachedCategories.length === 0);
  const [search, setSearch] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Form state
  const [formData, setFormData] = React.useState<{
    name: string;
    slug: string;
    description: string;
    image: string;
    gender: "all" | "women" | "men";
    link?: string;
    badge?: string;
  }>({
    name: "",
    slug: "",
    description: "",
    image: "",
    gender: "all",
    link: "",
    badge: "",
  });

  const fetchCategories = React.useCallback(async () => {
    try {
      if (cachedCategories.length === 0) setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      const list = data.data || data.categories || [];
      if (Array.isArray(list)) {
        cachedCategories = list;
        setCategories(list);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=600",
      gender: "all",
      link: "",
      badge: "",
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      gender: cat.gender || "all",
      link: cat.link || "",
      badge: cat.badge || "",
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : `/api/admin/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || errorData.error || "Failed to save category");
      }

      await fetchCategories();
      setIsModalOpen(false);
      setSuccessToast(
        editingCategory
          ? `Category "${formData.name}" updated successfully`
          : `Category "${formData.name}" created successfully`
      );
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save category";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setSuccessToast(`Deleted category "${name}"`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      departmentFilter === "all" ||
      (departmentFilter === "unisex"
        ? c.gender === "all" || !c.gender
        : c.gender === departmentFilter);
    return matchesSearch && matchesDept;
  });

  const totalProductsMapped = categories.reduce((acc, c) => acc + (c.productCount || 0), 0);

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
              Categories & Departments
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {categories.length} Taxonomy Nodes
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Organize seasonal collections, winter apparel lines, and Men/Women mega menu navigation categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Categories
            </div>
            <div className="text-xl font-bold text-neutral-900">{categories.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Products Categorized
            </div>
            <div className="text-xl font-bold text-neutral-900">{totalProductsMapped}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Store Navigation
            </div>
            <div className="text-sm font-semibold text-neutral-800">Men & Women Synced</div>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search categories by name, slug or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-md px-3 py-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          >
            <option value="all">All Departments ({categories.length})</option>
            <option value="women">Women ({categories.filter((c) => c.gender === "women").length})</option>
            <option value="men">Men ({categories.filter((c) => c.gender === "men").length})</option>
            <option value="unisex">Unisex / All ({categories.filter((c) => c.gender === "all" || !c.gender).length})</option>
          </select>
          <div className="text-xs text-neutral-500 font-mono">
            Showing {filteredCategories.length} of {categories.length}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-neutral-200 p-5 space-y-4 animate-pulse"
            >
              <div className="w-full h-40 bg-neutral-100 rounded-md" />
              <div className="h-5 bg-neutral-100 rounded w-1/2" />
              <div className="h-3 bg-neutral-100 rounded w-full" />
              <div className="h-3 bg-neutral-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <FolderOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No categories found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {search
              ? `No category matches "${search}". Try clearing your search term.`
              : "No categories have been defined yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Department Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-2xs font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm border shadow-xs ${
                        category.gender === "women"
                          ? "bg-rose-950/80 text-rose-200 border-rose-700/50"
                          : category.gender === "men"
                          ? "bg-sky-950/80 text-sky-200 border-sky-700/50"
                          : "bg-neutral-900/80 text-neutral-200 border-neutral-700/50"
                      }`}
                    >
                      {category.gender === "women" ? "Women" : category.gender === "men" ? "Men" : "Unisex / All"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                      /{category.slug}
                    </span>
                    <span className="text-xs font-semibold bg-white/90 text-neutral-900 px-2.5 py-0.5 rounded-full shadow-sm">
                      {category.productCount || 0} {category.productCount === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-black transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-200/60 transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link
                  href={getProductsLink(category)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
                >
                  <span>View Products</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Organize storefront departments and mega menu navigation
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermal Base Layers"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Department Menu
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value as "all" | "women" | "men",
                      }))
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="all">Both (Unisex / All)</option>
                    <option value="women">Women (Header Dropdown)</option>
                    <option value="men">Men (Header Dropdown)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="thermal-base-layers"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full pl-6 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-md font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="High-performance merino and technical mesh base layers for severe sub-zero environments."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Pieces, Curated"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Storefront Destination Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /collections/women?category=jackets-coats"
                    value={formData.link || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Editorial Banner Image"
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                folder="categories"
                helperText="Upload category image directly from your computer or paste an image URL"
              />

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
                  <span>{saving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
