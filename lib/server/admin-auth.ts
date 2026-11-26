import { NextRequest } from "next/server";
import { AdminStaff } from "./admin-store";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "catalog_manager" | "order_specialist" | "support_agent";
}

export const ROLE_PERMISSIONS: Record<AdminSession["role"], string[]> = {
  super_admin: ["all"],
  admin: [
    "products:read",
    "products:write",
    "categories:write",
    "inventory:write",
    "orders:write",
    "coupons:write",
    "reviews:write",
    "settings:write",
    "campaigns:read",
    "campaigns:write",
  ],
  catalog_manager: ["products:read", "products:write", "categories:write", "inventory:write", "campaigns:read", "campaigns:write"],
  order_specialist: ["orders:read", "orders:write", "customers:read", "inventory:read", "campaigns:read"],
  support_agent: ["orders:read", "customers:read", "reviews:read", "reviews:write", "campaigns:read"],
};

export function getAdminSessionFromRequest(request: NextRequest): AdminSession {
  // Check admin session cookie
  const cookie = request.cookies.get("winter_admin_session")?.value;
  if (cookie) {
    try {
      const parsed = JSON.parse(cookie);
      if (parsed && parsed.email && parsed.role) {
        return parsed as AdminSession;
      }
    } catch {
      // invalid cookie
    }
  }

  // Default demo super admin session for development preview
  return {
    id: "staff-1",
    name: "Raihan Rana",
    email: "admin@winter-fashion.com",
    role: "super_admin",
  };
}

export function hasPermission(role: AdminSession["role"], requiredPermission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes("all")) return true;
  return perms.includes(requiredPermission);
}
