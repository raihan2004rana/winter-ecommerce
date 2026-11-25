"use client";

import * as React from "react";
import Link from "next/link";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { useAuth } from "@/lib/auth/auth-context";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    await resetPasswordForEmail(email);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <StoreLayoutWrapper>
      <div className="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-6 sm:px-12 bg-[#FAFBFD]">
        <div className="w-full max-w-md bg-white border border-[#EAEAEA] p-8 sm:p-10 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
              Security & Credentials
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#111] uppercase">
              Reset Password
            </h1>
            <p className="text-xs text-[#666]">
              Enter the email address registered with your customer account to receive a secure recovery link.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="h-12 w-12 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mx-auto text-[#16A34A]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans text-base font-semibold text-[#111]">
                  Recovery Link Dispatched
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  We have transmitted a password reset link to <strong className="text-black">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA]">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-xs uppercase font-mono tracking-widest text-black hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-2xs uppercase tracking-widest font-mono text-[#555] block">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#111] hover:bg-black text-white py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all mt-6 shadow-sm disabled:opacity-50"
              >
                <span>{submitting ? "Transmitting..." : "Send Reset Link"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-4 border-t border-[#EAEAEA] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-xs uppercase font-mono tracking-widest text-[#666] hover:text-black"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
