"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { ArrowRight, Mail, User, Eye, EyeOff, CheckCircle } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  const { register, isLoading } = useAuth();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(true);
  const [subscribeNewsletter, setSubscribeNewsletter] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreeTerms) {
      setErrorMessage("Please accept the terms and privacy conditions to register.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters in length.");
      return;
    }

    setSubmitting(true);
    const res = await register({
      firstName,
      lastName,
      email,
      password,
    });
    setSubmitting(false);

    if (res.success) {
      router.push("/auth/verify-email?email=" + encodeURIComponent(email));
    } else {
      setErrorMessage(res.error || "Unable to register account. Please review details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-[#FEF2F2] border border-[#F87171] text-xs text-[#B91C1C]">
          {errorMessage}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Julian"
            required
            className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black font-sans transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Vallis"
            required
            className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black font-sans transition-colors"
          />
        </div>
      </div>

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
        <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
          Password (min. 8 characters)
        </label>
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

      {/* Preferences Checkboxes */}
      <div className="space-y-3 pt-2 text-xs text-[#555]">
        <label className="flex items-start space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribeNewsletter}
            onChange={(e) => setSubscribeNewsletter(e.target.checked)}
            className="mt-0.5 rounded-none border-gray-300 text-black focus:ring-black"
          />
          <span className="text-[0.72rem] leading-relaxed">
            Send me private winter drop allocations, seasonal runway lookbooks, and private archival invitations.
          </span>
        </label>

        <label className="flex items-start space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded-none border-gray-300 text-black focus:ring-black"
          />
          <span className="text-[0.72rem] leading-relaxed">
            I agree to the <Link href="#terms" className="underline hover:text-black">Terms of Service</Link> and{" "}
            <Link href="#privacy" className="underline hover:text-black">Privacy Policy</Link>.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || isLoading}
        className="w-full bg-[#111] hover:bg-black text-white py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all mt-6 shadow-sm disabled:opacity-50"
      >
        <span>{submitting ? "Creating Client Account..." : "Create Account"}</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Existing account link */}
      <div className="pt-4 border-t border-[#EAEAEA] text-center text-xs text-[#666]">
        <span>Already have an account? </span>
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
          className="text-black font-semibold uppercase hover:underline underline-offset-4 tracking-wider ml-1"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}
