"use client";

import * as React from "react";
import {
  ShieldCheck,
  Shield,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
  Loader2,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { AdminStaff } from "@/lib/server/admin-store";

export default function AdminStaffPage() {
  const [staffList, setStaffList] = React.useState<AdminStaff[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  const fetchStaff = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (data && data.staff) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.error("Failed to load staff list:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleRoleChange = async (staffId: string, name: string, newRole: AdminStaff["role"]) => {
    try {
      setUpdatingId(staffId);
      const res = await fetch("/api/admin/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update role");
      }

      await fetchStaff();
      setSuccessToast(`Role for ${name} updated to ${newRole.replace("_", " ").toUpperCase()}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: AdminStaff["role"]) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "catalog_manager":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "order_specialist":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

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
              Staff & Role-Based Access Control (RBAC)
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {staffList.length} Administrators
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Assign least-privilege security roles, enforce team access controls, and govern staff capabilities.
          </p>
        </div>

        <button
          onClick={fetchStaff}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Team</span>
        </button>
      </div>

      {/* RBAC Permissions Matrix */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center space-x-2">
              <Key className="w-4 h-4 text-neutral-500" />
              <span>Privilege Authorization Matrix</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Role permissions strictly enforced at API route boundary and server data layer.
            </p>
          </div>
          <span className="text-xs font-mono bg-neutral-100 px-2.5 py-1 rounded text-neutral-600 border border-neutral-200">
            Granular Security
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Catalog & Products</th>
                <th className="py-2.5 px-3">Inventory Adjust</th>
                <th className="py-2.5 px-3">Orders & Shipments</th>
                <th className="py-2.5 px-3">Coupons & Pricing</th>
                <th className="py-2.5 px-3">Moderation</th>
                <th className="py-2.5 px-3">Store Settings</th>
                <th className="py-2.5 px-3">Staff RBAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-purple-900">Super Admin</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-sky-900">Administrator</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-amber-900">Catalog Manager</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-neutral-300">READ</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-emerald-900">Order Specialist</td>
                <td className="py-2.5 px-3 text-neutral-300">READ</td>
                <td className="py-2.5 px-3 text-neutral-300">READ</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-bold text-neutral-700">Support Agent</td>
                <td className="py-2.5 px-3 text-neutral-300">READ</td>
                <td className="py-2.5 px-3 text-neutral-300">READ</td>
                <td className="py-2.5 px-3 text-neutral-300">READ</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-emerald-600 font-bold">FULL</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
                <td className="py-2.5 px-3 text-neutral-300">NO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Administrative Staff Accounts</h3>
            <p className="text-xs text-neutral-500">Live active sessions and assigned role permissions</p>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {staffList.filter((s) => s.status === "active").length} Active Now
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Current Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Adjust Authorization Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    <span>Querying staff registry...</span>
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => {
                  const initials = staff.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2);

                  return (
                    <tr key={staff.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900">{staff.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              {staff.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getRoleBadge(
                            staff.role
                          )}`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span className="uppercase">{staff.role.replace("_", " ")}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="uppercase">Active</span>
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{new Date(staff.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <select
                            value={staff.role}
                            disabled={updatingId === staff.id}
                            onChange={(e) =>
                              handleRoleChange(
                                staff.id,
                                staff.name,
                                e.target.value as AdminStaff["role"]
                              )
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-white border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Administrator</option>
                            <option value="catalog_manager">Catalog Manager</option>
                            <option value="order_specialist">Order Specialist</option>
                            <option value="support_agent">Support Agent</option>
                          </select>
                          {updatingId === staff.id && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
