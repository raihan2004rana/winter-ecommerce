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
} from "lucide-react";
import { AdminSettings } from "@/lib/server/admin-store";

export default function AdminSettingsPage() {
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

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  const fetchSettings = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load store settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update configuration");
      }

      setSuccessToast("Store configuration saved and synchronized with database!");
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update configuration";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
              Store Configuration & Parameters
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              System Settings
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Define checkout currencies, logistics rate thresholds, tax rates, and support email routing.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Config</span>
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

          {/* Section 1: Brand & Domain */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 space-y-4">
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

          {/* Section 2: Fiscal & Currency */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Currency, Shipping & Tax Calculations
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Base Store Currency
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
                  <option value="USD">USD ($ United States Dollar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                  <option value="GBP">GBP (£ British Pound)</option>
                  <option value="CAD">CAD ($ Canadian Dollar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Standard Shipping Fee ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={settings.standardShippingFee}
                  onChange={(e) =>
                    setSettings({ ...settings, standardShippingFee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Free Shipping Threshold ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeShippingThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Estimated Tax Rate (e.g. 0.08 for 8%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
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
              </div>
            </div>
          </div>

          {/* Section 3: Communications Routing */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 space-y-4">
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
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 space-y-4">
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
              <span>{saving ? "Saving Changes..." : "Save Store Configuration"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
