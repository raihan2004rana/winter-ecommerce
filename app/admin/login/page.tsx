"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
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
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Invalid email or security password.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle luxury ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-stone-200/50 via-stone-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2 z-10">
        <Link href="/" className="inline-block group">
          <span className="font-sans text-2xl sm:text-3xl font-extrabold tracking-[0.24em] uppercase text-neutral-900 group-hover:text-black transition-colors block">
            MAULI FASHION
          </span>
          <span className="block text-[0.65rem] font-mono uppercase tracking-[0.28em] text-neutral-500 mt-1">
            Administration Console
          </span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-2xl p-7 sm:p-9 z-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-[0.68rem] font-mono uppercase tracking-wider">
            <Shield className="h-3.5 w-3.5 text-neutral-800" />
            <span>Restricted Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold text-neutral-900 tracking-tight">
            Authenticate Administrator
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Enter your authorized administrative credentials to access store operations and catalog controls.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start space-x-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-neutral-700 font-medium">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@winter-fashion.com"
                className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-neutral-700 font-medium">
                Security Key / Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white border border-neutral-300 rounded-lg pl-10 pr-11 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 p-0.5 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-black text-white py-3 px-4 rounded-lg text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Authenticating..." : "Access Dashboard"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-neutral-100">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center space-x-1"
          >
            <span>← Return to Customer Storefront</span>
          </Link>
        </div>
      </div>

      {/* Subtle security notice */}
      <div className="mt-8 text-center text-[0.7rem] font-mono text-neutral-400 z-10">
        Protected by Encrypted Administrative Gateway &bull; Mauli Fashion &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
