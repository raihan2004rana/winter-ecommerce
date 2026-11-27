"use client";

import * as React from "react";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export function WardrobeExactFooter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#EFEFEF] text-[#111]">
      {/* =========================================================================
          SECTION 9: 3 TRUST GUARANTEE COLUMNS (Matching Wardrobe Reference)
         ========================================================================= */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 border-b border-[#F0F0F0]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="flex flex-col space-y-2">
            <Truck className="h-5 w-5 text-[#333]" />
            <h3 className="font-editorial text-2xl text-[#111] font-normal">
              Free shipping over $50
            </h3>
            <p className="text-xs text-[#666] font-sans leading-relaxed">
              Orders above $50 ship free — no hidden fees, no surprises.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col space-y-2">
            <RotateCcw className="h-5 w-5 text-[#333]" />
            <h3 className="font-editorial text-2xl text-[#111] font-normal">
              30-day easy returns
            </h3>
            <p className="text-xs text-[#666] font-sans leading-relaxed">
              Changed your mind? Return unused products within 30 days, hassle-free.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col space-y-2">
            <ShieldCheck className="h-5 w-5 text-[#333]" />
            <h3 className="font-editorial text-2xl text-[#111] font-normal">
              Trusted by thousands
            </h3>
            <p className="text-xs text-[#666] font-sans leading-relaxed">
              Join thousands of happy customers who shop with us every month.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 10: MAIN FOOTER (Newsletter, Links & Legal)
         ========================================================================= */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Logo + Newsletter */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-sans text-xl font-bold tracking-[0.14em] uppercase text-[#111]">
              MAULI FASHION
            </h2>
            <p className="text-xs sm:text-sm text-[#555] font-sans max-w-sm">
              Join our newsletter and save 10% on your first order
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="flex max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white border border-[#DDD] px-4 py-2.5 text-xs text-[#111] placeholder:text-[#999] focus:outline-none focus:border-black rounded-l-none"
              />
              <button
                type="submit"
                className="bg-[#111] hover:bg-black text-white px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-2 text-[#555]">
              <a href="#" className="hover:text-black transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="hover:text-black transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="#" className="hover:text-black transition-colors" aria-label="LinkedIn">
                <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
              </a>
            </div>
          </div>

          {/* Right Columns: Shop, Info, Legal */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-6 sm:gap-8 text-xs font-sans">
            {/* Shop Column */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#111] uppercase tracking-wider text-2xs font-mono">
                Shop
              </h4>
              <ul className="space-y-2 text-[#666]">
                <li>
                  <Link href="/collections/women" className="hover:text-black transition-colors">
                    Shop women
                  </Link>
                </li>
                <li>
                  <Link href="/collections/men" className="hover:text-black transition-colors">
                    Shop men
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-black transition-colors">
                    All products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Info Column */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#111] uppercase tracking-wider text-2xs font-mono">
                Info
              </h4>
              <ul className="space-y-2 text-[#666]">
                <li>
                  <Link href="/account" className="hover:text-black transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-black transition-colors">
                    Order tracking
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#111] uppercase tracking-wider text-2xs font-mono">
                Legal
              </h4>
              <ul className="space-y-2 text-[#666]">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Terms of service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Refund policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Shipping policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="pt-10 sm:pt-14 mt-10 sm:mt-14 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-[#888] font-mono">
          <p>© 2026 MAULI FASHION. Powered by Framer.</p>

          {/* High-Fidelity Official Payment Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Visa */}
            <div
              title="Visa"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-white border border-[#E2E2E2] rounded flex items-center justify-center p-1 shadow-2xs hover:border-neutral-900 transition-colors"
            >
              <svg viewBox="0 0 36 12" className="h-2.5 sm:h-3 w-auto" fill="none">
                <path
                  d="M14.5 1.2L12.2 11H9.8L11.9 1.2h2.6zm9.8 6.5c0-1.8-2.5-1.9-2.5-2.7 0-.6.7-.8 1.4-.8.8 0 1.6.2 2.1.4l.4-1.9c-.6-.2-1.4-.4-2.4-.4-2.5 0-4.2 1.3-4.2 3.2 0 1.4 1.3 2.2 2.2 2.7.9.4 1.2.7 1.2 1.1 0 .6-.7.9-1.4.9-.9 0-1.8-.3-2.5-.7l-.4 2c.7.3 1.7.5 2.8.5 2.7 0 4.3-1.3 4.3-3.2zm6.2 3.3h2.3l-2-9.8h-2.1c-.5 0-.9.3-1.1.7L24 11h2.5l.5-1.4h3.1l.6 1.4zm-2.6-3.3l1.3-3.5.7 3.5h-2zm-18.4-6.5L6.1 8c-.2-.7-.8-1.5-1.5-1.9L2 4.9l.1-.4h4c.9 0 1.5.6 1.7 1.4l1.1 5.1H12L10 1.2H9.5z"
                  fill="#1434CB"
                />
                <path d="M4.6 4.5l-2.6 6.5H.1L2.6 4.5h2z" fill="#F7B600" />
              </svg>
            </div>

            {/* Mastercard */}
            <div
              title="Mastercard"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-white border border-[#E2E2E2] rounded flex items-center justify-center p-1 shadow-2xs hover:border-neutral-900 transition-colors"
            >
              <svg viewBox="0 0 32 20" className="h-3 sm:h-3.5 w-auto">
                <circle cx="10" cy="10" r="8" fill="#EB001B" />
                <circle cx="22" cy="10" r="8" fill="#F79E1B" />
                <path
                  d="M16 4.8a7.96 7.96 0 0 1 3.1 5.2 7.96 7.96 0 0 1-3.1 5.2 7.96 7.96 0 0 1-3.1-5.2c0-2.1 1.2-4 3.1-5.2z"
                  fill="#FF5F00"
                />
              </svg>
            </div>

            {/* American Express */}
            <div
              title="American Express"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-[#006FCF] border border-[#006FCF] rounded flex items-center justify-center p-0.5 shadow-2xs hover:opacity-90 transition-opacity"
            >
              <span className="text-[0.52rem] sm:text-[0.58rem] font-black font-sans text-white tracking-widest">
                AMEX
              </span>
            </div>

            {/* Apple Pay */}
            <div
              title="Apple Pay"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-black border border-black rounded flex items-center justify-center p-1 shadow-2xs hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 34 16" className="h-2.5 sm:h-3 w-auto" fill="#FFFFFF">
                <path d="M3.4 3.1c-.2.3-.6.5-1 .5-.1-.4.1-.8.3-1 .2-.3.6-.5 1-.5.1.4-.1.8-.3 1zm.3 1c-.5 0-1 .3-1.3.3-.3 0-.7-.3-1.2-.3C.5 4.1 0 4.7 0 5.6c0 1.4 1.3 3.2 1.9 3.2.3 0 .5-.2.9-.2.3 0 .5.2.9.2.7 0 1.6-1.5 1.6-1.8-.7-.3-.8-1.3 0-1.7-.4-.6-1-.8-1.6-.8z" />
                <text
                  x="6.8"
                  y="8.2"
                  fontSize="6.2"
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="-0.2"
                >
                  Pay
                </text>
              </svg>
            </div>

            {/* PayPal */}
            <div
              title="PayPal"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-white border border-[#E2E2E2] rounded flex items-center justify-center p-1 shadow-2xs hover:border-neutral-900 transition-colors"
            >
              <svg viewBox="0 0 32 16" className="h-2.5 sm:h-3 w-auto" fill="none">
                <path d="M9.5 2h5c2.3 0 3.9 1.1 3.5 3.4-.4 2.2-2.1 3.4-4.2 3.4h-1.7l-1 5.2H8.3L10.3 2h-.8z" fill="#003087" />
                <path d="M12.5 4.5h4.4c1.9 0 3.3 1 2.9 2.9-.3 1.9-1.8 2.9-3.5 2.9h-1.5l-.8 4.5H11.7l1.5-10.3h-.7z" fill="#0079C1" />
                <path d="M12 8h1.7c1.7 0 3.2-1 3.5-2.9.1-.5 0-.9-.3-1.2-.4 1.6-1.8 2.6-3.4 2.6H12L11.3 10l.7-2z" fill="#00457C" />
              </svg>
            </div>

            {/* Google Pay */}
            <div
              title="Google Pay"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-white border border-[#E2E2E2] rounded flex items-center justify-center p-1 shadow-2xs hover:border-neutral-900 transition-colors"
            >
              <svg viewBox="0 0 32 14" className="h-2.5 sm:h-3 w-auto" fill="none">
                <path d="M8.8 5.7v3.9H7.5V2.1h3c.9 0 1.6.3 2.1.8.6.6.9 1.2.9 2.1s-.3 1.6-.9 2.1c-.6.6-1.2.8-2.1.8H8.8v-2.2zm0-2.5v2.5H10c.5 0 .9-.1 1.3-.5.4-.4.5-.8.5-1.2 0-.5-.2-.9-.5-1.2-.4-.4-.8-.5-1.3-.5H8.8z" fill="#5F6368" />
                <path d="M17.1 5.3c.8 0 1.5.2 1.9.7.5.4.7 1 .7 1.8v3.4h-1.1V10.3h-.1c-.4.7-1.1 1-1.9 1-.7 0-1.2-.2-1.7-.6-.4-.4-.7-.9-.7-1.5 0-.7.2-1.2.7-1.5.5-.4 1.1-.6 1.9-.6.7 0 1.3.1 1.7.4v-.3c0-.4-.2-.8-.5-1.1-.4-.3-.8-.4-1.3-.4-.7 0-1.2.3-1.6.8l-.9-.6c.6-.8 1.5-1.3 2.5-1.3zm-1.8 4.3c0 .3.1.6.4.8.3.2.6.3 1 .3.4 0 .9-.2 1.3-.5.4-.4.5-.7.5-1.2-.3-.3-.8-.4-1.5-.4-.4 0-.8.1-1.2.3-.3.2-.5.4-.5.7z" fill="#5F6368" />
                <path d="M25.3 5.4l-3.9 9h-1.3l1.5-3.2-2.6-5.8h1.4l1.9 4.4h.1l1.8-4.4h1.1z" fill="#5F6368" />
                <path d="M3.2 5.9c0-.2 0-.4-.1-.6H0v1.3h1.8c-.1.4-.3.8-.7 1.1v.9h1.1c.7-.6 1-1.5 1-2.7z" fill="#4285F4" />
                <path d="M0 9.3c.9 0 1.7-.3 2.3-.8L1.2 7.6c-.3.2-.7.4-1.2.4-.9 0-1.7-.6-1.9-1.4H-3v.9c.6 1.1 1.7 1.8 3 1.8z" fill="#34A853" />
                <path d="M-1.9 6.6c-.1-.2-.1-.5-.1-.7s0-.5.1-.7V4.3H-3C-3.4 5-3.6 5.8-3.6 6.6s.2 1.6.6 2.3l1.1-.9v-1.4z" fill="#FBBC04" />
                <path d="M0 3.8c.5 0 1 .2 1.4.5l1-1C1.7 2.7.9 2.4 0 2.4-1.3 2.4-2.4 3.1-3 4.3l1.1.9c.2-.8 1-1.4 1.9-1.4z" fill="#EA4335" />
              </svg>
            </div>

            {/* Shop Pay */}
            <div
              title="Shop Pay"
              className="h-6 w-9 sm:h-7 sm:w-11 bg-[#5A31F4] border border-[#5A31F4] rounded flex items-center justify-center p-0.5 shadow-2xs hover:opacity-90 transition-opacity"
            >
              <span className="text-[0.5rem] sm:text-[0.55rem] font-bold text-white tracking-tight">
                shop<span className="font-normal">Pay</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
