"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@winter-fashion.com");
  const [password, setPassword] = React.useState("••••••••••••");
  const [role, setRole] = React.useState<"super_admin" | "catalog_manager" | "order_specialist">("super_admin");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Invalid credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (selectedRole: "super_admin" | "catalog_manager" | "order_specialist", roleEmail: string) => {
    setEmail(roleEmail);
    setRole(selectedRole);
    setLoading(true);
    try {
      await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: roleEmail, password: "demo", role: selectedRole }),
      });
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-[#F3F4F6] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient architectural glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neutral-800/30 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Wordmark & Security Badge */}
      <div className="text-center mb-8 space-y-2 z-10">
        <Link href="/" className="inline-block group">
          <span className="font-sans text-2xl font-bold tracking-[0.25em] uppercase text-white group-hover:text-neutral-300 transition-colors">
            MAULI FASHION
          </span>
          <span className="block text-[0.62rem] font-mono uppercase tracking-[0.3em] text-neutral-400 mt-0.5">
            Administration Console
          </span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#16181C] border border-neutral-800 shadow-2xl p-8 z-10 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Restricted Gateway</span>
          </div>
          <h2 className="text-xl font-sans font-semibold text-white tracking-tight">
            Authenticate Administrator
          </h2>
          <p className="text-xs text-neutral-400">
            Sign in with administrative credentials to access store operations.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-sm text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-2xs font-mono uppercase tracking-wider text-neutral-400">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@winter-fashion.com"
                className="w-full bg-[#1C1F26] border border-neutral-700/80 pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-2xs font-mono uppercase tracking-wider text-neutral-400">
                Security Key / Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1C1F26] border border-neutral-700/80 pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-neutral-200 text-black py-3 px-4 text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Access Dashboard"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* 1-Click Role Demonstrator Buttons */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <span className="block text-[0.62rem] font-mono uppercase tracking-wider text-neutral-500 text-center">
            Instant Demo Access by Role
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickLogin("super_admin", "admin@winter-fashion.com")}
              className="w-full bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-semibold text-white block">Raihan Rana</span>
                <span className="text-[0.62rem] text-sky-400 font-mono">Role: Super Administrator</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
            </button>

            <button
              onClick={() => handleQuickLogin("catalog_manager", "camilla.lind@winter-fashion.com")}
              className="w-full bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-semibold text-white block">Camilla Lind</span>
                <span className="text-[0.62rem] text-amber-400 font-mono">Role: Catalog Manager</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
            </button>

            <button
              onClick={() => handleQuickLogin("order_specialist", "erik.thorne@winter-fashion.com")}
              className="w-full bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-semibold text-white block">Erik Thorne</span>
                <span className="text-[0.62rem] text-emerald-400 font-mono">Role: Order Specialist</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-2xs font-mono uppercase tracking-wider text-neutral-500 hover:text-white transition-colors"
          >
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
