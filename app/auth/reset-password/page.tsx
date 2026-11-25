"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { useAuth } from "@/lib/auth/auth-context";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const res = await updatePassword(password);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/account");
      }, 2500);
    } else {
      setErrorMessage(res.error || "Unable to update password.");
    }
  };

  return (
    <StoreLayoutWrapper>
      <div className="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-6 sm:px-12 bg-[#FAFBFD]">
        <div className="w-full max-w-md bg-white border border-[#EAEAEA] p-8 sm:p-10 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
              Security Update
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#111] uppercase">
              Set New Password
            </h1>
            <p className="text-xs text-[#666]">
              Choose a strong password with a minimum of 8 characters.
            </p>
          </div>

          {success ? (
            <div className="space-y-4 text-center">
              <div className="h-12 w-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mx-auto text-[#16A34A]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-base font-semibold text-[#111]">
                Password Updated Successfully
              </h3>
              <p className="text-xs text-[#666]">
                Redirecting you to your customer account dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-[#FEF2F2] border border-[#F87171] text-xs text-[#B91C1C]">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black font-sans transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#FAFBFD] border border-[#D5D5D5] px-3.5 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black font-sans transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#111] hover:bg-black text-white py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all mt-6 shadow-sm disabled:opacity-50"
              >
                <span>{submitting ? "Updating..." : "Update Password"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
