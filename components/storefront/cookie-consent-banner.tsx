"use client";

import * as React from "react";
import { Cookie, X, Check, ShieldCheck, Sliders, ChevronDown, ChevronUp } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

const COOKIE_STORAGE_KEY = "mauli_cookie_consent_v1";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);

  // Preference states
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);
  const [marketingEnabled, setMarketingEnabled] = React.useState(true);

  // Check consent on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!stored) {
        // Small delay for luxury entrance
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      } else {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalyticsEnabled(parsed.analytics);
        setMarketingEnabled(parsed.marketing);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  // Listen for manual open trigger (e.g. from footer link)
  React.useEffect(() => {
    const handleOpen = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };
    window.addEventListener("open-cookie-preferences", handleOpen);
    return () => window.removeEventListener("open-cookie-preferences", handleOpen);
  }, []);

  const handleSavePreferences = (analytics: boolean, marketing: boolean) => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    handleSavePreferences(true, true);
  };

  const handleEssentialOnly = () => {
    setAnalyticsEnabled(false);
    setMarketingEnabled(false);
    handleSavePreferences(false, false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-400"
    >
      <div className="bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 sm:p-6 rounded-lg text-neutral-900 font-sans">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 border border-neutral-200">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block leading-tight">
                Privacy & Data
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Cookie Preferences
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close cookie banner"
            className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prose Description */}
        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
          MAULI FASHION uses essential cookies to ensure safe checkout operations, and optional cookies to tailor your luxury shopping experience, analyze site velocity, and preserve your currency settings.
        </p>

        {/* Detailed Preferences Drawer */}
        {showPreferences && (
          <div className="space-y-3 pt-2 pb-4 border-t border-neutral-100 text-xs">
            {/* 1. Necessary */}
            <div className="flex items-start justify-between gap-2 p-2.5 bg-neutral-50 rounded-md border border-neutral-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-900 block">Strictly Necessary</span>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Required for bag persistence, session security, and checkout execution.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold shrink-0 border border-emerald-200">
                Always Active
              </span>
            </div>

            {/* 2. Analytics */}
            <div className="flex items-start justify-between gap-2 p-2.5 bg-neutral-50 rounded-md border border-neutral-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-900 block">Performance & Velocity</span>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Enables cache pre-warming, anonymous traffic analytics, and speed optimization.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>

            {/* 3. Marketing */}
            <div className="flex items-start justify-between gap-2 p-2.5 bg-neutral-50 rounded-md border border-neutral-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-900 block">Personalized Allocations</span>
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Remembers your editorial styling preferences and private collection previews.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={marketingEnabled}
                  onChange={(e) => setMarketingEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {showPreferences ? (
            <button
              onClick={() => handleSavePreferences(analyticsEnabled, marketingEnabled)}
              className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider py-2.5 rounded font-semibold transition-colors"
            >
              Save My Preferences
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 bg-neutral-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider py-2.5 rounded font-semibold transition-colors shadow-xs"
              >
                Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="w-full sm:flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider py-2.5 rounded font-semibold transition-colors border border-neutral-200"
              >
                Essential Only
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowPreferences((prev) => !prev)}
            className="w-full sm:w-auto text-[11px] font-mono text-neutral-500 hover:text-neutral-900 underline underline-offset-4 py-1 sm:py-2.5 sm:px-2 transition-colors flex items-center justify-center gap-1"
          >
            <span>{showPreferences ? "Simple View" : "Customize"}</span>
            {showPreferences ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
