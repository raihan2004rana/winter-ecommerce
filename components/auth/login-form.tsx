"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  const { login, isLoading } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      router.push(redirectTarget);
    } else {
      setErrorMessage(res.error || "Authentication failed. Please verify credentials.");
    }
  };

  const handleQuickDemoLogin = async () => {
    setSubmitting(true);
    setEmail("julian.vallis@haute-cold.com");
    setPassword("WinterSecret2026!");
    const res = await login("julian.vallis@haute-cold.com", "WinterSecret2026!");
    setSubmitting(false);
    if (res.success) {
      router.push(redirectTarget);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Customer One-Click Banner */}
      <div className="bg-[#F6F8FA] border border-[#E1E4E8] p-3.5 text-xs text-[#24292E] space-y-2">
        <div className="flex items-center space-x-1.5 font-medium text-[#111]">
          <ShieldCheck className="h-4 w-4 text-[#111]" />
          <span>Demo Customer Review Access</span>
        </div>
        <p className="text-[0.72rem] text-[#586069] leading-relaxed">
          Preloaded with 2 real winter orders, tracking histories, Aspen residence address, and verified reviews.
        </p>
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full bg-[#111] hover:bg-black text-white py-2 text-2xs uppercase tracking-widest font-mono transition-colors"
        >
          Sign In as Julian Vallis (Demo)
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-[#FEF2F2] border border-[#F87171] text-xs text-[#B91C1C]">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@cold-horizon.com"
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black font-sans transition-colors"
            />
            <Mail className="absolute right-3 top-3 h-4 w-4 text-[#888] pointer-events-none" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[0.68rem] text-[#666] hover:text-black underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black font-sans transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#888] hover:text-[#111]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="w-full bg-[#111] hover:bg-black text-white py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all mt-6 shadow-sm disabled:opacity-50"
        >
          <span>{submitting ? "Authenticating..." : "Sign In to Account"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Footer Registration Link */}
      <div className="pt-4 border-t border-[#EAEAEA] text-center text-xs text-[#666]">
        <span>New to Vallis & Ore? </span>
        <Link
          href={`/register?redirect=${encodeURIComponent(redirectTarget)}`}
          className="text-black font-semibold uppercase hover:underline underline-offset-4 tracking-wider ml-1"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
