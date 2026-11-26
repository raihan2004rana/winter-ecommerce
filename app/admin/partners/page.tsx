"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  RotateCcw,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Globe,
  Eye,
  ArrowUpDown,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface AdminPartner {
  id: string;
  name: string;
  logoUrl?: string;
  logoSvg?: string;
  websiteUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = React.useState<AdminPartner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPartner, setEditingPartner] = React.useState<AdminPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = React.useState<{
    name: string;
    logoMode: "svg" | "url" | "upload";
    logoUrl: string;
    logoSvg: string;
    websiteUrl: string;
    order: number;
    isActive: boolean;
  }>({
    name: "",
    logoMode: "svg",
    logoUrl: "",
    logoSvg: "",
    websiteUrl: "",
    order: 1,
    isActive: true,
  });

  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Notification auto-dismiss
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load partners
  const fetchPartners = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.partners)) {
        setPartners(data.partners);
      }
    } catch {
      setNotification({ type: "error", message: "Failed to load brand partners." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Handle open modal
  const handleOpenAdd = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      logoMode: "svg",
      logoUrl: "",
      logoSvg: `<svg viewBox="0 0 140 36" fill="currentColor" className="h-7 w-auto"><text x="5" y="24" fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="2">BRAND</text></svg>`,
      websiteUrl: "",
      order: partners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: AdminPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logoMode: partner.logoSvg ? "svg" : "url",
      logoUrl: partner.logoUrl || "",
      logoSvg: partner.logoSvg || "",
      websiteUrl: partner.websiteUrl || "",
      order: partner.order || 1,
      isActive: partner.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle Image File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.status === "success" && data.url) {
        setFormData((prev) => ({
          ...prev,
          logoUrl: data.url,
          logoMode: "url",
        }));
        setNotification({ type: "success", message: "Logo image uploaded successfully." });
      } else {
        setNotification({ type: "error", message: data.message || "Upload failed." });
      }
    } catch {
      setNotification({ type: "error", message: "Network error during upload." });
    } finally {
      setUploadingImage(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (partner: AdminPartner) => {
    try {
      const res = await fetch(`/api/admin/partners/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !partner.isActive }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setPartners((prev) =>
          prev.map((p) => (p.id === partner.id ? { ...p, isActive: !p.isActive } : p))
        );
        setNotification({
          type: "success",
          message: `${partner.name} is now ${!partner.isActive ? "active" : "hidden"} in the storefront marquee.`,
        });
      }
    } catch {
      setNotification({ type: "error", message: "Failed to update status." });
    }
  };

  // Delete Partner
  const handleDelete = async (partner: AdminPartner) => {
    if (!confirm(`Are you sure you want to remove "${partner.name}" from brand partners?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/partners/${partner.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        setPartners((prev) => prev.filter((p) => p.id !== partner.id));
        setNotification({ type: "success", message: `Removed "${partner.name}".` });
      } else {
        setNotification({ type: "error", message: data.message || "Failed to delete." });
      }
    } catch {
      setNotification({ type: "error", message: "Network error deleting partner." });
    }
  };

  // Reset to 14 Brand Presets
  const handleResetDefaults = async () => {
    if (
      !confirm(
        "Reset all brand partners to the 14 iconic default brands (The North Face, Arc'teryx, Nike, Patagonia, Moncler, etc.)?"
      )
    ) {
      return;
    }

    try {
      setIsResetting(true);
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_defaults" }),
      });
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.partners)) {
        setPartners(data.partners);
        setNotification({
          type: "success",
          message: "Successfully reset to 14 famous brand partner presets!",
        });
      } else {
        setNotification({ type: "error", message: data.message || "Reset failed." });
      }
    } catch {
      setNotification({ type: "error", message: "Network error while resetting." });
    } finally {
      setIsResetting(false);
    }
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setNotification({ type: "error", message: "Brand name is required." });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      logoUrl: formData.logoMode === "url" ? formData.logoUrl.trim() : undefined,
      logoSvg: formData.logoMode === "svg" ? formData.logoSvg.trim() : undefined,
      websiteUrl: formData.websiteUrl.trim() || undefined,
      order: Number(formData.order) || 1,
      isActive: formData.isActive,
    };

    if (!payload.logoUrl && !payload.logoSvg) {
      setNotification({ type: "error", message: "Please provide either an image URL or SVG markup." });
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingPartner) {
        const res = await fetch(`/api/admin/partners/${editingPartner.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.status === "success" && data.partner) {
          setPartners((prev) =>
            prev.map((p) => (p.id === editingPartner.id ? data.partner : p)).sort((a, b) => a.order - b.order)
          );
          setIsModalOpen(false);
          setNotification({ type: "success", message: `Updated "${data.partner.name}".` });
        } else {
          setNotification({ type: "error", message: data.message || "Update failed." });
        }
      } else {
        const res = await fetch("/api/admin/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.status === "success" && data.partner) {
          setPartners((prev) => [...prev, data.partner].sort((a, b) => a.order - b.order));
          setIsModalOpen(false);
          setNotification({ type: "success", message: `Added "${data.partner.name}".` });
        } else {
          setNotification({ type: "error", message: data.message || "Failed to create partner." });
        }
      }
    } catch {
      setNotification({ type: "error", message: "Network error saving partner." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered list
  const filteredPartners = React.useMemo(() => {
    return partners
      .filter((p) => {
        if (statusFilter === "active" && !p.isActive) return false;
        if (statusFilter === "inactive" && p.isActive) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return p.name.toLowerCase().includes(q) || (p.websiteUrl && p.websiteUrl.toLowerCase().includes(q));
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [partners, statusFilter, searchQuery]);

  const activeCount = partners.filter((p) => p.isActive).length;
  const inactiveCount = partners.length - activeCount;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 border text-xs font-mono uppercase tracking-wider shadow-lg flex items-center space-x-2.5 transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-300 border-emerald-800"
              : "bg-red-950 text-red-300 border-red-800"
          }`}
        >
          {notification.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-75">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-1">
            <Award className="h-3.5 w-3.5 text-neutral-900" />
            <span>Storefront Brand Ecosystem</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Brand Partners</h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Manage high-profile partner logos displayed in the auto-scrolling marquee ticker on the home page.
            Control display order, upload custom logos, or provide vector SVGs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetDefaults}
            disabled={isResetting}
            title="Reset to 14 default brands"
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Resetting..." : "Reset Presets"}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Brand Partner</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-neutral-500">Total Partners</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono">{partners.length}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Iconic fashion & outdoor brands</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-neutral-500">Active in Marquee</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{activeCount}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Currently looping on homepage</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[0.68rem] font-mono uppercase tracking-wider text-neutral-500">Inactive / Hidden</div>
          <div className="text-2xl font-bold text-neutral-400 mt-1 font-mono">{inactiveCount}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Temporarily omitted from marquee</div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by brand name or website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-mono border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-neutral-900 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-1.5 border border-neutral-200 p-0.5 bg-neutral-100">
          {(["all", "active", "inactive"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                statusFilter === filter
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-neutral-400">
          Loading brand partners...
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-300 p-12 text-center space-y-3">
          <Award className="h-8 w-8 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium text-neutral-700">No brand partners match your query</p>
          <p className="text-xs text-neutral-400 font-mono">
            {searchQuery ? "Try clearing your search term." : "Click 'Add Brand Partner' or 'Reset Presets' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className={`bg-white border transition-all ${
                partner.isActive ? "border-neutral-200 hover:border-neutral-400" : "border-neutral-200 opacity-60 bg-neutral-50"
              }`}
            >
              {/* Logo Preview Container */}
              <div className="h-28 bg-[#F4F5F7] border-b border-neutral-200 flex items-center justify-center p-4 relative group">
                <span className="absolute top-2 left-2 text-[0.62rem] font-mono text-neutral-400 bg-white px-1.5 py-0.5 border border-neutral-200">
                  #{partner.order}
                </span>

                <div className="max-h-12 max-w-[180px] flex items-center justify-center text-neutral-800 transition-transform group-hover:scale-105">
                  {partner.logoSvg ? (
                    <div
                      className="[&>svg]:max-h-8 [&>svg]:w-auto [&>svg]:fill-current text-neutral-800"
                      dangerouslySetInnerHTML={{ __html: partner.logoSvg }}
                    />
                  ) : partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-h-8 max-w-full object-contain brightness-0 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-xs font-mono font-bold uppercase">{partner.name}</span>
                  )}
                </div>

                <div className="absolute top-2 right-2 flex items-center space-x-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${partner.isActive ? "bg-emerald-500" : "bg-neutral-300"}`}
                  />
                  <span className="text-[0.62rem] font-mono uppercase tracking-wider text-neutral-500">
                    {partner.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Partner Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 tracking-tight">{partner.name}</h3>
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-900 font-mono mt-0.5"
                      >
                        <Globe className="h-3 w-3" />
                        <span className="truncate max-w-[180px]">{partner.websiteUrl.replace(/^https?:\/\//, "")}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-400 font-mono">No external link</span>
                    )}
                  </div>

                  <span className="text-[0.62rem] font-mono px-2 py-0.5 border border-neutral-200 bg-neutral-50 text-neutral-600 uppercase">
                    {partner.logoSvg ? "Vector SVG" : "Image URL"}
                  </span>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  {/* Toggle Active Button */}
                  <button
                    onClick={() => handleToggleActive(partner)}
                    className={`text-xs font-mono uppercase tracking-wider px-2 py-1 border transition-colors ${
                      partner.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        : "border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {partner.isActive ? "Visible in Marquee" : "Activate"}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(partner)}
                      title="Edit Brand Partner"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(partner)}
                      title="Delete Brand Partner"
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Partner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-neutral-300 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-neutral-900" />
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-900">
                  {editingPartner ? `Edit: ${editingPartner.name}` : "Add Brand Partner"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-mono">
              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-neutral-700 font-semibold">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arc'teryx, Moncler, Vibram"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              {/* Website URL & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider text-neutral-700">Official Website URL</label>
                  <input
                    type="url"
                    placeholder="https://brand.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider text-neutral-700">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Logo Mode Selection */}
              <div className="space-y-2">
                <label className="block uppercase tracking-wider text-neutral-700 font-semibold">
                  Logo Asset Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, logoMode: "svg" }))}
                    className={`py-2 px-3 border text-center uppercase tracking-wider transition-colors ${
                      formData.logoMode === "svg"
                        ? "border-neutral-900 bg-neutral-900 text-white font-bold"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    Inline Vector SVG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, logoMode: "url" }))}
                    className={`py-2 px-3 border text-center uppercase tracking-wider transition-colors ${
                      formData.logoMode === "url"
                        ? "border-neutral-900 bg-neutral-900 text-white font-bold"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    Image URL / Upload
                  </button>
                </div>
              </div>

              {/* SVG Input */}
              {formData.logoMode === "svg" && (
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider text-neutral-700">
                    Vector SVG Markup <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.logoSvg}
                    onChange={(e) => setFormData((prev) => ({ ...prev, logoSvg: e.target.value }))}
                    placeholder="<svg viewBox='0 0 140 36' fill='currentColor'>...</svg>"
                    className="w-full p-2.5 font-mono text-[11px] border border-neutral-300 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-neutral-900"
                  />
                  <p className="text-[10px] text-neutral-500 font-sans">
                    Tip: Use fill=&quot;currentColor&quot; so the logo adapts dynamically to the marquee's clean monochrome aesthetic.
                  </p>
                </div>
              )}

              {/* Image URL & Upload */}
              {formData.logoMode === "url" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block uppercase tracking-wider text-neutral-700">Logo Image URL</label>
                    <input
                      type="text"
                      placeholder="/images/brands/brand.png or https://..."
                      value={formData.logoUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>

                  {/* Or File Upload */}
                  <div className="p-3 border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <span className="block font-semibold uppercase text-neutral-700 text-[11px]">Upload PNG / SVG File</span>
                      <span className="text-[10px] text-neutral-400 font-sans">Auto-saves to /public/images/products</span>
                    </div>
                    <label className="cursor-pointer px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 uppercase tracking-wider text-[10px] inline-flex items-center space-x-1.5">
                      <Upload className="h-3 w-3" />
                      <span>{uploadingImage ? "Uploading..." : "Browse"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Live Preview Box */}
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-neutral-500 flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Real-Time Marquee Preview</span>
                </label>
                <div className="h-20 bg-neutral-100 border border-neutral-200 flex items-center justify-center p-4">
                  {formData.logoMode === "svg" && formData.logoSvg ? (
                    <div
                      className="[&>svg]:max-h-8 [&>svg]:w-auto [&>svg]:fill-current text-neutral-800"
                      dangerouslySetInnerHTML={{ __html: formData.logoSvg }}
                    />
                  ) : formData.logoMode === "url" && formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt={formData.name || "Preview"}
                      className="max-h-8 max-w-[200px] object-contain brightness-0 opacity-80"
                    />
                  ) : (
                    <span className="text-neutral-400 text-xs">Enter SVG or Image to preview</span>
                  )}
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActivePartner"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <label htmlFor="isActivePartner" className="uppercase tracking-wider text-neutral-700 cursor-pointer">
                  Active (show in homepage marquee)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-neutral-900 hover:bg-black text-white uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingPartner ? "Update Partner" : "Add Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
