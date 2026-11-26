"use client";

import * as React from "react";
import {
  History,
  Search,
  ShieldCheck,
  Calendar,
  User,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { AdminAuditLog } from "@/lib/server/admin-store";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = React.useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const fetchLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data && data.auditLogs) {
        setLogs(data.auditLogs);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const s = search.toLowerCase();
    return (
      log.actorName.toLowerCase().includes(s) ||
      log.actorEmail.toLowerCase().includes(s) ||
      log.action.toLowerCase().includes(s) ||
      log.entity.toLowerCase().includes(s) ||
      log.details.toLowerCase().includes(s) ||
      log.entityId.toLowerCase().includes(s)
    );
  });

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD") || act.includes("APPROVE")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (act.includes("DELETE") || act.includes("REJECT") || act.includes("ARCHIVE")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (act.includes("ADJUST") || act.includes("UPDATE") || act.includes("TOGGLE")) {
      return "bg-sky-50 text-sky-700 border-sky-200";
    }
    return "bg-neutral-100 text-neutral-700 border-neutral-200";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Administrative Audit Trail
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {logs.length} Immutable Event Logs
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Cryptographic ledger tracking all staff modifications, stock counts, role changes, and catalog updates.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, SKU or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>
        <div className="text-xs text-neutral-500 font-mono">
          Showing {filteredLogs.length} of {logs.length} log events
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Event Timestamp</th>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">Change Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
                    <span>Loading immutable audit records...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <History className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <span>No audit entries found.</span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = new Date(log.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-900">{log.actorName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {log.actorEmail}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionBadge(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4 capitalize font-medium text-neutral-800 whitespace-nowrap">
                        {log.entity}
                      </td>

                      {/* Entity ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                        {log.entityId}
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 text-neutral-600 max-w-md">
                        <div className="line-clamp-2 leading-relaxed text-xs">
                          {log.details}
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
