"use client";

import * as React from "react";
import Link from "next/link";
import { ANNOUNCEMENT_MESSAGES } from "@/data/banners";
import { ChevronLeft, ChevronRight, Globe, ChevronDown } from "lucide-react";

interface AnnouncementBarProps {
  activeCurrency: "USD" | "EUR" | "GBP" | "CAD";
  onCurrencyChange: (currency: "USD" | "EUR" | "GBP" | "CAD") => void;
}

export function AnnouncementBar({
  activeCurrency,
  onCurrencyChange,
}: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = React.useState(false);

  const currencies: Array<"USD" | "EUR" | "GBP" | "CAD"> = ["USD", "EUR", "GBP", "CAD"];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENT_MESSAGES[currentIndex];

  return (
    <div className="w-full bg-canvas-subtle border-b border-canvas-muted text-charcoal py-2 px-4 sm:px-8 text-xs relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Region & DDP Compliance Badge */}
        <div className="hidden lg:flex items-center space-x-2 text-2xs uppercase tracking-widest text-charcoal-500 font-medium">
          <span className="h-1.5 w-1.5 rounded-none bg-forest inline-block" />
          <span>International Transit • DDP Taxes Handled</span>
        </div>

        {/* Center: Rotating Announcement Messages with controls */}
        <div className="flex-1 flex items-center justify-center space-x-3 text-center px-4">
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? ANNOUNCEMENT_MESSAGES.length - 1 : prev - 1
              )
            }
            aria-label="Previous announcement"
            className="text-charcoal-400 hover:text-charcoal transition-colors p-0.5"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>

          <div className="flex items-center space-x-2 text-2xs tracking-widest uppercase">
            {current.badge && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-canvas border border-charcoal/20 font-mono text-[0.6rem] text-charcoal-700">
                {current.badge}
              </span>
            )}
            <span className="text-charcoal-600">{current.message}</span>
            <span className="font-semibold text-charcoal">{current.highlightText}</span>
            {current.linkText && (
              <Link
                href={current.linkHref || "#"}
                className="hidden md:inline-block underline underline-offset-2 hover:text-forest transition-colors ml-1"
              >
                {current.linkText}
              </Link>
            )}
          </div>

          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length)
            }
            aria-label="Next announcement"
            className="text-charcoal-400 hover:text-charcoal transition-colors p-0.5"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Right: Currency Switcher */}
        <div className="relative">
          <button
            onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            className="flex items-center space-x-1.5 text-2xs uppercase tracking-widest font-mono font-medium py-0.5 px-2 hover:bg-canvas rounded-none border border-transparent hover:border-canvas-muted transition-colors text-charcoal"
          >
            <Globe className="h-3 w-3 text-charcoal-500" />
            <span>{activeCurrency}</span>
            <ChevronDown className="h-2.5 w-2.5 text-charcoal-500" />
          </button>

          {currencyDropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-canvas-elevated border border-canvas-muted rounded-none shadow-editorial-dropdown py-1 z-50">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    onCurrencyChange(curr);
                    setCurrencyDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-2xs uppercase tracking-widest font-mono transition-colors ${
                    activeCurrency === curr
                      ? "bg-canvas-subtle font-semibold text-charcoal"
                      : "text-charcoal-600 hover:bg-canvas-subtle"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
