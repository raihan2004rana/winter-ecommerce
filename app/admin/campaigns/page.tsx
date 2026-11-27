"use client";

import * as React from "react";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  MousePointerClick,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Power,
  Trash2,
  Edit2,
  X,
  Upload,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  Percent,
  Timer,
  ExternalLink,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { AdminCampaign } from "@/lib/server/admin-store";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = React.useState<AdminCampaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [placementFilter, setPlacementFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "scheduled" | "expired">("all");
  const [analytics, setAnalytics] = React.useState({
    totalImpressions: 0,
    totalClicks: 0,
    averageCtr: "0.00%",
    activeCount: 0,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<AdminCampaign | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    type: "banner" as AdminCampaign["type"],
    placement: "hero" as AdminCampaign["placement"],
    desktopImage: "/images/wardrobe/hero-hoodies-hd.jpg",
    mobileImage: "",
    headline: "",
    subheadline: "",
    badgeText: "",
    ctaText: "Shop the Collection",
    destinationUrl: "/products",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
    isActive: true,
    priority: 1,
    // Offer
    hasDiscount: false,
    discountType: "percentage" as "percentage" | "fixed_amount" | "free_shipping",
    discountValue: 20,
    minPurchase: 100,
    couponCode: "",
    // Timer
    hasTimer: false,
    timerTargetDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().slice(0, 16),
  });

  // Image Upload state
  const [uploadingDesktop, setUploadingDesktop] = React.useState(false);
  const [uploadingMobile, setUploadingMobile] = React.useState(false);
  const desktopFileRef = React.useRef<HTMLInputElement | null>(null);
  const mobileFileRef = React.useRef<HTMLInputElement | null>(null);

  // Deleting State
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const fetchCampaigns = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (placementFilter !== "all") params.set("placement", placementFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/campaigns?${params.toString()}`);
      const data = await res.json();
      if (data && data.campaigns) {
        setCampaigns(data.campaigns);
        if (data.analytics) setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [placementFilter, statusFilter]);

  React.useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Image Upload Handler
  const handleUpload = async (file: File, isMobile = false) => {
    if (!file) return;
    try {
      if (isMobile) setUploadingMobile(true);
      else setUploadingDesktop(true);

      const bodyData = new FormData();
      bodyData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: bodyData,
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Upload failed");
      }

      if (isMobile) {
        setFormData((prev) => ({ ...prev, mobileImage: data.url }));
      } else {
        setFormData((prev) => ({ ...prev, desktopImage: data.url }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image");
    } finally {
      if (isMobile) setUploadingMobile(false);
      else setUploadingDesktop(false);
    }
  };

  // Open Create
  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setErrorMsg(null);
    setFormData({
      title: "",
      type: "banner",
      placement: "hero",
      desktopImage: "/images/wardrobe/hero-hoodies-hd.jpg",
      mobileImage: "",
      headline: "Designed for colder days",
      subheadline: "Premium winter insulation engineered for severe cold and effortless daily layering.",
      badgeText: "NEW DROP",
      ctaText: "Shop Collection",
      destinationUrl: "/products",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
      isActive: true,
      priority: 1,
      hasDiscount: false,
      discountType: "percentage",
      discountValue: 20,
      minPurchase: 100,
      couponCode: "",
      hasTimer: false,
      timerTargetDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (c: AdminCampaign) => {
    setEditingCampaign(c);
    setErrorMsg(null);
    setFormData({
      title: c.title,
      type: c.type,
      placement: c.placement,
      desktopImage: c.desktopImage || "",
      mobileImage: c.mobileImage || "",
      headline: c.headline || "",
      subheadline: c.subheadline || "",
      badgeText: c.badgeText || "",
      ctaText: c.ctaText || "Shop Now",
      destinationUrl: c.destinationUrl || "/products",
      startDate: c.startDate ? c.startDate.split("T")[0] : "",
      endDate: c.endDate ? c.endDate.split("T")[0] : "",
      isActive: c.isActive,
      priority: c.priority || 1,
      hasDiscount: Boolean(c.discountRule),
      discountType: c.discountRule?.type || "percentage",
      discountValue: c.discountRule?.value || 20,
      minPurchase: c.discountRule?.minPurchase || 0,
      couponCode: c.discountRule?.couponCode || "",
      hasTimer: Boolean(c.countdownTimer?.enabled),
      timerTargetDate: c.countdownTimer?.targetDate
        ? new Date(c.countdownTimer.targetDate).toISOString().slice(0, 16)
        : "",
    });
    setIsModalOpen(true);
  };

  // Submit Save
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      const payload: Partial<AdminCampaign> = {
        title: formData.title,
        type: formData.type,
        placement: formData.placement,
        desktopImage: formData.desktopImage,
        mobileImage: formData.mobileImage || formData.desktopImage,
        headline: formData.headline,
        subheadline: formData.subheadline,
        badgeText: formData.badgeText,
        ctaText: formData.ctaText,
        destinationUrl: formData.destinationUrl,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
        priority: Number(formData.priority) || 1,
        discountRule: formData.hasDiscount
          ? {
              type: formData.discountType,
              value: Number(formData.discountValue),
              minPurchase: Number(formData.minPurchase),
              couponCode: formData.couponCode.toUpperCase().trim() || undefined,
            }
          : undefined,
        countdownTimer: formData.hasTimer
          ? {
              enabled: true,
              targetDate: new Date(formData.timerTargetDate).toISOString(),
            }
          : undefined,
      };

      if (editingCampaign) {
        const res = await fetch("/api/admin/campaigns", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCampaign.id, ...payload }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to update campaign");
        }
        setSuccessToast(`Campaign "${formData.title}" updated successfully!`);
      } else {
        const res = await fetch("/api/admin/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to launch campaign");
        }
        setSuccessToast(`Campaign "${formData.title}" launched live!`);
      }

      await fetchCampaigns();
      setIsModalOpen(false);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (c: AdminCampaign) => {
    try {
      await fetch("/api/admin/campaigns", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
      });
      await fetchCampaigns();
      setSuccessToast(`Campaign status changed to ${!c.isActive ? "ACTIVE" : "PAUSED"}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Campaign
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await fetch(`/api/admin/campaigns?id=${deletingId}`, {
        method: "DELETE",
      });
      setDeletingId(null);
      await fetchCampaigns();
      setSuccessToast("Campaign permanently deleted.");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Status Badge Helper
  const getStatusInfo = (c: AdminCampaign) => {
    const now = new Date();
    const start = new Date(c.startDate);
    const end = new Date(c.endDate);

    if (!c.isActive) {
      return { label: "PAUSED", color: "bg-neutral-100 text-neutral-600 border-neutral-300" };
    }
    if (now < start) {
      return { label: "SCHEDULED", color: "bg-sky-50 text-sky-700 border-sky-300" };
    }
    if (now > end) {
      return { label: "EXPIRED", color: "bg-rose-50 text-rose-700 border-rose-300" };
    }
    return { label: "LIVE NOW", color: "bg-emerald-50 text-emerald-700 border-emerald-300" };
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.headline.toLowerCase().includes(q) ||
      c.destinationUrl.toLowerCase().includes(q) ||
      (c.discountRule?.couponCode && c.discountRule.couponCode.toLowerCase().includes(q));
    return matchesSearch;
  });

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
              Marketing, Ads & Promotional Campaigns
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200 font-semibold">
              {analytics.activeCount} Live Banners
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Configure real storefront banners, announcement bars, flash sales with live timers, and track impressions and CTR.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Analytics KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Impressions</span>
            <Eye className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono">
            {analytics.totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Real ad views tracked</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Ad Clicks</span>
            <MousePointerClick className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1 font-mono">
            {analytics.totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-sky-600 mt-1">Verified user conversions</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider flex items-center justify-between">
            <span>Click-Through Rate (CTR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {analytics.averageCtr}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Across all placements</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>Active Deployments</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono">
            {analytics.activeCount} / {campaigns.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Live in store right now</div>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
          {[
            { id: "all", label: `All Campaigns (${campaigns.length})` },
            { id: "active", label: `Live Now (${analytics.activeCount})` },
            { id: "scheduled", label: "Upcoming Scheduled" },
            { id: "expired", label: "Expired" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
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

        {/* Right filters: Placement Selector + Search */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm font-mono"
          >
            <option value="all">All Placements</option>
            <option value="hero">Hero Main Banner</option>
            <option value="announcement_bar">Announcement Bar</option>
            <option value="promo_section">Promo Section (Countdown)</option>
            <option value="category_header">Category Banners</option>
            <option value="product_page">Product Page Banners</option>
          </select>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search title, promo code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
            />
          </div>

          <button
            onClick={fetchCampaigns}
            className="p-2 bg-white border border-neutral-200 rounded-md text-neutral-600 hover:text-black shadow-sm"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Campaigns Cards & Directory */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
            <span>Loading marketing campaigns...</span>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
            <Megaphone className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <h4 className="text-sm font-semibold text-neutral-900">No campaigns found</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Try switching your placement filter or launch a new campaign.
            </p>
          </div>
        ) : (
          filteredCampaigns.map((c) => {
            const statusInfo = getStatusInfo(c);
            const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00";

            return (
              <div
                key={c.id}
                className="bg-white rounded-lg border border-neutral-200 p-5 shadow-sm hover:border-neutral-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Visual Thumbnail & Content */}
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-28 h-20 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                    {c.desktopImage ? (
                      <Image
                        src={c.desktopImage}
                        alt={c.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-900 text-white font-mono text-[10px] p-2 text-center">
                        BAR TEXT
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-mono px-1 rounded uppercase">
                      {c.placement.replace("_", " ")}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-neutral-900 truncate">
                        {c.title}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 uppercase font-semibold">
                        📍 {c.placement === "promo_section"
                          ? "Promotional Section"
                          : c.placement === "hero"
                          ? "Hero Banner & Promo"
                          : c.placement === "announcement_bar"
                          ? "Announcement Bar"
                          : c.placement === "category_header"
                          ? "Category Header"
                          : "Product Page"}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600 line-clamp-1">
                      {c.headline}
                      {c.subheadline && <span className="text-neutral-400"> — {c.subheadline}</span>}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-neutral-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>
                          {new Date(c.startDate).toLocaleDateString()} &rarr;{" "}
                          {new Date(c.endDate).toLocaleDateString()}
                        </span>
                      </span>

                      {c.discountRule && (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center space-x-1">
                          <Percent className="w-3 h-3" />
                          <span>
                            {c.discountRule.type === "percentage"
                              ? `${c.discountRule.value}% OFF`
                              : `$${c.discountRule.value} OFF`}
                            {c.discountRule.couponCode && ` (Code: ${c.discountRule.couponCode})`}
                          </span>
                        </span>
                      )}

                      {c.countdownTimer?.enabled && (
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-semibold flex items-center space-x-1">
                          <Timer className="w-3 h-3" />
                          <span>Urgency Timer Active</span>
                        </span>
                      )}

                      <span className="text-neutral-400">
                        Destination: <span className="underline">{c.destinationUrl}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Analytics & Action Controls */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100 shrink-0">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center font-mono">
                    <div className="px-2">
                      <div className="text-[10px] text-neutral-400 uppercase">Views</div>
                      <div className="text-xs font-bold text-neutral-900">{c.impressions}</div>
                    </div>
                    <div className="px-2 border-x border-neutral-200">
                      <div className="text-[10px] text-neutral-400 uppercase">Clicks</div>
                      <div className="text-xs font-bold text-sky-700">{c.clicks}</div>
                    </div>
                    <div className="px-2">
                      <div className="text-[10px] text-neutral-400 uppercase">CTR</div>
                      <div className="text-xs font-bold text-emerald-700">{ctr}%</div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(c)}
                      title={c.isActive ? "Pause Campaign" : "Activate Campaign"}
                      className={`p-2 rounded border transition-colors ${
                        c.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-400 border-neutral-300 hover:text-neutral-700"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(c)}
                      title="Edit Campaign"
                      className="p-2 bg-white border border-neutral-300 text-neutral-700 hover:text-black hover:border-black rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeletingId(c.id)}
                      title="Delete Campaign"
                      className="p-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50 sticky top-0 z-10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {editingCampaign ? "Edit Marketing Campaign" : "Launch Marketing Campaign"}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Configure creative assets, placement schedule, and offer incentives
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

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-5 text-xs font-sans">
              {errorMsg && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title & Placement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Campaign Internal Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sub-Zero Parka Launch Drop"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Storefront Placement *
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        placement: e.target.value as AdminCampaign["placement"],
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="hero">Hero Main Banner (Homepage Top)</option>
                    <option value="announcement_bar">Top Announcement Bar (Site Header)</option>
                    <option value="promo_section">Promotional Section (50/50 Countdown Deal)</option>
                    <option value="category_header">Category Header (Women/Men Lookbook)</option>
                    <option value="product_page">Product Page Campaign Banner</option>
                  </select>
                </div>
              </div>

              {/* Visual Assets (Desktop & Mobile) */}
              {formData.placement !== "announcement_bar" && (
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="font-bold text-xs uppercase text-neutral-800">
                      Creative Visual Banners
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      High-Resolution Master
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Desktop Image */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Desktop Image Banner *
                      </label>
                      <input
                        ref={desktopFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, false);
                        }}
                      />
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          required
                          value={formData.desktopImage}
                          onChange={(e) =>
                            setFormData({ ...formData, desktopImage: e.target.value })
                          }
                          placeholder="/images/wardrobe/hero-hoodies-hd.jpg"
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => desktopFileRef.current?.click()}
                          className="px-3 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-semibold flex items-center space-x-1"
                        >
                          {uploadingDesktop ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Upload</span>
                        </button>
                      </div>

                      {formData.desktopImage && (
                        <div className="relative h-24 w-full rounded overflow-hidden border border-neutral-300 bg-neutral-100">
                          <Image
                            src={formData.desktopImage}
                            alt="Desktop preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Mobile Image */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Mobile Responsive Crop (Optional)
                      </label>
                      <input
                        ref={mobileFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, true);
                        }}
                      />
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={formData.mobileImage}
                          onChange={(e) =>
                            setFormData({ ...formData, mobileImage: e.target.value })
                          }
                          placeholder="Optional separate mobile crop"
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => mobileFileRef.current?.click()}
                          className="px-3 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-semibold flex items-center space-x-1"
                        >
                          {uploadingMobile ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Upload</span>
                        </button>
                      </div>

                      {formData.mobileImage && (
                        <div className="relative h-24 w-full rounded overflow-hidden border border-neutral-300 bg-neutral-100">
                          <Image
                            src={formData.mobileImage}
                            alt="Mobile preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Copywriting: Headline, Subheadline & Badge */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Promotional Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Designed for colder days"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Pill Badge Text
                    </label>
                    <input
                      type="text"
                      placeholder="NEW DROP / FLASH SALE"
                      value={formData.badgeText}
                      onChange={(e) =>
                        setFormData({ ...formData, badgeText: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Editorial Subheadline / Supporting Copy
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description or coupon terms..."
                    value={formData.subheadline}
                    onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* CTA & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    CTA Button Text *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Shop Now"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-md text-neutral-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/products or /collections/women"
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900"
                  />
                </div>
              </div>

              {/* Schedule Dates & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Display Priority (1 = Highest)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md"
                  />
                </div>
              </div>

              {/* Offers, Discount Rules & Urgency Countdown Timer */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="font-bold text-xs uppercase text-neutral-800">
                    Campaign Incentives & Urgency Timer
                  </span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-neutral-700">
                      <input
                        type="checkbox"
                        checked={formData.hasDiscount}
                        onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                        className="rounded border-neutral-300"
                      />
                      <span>Attach Offer / Coupon</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-neutral-700">
                      <input
                        type="checkbox"
                        checked={formData.hasTimer}
                        onChange={(e) => setFormData({ ...formData, hasTimer: e.target.checked })}
                        className="rounded border-neutral-300"
                      />
                      <span>Enable Countdown Clock</span>
                    </label>
                  </div>
                </div>

                {/* Offer Fields */}
                {formData.hasDiscount && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Discount Type
                      </label>
                      <select
                        value={formData.discountType}
                        onChange={(e) =>
                          setFormData({ ...formData, discountType: e.target.value as any })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-300 rounded"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed_amount">Fixed Amount ($)</option>
                        <option value="free_shipping">Free Shipping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Value ({formData.discountType === "percentage" ? "%" : "$"})
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formData.discountValue}
                        onChange={(e) =>
                          setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Min Spend ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.minPurchase}
                        onChange={(e) =>
                          setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Linked Voucher Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ARCTIC25"
                        value={formData.couponCode}
                        onChange={(e) =>
                          setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono font-bold uppercase bg-white border border-neutral-300 rounded"
                      />
                    </div>
                  </div>
                )}

                {/* Countdown Timer */}
                {formData.hasTimer && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Urgency Countdown Target Timestamp *
                    </label>
                    <input
                      type="datetime-local"
                      required={formData.hasTimer}
                      value={formData.timerTargetDate}
                      onChange={(e) => setFormData({ ...formData, timerTargetDate: e.target.value })}
                      className="w-full sm:w-80 px-3 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded"
                    />
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
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
                  <span>{saving ? "Deploying..." : editingCampaign ? "Save Campaign" : "Launch Campaign"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-neutral-300 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-neutral-900">Delete Marketing Campaign?</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete this marketing campaign? This will remove the banner from all storefront placements and record an audit log event.
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider rounded-md shadow-xs"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
