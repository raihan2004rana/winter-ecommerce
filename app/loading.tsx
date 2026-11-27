import * as React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-white/70 backdrop-blur-xs transition-opacity duration-300 pointer-events-none">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-neutral-900 animate-spin" />
        <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 font-semibold">
          Loading Garment...
        </span>
      </div>
    </div>
  );
}
