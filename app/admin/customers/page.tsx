"use client";

import * as React from "react";
import {
  Users,
  Search,
  Crown,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Calendar,
  X,
  ExternalLink,
  Loader2,
  RefreshCw,
  Award,
} from "lucide-react";
import { AdminCustomer } from "@/lib/server/admin-store";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<AdminCustomer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<AdminCustomer | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);

      const res = await fetch(`/api/admin/customers?${queryParams.toString()}`);
      const data = await res.json();
      if (data && data.customers) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const vipCount = customers.filter((c) => c.status === "vip").length;
  const totalLTV = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgLTV = customers.length > 0 ? totalLTV / customers.length : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Customer Intelligence & Directory
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            View luxury clientele profiles, VIP winter tiers, and lifetime purchasing history.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Customers
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{customers.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Global verified buyers</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center justify-between">
            <span>VIP Winter Patrons</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{vipCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">High-tier luxury spenders</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Average Lifetime Value
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            ${avgLTV.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Per active profile</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-sky-700 uppercase tracking-wider">
            Cumulative Revenue
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            ${totalLTV.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-sky-600 mt-1">Lifetime customer ledger</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>
        <div className="text-xs text-neutral-500 font-mono">
          Showing {customers.length} customer records
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Client Profile</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Tier Status</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Member Since</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    <span>Loading customer ledger...</span>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <span>No customer profiles found.</span>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const initials = c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-neutral-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              c.status === "vip"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 group-hover:text-black">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-neutral-400">{c.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1 text-neutral-600">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>
                            {c.city}, {c.country}
                          </span>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-4">
                        {c.status === "vip" ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            <Crown className="w-3 h-3 text-amber-600" />
                            <span>VIP TIER</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-neutral-900">
                          {c.totalOrders}
                        </span>
                        <span className="text-[11px] text-neutral-400 ml-1">orders</span>
                      </td>

                      {/* Spent */}
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                        ${c.totalSpent.toFixed(2)}
                      </td>

                      {/* Member Since */}
                      <td className="py-3.5 px-4 text-neutral-500 text-[11px] font-mono">
                        {new Date(c.joinedAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-neutral-600 group-hover:text-black underline underline-offset-2">
                          View Profile
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

      {/* Customer Profile Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                    selectedCustomer.status === "vip"
                      ? "bg-amber-100 text-amber-800 border border-amber-300 ring-2 ring-amber-200"
                      : "bg-neutral-900 text-white"
                  }`}
                >
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{selectedCustomer.name}</h3>
                  <p className="text-[11px] text-neutral-400 font-mono">ID: {selectedCustomer.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-neutral-400 hover:text-neutral-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-lg border flex items-center space-x-3 ${
                  selectedCustomer.status === "vip"
                    ? "bg-amber-50/60 border-amber-200 text-amber-900"
                    : "bg-neutral-50 border-neutral-200 text-neutral-800"
                }`}
              >
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold uppercase tracking-wider">
                    {selectedCustomer.status === "vip" ? "VIP Winter Collector" : "Standard Client"}
                  </div>
                  <div className="text-neutral-500 mt-0.5">
                    Customer has completed {selectedCustomer.totalOrders} verified orders.
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="space-y-2 text-xs bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
                  <div className="flex items-center space-x-2.5 text-neutral-700">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-neutral-700">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-neutral-700">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>
                      {selectedCustomer.city}, {selectedCustomer.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Lifetime Spend
                  </div>
                  <div className="text-lg font-bold font-mono text-neutral-900 mt-1">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                    Total Purchases
                  </div>
                  <div className="text-lg font-bold font-mono text-neutral-900 mt-1">
                    {selectedCustomer.totalOrders}
                  </div>
                </div>
              </div>

              {/* Member Timestamp */}
              <div className="text-xs text-neutral-400 flex items-center space-x-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Client since {new Date(selectedCustomer.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
