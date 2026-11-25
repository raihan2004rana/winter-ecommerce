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
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 border-b border-[#F0F0F0]">
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
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Logo + Newsletter */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-sans text-xl font-bold tracking-[0.14em] uppercase text-[#111]">
              WARDROBE
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
        <div className="pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-[#F0F0F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-[#888] font-mono">
          <p>© 2026 WARDROBE. Powered by Framer.</p>

          <div className="flex items-center space-x-2 text-[0.62rem] text-[#666]">
            <span className="bg-[#F5F5F5] px-2 py-1 rounded-xs border border-[#E5E5E5]">VISA</span>
            <span className="bg-[#F5F5F5] px-2 py-1 rounded-xs border border-[#E5E5E5]">MC</span>
            <span className="bg-[#F5F5F5] px-2 py-1 rounded-xs border border-[#E5E5E5]">AMEX</span>
            <span className="bg-[#F5F5F5] px-2 py-1 rounded-xs border border-[#E5E5E5]">APPLE PAY</span>
            <span className="bg-[#F5F5F5] px-2 py-1 rounded-xs border border-[#E5E5E5]">PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
