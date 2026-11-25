import * as React from "react";
import Link from "next/link";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { MailCheck, ArrowRight } from "lucide-react";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <StoreLayoutWrapper>
      <div className="min-h-[75vh] flex items-center justify-center py-16 sm:py-24 px-6 sm:px-12 bg-[#FAFBFD]">
        <div className="w-full max-w-md bg-white border border-[#EAEAEA] p-8 sm:p-10 shadow-xs text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-[#FAFBFD] border border-[#EAEAEA] flex items-center justify-center mx-auto text-[#111]">
            <MailCheck className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
              Identity Verification
            </span>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-[#111] uppercase">
              Verify Your Email
            </h1>
            <p className="text-xs text-[#666] leading-relaxed">
              We have dispatched an activation confirmation link to{" "}
              <strong className="text-black">{email || "your email address"}</strong>. Please follow the instructions to finalize access to your private customer profile.
            </p>
          </div>

          <div className="bg-[#FAFBFD] border border-[#EAEAEA] p-4 text-xs text-[#555] space-y-1 text-left">
            <p className="font-mono text-2xs uppercase tracking-wider text-[#111]">What happens next?</p>
            <p className="text-[0.72rem] text-[#777] leading-relaxed">
              Click the link in the verification email to immediately activate your account, view your orders, and claim your Alpine Noir membership tier.
            </p>
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            <Link
              href="/account"
              className="w-full bg-[#111] hover:bg-black text-white py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <span>Continue to Client Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="text-xs uppercase font-mono tracking-wider text-[#888] hover:text-black"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
