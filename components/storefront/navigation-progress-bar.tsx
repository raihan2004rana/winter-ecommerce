"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * High-performance luxury top navigation progress bar
 * Provides immediate 0ms feedback whenever a user clicks any navigation link or product card.
 */
export function NavigationProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Complete progress whenever the pathname changes
  React.useEffect(() => {
    setIsNavigating(false);
    setProgress(100);
    const timeout = setTimeout(() => {
      setProgress(0);
    }, 250);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Intercept all internal link clicks for instant 0ms visual reaction
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        !target.getAttribute("target") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        href !== pathname
      ) {
        setIsNavigating(true);
        setProgress(30);

        // Smooth increment animation
        const t1 = setTimeout(() => setProgress(65), 120);
        const t2 = setTimeout(() => setProgress(85), 350);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [pathname]);

  if (progress === 0 && !isNavigating) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#111] via-[#E11D48] to-[#111] shadow-[0_0_8px_rgba(225,29,72,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
