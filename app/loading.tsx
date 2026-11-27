import * as React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] overflow-hidden bg-transparent pointer-events-none">
      <div className="h-full bg-neutral-900 animate-pulse w-full origin-left duration-300" />
    </div>
  );
}
