import * as React from "react";
import { Metadata } from "next";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Customer Account | MONCLER & VALLIS",
  description: "Join the Alpine Noir client network. Enjoy priority winter drop allocations, bespoke sizing recommendations, and seamless global orders.",
};

export default function RegisterPage() {
  return (
    <StoreLayoutWrapper>
      <div className="min-h-[80vh] flex items-center justify-center py-16 sm:py-24 px-6 sm:px-12 bg-[#FAFBFD]">
        <div className="w-full max-w-md bg-white border border-[#EAEAEA] p-8 sm:p-10 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
              Client Registration
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#111] uppercase">
              Create Account
            </h1>
            <p className="text-xs text-[#666]">
              Unlock priority drop reservations, complimentary express shipping, and personal size archive.
            </p>
          </div>

          <React.Suspense fallback={<div className="text-center font-mono text-xs py-8">Loading...</div>}>
            <RegisterForm />
          </React.Suspense>
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
