import * as React from "react";
import { Metadata } from "next";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Customer Sign In | MONCLER & VALLIS",
  description: "Sign in to your private winter fashion customer account to access order tracking, personal preferences, and saved garments.",
};

export default function LoginPage() {
  return (
    <StoreLayoutWrapper>
      <div className="min-h-[80vh] flex items-center justify-center py-16 sm:py-24 px-6 sm:px-12 bg-[#FAFBFD]">
        <div className="w-full max-w-md bg-white border border-[#EAEAEA] p-8 sm:p-10 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
              Private Client Portal
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#111] uppercase">
              Sign In
            </h1>
            <p className="text-xs text-[#666]">
              Access your order history, delivery tracking, and bespoke sizing.
            </p>
          </div>

          <React.Suspense fallback={<div className="text-center font-mono text-xs py-8">Loading...</div>}>
            <LoginForm />
          </React.Suspense>
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
