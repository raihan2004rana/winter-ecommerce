"use client";

import * as React from "react";
import { X, Ruler, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  category: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  productTitle,
  category,
}: SizeGuideModalProps) {
  const [unit, setUnit] = React.useState<"cm" | "in">("cm");

  if (!isOpen) return null;

  // Measurement charts
  const measurementsCm = [
    { size: "XS", chest: "92-96", waist: "76-80", hip: "90-94", sleeve: "84" },
    { size: "S", chest: "96-100", waist: "80-84", hip: "94-98", sleeve: "86" },
    { size: "M", chest: "100-104", waist: "84-88", hip: "98-102", sleeve: "88" },
    { size: "L", chest: "104-108", waist: "88-92", hip: "102-106", sleeve: "90" },
    { size: "XL", chest: "108-114", waist: "92-98", hip: "106-112", sleeve: "92" },
    { size: "XXL", chest: "114-120", waist: "98-104", hip: "112-118", sleeve: "94" },
  ];

  const measurementsInches = [
    { size: "XS", chest: "36-38", waist: "30-31", hip: "35-37", sleeve: "33" },
    { size: "S", chest: "38-39", waist: "31-33", hip: "37-39", sleeve: "34" },
    { size: "M", chest: "39-41", waist: "33-35", hip: "39-40", sleeve: "34.5" },
    { size: "L", chest: "41-43", waist: "35-36", hip: "40-42", sleeve: "35.5" },
    { size: "XL", chest: "43-45", waist: "36-39", hip: "42-44", sleeve: "36" },
    { size: "XXL", chest: "45-47", waist: "39-41", hip: "44-46", sleeve: "37" },
  ];

  const activeMeasurements = unit === "cm" ? measurementsCm : measurementsInches;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white border border-[#EAEAEA] w-full max-w-2xl text-[#111] p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EAEAEA] pb-4">
          <div className="space-y-1">
            <span className="text-2xs font-mono uppercase tracking-[0.2em] text-[#888]">
              Alpine Fit Architecture
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111]">
              Garment Sizing & Fit Advisor
            </h3>
            <p className="text-xs text-[#666]">{productTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-black border border-[#EAEAEA] hover:border-black transition-colors"
            aria-label="Close size guide"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Unit Toggle & Layering Recommendation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFBFD] p-4 border border-[#EAEAEA]">
          <div className="space-y-0.5">
            <span className="text-2xs font-mono uppercase tracking-widest text-[#111] font-bold block">
              Layering Recommendation
            </span>
            <p className="text-xs text-[#666]">
              Order true to size for standard winter fit. Order one size up if layering over heavy cable knits.
            </p>
          </div>

          <div className="flex items-center space-x-1 border border-[#EAEAEA] bg-white p-0.5 self-start sm:self-auto">
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 text-2xs font-mono uppercase transition-colors ${
                unit === "cm" ? "bg-black text-white font-bold" : "text-[#777]"
              }`}
            >
              Metric (CM)
            </button>
            <button
              onClick={() => setUnit("in")}
              className={`px-3 py-1 text-2xs font-mono uppercase transition-colors ${
                unit === "in" ? "bg-black text-white font-bold" : "text-[#777]"
              }`}
            >
              Imperial (IN)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#111] text-2xs font-mono uppercase tracking-widest text-[#111]">
                <th className="py-2.5 font-bold">Size</th>
                <th className="py-2.5">Chest</th>
                <th className="py-2.5">Waist</th>
                <th className="py-2.5">Hips</th>
                <th className="py-2.5">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA] font-mono text-xs">
              {activeMeasurements.map((m) => (
                <tr key={m.size} className="hover:bg-[#F9F9F9]">
                  <td className="py-3 font-bold text-black">{m.size}</td>
                  <td className="py-3 text-[#555]">{m.chest} {unit}</td>
                  <td className="py-3 text-[#555]">{m.waist} {unit}</td>
                  <td className="py-3 text-[#555]">{m.hip} {unit}</td>
                  <td className="py-3 text-[#555]">{m.sleeve} {unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Advice */}
        <div className="pt-2 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between text-2xs text-[#777] gap-3">
          <div className="flex items-center space-x-1.5 text-forest font-medium">
            <CheckCircle2 className="h-4 w-4" />
            <span>Complimentary exchanges on all sizes within 30 days.</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
