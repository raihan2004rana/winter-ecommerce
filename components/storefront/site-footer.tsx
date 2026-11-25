import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-canvas-muted bg-canvas-subtle text-charcoal">
      {/* 4 Value Pillars Ribbon */}
      <div className="border-b border-canvas-muted py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center space-x-3">
            <Truck className="h-4.5 w-4.5 text-forest shrink-0" />
            <div>
              <span className="font-semibold block text-charcoal">Worldwide Express</span>
              <span className="text-2xs text-charcoal-500">Free over $200 / €190 / £175</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-4.5 w-4.5 text-forest shrink-0" />
            <div>
              <span className="font-semibold block text-charcoal">DDP Guaranteed</span>
              <span className="text-2xs text-charcoal-500">All duties & EU/UK VAT handled</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-4.5 w-4.5 text-forest shrink-0" />
            <div>
              <span className="font-semibold block text-charcoal">30-Day Winter Returns</span>
              <span className="text-2xs text-charcoal-500">Complimentary exchange labels</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Award className="h-4.5 w-4.5 text-forest shrink-0" />
            <div>
              <span className="font-semibold block text-charcoal">Lifetime Warranty</span>
              <span className="text-2xs text-charcoal-500">On all seams, zips & down baffles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        {/* Col 1: Brand Wordmark & Philosophy */}
        <div className="col-span-2 space-y-4 pr-6">
          <span className="font-serif text-2xl text-charcoal font-normal tracking-tight block">
            VALLIS & ORE
          </span>
          <p className="text-xs text-charcoal-500 leading-relaxed max-w-sm">
            Engineered cold-weather apparel and lifestyle goods designed for extreme sub-zero alpine conditions and refined urban transit.
          </p>
          <div className="text-2xs font-mono text-charcoal-400 space-y-1">
            <p>Ateliers: Zurich • Milan • Tokyo</p>
            <p>Global Fulfillment: Frankfurt (EU) • Newark (US) • Northampton (UK)</p>
          </div>
        </div>

        {/* Col 2: Collections */}
        <div className="space-y-3">
          <span className="editorial-caps text-charcoal font-semibold block">Collections</span>
          <ul className="space-y-2 text-charcoal-600">
            <li><Link href="#outerwear" className="hover:text-charcoal transition-colors">Sub-Zero Parkas</Link></li>
            <li><Link href="#outerwear" className="hover:text-charcoal transition-colors">Double-Faced Coats</Link></li>
            <li><Link href="#knitwear" className="hover:text-charcoal transition-colors">Mongolian Cashmere</Link></li>
            <li><Link href="#footwear" className="hover:text-charcoal transition-colors">Shearling Boots</Link></li>
            <li><Link href="#outerwear" className="hover:text-charcoal transition-colors">3-Layer Alpine Shells</Link></li>
          </ul>
        </div>

        {/* Col 3: Assistance & Client Care */}
        <div className="space-y-3">
          <span className="editorial-caps text-charcoal font-semibold block">Client Service</span>
          <ul className="space-y-2 text-charcoal-600">
            <li><Link href="#shipping" className="hover:text-charcoal transition-colors">International Delivery</Link></li>
            <li><Link href="#returns" className="hover:text-charcoal transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="#size-guide" className="hover:text-charcoal transition-colors">Alpine Fit & Sizing</Link></li>
            <li><Link href="#customs" className="hover:text-charcoal transition-colors">Duties & Tax Transparency</Link></li>
            <li><Link href="#contact" className="hover:text-charcoal transition-colors">Concierge Contact</Link></li>
          </ul>
        </div>

        {/* Col 4: Corporate & Standards */}
        <div className="space-y-3">
          <span className="editorial-caps text-charcoal font-semibold block">Standards & Legal</span>
          <ul className="space-y-2 text-charcoal-600">
            <li><Link href="#sustainability" className="hover:text-charcoal transition-colors">RDS Down Commitment</Link></li>
            <li><Link href="#privacy" className="hover:text-charcoal transition-colors">Privacy & GDPR Policy</Link></li>
            <li><Link href="#terms" className="hover:text-charcoal transition-colors">Terms of Commercial Sale</Link></li>
            <li><Link href="#cookies" className="hover:text-charcoal transition-colors">Cookie Preferences</Link></li>
            <li><Link href="/design-system" className="hover:text-forest transition-colors font-medium">Design System Spec</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Payment Icons */}
      <div className="border-t border-canvas-muted py-8 px-6 sm:px-12 text-2xs text-charcoal-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 VALLIS & ORE International Retail AG. All rights reserved.</p>
          <div className="flex items-center space-x-4 font-mono text-[0.62rem] text-charcoal-400">
            <span>STRIPE SECURE</span>
            <span>•</span>
            <span>APPLE PAY</span>
            <span>•</span>
            <span>GOOGLE PAY</span>
            <span>•</span>
            <span>KLARNA</span>
            <span>•</span>
            <span>iDEAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
