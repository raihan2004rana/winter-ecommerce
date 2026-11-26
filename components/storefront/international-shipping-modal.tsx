"use client";

import * as React from "react";
import {
  X,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InternationalShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InternationalShippingModal({
  isOpen,
  onClose,
}: InternationalShippingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 text-[#111]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-normal text-black">
                International Shipping & Customs Policy
              </h2>
              <p className="text-2xs font-mono text-gray-500 uppercase tracking-widest">
                Delivered Duty Paid (DDP) • Insured Freight • 30-Day Returns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Guarantee: DDP (No hidden fees) */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Delivered Duty Paid (DDP) — Guaranteed Zero Hidden Customs Fees</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-sans">
              Every international parcel dispatched by KØRA Wardrobe is sent DDP. All import duties, tariffs, and national VAT charges are calculated at checkout. You will never receive an unexpected fee or brokerage bill upon arrival at your doorstep.
            </p>
          </div>

          {/* Regional Transit Speeds Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Estimated Transit Times by Region
            </h3>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden text-xs">
              <div className="p-3.5 bg-gray-50/50 flex justify-between items-center">
                <div className="font-semibold text-black flex items-center gap-2">
                  <span>🇨🇭 🇩🇪 🇫🇷 🇬🇧</span>
                  <span>Western Europe & Switzerland</span>
                </div>
                <div className="text-right font-mono text-gray-600">
                  <span>3–5 business days</span>
                  <span className="block text-[10px] text-gray-400">DHL Express / Swiss Post</span>
                </div>
              </div>

              <div className="p-3.5 bg-white flex justify-between items-center">
                <div className="font-semibold text-black flex items-center gap-2">
                  <span>🇺🇸 🇨🇦</span>
                  <span>North America (US & Canada)</span>
                </div>
                <div className="text-right font-mono text-gray-600">
                  <span>3–5 business days</span>
                  <span className="block text-[10px] text-gray-400">Air Courier Priority</span>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50/50 flex justify-between items-center">
                <div className="font-semibold text-black flex items-center gap-2">
                  <span>🇸🇪 🇳🇴 🇩🇰 🇫🇮</span>
                  <span>Nordics & Scandinavia</span>
                </div>
                <div className="text-right font-mono text-gray-600">
                  <span>4–7 business days</span>
                  <span className="block text-[10px] text-gray-400">PostNord / DHL Parcel</span>
                </div>
              </div>

              <div className="p-3.5 bg-white flex justify-between items-center">
                <div className="font-semibold text-black flex items-center gap-2">
                  <span>🇯🇵 🇦🇺 🇸🇬 🇳🇿</span>
                  <span>Asia-Pacific & Oceania</span>
                </div>
                <div className="text-right font-mono text-gray-600">
                  <span>5–8 business days</span>
                  <span className="block text-[10px] text-gray-400">Global Priority Air</span>
                </div>
              </div>
            </div>
          </div>

          {/* 30-Day Returns Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-black">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>30-Day Global Returns</span>
              </div>
              <p className="text-[0.72rem] text-gray-500 leading-relaxed">
                Local returns hubs in London, Geneva, Frankfurt, and New York. Pre-paid international return labels available upon request.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-black">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>100% Insured Packaging</span>
              </div>
              <p className="text-[0.72rem] text-gray-500 leading-relaxed">
                All garments arrive in weather-resistant, dust-proof archival packaging with signature verification required for high-value outercoats.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/70 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider"
          >
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
