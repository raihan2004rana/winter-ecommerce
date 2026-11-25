import * as React from "react";
import { Metadata } from "next";
import { StoreLayoutWrapper } from "@/components/storefront/store-layout-wrapper";
import { CustomerDashboardShell } from "@/components/account/dashboard-shell";

export const metadata: Metadata = {
  title: "Customer Account Dashboard | MONCLER & VALLIS",
  description: "Manage your winter fashion orders, tracked deliveries, bespoke sizing, saved addresses, and security preferences.",
};

export default function AccountPage() {
  return (
    <StoreLayoutWrapper>
      <div className="min-h-screen bg-[#FBFBFC] py-10 sm:py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1500px] mx-auto">
          <React.Suspense fallback={<div className="p-12 text-center text-xs font-mono">Loading Customer Account...</div>}>
            <CustomerDashboardShell />
          </React.Suspense>
        </div>
      </div>
    </StoreLayoutWrapper>
  );
}
