"use client";

import * as React from "react";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  DollarSign,
  Truck,
  Mail,
  Globe,
  Boxes,
  Loader2,
  RefreshCw,
  Percent,
  Plane,
  ArrowRight,
  TrendingUp,
  Trash2,
  Plus,
  ExternalLink,
} from "lucide-react";
import {
  AdminSettings,
  AdminTaxRule,
  AdminShippingZone,
  InstagramConfig,
  InstagramPost,
} from "@/lib/server/admin-store";
import {
  COUNTRIES_REGISTRY,
  SUPPORTED_CURRENCIES,
} from "@/lib/international/countries";
import { formatLocalizedCurrency } from "@/lib/international/formatters";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<"general" | "taxes" | "shipping" | "fx" | "instagram">("general");

  const [settings, setSettings] = React.useState<AdminSettings>({
    storeName: "KØRA Winter Editorial",
    storeDomain: "winter.kora-apparel.com",
    defaultCurrency: "USD",
    supportEmail: "concierge@kora-winter.com",
    orderNotificationEmail: "orders@kora-winter.com",
    standardShippingFee: 15.0,
    freeShippingThreshold: 200.0,
    taxRate: 0.08,
    lowStockThreshold: 10,
    maintenanceMode: false,
  });

  const [taxRules, setTaxRules] = React.useState<AdminTaxRule[]>([]);
  const [shippingZones, setShippingZones] = React.useState<AdminShippingZone[]>([]);
  const [instagramConfig, setInstagramConfig] = React.useState<InstagramConfig>({
    handle: "kora.winter",
    profileUrl: "https://instagram.com/kora.winter",
    accessToken: "",
    autoSync: false,
    posts: [],
  });
  const [newPostImageUrl, setNewPostImageUrl] = React.useState("");
  const [newPostPermalink, setNewPostPermalink] = React.useState("");
  const [newPostCaption, setNewPostCaption] = React.useState("");

  const [ratesData, setRatesData] = React.useState<{
    rates: Record<string, number>;
    date?: string;
    source?: string;
  } | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [refreshingRates, setRefreshingRates] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  const fetchAllData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [settingsRes, ratesRes, igRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/international/rates"),
        fetch("/api/instagram"),
      ]);

      const data = await settingsRes.json();
      if (data && data.settings) {
        setSettings(data.settings);
      }
      if (data && Array.isArray(data.taxRules)) {
        setTaxRules(data.taxRules);
      }
      if (data && Array.isArray(data.shippingZones)) {
        setShippingZones(data.shippingZones);
      }

      const ratesJson = await ratesRes.json();
      if (ratesJson && ratesJson.rates) {
        setRatesData(ratesJson);
      }

      const igJson = await igRes.json();
      if (igJson && igJson.data) {
        setInstagramConfig(igJson.data);
      }
    } catch (err) {
      console.error("Failed to load store settings & international registry:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRefreshRates = async () => {
    try {
      setRefreshingRates(true);
      const res = await fetch("/api/international/rates");
      const data = await res.json();
      if (data && data.rates) {
        setRatesData(data);
        setSuccessToast("Live foreign exchange rates refreshed from open.er-api.com!");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (err) {
      console.error("Failed to refresh live exchange rates:", err);
    } finally {
      setRefreshingRates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          taxRules,
          shippingZones,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update configuration");
      }

      setSuccessToast("International configuration & store settings saved!");
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update configuration";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTaxRate = (index: number, newRatePercent: number) => {
    setTaxRules((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], rate: Math.max(0, newRatePercent / 100) };
      return next;
    });
  };

  const handleToggleTaxInclusive = (index: number) => {
    setTaxRules((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isInclusive: !next[index].isInclusive };
      return next;
    });
  };

  const handleToggleTaxActive = (index: number) => {
    setTaxRules((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isActive: !next[index].isActive };
      return next;
    });
  };

  const handleUpdateShippingFee = (
    index: number,
    field: "standardFee" | "expressFee" | "freeShippingThreshold",
    val: number
  ) => {
    setShippingZones((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: Math.max(0, val) };
      return next;
    });
  };

  const handleToggleZoneActive = (index: number) => {
    setShippingZones((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isActive: !next[index].isActive };
      return next;
    });
  };

  const handleSaveInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_config",
          handle: instagramConfig.handle,
          profileUrl: instagramConfig.profileUrl,
          accessToken: instagramConfig.accessToken,
          autoSync: instagramConfig.autoSync,
        }),
      });
      if (!res.ok) throw new Error("Failed to update Instagram configuration");
      setSuccessToast("Instagram account configuration saved!");
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save Instagram");
    } finally {
      setSaving(false);
    }
  };

  const handleAddInstagramPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostImageUrl.trim()) return;
    try {
      setSaving(true);
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_post",
          imageUrl: newPostImageUrl.trim(),
          permalink: newPostPermalink.trim() || `https://instagram.com/${instagramConfig.handle}`,
          caption: newPostCaption.trim(),
        }),
      });
      const data = await res.json();
      if (data?.data) {
        setInstagramConfig(data.data);
        setNewPostImageUrl("");
        setNewPostPermalink("");
        setNewPostCaption("");
        setSuccessToast("New Instagram post added to storefront feed!");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInstagramPost = async (postId: string) => {
    try {
      setSaving(true);
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_post",
          postId,
        }),
      });
      const data = await res.json();
      if (data?.data) {
        setInstagramConfig(data.data);
        setSuccessToast("Post removed from Instagram feed.");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
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
              International Store Configuration
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono border border-emerald-200 font-semibold">
              Live DB Synced
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Manage global currencies, country-specific tax rules (VAT/GST), logistics zones, and live exchange rates.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAllData}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Config</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "general"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>General Store</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("taxes")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "taxes"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Country Tax Rules ({taxRules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shipping")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "shipping"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipping Zones & DDP ({shippingZones.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fx")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "fx"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live FX Rates Status</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("instagram")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "instagram"
              ? "border-neutral-900 text-neutral-900"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>Instagram Feed ({instagramConfig?.posts?.length || 0})</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
          <span>Loading configuration registry...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: GENERAL STORE CONFIG */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Section 1: Brand & Domain */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
                  <Globe className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Brand & Domain Identity
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Store Public Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Primary Domain Host
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.storeDomain}
                      onChange={(e) => setSettings({ ...settings, storeDomain: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Fiscal & Default Currency */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
                  <DollarSign className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Settlement Currency & Inventory Warnings
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Guaranteed Base Settlement Currency
                    </label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultCurrency: e.target.value as AdminSettings["defaultCurrency"],
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    >
                      <option value="USD">USD ($ United States Dollar - Base Currency)</option>
                      <option value="EUR">EUR (€ Euro)</option>
                      <option value="GBP">GBP (£ British Pound)</option>
                      <option value="CAD">CAD ($ Canadian Dollar)</option>
                    </select>
                    <p className="text-2xs text-neutral-500 mt-1">
                      All products and financial values are stored in this base unit to maintain accounting integrity.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Low Stock Warning Threshold (units)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={settings.lowStockThreshold}
                      onChange={(e) =>
                        setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                    <p className="text-2xs text-neutral-500 mt-1">
                      Triggers automated warnings on admin product tables when stock drops below this value.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Communications Routing */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Support & Notification Routing
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Customer Concierge Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Warehouse Order Notification Email
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.orderNotificationEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, orderNotificationEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Maintenance Lockout Mode */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
                  <ShieldAlert className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Storefront Maintenance Lockout
                  </h3>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Maintenance Lockout State
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      When enabled, public visitors see a seasonal maintenance splash screen while admins retain full access.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) =>
                        setSettings({ ...settings, maintenanceMode: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COUNTRY TAX RULES */}
          {activeTab === "taxes" && (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Configurable International Tax Rules
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    No hardcoded tax percentages. Rates are calculated dynamically based on destination country during checkout.
                  </p>
                </div>
                <span className="text-2xs font-mono bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded">
                  {taxRules.filter((r) => r.isActive).length} Active Country Rules
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 font-mono uppercase text-neutral-500 text-2xs">
                    <tr>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4">Tax Type</th>
                      <th className="py-3 px-4">Configured Rate (%)</th>
                      <th className="py-3 px-4">Inclusive / Exclusive</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {taxRules.map((rule, idx) => {
                      const countryConfig = COUNTRIES_REGISTRY[rule.countryCode];
                      const ratePercent = Math.round(rule.rate * 1000) / 10;
                      return (
                        <tr key={rule.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                              <span>{countryConfig?.flag || "🌐"}</span>
                              <span>{rule.countryName}</span>
                              <span className="text-2xs font-mono text-neutral-400">({rule.countryCode})</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono uppercase">
                            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-2xs">
                              {rule.taxType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                max={50}
                                step="0.1"
                                value={ratePercent}
                                onChange={(e) => handleUpdateTaxRate(idx, parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 text-xs font-mono bg-white border border-neutral-300 rounded focus:outline-none focus:border-black"
                              />
                              <span className="font-mono text-neutral-500">%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleTaxInclusive(idx)}
                              className={`text-2xs font-mono px-2 py-1 rounded transition-colors ${
                                rule.isInclusive
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {rule.isInclusive ? "VAT-Inclusive" : "Tax-Exclusive (+ checkout)"}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleTaxActive(idx)}
                              className={`text-2xs font-mono px-2 py-1 rounded font-semibold ${
                                rule.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-neutral-100 text-neutral-400"
                              }`}
                            >
                              {rule.isActive ? "ACTIVE" : "DISABLED"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SHIPPING ZONES & DDP */}
          {activeTab === "shipping" && (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden space-y-6 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Logistics Zones & Delivered Duty Paid (DDP) Rates
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Configure standard and express air courier fees, delivery estimates, and free shipping qualification thresholds.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {shippingZones.map((zone, idx) => (
                  <div
                    key={zone.id}
                    className="p-5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-neutral-700" />
                        <h4 className="font-semibold text-neutral-900 text-sm">{zone.name}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleZoneActive(idx)}
                        className={`text-2xs font-mono px-2.5 py-1 rounded font-semibold ${
                          zone.isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {zone.isActive ? "ZONE ACTIVE" : "ZONE INACTIVE"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {zone.countries.map((c) => {
                        const countryObj = COUNTRIES_REGISTRY[c];
                        return (
                          <span
                            key={c}
                            className="text-2xs font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 flex items-center gap-1"
                          >
                            <span>{countryObj?.flag || "🌐"}</span>
                            <span>{countryObj?.name || c}</span>
                          </span>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                      <div>
                        <label className="block text-2xs font-mono text-neutral-500 uppercase mb-1">
                          Standard Fee (USD)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="1"
                          value={zone.standardFee}
                          onChange={(e) =>
                            handleUpdateShippingFee(idx, "standardFee", parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-2xs font-mono text-neutral-500 uppercase mb-1">
                          Express Courier (USD)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="1"
                          value={zone.expressFee}
                          onChange={(e) =>
                            handleUpdateShippingFee(idx, "expressFee", parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-2xs font-mono text-neutral-500 uppercase mb-1">
                          Free Shipping Threshold (USD)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="10"
                          value={zone.freeShippingThreshold}
                          onChange={(e) =>
                            handleUpdateShippingFee(
                              idx,
                              "freeShippingThreshold",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-300 rounded focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-2xs font-mono text-neutral-500 uppercase mb-1">
                          Transit Speed
                        </label>
                        <div className="px-2.5 py-1.5 text-xs font-mono bg-white border border-neutral-200 rounded text-neutral-700">
                          {zone.estimatedDaysMin}–{zone.estimatedDaysMax} business days
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE FX EXCHANGE RATES STATUS */}
          {activeTab === "fx" && (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                      Live Foreign Exchange Rate Provider
                    </h3>
                    <span className="text-2xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      Connected • open.er-api.com
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Live mid-market rates with 6-hour cache TTL and resilient fallback snapshot. No hardcoded rates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRefreshRates}
                  disabled={refreshingRates}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-mono rounded transition-colors disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingRates ? "animate-spin" : ""}`} />
                  <span>{refreshingRates ? "Fetching FX API..." : "Sync Live Rates"}</span>
                </button>
              </div>

              {/* Status Info Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="text-2xs font-mono text-neutral-500 uppercase">Base Currency</div>
                  <div className="text-lg font-bold font-mono text-neutral-900 mt-1">USD ($)</div>
                  <div className="text-2xs text-neutral-400 mt-0.5">Strict base settlement ledger</div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="text-2xs font-mono text-neutral-500 uppercase">Last Sync Date</div>
                  <div className="text-lg font-bold font-mono text-neutral-900 mt-1">
                    {ratesData?.date || new Date().toISOString().split("T")[0]}
                  </div>
                  <div className="text-2xs text-neutral-400 mt-0.5">Next automated revalidation: 6 hours</div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="text-2xs font-mono text-neutral-500 uppercase">Supported Currencies</div>
                  <div className="text-lg font-bold font-mono text-neutral-900 mt-1">
                    {SUPPORTED_CURRENCIES.length} Currencies
                  </div>
                  <div className="text-2xs text-neutral-400 mt-0.5">Zero-decimal logic for JPY/KRW</div>
                </div>
              </div>

              {/* Rates Table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 font-mono uppercase text-neutral-500 text-2xs">
                    <tr>
                      <th className="py-2.5 px-4">Currency</th>
                      <th className="py-2.5 px-4">ISO Code</th>
                      <th className="py-2.5 px-4">Exchange Rate (1 USD)</th>
                      <th className="py-2.5 px-4">$100 USD Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {SUPPORTED_CURRENCIES.map((curr) => {
                      const rate = ratesData?.rates[curr.code] || 1.0;
                      const converted = formatLocalizedCurrency(100 * rate, curr.code);
                      return (
                        <tr key={curr.code} className="hover:bg-neutral-50/50">
                          <td className="py-2.5 px-4 font-sans font-medium text-neutral-900">
                            <span className="mr-2">{curr.flag}</span>
                            <span>{curr.name}</span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-neutral-700">{curr.code}</td>
                          <td className="py-2.5 px-4 text-neutral-900">
                            {rate.toFixed(curr.code === "JPY" ? 2 : 4)} {curr.symbol}
                          </td>
                          <td className="py-2.5 px-4 text-emerald-700 font-semibold">{converted}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: INSTAGRAM FEED & SOCIAL MEDIA INTEGRATION */}
          {activeTab === "instagram" && (
            <div className="space-y-6">
              {/* Account Connection Settings */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <InstagramIcon className="w-4 h-4 text-neutral-700" />
                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                      Instagram Account Connection
                    </h3>
                  </div>
                  <span className="text-2xs font-mono bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 rounded font-semibold">
                    @{instagramConfig.handle || "kora.winter"} Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Instagram Handle (@username)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. kora.winter"
                      value={instagramConfig.handle}
                      onChange={(e) =>
                        setInstagramConfig({
                          ...instagramConfig,
                          handle: e.target.value.replace(/^@/, ""),
                          profileUrl: `https://instagram.com/${e.target.value.replace(/^@/, "")}`,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Direct Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={instagramConfig.profileUrl}
                      onChange={(e) =>
                        setInstagramConfig({ ...instagramConfig, profileUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Meta Graph API Access Token (Optional for automatic live feed polling)
                  </label>
                  <input
                    type="password"
                    placeholder="IGQVJ... (Meta Instagram Basic Display Access Token)"
                    value={instagramConfig.accessToken || ""}
                    onChange={(e) =>
                      setInstagramConfig({ ...instagramConfig, accessToken: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <p className="text-2xs text-neutral-500 mt-1">
                    When provided, the storefront automatically synchronizes with the real Instagram Graph API. You can also add or curate individual posts below.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveInstagram}
                    disabled={saving}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
                  >
                    <span>Save Account Settings</span>
                  </button>
                </div>
              </div>

              {/* Add New Instagram Look */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
                  <Plus className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Add Real Instagram Post to Storefront
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Image URL (Photo or Upload)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /images/products/... or https://..."
                      value={newPostImageUrl}
                      onChange={(e) => setNewPostImageUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Instagram Post Permalink
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/p/..."
                      value={newPostPermalink}
                      onChange={(e) => setNewPostPermalink(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Post Caption
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sub-zero thermal parka expedition test in Tromsø..."
                      value={newPostCaption}
                      onChange={(e) => setNewPostCaption(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddInstagramPost}
                    disabled={saving || !newPostImageUrl}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Instagram Feed</span>
                  </button>
                </div>
              </div>

              {/* Live Posts Gallery */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Storefront Live Instagram Gallery ({instagramConfig.posts?.length || 0} Posts)
                  </h3>
                  <a
                    href={instagramConfig.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-mono text-neutral-600 hover:text-black"
                  >
                    <span>View @{instagramConfig.handle} on Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {instagramConfig.posts?.map((post) => (
                    <div
                      key={post.id}
                      className="group relative rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 flex flex-col"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.imageUrl}
                          alt={post.caption || "Instagram look"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteInstagramPost(post.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors"
                          title="Remove Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3 text-2xs space-y-1 bg-white flex-1 flex flex-col justify-between">
                        <p className="text-neutral-700 line-clamp-2 leading-relaxed">
                          {post.caption || "No caption"}
                        </p>
                        <div className="flex items-center justify-between text-neutral-400 font-mono pt-1 border-t border-neutral-100">
                          <span>❤️ {post.likesCount || 0}</span>
                          <span>💬 {post.commentsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Bar */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? "Saving Changes..." : "Save Configuration & Tax Rules"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
